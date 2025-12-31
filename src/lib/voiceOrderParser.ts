/**
 * voiceOrderParser - NLP Parser untuk Voice Command Pesanan LPG
 * 
 * PENJELASAN:
 * Module ini mengekstrak informasi pesanan dari teks hasil speech recognition.
 * Menggunakan regex pattern matching dan fuzzy matching untuk nama pangkalan.
 * 
 * FITUR:
 * - Extract quantity (angka dan kata: "50", "lima puluh")
 * - Extract product type (3kg, 12kg, bright gas, dll)
 * - Extract pangkalan name dengan fuzzy matching
 * - Calculate confidence score
 * 
 * CONTOH INPUT:
 * - "Pesan 50 tabung 3 kilo ke Pangkalan Mitra Jaya"
 * - "Order LPG 12 kg dua puluh unit"
 * - "Bright gas 30 untuk Makmur Sejahtera"
 */

export interface VoiceOrderItem {
    productKeyword: string  // "3kg", "12kg", "bright_gas"
    quantity: number
}

export interface VoiceOrderIntent {
    /** Type of intent detected */
    intent: 'CREATE_ORDER' | 'UNKNOWN'
    /** Confidence score 0.0 - 1.0 */
    confidence: number
    /** Extracted order items */
    items: VoiceOrderItem[]
    /** Extracted pangkalan keyword for matching */
    pangkalanKeyword: string | null
    /** Matched pangkalan ID (after fuzzyMatch) */
    matchedPangkalanId: string | null
    /** Original raw text */
    rawText: string
    /** Debug info for what was matched */
    debugInfo: {
        quantityMatch: string | null
        productMatch: string | null
        pangkalanMatch: string | null
    }
}

interface PangkalanOption {
    id: string
    name: string
}

// ===========================================
// Number word to digit mapping (Bahasa Indonesia)
// ===========================================
const NUMBER_WORDS: Record<string, number> = {
    'satu': 1, 'dua': 2, 'tiga': 3, 'empat': 4, 'lima': 5,
    'enam': 6, 'tujuh': 7, 'delapan': 8, 'sembilan': 9, 'sepuluh': 10,
    'sebelas': 11, 'belas': 10, 'puluh': 10, 'ratus': 100, 'ribu': 1000,
    'seratus': 100, 'seribu': 1000,
}

/**
 * Convert Indonesian number words to digits
 * Examples: "lima puluh" → 50, "seratus" → 100
 */
function parseIndonesianNumber(text: string): number | null {
    const normalized = text.toLowerCase().trim()

    // Direct number
    const directNum = parseInt(normalized)
    if (!isNaN(directNum)) return directNum

    // Simple single word
    if (NUMBER_WORDS[normalized]) return NUMBER_WORDS[normalized]

    // Compound numbers like "lima puluh", "dua ratus"
    const words = normalized.split(/\s+/)
    let result = 0
    let current = 0

    for (const word of words) {
        if (NUMBER_WORDS[word]) {
            const value = NUMBER_WORDS[word]

            if (word === 'puluh') {
                current = (current || 1) * 10
            } else if (word === 'belas') {
                current = current + 10
            } else if (word === 'ratus' || word === 'seratus') {
                current = (current || 1) * 100
            } else if (word === 'ribu' || word === 'seribu') {
                current = (current || 1) * 1000
                result += current
                current = 0
            } else {
                current += value
            }
        }
    }

    result += current
    return result > 0 ? result : null
}

// ===========================================
// Product patterns
// ===========================================
const PRODUCT_PATTERNS: { pattern: RegExp; keyword: string }[] = [
    // 3kg patterns
    { pattern: /(?:lpg\s*)?3\s*(?:kg|kilo|kilogram)/i, keyword: '3kg' },
    { pattern: /tiga\s*(?:kg|kilo|kilogram)/i, keyword: '3kg' },
    { pattern: /subsidi/i, keyword: '3kg' },  // 3kg is subsidized

    // 5.5kg patterns
    { pattern: /(?:lpg\s*)?5[,.]?5?\s*(?:kg|kilo|kilogram)/i, keyword: '5.5kg' },
    { pattern: /lima\s*(?:setengah)?\s*(?:kg|kilo|kilogram)/i, keyword: '5.5kg' },

    // 12kg patterns
    { pattern: /(?:lpg\s*)?12\s*(?:kg|kilo|kilogram)/i, keyword: '12kg' },
    { pattern: /dua\s*belas\s*(?:kg|kilo|kilogram)/i, keyword: '12kg' },

    // 50kg patterns
    { pattern: /(?:lpg\s*)?50\s*(?:kg|kilo|kilogram)/i, keyword: '50kg' },
    { pattern: /lima\s*puluh\s*(?:kg|kilo|kilogram)/i, keyword: '50kg' },

    // Bright Gas (220g can)
    { pattern: /bright\s*gas/i, keyword: 'bright_gas' },
    { pattern: /kaleng/i, keyword: 'bright_gas' },
]

// ===========================================
// Quantity patterns
// ===========================================
const QUANTITY_PATTERNS: RegExp[] = [
    // "50 tabung", "100 unit", "20 buah"
    /(\d+)\s*(?:tabung|unit|buah|pcs|biji)/i,
    // "tabung 50", "unit 100"
    /(?:tabung|unit|buah|pcs|biji)\s*(\d+)/i,
    // Just a number at the start: "50 lpg 3kg"
    /^(\d+)\s+/,
    // Number before product: "50 3kg", "100 lpg"
    /(\d+)\s+(?:lpg|bright)/i,
    // Word numbers: "lima puluh tabung"
    /((?:se(?:ratus|ribu)|[a-z]+\s+(?:puluh|ratus|belas)?))\s*(?:tabung|unit|buah)/i,
]

