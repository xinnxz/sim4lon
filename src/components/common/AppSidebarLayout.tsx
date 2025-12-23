
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/common/AdminSidebar'
import AdminHeader from '@/components/common/AdminHeader'

interface AppSidebarLayoutProps {
  children: React.ReactNode
  headerHeight?: string
  /**
   * If true, hides the header (for pages that need custom header behavior)
   */
  hideHeader?: boolean
}

/**
 * AppSidebarLayout - Main layout wrapper for admin pages
 * 
 * IMPORTANT: AdminHeader is rendered INSIDE SidebarProvider to ensure
 * the hamburger menu button has access to the sidebar context for mobile.
 */
export default function AppSidebarLayout({
  children,
  headerHeight = '64px',
  hideHeader = false
}: AppSidebarLayoutProps) {
  return (
    <SidebarProvider
      style={{
        '--header-height': headerHeight
      } as React.CSSProperties}
    >
      {/* Header rendered INSIDE SidebarProvider so hamburger menu has access to context */}
      {!hideHeader && <AdminHeader />}
      <AdminSidebar />
      <SidebarInset className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
