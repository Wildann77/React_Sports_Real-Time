import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, LogOut, User as UserIcon, Sun, Moon, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useLogoutMutation } from '@/features/auth/hooks/use-auth-mutations';
import { Button } from '@/shared/ui/button';
import { useTheme } from '@/shared/hooks';
import { AdminSidebar } from './AdminSidebar';
import { ConnectionStatus } from './ConnectionStatus';
import { Backdrop } from './Backdrop';
import { SkipToContent } from './SkipToContent';
import { cn } from '@/shared/utils';

export function AdminShell() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const { toggleTheme, isDark } = useTheme();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate('/login');
    },
  });

  const getPageTitle = (pathname: string) => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/api-keys') return 'API Key Management';
    if (pathname.includes('/matches/create')) return 'Create New Match';
    if (pathname.includes('/commentary')) return 'Match Commentary';
    return 'Admin Panel';
  };

  const getBreadcrumbs = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs = [];

    // Base breadcrumb
    crumbs.push({ label: 'Admin', to: '/admin' });

    if (segments.length > 1) {
      if (segments[1] === 'api-keys') {
        crumbs.push({ label: 'API Keys', to: '/admin/api-keys' });
      } else if (segments[1] === 'matches') {
        if (segments[2] === 'create') {
          crumbs.push({ label: 'Matches', to: '/admin' });
          crumbs.push({ label: 'Create', to: '/admin/matches/create' });
        } else if (segments[3] === 'commentary') {
          crumbs.push({ label: 'Matches', to: '/admin' });
          crumbs.push({ label: 'Commentary', to: `/admin/matches/${segments[2]}/commentary` });
        }
      }
    }

    return crumbs;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const userInitial = user?.email?.[0]?.toUpperCase() || 'A';

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background font-sans antialiased text-foreground">
      <SkipToContent />
      <Backdrop />

      {/* Desktop Layout: Sidebar sticky on left */}
      <div 
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300 ease-in-out overflow-hidden bg-card",
          desktopSidebarOpen ? "w-[260px]" : "w-0"
        )}
      >
        <div className="sticky top-0 h-screen w-[260px]">
          <AdminSidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* TopBar */}
        <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-4 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button for mobile and desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-secondary"
              onClick={() => {
                if (window.innerWidth >= 768) {
                  setDesktopSidebarOpen((prev) => !prev);
                } else {
                  setSidebarOpen(true);
                }
              }}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity md:hidden" />
                <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-background/95 shadow-2xl outline-none border-r border-border/40 focus-visible:ring-0 md:hidden">
                  <Dialog.Title className="sr-only">Navigation Sidebar</Dialog.Title>
                  <Dialog.Description className="sr-only">Sidebar menu details for sports dashboard management</Dialog.Description>
                  <div className="absolute top-4 right-4 z-55">
                    <Dialog.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        aria-label="Close sidebar"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <div className="h-full">
                    <AdminSidebar onCloseMobile={() => setSidebarOpen(false)} />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <div className="flex flex-col gap-0.5">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {getBreadcrumbs(location.pathname).map((crumb, idx, arr) => (
                  <React.Fragment key={crumb.to}>
                    {idx > 0 && <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/60 shrink-0" />}
                    {idx === arr.length - 1 ? (
                      <span className="text-primary font-black truncate max-w-[100px]">{crumb.label}</span>
                    ) : (
                      <Link to={crumb.to} className="hover:text-foreground transition-colors shrink-0">
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
              <h1 className="text-base font-black tracking-tight sm:text-lg font-display mt-0.5">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ConnectionStatus size="sm" />

            <div className="h-4 w-px bg-border/60" />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="h-4 w-px bg-border/60" />

            {/* User Profile display & Logout button */}
            <div className="flex items-center gap-3">
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20"
                aria-hidden="true"
              >
                {userInitial}
              </div>
              <span className="hidden text-xs font-semibold text-muted-foreground sm:inline max-w-[150px] truncate" title={user?.email || ''}>
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="h-8 w-8 rounded-full text-red-500 hover:text-red-500 hover:bg-red-500/10"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main id="main" className="relative z-10 flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
