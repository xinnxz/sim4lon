"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
let GeminiService = GeminiService_1 = class GeminiService {
    prisma;
    logger = new common_1.Logger(GeminiService_1.name);
    apiKey;
    apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    constructor(prisma) {
        this.prisma = prisma;
        this.apiKey = process.env.GEMINI_API_KEY || '';
        if (!this.apiKey) {
            this.logger.warn('GEMINI_API_KEY not set! Voice order parsing will use fallback.');
        }
    }
    async parseVoiceCommand(text) {
        this.logger.log(`Parsing voice command: "${text}"`);
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
        const pangkalanList = pangkalans.map(p => `- "${p.name}" (ID: ${p.id})`).join('\n');
        const productList = products.map(p => `- ${p.name} - ${p.size_kg}kg (ID: ${p.id}, harga: ${p.selling_price})`).join('\n');
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

⚖️ UKURAN PRODUK (match ke database!):
- "3 kilo" / "3kg" / "tiga kilo" / "melon" / "kecil" → cari produk 3kg
- "12 kilo" / "12kg" / "dua belas kilo" → cari produk 12kg  
- "50 kilo" / "50kg" / "besar" → cari produk 50kg
- "5 kilo" / "5kg" → HANYA jika ada 5kg di database, jika tidak → ERROR!
- "220 gram" → HANYA jika ada 220gr di database, jika tidak → ERROR!

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
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                this.logger.warn('No JSON found in Gemini response, using fallback');
                return this.fallbackParse(text, pangkalans, products);
            }
            const parsed = JSON.parse(jsonMatch[0]);
            parsed.rawText = text;
            this.logger.log(`Gemini parsed successfully: ${JSON.stringify(parsed)}`);
            return parsed;
        }
        catch (error) {
            this.logger.error(`Gemini parsing failed: ${error}`);
            return this.fallbackParse(text, pangkalans, products);
        }
    }
    fallbackParse(text, pangkalans, products) {
        this.logger.log(`Using fallback regex parser for: "${text}"`);
        const normalized = text.toLowerCase().trim();
        this.logger.log(`Normalized text: "${normalized}"`);
        let quantity = 1;
        let qtyMatch = normalized.match(/(\d+)\s*(?:tabung|unit|buah|biji|gas)/);
        if (!qtyMatch) {
            qtyMatch = normalized.match(/(\d+)\s+(?:yang|untuk|ke)/);
        }
        if (!qtyMatch) {
            const numberMatches = [...normalized.matchAll(/(\d+)(?:\s*(\w*))?/g)];
            for (const match of numberMatches) {
                const num = parseInt(match[1]);
                const suffix = (match[2] || '').toLowerCase();
                if (suffix === 'kg' || suffix === 'kilo' || suffix === 'kilogram') {
                    continue;
                }
                if (num > 1) {
                    if ((num === 3 || num === 5 || num === 12) && !suffix) {
                        continue;
                    }
                    quantity = num;
                    this.logger.log(`Found quantity from context-aware parsing: ${quantity} (suffix: ${suffix})`);
                    break;
                }
            }
        }
        else {
            quantity = parseInt(qtyMatch[1]);
            this.logger.log(`Found quantity from pattern match: ${quantity}`);
        }
        let matchedProduct = null;
        if (/3\s*(?:kg|kilo)/.test(normalized) || /tiga\s*(?:kg|kilo)/.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 3) < 0.5) || null;
            this.logger.log(`Matched product: 3kg`);
        }
        else if (/12\s*(?:kg|kilo)/.test(normalized) || /dua\s*belas/.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 12) < 0.5) || null;
            this.logger.log(`Matched product: 12kg`);
        }
        else if (/50\s*(?:kg|kilo)/.test(normalized) || /lima\s*puluh\s*(?:kg|kilo)/.test(normalized)) {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 50) < 0.5) || null;
            this.logger.log(`Matched product: 50kg`);
        }
        else {
            matchedProduct = products.find(p => Math.abs(Number(p.size_kg) - 3) < 0.5) || products[0] || null;
            this.logger.log(`Defaulting to 3kg product`);
        }
        let matchedPangkalan = null;
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
        if (extractedPangkalanName) {
            const searchName = extractedPangkalanName.toLowerCase().trim();
            const levenshteinDistance = (a, b) => {
                const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
                for (let i = 0; i <= a.length; i++)
                    matrix[0][i] = i;
                for (let j = 0; j <= b.length; j++)
                    matrix[j][0] = j;
                for (let j = 1; j <= b.length; j++) {
                    for (let i = 1; i <= a.length; i++) {
                        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                        matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + cost);
                    }
                }
                return matrix[b.length][a.length];
            };
            const similarity = (a, b) => {
                const distance = levenshteinDistance(a, b);
                const maxLen = Math.max(a.length, b.length);
                return maxLen === 0 ? 1 : 1 - (distance / maxLen);
            };
            this.logger.log(`Searching pangkalan for: "${searchName}"`);
            matchedPangkalan = pangkalans.find(p => p.name.toLowerCase() === searchName ||
                p.name.toLowerCase().includes(searchName) ||
                searchName.includes(p.name.toLowerCase())) || null;
            if (!matchedPangkalan) {
                let bestMatch = null;
                for (const p of pangkalans) {
                    const pName = p.name.toLowerCase();
                    const pWords = pName.split(/\s+/);
                    for (const word of pWords) {
                        if (word.length < 3)
                            continue;
                        const score = similarity(searchName, word);
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
                    if (matchedPangkalan)
                        break;
                }
            }
        }
        if (!matchedPangkalan) {
            for (const p of pangkalans) {
                const pNameLower = p.name.toLowerCase();
                const words = pNameLower.split(/\s+/);
                for (const word of words) {
                    if (word.length > 3 && normalized.includes(word)) {
                        matchedPangkalan = p;
                        this.logger.log(`Found pangkalan via word match: ${p.name} (word: ${word})`);
                        break;
                    }
                }
                if (matchedPangkalan)
                    break;
            }
        }
        this.logger.log(`Final result: qty=${quantity}, product=${matchedProduct?.name}, pangkalan=${matchedPangkalan?.name}`);
        const sizeToLpgType = (size) => {
            if (size <= 0.3)
                return 'gr220';
            if (Math.abs(size - 3) < 0.5)
                return 'kg3';
            if (Math.abs(size - 5.5) < 1)
                return 'kg5';
            if (Math.abs(size - 12) < 0.5)
                return 'kg12';
            if (Math.abs(size - 50) < 0.5)
                return 'kg50';
            return 'kg3';
        };
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
            error: matchedProduct ? undefined : 'Tidak dapat mendeteksi produk dari perintah'
        };
    }
    async validateParsedOrder(parsedData) {
        const issues = [];
        const warnings = [];
        const rawText = parsedData.rawText.toLowerCase();
        const MAX_QUANTITY_PER_ITEM = 500;
        const MIN_QUANTITY = 1;
        const sizePatterns = [
            { pattern: /(?:5|lima)\s*(?:kg|kilo)/i, size: 5 },
            { pattern: /(?:5\.5|5,5|lima setengah)\s*(?:kg|kilo)/i, size: 5.5 },
            { pattern: /(?:220|dua ratus dua puluh)\s*(?:gr|gram)/i, size: 0.22 },
            { pattern: /(?:50|lima puluh)\s*(?:kg|kilo)/i, size: 50 },
            { pattern: /(?:25|dua puluh lima)\s*(?:kg|kilo)/i, size: 25 },
        ];
        const activeProducts = await this.prisma.lpg_products.findMany({
            where: { is_active: true },
            select: { size_kg: true, name: true }
        });
        const activeSizes = activeProducts.map(p => Number(p.size_kg));
        for (const sp of sizePatterns) {
            if (sp.pattern.test(rawText)) {
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
        const pangkalanMentionPatterns = [
            /(?:ke|untuk|buat)\s+(?:pangkalan\s+)?([a-zA-Z0-9\s]+?)(?:\s+(?:aja|ya|dong|deh|nih)|[,.]|$)/i,
            /pangkalan\s+([a-zA-Z0-9\s]+?)(?:\s+(?:aja|ya|dong|deh|nih)|[,.]|$)/i,
        ];
        const allPangkalans = await this.prisma.pangkalans.findMany({
            where: { is_active: true },
            select: { id: true, name: true }
        });
        for (const pattern of pangkalanMentionPatterns) {
            const match = rawText.match(pattern);
            if (match && match[1]) {
                const mentionedName = match[1].trim().toLowerCase();
                this.logger.log(`User mentioned pangkalan: "${mentionedName}", Parsed to: "${parsedData.pangkalanName}"`);
                if (['yang', 'aja', 'dong', 'ya', 'unit', 'kilo', 'kg'].includes(mentionedName))
                    continue;
                if (parsedData.pangkalanName) {
                    const parsedNameLower = parsedData.pangkalanName.toLowerCase();
                    const levenshteinDistance = (a, b) => {
                        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
                        for (let i = 0; i <= a.length; i++)
                            matrix[0][i] = i;
                        for (let j = 0; j <= b.length; j++)
                            matrix[j][0] = j;
                        for (let j = 1; j <= b.length; j++) {
                            for (let i = 1; i <= a.length; i++) {
                                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + cost);
                            }
                        }
                        return matrix[b.length][a.length];
                    };
                    const similarity = (a, b) => {
                        const maxLen = Math.max(a.length, b.length);
                        return maxLen === 0 ? 1 : 1 - (levenshteinDistance(a, b) / maxLen);
                    };
                    const parsedWords = parsedNameLower.split(/\s+/);
                    const isSimilarMatch = parsedWords.some(word => word.length >= 3 && similarity(mentionedName, word) >= 0.7);
                    this.logger.log(`Validation: mentioned="${mentionedName}", parsed="${parsedNameLower}", similar=${isSimilarMatch}`);
                    const isGoodMatch = parsedNameLower.includes(mentionedName) ||
                        mentionedName.includes(parsedWords.pop() || '') ||
                        parsedWords.some(w => mentionedName.includes(w) && w.length > 2) ||
                        isSimilarMatch;
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
                break;
            }
        }
        if (!parsedData.pangkalanId) {
            issues.push({
                type: 'pangkalan_not_found',
                field: 'pangkalan',
                message: '🏪 Pangkalan belum disebutkan dalam perintah',
                suggestion: 'Sebutkan nama pangkalan tujuan, contoh: "untuk pangkalan Reon"'
            });
        }
        else {
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
            }
            else if (!pangkalan.is_active) {
                issues.push({
                    type: 'pangkalan_inactive',
                    field: 'pangkalan',
                    message: `🏪 Pangkalan "${pangkalan.name}" sedang tidak aktif`,
                    suggestion: 'Pilih pangkalan lain yang aktif'
                });
            }
        }
        if (!parsedData.items || parsedData.items.length === 0) {
            issues.push({
                type: 'product_not_found',
                field: 'items',
                message: '📦 Tidak ada produk yang terdeteksi dalam perintah',
                suggestion: 'Sebutkan produk yang dipesan, contoh: "50 tabung 3 kilo"'
            });
        }
        else {
            for (let i = 0; i < parsedData.items.length; i++) {
                const item = parsedData.items[i];
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
                let currentStock = 0;
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
                if (currentStock === 0 && item.lpgType) {
                    this.logger.log(`product_id returned 0, trying lpg_type: "${item.lpgType}"`);
                    const stockInByType = await this.prisma.stock_histories.aggregate({
                        where: { lpg_type: item.lpgType, movement_type: 'MASUK' },
                        _sum: { qty: true }
                    });
                    const stockOutByType = await this.prisma.stock_histories.aggregate({
                        where: { lpg_type: item.lpgType, movement_type: 'KELUAR' },
                        _sum: { qty: true }
                    });
                    currentStock = (stockInByType._sum.qty || 0) - (stockOutByType._sum.qty || 0);
                    this.logger.log(`Stock by lpg_type: IN=${stockInByType._sum.qty}, OUT=${stockOutByType._sum.qty}, Current=${currentStock}`);
                }
                this.logger.log(`Final stock for ${item.productName}: ${currentStock} units`);
                item.stockAvailable = currentStock;
                if (currentStock <= 0) {
                    issues.push({
                        type: 'stock_insufficient',
                        field: `items[${i}].stock`,
                        message: `📦 Stok ${item.productName} habis (tersedia: 0 unit)`,
                        suggestion: 'Pilih produk lain atau hubungi admin untuk penambahan stok'
                    });
                }
                else if (item.quantity > currentStock) {
                    issues.push({
                        type: 'stock_insufficient',
                        field: `items[${i}].stock`,
                        message: `📦 Stok ${item.productName} tidak cukup. Diminta: ${item.quantity}, Tersedia: ${currentStock} unit`,
                        suggestion: `Kurangi jumlah pesanan menjadi maksimal ${currentStock} unit`
                    });
                }
                else if (item.quantity > currentStock * 0.8) {
                    warnings.push(`⚠️ ${item.productName}: Pesanan ${item.quantity} unit hampir menghabiskan stok (tersisa ${currentStock} unit)`);
                }
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
                    }
                    else if (!product.is_active) {
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
        parsedData.validation = {
            isValid: issues.length === 0,
            issues,
            warnings
        };
        if (issues.length > 0) {
            parsedData.success = false;
            parsedData.error = issues[0].message;
        }
        this.logger.log(`Validation result: ${issues.length} issues, ${warnings.length} warnings`);
        return parsedData;
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map