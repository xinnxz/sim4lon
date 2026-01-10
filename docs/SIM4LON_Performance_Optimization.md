# SIM4LON Performance Optimization

> Dokumentasi implementasi optimasi performa untuk website SIM4LON

## Ringkasan

Optimasi performa komprehensif telah diterapkan untuk seluruh website (Admin + Pangkalan) meliputi:
- Backend compression
- Static asset caching  
- React Query caching
- Lazy loading images
- Custom query hooks

---

## 1. Backend GZIP Compression

### File
`backend/src/main.ts`

### Perubahan
Semua API response > 1KB dikompres dengan GZIP, mengurangi ukuran response hingga **60-80%**.

```typescript
import compression from 'compression';

// Enable GZIP compression for faster response times
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    threshold: 1024, // Only compress responses > 1KB
}));

// CORS preflight caching for 24 hours
app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    maxAge: 86400, // 24 hours
});
```

### Manfaat
| Metric | Sebelum | Sesudah |
|--------|---------|---------|
| Response Size | 100KB | ~30KB |
| CORS Preflight | Setiap request | Cache 24 jam |

---

## 2. Static Assets Caching (Vercel)

### File
`vercel.json`

### Konfigurasi

```json
{
    "headers": [
        {
            "source": "/(.*).js",
            "headers": [
                { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
            ]
        },
        {
            "source": "/(.*).css",
            "headers": [
                { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
            ]
        },
        {
            "source": "/(.*).png",
            "headers": [
                { "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }
            ]
        }
    ]
}
```

### Policy
| Asset Type | Cache Duration | Strategy |
|------------|----------------|----------|
| JavaScript | 1 tahun | Immutable |
| CSS | 1 tahun | Immutable |
| Fonts (WOFF2) | 1 tahun | Immutable |
| Images | 1 hari | Stale-while-revalidate 7 hari |

---

## 3. React Query Integration

### Files
- `src/lib/queryClient.ts` - Query client configuration
- `src/components/providers/QueryProvider.tsx` - Provider component

### Konfigurasi Default

```typescript
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,      // Data fresh 5 menit
            gcTime: 30 * 60 * 1000,         // Cache 30 menit
            retry: 2,                        // Retry 2x on failure
            refetchOnWindowFocus: false,     // No refetch on focus
            refetchOnReconnect: true,        // Refetch on reconnect
        },
    },
});
```

### Integrasi
React Query terintegrasi di:
- `AppSidebarLayout.tsx` (Admin portal)
- `PangkalanSidebarLayout.tsx` (Pangkalan portal)

---

## 4. Custom Query Hooks

### File
`src/hooks/useOptimizedQuery.ts`

### Hooks Tersedia

| Hook | Kegunaan | Stale Time |
|------|----------|------------|
| `useProfile()` | User profile | 10 menit |
| `useDashboardStats()` | Dashboard statistics | 2 menit |
| `useDashboardAlerts()` | Dashboard alerts | 5 menit |
| `useStockLevels()` | Stock levels | 5 menit |
| `useConsumers()` | Consumer list | 5 menit |
| `useConsumerOrders()` | Consumer orders | 2 menit |
| `usePangkalans()` | Pangkalan list | 5 menit |
| `useOrders()` | Order list | 2 menit |

### Contoh Penggunaan

```tsx
import { useConsumers, useConsumerStats } from '@/hooks/useOptimizedQuery';

function ConsumerList() {
    const { data, isLoading, error } = useConsumers(1, 'search term');
    const { data: stats } = useConsumerStats();
    
    if (isLoading) return <Skeleton />;
    if (error) return <ErrorMessage />;
    
    return <ConsumerTable data={data} />;
}
```

---

## 5. Optimized Image Component

### File
`src/components/common/OptimizedImage.tsx`

### Features
- **Lazy Loading**: Intersection Observer untuk load saat visible
- **Blur Placeholder**: Animasi blur saat loading
- **Error Fallback**: Fallback image jika gagal load
- **Priority Flag**: Untuk above-the-fold images

### Contoh Penggunaan

```tsx
import OptimizedImage from '@/components/common/OptimizedImage';

// Normal lazy loaded image
<OptimizedImage 
    src="/images/product.jpg" 
    alt="Product" 
    width={200} 
    height={200}
/>

// Priority image (no lazy load)
<OptimizedImage 
    src="/images/hero.jpg" 
    alt="Hero"
    priority
/>
```

---

## Expected Performance Improvements

| Metric | Sebelum | Sesudah | Improvement |
|--------|---------|---------|-------------|
| API Response Size | 100KB | ~30KB | **70%** smaller |
| Repeat Page Load | Full fetch | Instant (cache) | **~90%** faster |
| First Contentful Paint | ~2s | ~1s | **50%** faster |
| JS/CSS Load | Every visit | From cache | **100%** cached |
| CORS Overhead | Every request | Once/24h | **Eliminated** |

---

## Testing & Verification

### Test Compression
```bash
curl -H "Accept-Encoding: gzip" -I http://localhost:3000/api/dashboard/stats
# Look for: Content-Encoding: gzip
```

### Test Browser Caching
1. Buka DevTools → Network tab
2. Navigate ke halaman yang sama 2x
3. Request kedua harus dari cache (`disk cache` atau `memory cache`)

### Test React Query
1. Buka React Query DevTools
2. Lihat cached queries dan stale status
3. Verify background refetch behavior

---

## Dependencies Ditambahkan

### Backend
```bash
npm install compression @types/compression --save
```

### Frontend
```bash
npm install @tanstack/react-query --save
```

---

## Catatan Implementasi

1. **Backward Compatible**: Semua perubahan tidak breaking existing functionality
2. **Gradual Migration**: Komponen existing bisa migrate ke hooks secara bertahap
3. **Dev vs Prod**: Compression dan caching optimal untuk production

---

*Dokumentasi ini dibuat pada: 11 Januari 2026*
