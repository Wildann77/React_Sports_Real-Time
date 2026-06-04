import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Trophy, Key, LogOut } from 'lucide-react';
import { useLogoutMutation } from '@/features/auth/hooks/use-auth-mutations';
import { BrandLogo } from './BrandLogo';
import { cn } from '@/shared/utils';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      to: '/admin',
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: 'API Keys',
      to: '/admin/api-keys',
      icon: Key,
      end: false,
    },
    {
      label: 'Public View',
      to: '/',
      icon: Trophy,
      end: false,
    },
  ];

  return (
    <aside className="flex h-full w-full flex-col bg-card text-card-foreground border-r border-border py-6 px-4">
      <div className="mb-8 px-2">
        <BrandLogo size="md" />
      </div>

      <nav className="flex-1 space-y-1.5" aria-label="Admin Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary rounded-l-none'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border pt-4 mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/10 outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>{logoutMutation.isPending ? 'Logging out...' : 'Log Out'}</span>
        </button>
      </div>
    </aside>
  );
};
