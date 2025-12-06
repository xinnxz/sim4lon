import { createElement, lazy, Suspense, type ComponentType } from 'react';
import { Circle, type LucideProps } from 'lucide-react';

interface SafeIconProps extends LucideProps {
  name: string;
}

// Cache for loaded icons
const iconCache = new Map<string, ComponentType<LucideProps>>();

export default function SafeIcon({ name, ...props }: SafeIconProps) {
  // Check cache first
  if (!iconCache.has(name)) {
    try {
      // Dynamically import icon
      const IconComponent = lazy(() =>
        import('lucide-react')
          .then((module) => {
            const icon = (module as any)[name];
            if (!icon) {
              console.warn(`Icon "${name}" not found in lucide-react, using fallback`);
              return { default: Circle };
            }
            return { default: icon };
          })
          .catch(() => {
            console.warn(`Failed to load icon "${name}", using fallback`);
            return { default: Circle };
          })
      );
      iconCache.set(name, IconComponent);
    } catch {
      iconCache.set(name, Circle);
    }
  }

  const IconComponent = iconCache.get(name) || Circle;

  return (
    <Suspense fallback={<Circle {...props} />}>
      {createElement(IconComponent, props)}
    </Suspense>
  );
}

