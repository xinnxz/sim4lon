
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
      { name: 'Pangkalan', href: './daftar-pangkalan.html', icon: 'Store' },
      { name: 'Laporan', href: './dashboard-laporan.html', icon: 'BarChart3' },
      { name: 'Stok LPG', href: './ringkasan-stok.html', icon: 'Package' },
    ]
  },
  {
    label: 'Manajemen Sistem',
    items: [
      { name: 'Pengguna', href: './daftar-pengguna.html', icon: 'Users' },
      { name: 'Supir', href: './page-912213.html', icon: 'Truck' },
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
      <SidebarContent className="bg-gradient-to-b from-sidebar via-sidebar/95 to-sidebar-accent/30 px-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-5">
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/60 px-3 mb-4">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {group.items.map((item) => {
                  const normalizedItemHref = normalizeForComparison(item.href)
                  const isActive = normalizedItemHref === activePage

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={`h-12 px-4 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105 font-semibold' 
                            : 'text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 hover:scale-102 hover:shadow-md'
                        } [&>svg]:w-5 [&>svg]:h-5`}
                      >
                        <a href={item.href} className="flex items-center gap-3 w-full">
                          <SafeIcon name={item.icon} />
                          <span className="text-sm font-semibold">{item.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
