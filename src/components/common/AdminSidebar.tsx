
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
      <SidebarContent className="bg-gradient-to-b from-sidebar via-sidebar/95 to-sidebar-accent/30 px-4">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-4">
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/70 px-4 mb-2 mt-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const normalizedItemHref = normalizeForComparison(item.href)
                  const isActive = normalizedItemHref === activePage

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={isActive ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                      >
                        <a href={item.href} className="flex items-center gap-3 w-full px-3 py-2">
                          <SafeIcon name={item.icon} />
                          <span className="text-base font-semibold">{item.name}</span>
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
