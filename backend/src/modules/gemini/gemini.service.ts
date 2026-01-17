/**
 * Gemini AI Service
 * 
 * Service ini menggunakan Google Gemini AI untuk:
 * - Parse voice command menjadi structured order data
 * - Extract quantity, product, dan pangkalan dari text
 * - Validasi komprehensif: stok, pangkalan, quantity limits
 */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma';

// Validation issue types
export type ValidationIssueType =
    | 'quantity_too_high'
    | 'quantity_too_low'
    | 'stock_insufficient'
    | 'pangkalan_not_found'
    | 'pangkalan_mismatch'
    | 'product_not_found'
    | 'pangkalan_inactive';

export interface ValidationIssue {
    type: ValidationIssueType;
    field: string;
    message: string;
    suggestion?: string;
}

export interface ParsedOrderData {
    success: boolean;
    pangkalanId: string | null;
    pangkalanName: string | null;
    items: Array<{
        productId: string;
        productName: string;
        lpgType: string;
        quantity: number;
        price: number;
        stockAvailable?: number;  // Stok yang tersedia
    }>;
    note: string | null;
    confidence: number;
    rawText: string;
    error?: string;

    // Comprehensive validation results
    validation?: {
        isValid: boolean;
        issues: ValidationIssue[];
        warnings: string[];  // Non-blocking warnings
    };
}

interface PangkalanData {
    id: string;
    name: string;
    code: string | null;
}

