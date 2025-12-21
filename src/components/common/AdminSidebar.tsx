
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

// Cache key for profile
const PROFILE_CACHE_KEY = 'sim4lon_user_profile'

type UserRole = 'ADMIN' | 'OPERATOR' | 'PANGKALAN'

interface MenuItem {
  name: string
  href: string
  icon: string
  adminOnly?: boolean  // If true, only ADMIN can see this
}

interface MenuGroup {
  label: string
  adminOnly?: boolean  // If true, entire group is admin-only
  items: MenuItem[]
}

/**
 * Menu configuration with role restrictions
 * 
 * adminOnly = true: Only ADMIN can access
 * No adminOnly: Both ADMIN and OPERATOR can access
 */
const menuGroups: MenuGroup[] = [
  {
    label: 'Menu Utama',
    items: [
      { name: 'Dashboard', href: './dashboard-admin.html', icon: 'LayoutDashboard' },
      { name: 'Pesanan', href: './daftar-pesanan.html', icon: 'ShoppingCart' },
      { name: 'Stok LPG', href: './ringkasan-stok.html', icon: 'Package' },
      { name: 'Laporan', href: '/laporan', icon: 'BarChart3', adminOnly: true },
    ]
  },
  {
    label: 'Operasional',
    adminOnly: true,  // Entire group is admin-only
    items: [
      { name: 'Perencanaan', href: '/perencanaan', icon: 'CalendarDays' },
      { name: 'Penyaluran', href: '/penyaluran', icon: 'Send' },
      { name: 'Penerimaan', href: '/penerimaan', icon: 'PackageCheck' },
      { name: 'In / Out Agen', href: '/in-out-agen', icon: 'RefreshCw' },
    ]
  },
  {
    label: 'Manajemen',
    adminOnly: true,  // Entire group is admin-only
    items: [
      { name: 'Pangkalan', href: './daftar-pangkalan.html', icon: 'Store' },
      { name: 'Pengguna', href: './daftar-pengguna.html', icon: 'Users' },
      { name: 'Supir', href: './daftar-driver.html', icon: 'Truck' },
    ]
  },
  {
    label: 'Sistem',
    adminOnly: true,  // Entire group is admin-only
    items: [
      { name: 'Pengaturan', href: './pengaturan.html', icon: 'Settings' },
    ]
  }
]

/**
 * Get user role from cached profile
 */
function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'OPERATOR'

  try {
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY)
    if (cached) {
      const profile = JSON.parse(cached)
      return profile.role || 'OPERATOR'
    }
  } catch { /* ignore */ }

  return 'OPERATOR'  // Default to most restricted role
}

/**
 * Filter menu groups based on user role
 */
function getVisibleMenuGroups(role: UserRole): MenuGroup[] {
  if (role === 'ADMIN') {
    // Admin sees everything
    return menuGroups
  }

  // OPERATOR: Filter out admin-only groups and items
  return menuGroups
    .filter(group => !group.adminOnly)
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.adminOnly)
    }))
    .filter(group => group.items.length > 0)  // Remove empty groups
}

export default function AdminSidebar() {
  const [activePage, setActivePage] = useState<string>('')
  // Start with ADMIN to match server render (shows all menus initially)
  // Then update to actual role after client hydration
  const [userRole, setUserRole] = useState<UserRole>('ADMIN')
  const [isHydrated, setIsHydrated] = useState(false)

  const normalizeForComparison = (path: string): string => {
    return path
      .replace(/^\.\//, '') // Remove ./
      .replace(/^\//, '') // Remove leading /
      .replace(/\/$/, '') // Remove trailing /
      .replace(/\.html$/, '') // Remove .html
  }

  // Mapping sub-pages to their parent menu item
  // Key: parent menu path, Value: array of sub-page patterns
  const subPageMapping: Record<string, string[]> = {
    'daftar-pesanan': ['buat-pesanan', 'detail-pesanan', 'catat-pembayaran', 'nota-pembayaran', 'status-pembayaran'],
    'ringkasan-stok': ['pemakaian-stok'],
    'daftar-pangkalan': ['detail-edit-pangkalan'],
    'daftar-pengguna': ['tambah-pengguna'],
    'dashboard-admin': [],
  }

  // Check if current page should highlight a specific menu item
  const getActiveMenu = (currentPath: string): string => {
    // First check direct match
    for (const [parent, subPages] of Object.entries(subPageMapping)) {
      if (subPages.some(sub => currentPath.includes(sub))) {
        return parent
      }
    }
    return currentPath
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const normalizedCurrentPath = normalizeForComparison(currentPath)
      // Use getActiveMenu to map sub-pages to their parent menu
      const activeMenuPath = getActiveMenu(normalizedCurrentPath)
      setActivePage(activeMenuPath)

      // Get user role from cache - only after hydration
      const role = getUserRole()
      setUserRole(role)
      setIsHydrated(true)
    }
  }, [])

  // Get visible menus based on role
  const visibleGroups = getVisibleMenuGroups(userRole)

  return (
    <Sidebar
      className="top-[--header-height] h-[calc(100vh-var(--header-height))]"
      variant="inset"
    >
      <SidebarContent
        className="px-2 py-2 sidebar-scrollbar-modern"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--sidebar-background)/0.97) 50%, hsl(var(--sidebar-accent)/0.3) 100%)',
        }}
      >
        {visibleGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label} className="py-0.5">
            <SidebarGroupLabel
              className="text-[9px] font-bold uppercase tracking-[0.12em] text-sidebar-foreground/50 px-3 mb-1 flex items-center gap-2"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              <span>{group.label}</span>
              <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5 px-1">
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
                        <a href={item.href} className="flex items-center gap-2 w-full px-3 py-2 group">
                          <div className={`
                            p-1 rounded-md transition-all duration-300
                            ${isActive
                              ? 'bg-white/20'
                              : 'bg-sidebar-accent/50 group-hover:bg-primary/10 group-hover:scale-110'
                            }
                          `}>
                            <SafeIcon
                              name={item.icon}
                              className={`h-3.5 w-3.5 transition-transform duration-300 ${isActive ? 'text-white' : 'text-sidebar-foreground/70 group-hover:text-primary'}`}
                            />
                          </div>
                          <span className={`text-[13px] font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-sidebar-foreground/80 group-hover:text-sidebar-foreground'}`}>
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
        <div className="mt-auto pt-2 px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[14px] text-center text-muted-foreground/40 mt-2 font-medium">
            SIM4LON v1.2
          </p>
          <p className="text-[9px] text-center text-muted-foreground/40 font-normal">
            by Luthfi
          </p>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
