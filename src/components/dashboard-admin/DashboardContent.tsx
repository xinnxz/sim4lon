
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
    <div id="is6jwg" className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 bg-background/50">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:gap-3 animate-fadeInDown">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
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
            <Card className="shadow-sm hover:shadow-lg transition-all duration-300 ease-out">
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
              <Card className="shadow-sm hover:shadow-lg transition-all duration-300 ease-out">
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
              <Card className="shadow-sm hover:shadow-lg transition-all duration-300 ease-out">
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

{/* Recent Activity & Pangkalan Orders */}
       <div id="i6w25j" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
         <ChartContainer animationDelay="0.7s">
           {(isVisible) => (
             <div id="i12kle" className="animate-fadeInUp chart-pangkalan">
              <Card className="shadow-sm hover:shadow-lg transition-all duration-300 ease-out h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Pangkalan dengan Order Terbanyak</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Distribusi pesanan per pangkalan</CardDescription>
                </CardHeader>
<CardContent id="i112jk" className="p-4 sm:p-6 pt-0">
                   <div className="w-full h-64 sm:h-72 lg:h-80">
                     <PangkalanOrderChart isVisible={isVisible} />
                   </div>
                 </CardContent>
              </Card>
            </div>
          )}
        </ChartContainer>
        <div className="animate-fadeInUp recent-activity">
          <RecentActivitySection />
        </div>
      </div>
    </div>
  )
}
