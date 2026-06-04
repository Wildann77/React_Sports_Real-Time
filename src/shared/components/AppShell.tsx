import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useLogoutMutation } from '@/features/auth/hooks/use-auth-mutations';
import { Button } from '@/shared/ui/button';
import { useTheme } from '@/shared/hooks';
import { Backdrop } from './Backdrop';
import { BrandLogo } from './BrandLogo';
import { SkipToContent } from './SkipToContent';
import { ConnectionStatus } from './ConnectionStatus';
import { cn } from '@/shared/utils';

export function AppShell() {
  const { isAuthenticated, isAuthReady, user } = useAuthStore();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutMutation = useLogoutMutation({
    onSettled: () => {
      navigate('/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Matches', to: '/' },
    ...(isAuthReady && isAuthenticated
      ? [
          { label: 'Admin Area', to: '/admin' },
          { label: 'API Keys', to: '/admin/api-keys' },
        ]
      : []),
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background font-sans antialiased text-foreground">
      <SkipToContent />
      <Backdrop />

      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm font-semibold tracking-tight transition-colors hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm',
                  location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-4 w-px bg-border/60" />

            <ConnectionStatus size="sm" />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {isAuthReady && isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground max-w-[120px] truncate" title={user?.email || ''}>
                  {user?.email}
                </span>
                <Button variant="outline" size="sm" className="rounded-full font-semibold border-border/80 hover:bg-secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : null}

            {isAuthReady && !isAuthenticated ? (
              <Button asChild size="sm" className="rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/login">Admin Login</Link>
              </Button>
            ) : null}
          </nav>

          {/* Mobile Actions (Menu Toggle & Theme Toggle) */}
          <div className="flex items-center gap-2 md:hidden">
            <ConnectionStatus size="sm" className="mr-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-secondary"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-background/95 p-6 shadow-2xl outline-none border-l border-border/40 focus-visible:ring-0">
                  <div className="flex items-center justify-between mb-8">
                    <Dialog.Title className="sr-only">Menu</Dialog.Title>
                    <Dialog.Description className="sr-only">Navigation links for sports dashboard</Dialog.Description>
                    <BrandLogo size="sm" />
                    <Dialog.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        aria-label="Close menu"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </Dialog.Close>
                  </div>

                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'text-base font-semibold px-2 py-1.5 rounded-md hover:bg-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto border-t border-border/60 pt-6">
                    {isAuthReady && isAuthenticated ? (
                      <div className="flex flex-col gap-3">
                        <span className="text-sm text-muted-foreground truncate px-2">
                          {user?.email}
                        </span>
                        <Button 
                          variant="outline" 
                          className="w-full rounded-full font-semibold border-border/80" 
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </div>
                    ) : null}

                    {isAuthReady && !isAuthenticated ? (
                      <Button asChild className="w-full rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setMobileMenuOpen(false)}>
                        <Link to="/login">Admin Login</Link>
                      </Button>
                    ) : null}
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      <main id="main" className="relative z-10 flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