/**
 * Extract quantity from text
 */
function extractQuantity(text: string): { value: number; match: string } | null {
    const normalized = text.toLowerCase()

    for (const pattern of QUANTITY_PATTERNS) {
        const match = normalized.match(pattern)
        if (match && match[1]) {
            // Try parsing as number first
            const num = parseInt(match[1])
            if (!isNaN(num) && num > 0) {
                return { value: num, match: match[0] }
            }

            // Try parsing Indonesian number words
            const wordNum = parseIndonesianNumber(match[1])
            if (wordNum && wordNum > 0) {
                return { value: wordNum, match: match[0] }
            }
        }
    }

    return null
}

/**
 * Extract product type from text
 */
function extractProduct(text: string): { keyword: string; match: string } | null {
    const normalized = text.toLowerCase()

    for (const { pattern, keyword } of PRODUCT_PATTERNS) {
        const match = normalized.match(pattern)
        if (match) {
            return { keyword, match: match[0] }
        }
    }

    return null
}

// ===========================================
// Fuzzy matching for pangkalan names
// ===========================================

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = []

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i]
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                )
            }
        }
    }

    return matrix[b.length][a.length]
}

/**
 * Calculate similarity score (0-1) between two strings
 */
function similarityScore(a: string, b: string): number {
    const longer = a.length > b.length ? a : b
    const shorter = a.length > b.length ? b : a

    if (longer.length === 0) return 1.0

    const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase())
    return (longer.length - distance) / longer.length
}

/**
 * Extract pangkalan keyword from text
 */
function extractPangkalanKeyword(text: string): string | null {
    const normalized = text.toLowerCase()

    // Pattern: "ke pangkalan X", "untuk pangkalan X", "pangkalan X"
    const patterns = [
        /(?:ke|untuk|di)\s+(?:pangkalan\s+)?([a-z\s]+?)(?:\s+(?:pesan|order|beli|\d|$))/i,
        /pangkalan\s+([a-z\s]+?)(?:\s+(?:pesan|order|beli|\d|$))/i,
        // At the end: "... ke mitra jaya"
        /(?:ke|untuk|di)\s+([a-z\s]+)$/i,
    ]

    for (const pattern of patterns) {
        const match = normalized.match(pattern)
        if (match && match[1]) {
            const keyword = match[1].trim()
            // Filter out common words
            if (keyword.length > 2 && !['lpg', 'gas', 'tabung'].includes(keyword)) {
                return keyword
            }
        }
    }

    return null
}

/**
 * Find best matching pangkalan using fuzzy match
 */
function fuzzyMatchPangkalan(
    keyword: string,
    pangkalanList: PangkalanOption[]
): { id: string; name: string; score: number } | null {
    if (!keyword || pangkalanList.length === 0) return null

    const keywordLower = keyword.toLowerCase()
    let bestMatch: { id: string; name: string; score: number } | null = null

    for (const pangkalan of pangkalanList) {
        const nameLower = pangkalan.name.toLowerCase()

        // Exact substring match
        if (nameLower.includes(keywordLower) || keywordLower.includes(nameLower)) {
            const score = 0.9
            if (!bestMatch || score > bestMatch.score) {
                bestMatch = { id: pangkalan.id, name: pangkalan.name, score }
            }
            continue
        }

        // Fuzzy match
        const score = similarityScore(nameLower, keywordLower)
        if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = { id: pangkalan.id, name: pangkalan.name, score }
        }
    }

    return bestMatch
}

// ===========================================
// Main parser function
// ===========================================

/**
 * Parse voice command text to extract order intent
 * 
 * @param text - Raw text from speech recognition
 * @param pangkalanList - List of available pangkalan for fuzzy matching
 * @returns VoiceOrderIntent with extracted data
 */
export function parseVoiceCommand(
    text: string,
    pangkalanList: PangkalanOption[] = []
): VoiceOrderIntent {
    const normalized = text.toLowerCase().trim()

    // Extract components
    const quantityResult = extractQuantity(normalized)
    const productResult = extractProduct(normalized)
    const pangkalanKeyword = extractPangkalanKeyword(normalized)

    // Fuzzy match pangkalan
    const pangkalanMatch = pangkalanKeyword
        ? fuzzyMatchPangkalan(pangkalanKeyword, pangkalanList)
        : null

    // Build items array
    const items: VoiceOrderItem[] = []
    if (productResult && quantityResult) {
        items.push({
            productKeyword: productResult.keyword,
            quantity: quantityResult.value,
        })
    } else if (productResult) {
        // Default to 1 if no quantity specified
        items.push({
            productKeyword: productResult.keyword,
            quantity: 1,
        })
    }

    // Calculate confidence
    let confidence = 0
    if (quantityResult) confidence += 0.3
    if (productResult) confidence += 0.4
    if (pangkalanMatch) confidence += 0.3 * pangkalanMatch.score

    // Determine intent
    const intent = items.length > 0 ? 'CREATE_ORDER' : 'UNKNOWN'

    return {
        intent,
        confidence: Math.min(confidence, 1),
        items,
        pangkalanKeyword,
        matchedPangkalanId: pangkalanMatch?.id || null,
        rawText: text,
        debugInfo: {
            quantityMatch: quantityResult?.match || null,
            productMatch: productResult?.match || null,
            pangkalanMatch: pangkalanMatch?.name || null,
        },
    }
}

/**
 * Map product keyword to LPG product size
 */
export function mapKeywordToProductSize(keyword: string): number | null {
    const mapping: Record<string, number> = {
        '3kg': 3,
        '5.5kg': 5.5,
        '12kg': 12,
        '50kg': 50,
        'bright_gas': 0.22,  // 220g = 0.22kg
    }
    return mapping[keyword] || null
}

export default parseVoiceCommand
