import type { AstroIntegration } from 'astro';
import { parse } from '@astrojs/compiler';
import { readFileSync } from 'fs';

function getRelativePath(filePath: string): string {
  return filePath.replace(/^.*\/src\//, 'src/');
}

export function reactNodeTransform() {
  return function ({ types: t }: any) {
    return {
      name: 'inject-source-info',
      visitor: {
        JSXElement(path: any, state: any) {
          const node = path.node;
          const openingElement = node.openingElement;
          const elementName = openingElement?.name?.name;

          if (!elementName || !openingElement) {
            return;
          }

          const filename = state.filename || state.file?.opts?.filename || 'unknown';
          const relativeFile = getRelativePath(filename);

          const hasSourceAttr = openingElement.attributes.some(
            (attr: any) =>
              attr.type === 'JSXAttribute' &&
              attr.name &&
              attr.name.name === 'data-source-file'
          );

          if (!hasSourceAttr) {
            const startLoc = openingElement.loc;
            const endLoc = node.loc;

            openingElement.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('data-source-file'),
                t.stringLiteral(relativeFile)
              ),
              t.jsxAttribute(
                t.jsxIdentifier('data-source-line-start'),
                t.stringLiteral(String(startLoc?.start?.line || 0))
              ),
              t.jsxAttribute(
                t.jsxIdentifier('data-source-line-end'),
                t.stringLiteral(String(endLoc?.end?.line || 0))
              )
            );
          }
        },
      },
    };
  };
}

function injectLocationVitePlugin() {
  return {
    name: 'vite-plugin-astro-inject-location',
    enforce: 'pre' as const,

    async load(id: string) {
      if (!id.endsWith('.astro')) {
        return null;
      }

      try {
        const sourceCode = readFileSync(id, 'utf-8');
        const relativePath = getRelativePath(id);
        const ast = await parse(sourceCode, { position: true });
        const elementsToInject: Array<{ line: number; endLine: number; name: string }> = [];

        function collectElements(node: any, inExpression = false) {
          if (!node) return;

          const isExpression = node.type === 'expression';
          const currentInExpression = inExpression || isExpression;

          if (!currentInExpression && node.type === 'element' && node.position && node.name) {
            if (!['script', 'style', 'Fragment', 'slot'].includes(node.name) && 
                node.position.start && node.position.end) {
              elementsToInject.push({
                line: node.position.start.line,
                endLine: node.position.end.line,
                name: node.name
              });
            }
          }

          for (const key in node) {
            if (key === 'parent') continue;
            const value = node[key];
            if (Array.isArray(value)) {
              value.forEach(child => collectElements(child, currentInExpression));
            } else if (typeof value === 'object' && value !== null && value.type) {
              collectElements(value, currentInExpression);
            }
          }
        }

        if (ast) {
          collectElements(ast);
        }

        if (elementsToInject.length === 0) {
          return null;
        }

        const lines = sourceCode.split('\n');
        const processedLines = new Set<number>();

        elementsToInject.forEach(element => {
          const lineIndex = element.line - 1;

          if (lineIndex >= 0 && lineIndex < lines.length && !processedLines.has(lineIndex)) {
            const line = lines[lineIndex];
            const tagRegex = new RegExp(`<(${element.name})([\\s>/])`);
            const match = tagRegex.exec(line);

            if (match) {
              const attrs = [
                `data-source-file="${relativePath}"`,
                `data-source-line-start="${element.line}"`,
                `data-source-line-end="${element.endLine}"`
              ].join(' ');

              const before = line.substring(0, match.index + 1 + element.name.length);
              const after = line.substring(match.index + 1 + element.name.length);
              lines[lineIndex] = `${before} ${attrs}${after}`;
              processedLines.add(lineIndex);
            }
          }
        });

        return {
          code: lines.join('\n'),
          map: null,
        };
      } catch (e) {
        console.error(`Failed to process ${id}:`, e);
        return null;
      }
    },
  };
}

export function astroSourceIntegration(): AstroIntegration {
  return {
    name: 'astro-source-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [injectLocationVitePlugin()],
          },
        });
      }
    }
  };
}

