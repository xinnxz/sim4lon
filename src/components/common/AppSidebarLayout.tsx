
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/common/AdminSidebar'
import AdminHeader from '@/components/common/AdminHeader'

interface AppSidebarLayoutProps {
  children: React.ReactNode
  headerHeight?: string
}

/**
 * AppSidebarLayout - Main layout wrapper for admin pages
 * 
 * BEST PRACTICE STRUCTURE:
 * ┌─────────────────────────────────────┐
 * │      HEADER (full width, sticky)    │  ← Spans entire width
 * ├──────────┬──────────────────────────┤
 * │ SIDEBAR  │       CONTENT            │  ← Sidebar + Content in row
 * │          │                          │
 * └──────────┴──────────────────────────┘
 * 
 * Header is inside SidebarProvider (for hamburger menu access)
 * but wrapped in a flex-col container to place it ABOVE the sidebar+content row.
 */
export default function AppSidebarLayout({
  children,
  headerHeight = '64px'
}: AppSidebarLayoutProps) {
  return (
    <SidebarProvider
      style={{
        '--header-height': headerHeight
      } as React.CSSProperties}
    >
      {/* 
        Flex column container wraps everything:
        - Row 1: Header (full width)
        - Row 2: Sidebar + Content (flex row)
      */}
      <div className="flex flex-col min-h-screen w-full">
        {/* HEADER - Full width sticky at top */}
        <AdminHeader />

        {/* SIDEBAR + CONTENT row */}
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <SidebarInset className="flex flex-col flex-1">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
