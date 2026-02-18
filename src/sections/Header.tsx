import React from 'react';
import { Bell, Settings, User, Zap, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusIndicator } from '@/components/StatusIndicator';

interface HeaderProps {
  agentStatus: 'ACTIVE' | 'PAUSED' | 'ERROR';
  unreadNotifications: number;
  onMenuClick?: () => void;
  className?: string;
  user?: any; // Add user prop
}

export const Header: React.FC<HeaderProps> = ({
  agentStatus,
  unreadNotifications,
  onMenuClick,
  className,
  user
}) => {
  const statusMap = {
    'ACTIVE': 'active',
    'PAUSED': 'idle',
    'ERROR': 'error'
  } as const;

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50',
      'bg-dark-bg/90 backdrop-blur-md border-b border-neon-cyan/20',
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-white/70 hover:text-neon-cyan transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 
                            border border-neon-cyan/50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-neon-cyan" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full 
                            animate-pulse shadow-[0_0_10px_rgba(0,255,100,0.8)]" />
            </div>

            <div className="hidden sm:block">
              <h1 className="font-orbitron text-lg font-bold text-white tracking-wider">
                GIAA <span className="text-neon-cyan">AI</span>
              </h1>
              <p className="text-xs text-white/50 font-rajdhani uppercase tracking-widest">
                Grant Intelligence Agent
              </p>
            </div>
          </div>
        </div>

        {/* Center section - Agent Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-dark-panel/50 border border-neon-cyan/20">
            <StatusIndicator
              status={statusMap[agentStatus]}
              size="sm"
              pulse={agentStatus === 'ACTIVE'}
            />
            <span className="text-sm font-rajdhani text-white/70">
              Agent {agentStatus.toLowerCase()}
            </span>
            {agentStatus === 'ACTIVE' && (
              <div className="flex gap-0.5">
                <span className="w-1 h-3 bg-neon-cyan animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-3 bg-neon-cyan animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-3 bg-neon-cyan animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 text-white/70 hover:text-neon-cyan transition-colors">
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 
                             text-white text-xs flex items-center justify-center font-bold
                             animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Settings */}
          <button className="hidden sm:block p-2 text-white/70 hover:text-neon-cyan transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 
                            border border-neon-cyan/50 flex items-center justify-center">
              <User className="w-4 h-4 text-neon-cyan" />
            </div>
            <span className="hidden lg:block text-sm font-rajdhani text-white/70">
              {user?.role || 'Guest'}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
    </header>
  );
};

export default Header;
