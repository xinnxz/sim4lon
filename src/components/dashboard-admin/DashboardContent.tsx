
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import CreateOrderButton from './CreateOrderButton'
import DashboardKPICards from './DashboardKPICards'
import SalesChart from './charts/SalesChart'
import StockChart from './charts/StockChart'
import ProfitChart from './charts/ProfitChart'
import PangkalanOrderChart from './charts/PangkalanOrderChart'
import RecentActivitySection from './RecentActivitySection'
import ChartContainer from './ChartContainer'

export default function DashboardContent() {
  return (
    <div id="is6jwg" className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Dashboard</h1>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl">
          Selamat datang kembali! Berikut adalah ringkasan operasional Anda hari ini.
        </p>
      </div>

      {/* Create Order Button */}
      <div className="animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <CreateOrderButton />
      </div>

      {/* KPI Cards */}
      <DashboardKPICards />

      {/* Sales Chart */}
      <ChartContainer animationDelay="0.5s">
        {(isVisible) => (
          <div className="w-full animate-fadeInUp chart-sales">
            <Card className="shadow-enterprise">
              <CardHeader className="pb-4">
                <CardTitle id="i1oio5" className="text-lg sm:text-xl font-semibold">Pesanan Mingguan</CardTitle>
                <CardDescription id="iwkknt" className="text-xs sm:text-sm">Ringkasan pemesanan gas 7 hari terakhir</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="w-full h-64 sm:h-72 lg:h-80">
                  <SalesChart isVisible={isVisible} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ChartContainer>

      {/* Stock & Profit Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChartContainer animationDelay="0.6s">
          {(isVisible) => (
            <div className="animate-fadeInUp chart-stock">
              <Card className="shadow-enterprise">
                <CardHeader className="pb-4">
                  <CardTitle id="ixkzi5" className="text-lg font-semibold">Stok LPG</CardTitle>
                  <CardDescription id="ico6v7" className="text-xs sm:text-sm">Tren stok lpg mingguan</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="w-full h-64 sm:h-72">
                    <StockChart isVisible={isVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>
        <ChartContainer animationDelay="0.65s">
          {(isVisible) => (
            <div className="animate-fadeInUp chart-profit">
              <Card className="shadow-enterprise">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Keuntungan</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Profit harian</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="w-full h-64 sm:h-72">
                    <ProfitChart isVisible={isVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Pangkalan Orders & Recent Activity - Side by Side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pangkalan Order Chart */}
        <ChartContainer animationDelay="0.7s">
          {(isVisible) => (
            <div className="animate-fadeInUp h-full">
              <Card className="h-full shadow-enterprise flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Top Pangkalan</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">3 pangkalan dengan order terbanyak</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-4 pt-0 flex flex-col">
                  <div className="w-full flex-1 min-h-[240px]">
                    <PangkalanOrderChart isVisible={isVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>

        {/* Recent Activity */}
        <ChartContainer animationDelay="0.75s">
          {(isVisible) => (
            <div className="animate-fadeInUp h-full">
              <RecentActivitySection />
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
