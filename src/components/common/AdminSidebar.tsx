
import { useState, useEffect } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import SafeIcon from '@/components/common/SafeIcon'

const menuGroups = [
  {
    label: 'Menu Utama',
    items: [
      { name: 'Dashboard', href: './dashboard-admin.html', icon: 'LayoutDashboard' },
      { name: 'Pesanan', href: './daftar-pesanan.html', icon: 'ShoppingCart' },
      { name: 'Laporan', href: '/laporan', icon: 'BarChart3' },
      { name: 'Stok LPG', href: './ringkasan-stok.html', icon: 'Package' },
    ]
  },
  {
    label: 'Operasional',
    items: [
      { name: 'Perencanaan', href: '/perencanaan', icon: 'CalendarDays' },
      { name: 'Penyaluran', href: '/penyaluran', icon: 'Send' },
      { name: 'Penerimaan', href: '/penerimaan', icon: 'PackageCheck' },
      { name: 'In / Out Agen', href: '/in-out-agen', icon: 'RefreshCw' },
    ]
  },
  {
    label: 'Manajemen',
    items: [
      { name: 'Pangkalan', href: './daftar-pangkalan.html', icon: 'Store' },
      { name: 'Pengguna', href: './daftar-pengguna.html', icon: 'Users' },
      { name: 'Supir', href: './daftar-driver.html', icon: 'Truck' },
    ]
  },
  {
    label: 'Sistem',
    items: [
      { name: 'Pengaturan', href: './pengaturan.html', icon: 'Settings' },
    ]
  }
]

export default function AdminSidebar() {
  const [activePage, setActivePage] = useState<string>('')

  const normalizeForComparison = (path: string): string => {
    return path
      .replace(/^\.\//, '') // Remove ./
      .replace(/^\//, '') // Remove leading /
      .replace(/\/$/, '') // Remove trailing /
      .replace(/\.html$/, '') // Remove .html
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const normalizedCurrentPath = normalizeForComparison(currentPath)
      setActivePage(normalizedCurrentPath)
    }
  }, [])

  return (
    <Sidebar
      className="top-[--header-height] h-[calc(100vh-var(--header-height))]"
      variant="inset"
    >
      <SidebarContent
        className="px-3 py-4"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--sidebar-background)/0.97) 50%, hsl(var(--sidebar-accent)/0.3) 100%)',
        }}
      >
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label} className="py-3">
            <SidebarGroupLabel
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/50 px-4 mb-3 flex items-center gap-2"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              <span>{group.label}</span>
              <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5 px-1">
                {group.items.map((item, itemIndex) => {
                  const normalizedItemHref = normalizeForComparison(item.href)
                  const isActive = normalizedItemHref === activePage

                  return (
                    <SidebarMenuItem
                      key={item.name}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          relative overflow-hidden rounded-xl transition-all duration-300 ease-out
                          ${isActive
                            ? 'bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white shadow-lg'
                            : 'hover:bg-sidebar-accent/50 hover:translate-x-1'
                          }
                        `}
                        style={isActive ? {
                          boxShadow: '0 4px 15px -3px rgba(22, 163, 74, 0.4), 0 0 20px -5px rgba(22, 163, 74, 0.2)'
                        } : {}}
                      >
                        <a href={item.href} className="flex items-center gap-3 w-full px-4 py-2.5 group">
                          <div className={`
                            p-1.5 rounded-lg transition-all duration-300
                            ${isActive
                              ? 'bg-white/20'
                              : 'bg-sidebar-accent/50 group-hover:bg-primary/10 group-hover:scale-110'
                            }
                          `}>
                            <SafeIcon
                              name={item.icon}
                              className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'text-white' : 'text-sidebar-foreground/70 group-hover:text-primary'}`}
                            />
                          </div>
                          <span className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-sidebar-foreground/80 group-hover:text-sidebar-foreground'}`}>
                            {item.name}
                          </span>
                          {isActive && (
                            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Footer decoration */}
        <div className="mt-auto pt-4 px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] text-center text-muted-foreground/40 mt-3 font-medium">
            SIM4LON v1.0
          </p>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
