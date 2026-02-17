import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Search,
  Bot,
  FileText,
  Bell,
  Building2,
  Settings,
  LogOut,
  Zap,
  User
} from 'lucide-react';

type ViewType = 'dashboard' | 'grants' | 'ai-agent' | 'proposals' | 'alerts' | 'profile' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  unreadNotifications: number;
  className?: string;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'grants', label: 'Grant Opportunities', icon: Search },
  { id: 'ai-agent', label: 'AI Agent', icon: Bot },
  { id: 'proposals', label: 'Proposals', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 0 },
  { id: 'profile', label: 'School Profile', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onClose,
  unreadNotifications,
  className
}) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-16 bottom-0 w-64 z-40',
        'bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50',
        'transform transition-transform duration-300 lg:translate-x-0',
        !isOpen && '-translate-x-full',
        className
      )}>
        {/* Logo Area */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/20 to-violet-500/20
                          border border-brand-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-white">GIAA AI</h1>
              <p className="text-xs text-slate-500">Grant Agent</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const badge = item.id === 'alerts' ? unreadNotifications : item.badge;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg',
                  'text-sm font-medium',
                  'transition-all duration-200 group',
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-white'
                )} />
                <span className="flex-1 text-left">{item.label}</span>
                {badge ? (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-bold',
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'bg-red-500 text-white'
                  )}>
                    {badge}
                  </span>
                ) : null}
                {isActive && (
                  <div className="w-1 h-4 bg-brand-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
          {user && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                       text-slate-500 hover:text-red-400 hover:bg-red-500/10
                       transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Subtle decorative accent */}
        <div className="absolute top-20 right-0 w-px h-16 bg-gradient-to-b from-brand-500/30 to-transparent" />
      </aside>
    </>
  );
};

export default Sidebar;
