import React from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'active' | 'pending' | 'urgent' | 'success' | 'error' | 'idle';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = true,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusColors = {
    active: 'bg-neon-green',
    pending: 'bg-yellow-400',
    urgent: 'bg-red-500',
    success: 'bg-neon-green',
    error: 'bg-red-500',
    idle: 'bg-gray-400'
  };

  const glowColors = {
    active: 'shadow-[0_0_10px_rgba(0,255,100,0.8)]',
    pending: 'shadow-[0_0_10px_rgba(250,204,21,0.8)]',
    urgent: 'shadow-[0_0_10px_rgba(239,68,68,0.8)]',
    success: 'shadow-[0_0_10px_rgba(0,255,100,0.8)]',
    error: 'shadow-[0_0_10px_rgba(239,68,68,0.8)]',
    idle: 'shadow-[0_0_10px_rgba(156,163,175,0.8)]'
  };

  const statusLabels = {
    active: 'Active',
    pending: 'Pending',
    urgent: 'Urgent',
    success: 'Success',
    error: 'Error',
    idle: 'Idle'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'rounded-full transition-all duration-300',
        sizes[size],
        statusColors[status],
        glowColors[status],
        pulse && 'animate-pulse'
      )} />
      {(label || statusLabels[status]) && (
        <span className={cn(
          'text-sm font-rajdhani uppercase tracking-wider',
          status === 'active' && 'text-neon-green',
          status === 'pending' && 'text-yellow-400',
          status === 'urgent' && 'text-red-500',
          status === 'success' && 'text-neon-green',
          status === 'error' && 'text-red-500',
          status === 'idle' && 'text-gray-400'
        )}>
          {label || statusLabels[status]}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