interface ProductData {
    id: string;
    name: string;
    size_kg: any;
    selling_price: any;
    category: string;
}

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private readonly apiKey: string;
    private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    constructor(private prisma: PrismaService) {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        if (!this.apiKey) {
            this.logger.warn('GEMINI_API_KEY not set! Voice order parsing will use fallback.');
        }
    }

    /**
     * Parse voice command text using Gemini AI
     */
    async parseVoiceCommand(text: string): Promise<ParsedOrderData> {
        this.logger.log(`Parsing voice command: "${text}"`);

        // Get available pangkalan and products for context
        const [pangkalans, products] = await Promise.all([
            this.prisma.pangkalans.findMany({
                where: { is_active: true },
                select: { id: true, name: true, code: true }
            }),
            this.prisma.lpg_products.findMany({
                where: { is_active: true },
                select: {
                    id: true,
                    name: true,
                    size_kg: true,
                    selling_price: true,
                    category: true
                }
            })
        ]);

        // Build context for Gemini
        const pangkalanList = pangkalans.map(p => `- "${p.name}" (ID: ${p.id})`).join('\n');
        const productList = products.map(p =>
            `- ${p.name} - ${p.size_kg}kg (ID: ${p.id}, harga: ${p.selling_price})`
        ).join('\n');

        const prompt = `Kamu adalah AI PARSER CERDAS untuk sistem pemesanan LPG Indonesia.

🎯 MISI: Parse perintah suara menjadi data order JSON. PAHAMI MAKSUD, bukan kata literal.

=== PERINTAH SUARA USER ===
"${text}"

=== DATABASE REFERENSI ===
PANGKALAN:
${pangkalanList}

PRODUK AKTIF (HANYA yang ada di bawah ini yang bisa dipesan!):
${productList}

=== ATURAN PARSING ===

⚠️ PENTING - STRICT PRODUCT MATCHING:
- HANYA match ke produk yang ADA di daftar PRODUK AKTIF di atas!
- Jika user menyebut ukuran yang TIDAK ADA di daftar (misalnya 5kg, 25kg, dll), 
  set "error": "Produk [ukuran]kg tidak tersedia. Produk yang tersedia: [list dari database]"
- JANGAN fallback ke ukuran lain! Ukuran yang disebut user harus sesuai dengan database.

📦 MULTIPLE ITEMS:
User mungkin pesan LEBIH DARI 1 jenis produk! Dengarkan kata kunci:
- "yang pertama... yang kedua..." 
- "ada dua jenis..."
- "...lalu..."
- "...sama..."
- "...plus..."
- "3kg 10 unit, 12kg 5 unit"

Contoh multi-item:
"yang 3 kilo 10 unit sama yang 12 kilo juga 10 unit"
→ items: [{3kg, 10}, {12kg, 10}]

📦 QUANTITY (JUMLAH):
Ekstrak angka yang diasosiasikan dengan SETIAP produk:
- "pesannya 10 unit" → 10
- "ada 50" / "minta 50" → 50
- "seratus" / "100" → 100
- "sepuluh" → 10
- "dua puluh" → 20
Default 1 HANYA jika tidak ada angka.

⚖️ UKURAN PRODUK (match ke database!) - PENTING!:
- "kaleng" / "can" / "bright gas can" / "220 gram" / "220gr" → cari produk 0.22kg / 220gr (Bright Gas Can)
- "bright gas" / "5 kilo" / "5.5kg" / "lima kilo" → cari produk 5.5kg (Bright Gas tabung)
- "3 kilo" / "3kg" / "tiga kilo" / "melon" / "kecil" / "subsidi" → cari produk 3kg
- "12 kilo" / "12kg" / "dua belas kilo" → cari produk 12kg  
- "50 kilo" / "50kg" / "besar" / "industri" → cari produk 50kg
- Jika ukuran TIDAK ADA di database → ERROR! Jangan fallback ke ukuran lain!

🏪 PANGKALAN:
Fuzzy match - cari kata kunci dari nama:
- "test 1" / "tes satu" → Pangkalan Test 1
- "cihuy" → Pangkalan Cihuy
- "reon" → Pangkalan Reon

=== CONTOH PARSING LENGKAP ===

INPUT: "pesan dong 50 gas yang 3 kilo untuk pangkalan test 1"
→ pangkalan=Test 1, items=[{kg3, qty:50}]

INPUT: "ada dua jenis, yang 3 kilo pesannya 10 unit, yang 12 kilo juga 10 unit ke pangkalan tes 1"
→ pangkalan=Test 1, items=[{kg3, qty:10}, {kg12, qty:10}]

INPUT: "order 100 unit yang 5 kilo untuk test 1"
→ Jika 5kg TIDAK ADA di database: error="Produk 5kg tidak tersedia"

INPUT: "cihuy butuh gas 80 yang kecil"
→ pangkalan=Cihuy, items=[{kg3, qty:80}]

=== FORMAT RESPONSE (JSON SAJA, TANPA MARKDOWN/BACKTICKS) ===
{
    "success": true,
    "pangkalanId": "uuid dari daftar",
    "pangkalanName": "nama pangkalan",
    "items": [
        {
            "productId": "uuid produk dari daftar",
            "productName": "nama produk lengkap",
            "lpgType": "gr220/kg3/kg5/kg12/kg50",
            "quantity": 10,
            "price": 22000
        }
    ],
    "note": null,
    "confidence": 0.9,
    "error": null
}

PENTING: 
1. Items harus berupa ARRAY - bisa 1 item atau lebih
2. Cocokkan productId dan price dari DAFTAR PRODUK di atas
3. Jika ada 2+ produk berbeda, buat 2+ objek dalam array items`;

        try {
            if (!this.apiKey) {
                return this.fallbackParse(text, pangkalans, products);
            }

            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Gemini API error: ${response.status} - ${errorText}`);
                return this.fallbackParse(text, pangkalans, products);
            }

            const data = await response.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Extract JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                this.logger.warn('No JSON found in Gemini response, using fallback');
                return this.fallbackParse(text, pangkalans, products);
            }

            const parsed: ParsedOrderData = JSON.parse(jsonMatch[0]);
            parsed.rawText = text;

            // ==========================================
            // POST-PROCESSING: Override wrong product detection
            // Gemini sometimes ignores our prompt, so we validate here
            // ==========================================
            const textLower = text.toLowerCase();

            // Check if user said "kaleng"/"can" but Gemini returned non-220gr product
            if (/kaleng|can|220\s*gr/.test(textLower)) {
                const product220gr = products.find(p => Math.abs(Number(p.size_kg) - 0.22) < 0.1);
                if (product220gr && parsed.items?.length > 0) {
                    // Override to 220gr product
                    const oldProduct = parsed.items[0].productName;
                    if (Number(products.find(p => p.id === parsed.items[0].productId)?.size_kg || 0) > 1) {
                        this.logger.log(`[POST-PROCESS] Override: "${oldProduct}" → "${product220gr.name}" (detected 'kaleng' keyword)`);
                        parsed.items[0].productId = product220gr.id;
                        parsed.items[0].productName = product220gr.name;
                        parsed.items[0].lpgType = 'gr220';
                        parsed.items[0].price = Number(product220gr.selling_price) || 0;
                    }
                }
            }
            // Check if user said "bright gas" (without can) but Gemini returned 3kg
            else if (/bright\s*gas(?!\s*can)/i.test(textLower) && !/kaleng|can/.test(textLower)) {
                const product55kg = products.find(p => Math.abs(Number(p.size_kg) - 5.5) < 0.5);
                if (product55kg && parsed.items?.length > 0) {
                    const currentSize = Number(products.find(p => p.id === parsed.items[0].productId)?.size_kg || 0);
                    if (currentSize === 3) {  // Only override if Gemini chose 3kg
                        this.logger.log(`[POST-PROCESS] Override: "${parsed.items[0].productName}" → "${product55kg.name}" (detected 'bright gas' keyword)`);
                        parsed.items[0].productId = product55kg.id;
                        parsed.items[0].productName = product55kg.name;
                        parsed.items[0].lpgType = 'kg5';
                        parsed.items[0].price = Number(product55kg.selling_price) || 0;
                    }
                }
            }

            this.logger.log(`Gemini parsed successfully: ${JSON.stringify(parsed)}`);
            return parsed;

        } catch (error) {
            this.logger.error(`Gemini parsing failed: ${error}`);
            return this.fallbackParse(text, pangkalans, products);
        }
    }

    /**
     * Fallback parsing using regex (when Gemini fails)
     */
    private fallbackParse(
        text: string,
        pangkalans: PangkalanData[],
        products: ProductData[]
    ): ParsedOrderData {
        this.logger.log(`Using fallback regex parser for: "${text}"`);

        const normalized = text.toLowerCase().trim();
        this.logger.log(`Normalized text: "${normalized}"`);

        // ============================================
        // 1. EXTRACT QUANTITY - Try multiple patterns
        // ============================================
        let quantity = 1;

        // Pattern 1: "100 tabung", "50 unit", "50 gas", "25 buah"
        let qtyMatch = normalized.match(/(\d+)\s*(?:tabung|unit|buah|biji|gas)/);

        // Pattern 2: Number followed by "yang X kilo" (e.g., "50 yang 3 kilo")
        if (!qtyMatch) {
            qtyMatch = normalized.match(/(\d+)\s+(?:yang|untuk|ke)/);
        }

        // Pattern 3: any standalone number NOT followed by kg/kilo
        if (!qtyMatch) {
            // Use regex to find all numbers with their context
            const numberMatches = [...normalized.matchAll(/(\d+)(?:\s*(\w*))?/g)];
            for (const match of numberMatches) {
                const num = parseInt(match[1]);
                const suffix = (match[2] || '').toLowerCase();

                // Skip if followed by kg/kilo (product size indicator)
                if (suffix === 'kg' || suffix === 'kilo' || suffix === 'kilogram') {
                    continue;
                }

                // Accept any number > 1 as quantity (except if it looks like product size)
                if (num > 1) {
                    // Skip only 3, 5, 12 without context (common product sizes)
                    // BUT 50 without kg is likely quantity!
                    if ((num === 3 || num === 5 || num === 12) && !suffix) {
                        // These could be product sizes, skip unless followed by quantity word
                        continue;
                    }
                    quantity = num;
                    this.logger.log(`Found quantity from context-aware parsing: ${quantity} (suffix: ${suffix})`);
                    break;
                }
            }
        } else {
            quantity = parseInt(qtyMatch[1]);
            this.logger.log(`Found quantity from pattern match: ${quantity}`);
        }

        // ============================================
        // 2. EXTRACT PRODUCT SIZE
        // ============================================
        let matchedProduct: ProductData | null = null;

        // 220gr / Bright Gas Can patterns
        if (/220\s*(?:gr|gram)/i.test(normalized) || /bright\s*gas\s*(?:can|kaleng)/i.test(normalized) || /kaleng/i.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 0.22) < 0.1) || null;
            this.logger.log(`Matched product: 220gr / Bright Gas Can`);
        }
        // 5.5kg / Bright Gas patterns  
        else if (/5[,.]?5\s*(?:kg|kilo)/i.test(normalized) || /lima\s*(?:setengah|koma\s*lima)\s*(?:kg|kilo)/i.test(normalized) || /bright\s*gas(?!\s*can)/i.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 5.5) < 0.5) || null;
            this.logger.log(`Matched product: 5.5kg / Bright Gas`);
        }
        // 3kg patterns
        else if (/3\s*(?:kg|kilo)/.test(normalized) || /tiga\s*(?:kg|kilo)/.test(normalized) || /subsidi/i.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 3) < 0.5) || null;
            this.logger.log(`Matched product: 3kg`);
        }
        // 12kg patterns
        else if (/12\s*(?:kg|kilo)/.test(normalized) || /dua\s*belas/.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 12) < 0.5) || null;
            this.logger.log(`Matched product: 12kg`);
        }
        // 50kg patterns
        else if (/50\s*(?:kg|kilo)/.test(normalized) || /lima\s*puluh\s*(?:kg|kilo)/.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 50) < 0.5) || null;
            this.logger.log(`Matched product: 50kg`);
        } else {
            // NO DEFAULT - Return error if product not detected (prevent wrong detection)
            this.logger.log(`No product pattern matched in text: "${normalized}"`);
            matchedProduct = null;
        }

        // ============================================
        // 3. EXTRACT PANGKALAN - Multiple strategies
        // ============================================
        let matchedPangkalan: PangkalanData | null = null;

        // Strategy 1: Look for "pangkalan X" or "ke X" pattern
        const pangkalanPatterns = [
            /pangkalan\s+([a-zA-Z0-9\s]+)/i,
            /ke\s+([a-zA-Z0-9\s]+)$/i,
            /untuk\s+([a-zA-Z0-9\s]+)/i,
            /buat\s+([a-zA-Z0-9\s]+)/i,
        ];

        let extractedPangkalanName = '';
        for (const pattern of pangkalanPatterns) {
            const match = normalized.match(pattern);
            if (match) {
                extractedPangkalanName = match[1].trim();
                this.logger.log(`Extracted pangkalan name from pattern: "${extractedPangkalanName}"`);
                break;
            }
        }

        // Strategy 2: Find best matching pangkalan with fuzzy matching (scalable for 100+ pangkalans)
        if (extractedPangkalanName) {
            const searchName = extractedPangkalanName.toLowerCase().trim();

            // Levenshtein distance for fuzzy matching - works with ANY name
            const levenshteinDistance = (a: string, b: string): number => {
                const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
                for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
                for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
                for (let j = 1; j <= b.length; j++) {
                    for (let i = 1; i <= a.length; i++) {
                        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                        matrix[j][i] = Math.min(
                            matrix[j][i - 1] + 1,
                            matrix[j - 1][i] + 1,
                            matrix[j - 1][i - 1] + cost
                        );
                    }
                }
                return matrix[b.length][a.length];
            };

            // Calculate similarity score (0-1 where 1 is exact match)
            const similarity = (a: string, b: string): number => {
                const distance = levenshteinDistance(a, b);
                const maxLen = Math.max(a.length, b.length);
                return maxLen === 0 ? 1 : 1 - (distance / maxLen);
            };

            this.logger.log(`Searching pangkalan for: "${searchName}"`);

            // Step 1: Exact match
            matchedPangkalan = pangkalans.find(p =>
                p.name.toLowerCase() === searchName ||
                p.name.toLowerCase().includes(searchName) ||
                searchName.includes(p.name.toLowerCase())
            ) || null;

            // Step 2: Fuzzy match - find best matching pangkalan
            if (!matchedPangkalan) {
                let bestMatch: { pangkalan: PangkalanData; score: number } | null = null;

                for (const p of pangkalans) {
                    const pName = p.name.toLowerCase();
                    const pWords = pName.split(/\s+/);

                    // Check each word in pangkalan name
                    for (const word of pWords) {
                        if (word.length < 3) continue; // Skip short words

                        // Calculate similarity
                        const score = similarity(searchName, word);

                        // Accept if similarity >= 70% (e.g., "freon" vs "reon" = 80%)
                        if (score >= 0.7 && (!bestMatch || score > bestMatch.score)) {
                            bestMatch = { pangkalan: p, score };
                            this.logger.log(`Fuzzy candidate: "${word}" → "${p.name}" (${Math.round(score * 100)}% match)`);
                        }
                    }
                }

                if (bestMatch) {
                    matchedPangkalan = bestMatch.pangkalan;
                    this.logger.log(`Best fuzzy match: ${matchedPangkalan.name} (${Math.round(bestMatch.score * 100)}%)`);
                }
            }

            // Step 3: Partial word match
            if (!matchedPangkalan) {
                const searchWords = searchName.split(/\s+/);
                for (const p of pangkalans) {
                    const pName = p.name.toLowerCase();
                    for (const word of searchWords) {
                        if (word.length > 2 && pName.includes(word)) {
                            matchedPangkalan = p;
                            this.logger.log(`Partial matched pangkalan: ${p.name} (word: ${word})`);
                            break;
                        }
                    }
                    if (matchedPangkalan) break;
                }
            }
        }

        // Strategy 3: Search entire text for any pangkalan name
        if (!matchedPangkalan) {
            for (const p of pangkalans) {
                const pNameLower = p.name.toLowerCase();
                // Check if any significant word from pangkalan name appears in text
                const words = pNameLower.split(/\s+/);
                for (const word of words) {
                    if (word.length > 3 && normalized.includes(word)) {
                        matchedPangkalan = p;
                        this.logger.log(`Found pangkalan via word match: ${p.name} (word: ${word})`);
                        break;
                    }
                }
                if (matchedPangkalan) break;
            }
        }

        this.logger.log(`Final result: qty=${quantity}, product=${matchedProduct?.name}, pangkalan=${matchedPangkalan?.name}`);

        const sizeToLpgType = (size: number): string => {
            if (size <= 0.3) return 'gr220';
            if (Math.abs(size - 3) < 0.5) return 'kg3';
            if (Math.abs(size - 5.5) < 1) return 'kg5';
            if (Math.abs(size - 12) < 0.5) return 'kg12';
            if (Math.abs(size - 50) < 0.5) return 'kg50';
            return 'kg3';
        };

        // Build helpful error message listing available products
        const availableProductsList = products.map(p => p.name).join(', ');
        const errorMessage = matchedProduct
            ? undefined
            : `📦 Produk tidak terdeteksi. Coba sebutkan ukuran LPG dengan jelas.\n\n💡 Produk tersedia: ${availableProductsList}\n\nContoh: "pesan 50 unit 3 kilo ke pangkalan [nama]"`;

        return {
            success: !!matchedProduct,
            pangkalanId: matchedPangkalan?.id || null,
            pangkalanName: matchedPangkalan?.name || null,
            items: matchedProduct ? [{
                productId: matchedProduct.id,
                productName: matchedProduct.name,
                lpgType: sizeToLpgType(Number(matchedProduct.size_kg)),
                quantity,
                price: Number(matchedProduct.selling_price) || 0
            }] : [],
            note: null,
            confidence: (matchedProduct && matchedPangkalan) ? 0.75 : (matchedProduct ? 0.5 : 0.2),
            rawText: text,
            error: errorMessage
        };
    }

    /**
     * Comprehensive validation for parsed order data
     * Checks: quantity limits, stock availability, pangkalan existence, product existence
     * Also validates that parsing matches what user actually said
     */
    async validateParsedOrder(parsedData: ParsedOrderData): Promise<ParsedOrderData> {
        const issues: ValidationIssue[] = [];
        const warnings: string[] = [];

        const rawText = parsedData.rawText.toLowerCase();

        // Configuration
        const MAX_QUANTITY_PER_ITEM = 500;  // Max 500 unit per produk
        const MIN_QUANTITY = 1;

        // ============================================
        // 0. VALIDATE RAW TEXT vs PARSED RESULT
        // ============================================

        // Check if user mentioned a specific size that we don't have
        const sizePatterns = [
            { pattern: /(?:5|lima)\s*(?:kg|kilo)/i, size: 5 },
            { pattern: /(?:5\.5|5,5|lima setengah)\s*(?:kg|kilo)/i, size: 5.5 },
            { pattern: /(?:220|dua ratus dua puluh)\s*(?:gr|gram)/i, size: 0.22 },
            { pattern: /(?:50|lima puluh)\s*(?:kg|kilo)/i, size: 50 },
            { pattern: /(?:25|dua puluh lima)\s*(?:kg|kilo)/i, size: 25 },
        ];

        // Get active products with their sizes
        const activeProducts = await this.prisma.lpg_products.findMany({
            where: { is_active: true },
            select: { size_kg: true, name: true }
        });
        const activeSizes = activeProducts.map(p => Number(p.size_kg));

        for (const sp of sizePatterns) {
            if (sp.pattern.test(rawText)) {
                // User mentioned this size - check if it's available
                const sizeExists = activeSizes.some(s => Math.abs(s - sp.size) < 0.5);
                if (!sizeExists) {
                    const availableSizes = activeSizes.map(s => `${s}kg`).join(', ');
                    issues.push({
                        type: 'product_not_found',
                        field: 'product_size',
                        message: `📦 Ukuran ${sp.size}kg tidak tersedia!`,
                        suggestion: `Produk yang tersedia: ${availableSizes}`
                    });
                }
            }
        }

        // Check if user mentioned a pangkalan name that doesn't match the parsed result
        const pangkalanMentionPatterns = [
            /(?:ke|untuk|buat)\s+(?:pangkalan\s+)?([a-zA-Z0-9\s]+?)(?:\s+(?:aja|ya|dong|deh|nih)|[,.]|$)/i,
            /pangkalan\s+([a-zA-Z0-9\s]+?)(?:\s+(?:aja|ya|dong|deh|nih)|[,.]|$)/i,
        ];

        // Get all pangkalans
        const allPangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true },
            select: { id: true, name: true }
        });

        for (const pattern of pangkalanMentionPatterns) {
            const match = rawText.match(pattern);
            if (match && match[1]) {
                const mentionedName = match[1].trim().toLowerCase();

                this.logger.log(`User mentioned pangkalan: "${mentionedName}", Parsed to: "${parsedData.pangkalanName}"`);

                // Skip if it's just common words
                if (['yang', 'aja', 'dong', 'ya', 'unit', 'kilo', 'kg'].includes(mentionedName)) continue;

                // Check if the PARSED pangkalan name matches what user said
                if (parsedData.pangkalanName) {
                    const parsedNameLower = parsedData.pangkalanName.toLowerCase();

                    // Generic Levenshtein similarity - scalable for ANY pangkalan
                    const levenshteinDistance = (a: string, b: string): number => {
                        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
                        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
                        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
                        for (let j = 1; j <= b.length; j++) {
                            for (let i = 1; i <= a.length; i++) {
                                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + cost);
                            }
                        }
                        return matrix[b.length][a.length];
                    };

                    const similarity = (a: string, b: string): number => {
                        const maxLen = Math.max(a.length, b.length);
                        return maxLen === 0 ? 1 : 1 - (levenshteinDistance(a, b) / maxLen);
                    };

                    // Check if any word in parsed name is similar to mentioned name (≥70%)
                    const parsedWords = parsedNameLower.split(/\s+/);
                    const isSimilarMatch = parsedWords.some(word =>
                        word.length >= 3 && similarity(mentionedName, word) >= 0.7
                    );

                    this.logger.log(`Validation: mentioned="${mentionedName}", parsed="${parsedNameLower}", similar=${isSimilarMatch}`);

                    // Check if parsed name matches what user said
                    const isGoodMatch =
                        parsedNameLower.includes(mentionedName) ||
                        mentionedName.includes(parsedWords.pop() || '') ||
                        parsedWords.some(w => mentionedName.includes(w) && w.length > 2) ||
                        isSimilarMatch;  // Fuzzy match at 70% threshold

                    if (!isGoodMatch) {
                        const pangkalanNames = allPangkalans.map(p => p.name).slice(0, 5).join(', ');
                        issues.push({
                            type: 'pangkalan_mismatch',
                            field: 'pangkalan',
                            message: `🏪 Anda menyebut "${mentionedName}" tapi sistem memilih "${parsedData.pangkalanName}"`,
                            suggestion: `Pangkalan yang tersedia: ${pangkalanNames}. Coba ulangi dengan nama yang lebih jelas.`
                        });
                    }
                }

                break; // Only check first match
            }
        }

        // ============================================
        // 1. VALIDATE PANGKALAN
        // ============================================
        if (!parsedData.pangkalanId) {
            issues.push({
                type: 'pangkalan_not_found',
                field: 'pangkalan',
                message: '🏪 Pangkalan belum disebutkan dalam perintah',
                suggestion: 'Sebutkan nama pangkalan tujuan, contoh: "untuk pangkalan Reon"'
            });
        } else {
            // Check if pangkalan exists and is active
            const pangkalan = await this.prisma.pangkalans.findUnique({
                where: { id: parsedData.pangkalanId },
                select: { id: true, name: true, is_active: true }
            });

            if (!pangkalan) {
                issues.push({
                    type: 'pangkalan_not_found',
                    field: 'pangkalan',
                    message: `🏪 Pangkalan "${parsedData.pangkalanName}" tidak ditemukan di sistem`,
                    suggestion: 'Periksa nama pangkalan dan coba lagi'
                });
            } else if (!pangkalan.is_active) {
                issues.push({
                    type: 'pangkalan_inactive',
                    field: 'pangkalan',
                    message: `🏪 Pangkalan "${pangkalan.name}" sedang tidak aktif`,
                    suggestion: 'Pilih pangkalan lain yang aktif'
                });
            }
        }

        // ============================================
        // 2. VALIDATE ITEMS & STOCK
        // ============================================
        if (!parsedData.items || parsedData.items.length === 0) {
            issues.push({
                type: 'product_not_found',
                field: 'items',
                message: '📦 Tidak ada produk yang terdeteksi dalam perintah',
                suggestion: 'Sebutkan produk yang dipesan, contoh: "50 tabung 3 kilo"'
            });
        } else {
            for (let i = 0; i < parsedData.items.length; i++) {
                const item = parsedData.items[i];

                // Check quantity limits
                if (item.quantity > MAX_QUANTITY_PER_ITEM) {
                    issues.push({
                        type: 'quantity_too_high',
                        field: `items[${i}].quantity`,
                        message: `🔢 Jumlah ${item.productName} terlalu banyak: ${item.quantity} unit`,
                        suggestion: `Maksimal ${MAX_QUANTITY_PER_ITEM} unit per pesanan. Untuk pesanan besar, buat beberapa pesanan terpisah.`
                    });
                }

                if (item.quantity < MIN_QUANTITY) {
                    issues.push({
                        type: 'quantity_too_low',
                        field: `items[${i}].quantity`,
                        message: `🔢 Jumlah ${item.productName} tidak valid: ${item.quantity} unit`,
                        suggestion: 'Minimal 1 unit untuk setiap produk'
                    });
                }

                // Check stock availability
                // Priority: lpg_product_id (for new products like 12kg) > lpg_type (legacy)
                let currentStock = 0;

                // Method 1: Query by lpg_product_id (primary method for newer products)
                if (item.productId) {
                    this.logger.log(`Querying stock by lpg_product_id: "${item.productId}"`);

                    const stockInByProduct = await this.prisma.stock_histories.aggregate({
                        where: { lpg_product_id: item.productId, movement_type: 'MASUK' },
                        _sum: { qty: true }
                    });
                    const stockOutByProduct = await this.prisma.stock_histories.aggregate({
                        where: { lpg_product_id: item.productId, movement_type: 'KELUAR' },
                        _sum: { qty: true }
                    });

                    currentStock = (stockInByProduct._sum.qty || 0) - (stockOutByProduct._sum.qty || 0);
                    this.logger.log(`Stock by product_id: IN=${stockInByProduct._sum.qty}, OUT=${stockOutByProduct._sum.qty}, Current=${currentStock}`);
                }

                // Method 2: If lpg_product_id query returns 0, try lpg_type as fallback
                if (currentStock === 0 && item.lpgType) {
                    this.logger.log(`product_id returned 0, trying lpg_type: "${item.lpgType}"`);

                    const stockInByType = await this.prisma.stock_histories.aggregate({
                        where: { lpg_type: item.lpgType as any, movement_type: 'MASUK' },
                        _sum: { qty: true }
                    });
                    const stockOutByType = await this.prisma.stock_histories.aggregate({
                        where: { lpg_type: item.lpgType as any, movement_type: 'KELUAR' },
                        _sum: { qty: true }
                    });

                    currentStock = (stockInByType._sum.qty || 0) - (stockOutByType._sum.qty || 0);
                    this.logger.log(`Stock by lpg_type: IN=${stockInByType._sum.qty}, OUT=${stockOutByType._sum.qty}, Current=${currentStock}`);
                }

                this.logger.log(`Final stock for ${item.productName}: ${currentStock} units`);

                // Add stock info to item
                item.stockAvailable = currentStock;

                if (currentStock <= 0) {
                    issues.push({
                        type: 'stock_insufficient',
                        field: `items[${i}].stock`,
                        message: `📦 Stok ${item.productName} habis (tersedia: 0 unit)`,
                        suggestion: 'Pilih produk lain atau hubungi admin untuk penambahan stok'
                    });
                } else if (item.quantity > currentStock) {
                    issues.push({
                        type: 'stock_insufficient',
                        field: `items[${i}].stock`,
                        message: `📦 Stok ${item.productName} tidak cukup. Diminta: ${item.quantity}, Tersedia: ${currentStock} unit`,
                        suggestion: `Kurangi jumlah pesanan menjadi maksimal ${currentStock} unit`
                    });
                } else if (item.quantity > currentStock * 0.8) {
                    // Warning if ordering more than 80% of available stock
                    warnings.push(`⚠️ ${item.productName}: Pesanan ${item.quantity} unit hampir menghabiskan stok (tersisa ${currentStock} unit)`);
                }

                // Check if product exists
                if (item.productId) {
                    const product = await this.prisma.lpg_products.findUnique({
                        where: { id: item.productId },
                        select: { id: true, is_active: true, name: true }
                    });

                    if (!product) {
                        issues.push({
                            type: 'product_not_found',
                            field: `items[${i}].product`,
                            message: `📦 Produk "${item.productName}" tidak ditemukan di sistem`,
                            suggestion: 'Gunakan ukuran LPG yang tersedia: 3kg, 12kg, atau 50kg'
                        });
                    } else if (!product.is_active) {
                        issues.push({
                            type: 'product_not_found',
                            field: `items[${i}].product`,
                            message: `📦 Produk "${product.name}" sudah tidak aktif`,
                            suggestion: 'Pilih produk aktif lainnya'
                        });
                    }
                }
            }
        }

        // Build validation result
        parsedData.validation = {
            isValid: issues.length === 0,
            issues,
            warnings
        };

        // If there are blocking issues, set success to false
        if (issues.length > 0) {
            parsedData.success = false;
            parsedData.error = issues[0].message;  // Show first issue as main error
        }

        this.logger.log(`Validation result: ${issues.length} issues, ${warnings.length} warnings`);
        return parsedData;
    }
}
