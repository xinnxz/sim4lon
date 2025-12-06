
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SalesChart from './charts/SalesChart'
import StockChart from './charts/StockChart'
import ProfitChart from './charts/ProfitChart'

export default function DashboardCharts() {
  return (
    <>
<Card>
        <CardHeader>
          <CardTitle id="i1oio5">Pesanan Mingguan</CardTitle>
          <CardDescription id="iwkknt">Ringkasan pemesanan gas 7 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle id="ixkzi5">Stok LPG</CardTitle>
          <CardDescription id="ico6v7">Tren stok lpg mingguan</CardDescription>
        </CardHeader>
        <CardContent>
          <StockChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keuntungan</CardTitle>
          <CardDescription>Profit harian</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfitChart />
        </CardContent>
      </Card>
    </>
  )
}
