import React from 'react';
import { cn } from '@/lib/utils';
import { HoloCard } from '@/components/HoloCard';
import { NeonButton } from '@/components/NeonButton';
import type { DeadlineAlert } from '@/types';
import { 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  X,
  Bell,
  CheckCircle
} from 'lucide-react';

interface DeadlineAlertsProps {
  alerts: DeadlineAlert[];
  onDismiss?: (alertId: string) => void;
  onViewGrant?: (grantId: string) => void;
  className?: string;
}

export const DeadlineAlerts: React.FC<DeadlineAlertsProps> = ({
  alerts,
  onDismiss,
  onViewGrant,
  className
}) => {
  const getPriorityColor = (priority: DeadlineAlert['priority']) => {
    switch (priority) {
      case 'URGENT': return 'border-red-500/50 bg-red-500/10';
      case 'HIGH': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'MEDIUM': return 'border-neon-cyan/30 bg-neon-cyan/5';
      default: return 'border-white/10 bg-dark-panel/30';
    }
  };

  const getPriorityIcon = (priority: DeadlineAlert['priority']) => {
    switch (priority) {
      case 'URGENT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'HIGH': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'MEDIUM': return <Calendar className="w-5 h-5 text-neon-cyan" />;
      default: return <Bell className="w-5 h-5 text-white/50" />;
    }
  };

  const getDaysColor = (days: number) => {
    if (days <= 7) return 'text-red-500';
    if (days <= 14) return 'text-yellow-400';
    return 'text-neon-cyan';
  };

  return (
    <HoloCard glowColor="pink" className={cn('p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron text-white">Deadline Alerts</h2>
            <p className="text-sm text-white/50">
              {alerts.filter(a => a.priority === 'URGENT').length} urgent • {alerts.length} total
            </p>
          </div>
        </div>
        
        <NeonButton variant="outline" color="pink" size="sm">
          <Bell className="w-4 h-4" />
          Configure
        </NeonButton>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/50">
          <CheckCircle className="w-16 h-16 text-neon-green mb-4" />
          <p className="text-lg font-rajdhani">All caught up!</p>
          <p className="text-sm">No upcoming deadlines</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'relative p-4 rounded-lg border transition-all duration-300',
                'group hover:scale-[1.02]',
                getPriorityColor(alert.priority)
              )}
            >
              {/* Dismiss button */}
              <button
                onClick={() => onDismiss?.(alert.id)}
                className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100
                         hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  'p-2 rounded-lg',
                  alert.priority === 'URGENT' && 'bg-red-500/20',
                  alert.priority === 'HIGH' && 'bg-yellow-500/20',
                  alert.priority === 'MEDIUM' && 'bg-neon-cyan/20'
                )}>
                  {getPriorityIcon(alert.priority)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-medium truncate">
                      {alert.grantName}
                    </h3>
                    <span className={cn(
                      'px-2 py-0.5 text-xs rounded uppercase font-rajdhani',
                      alert.priority === 'URGENT' && 'bg-red-500/20 text-red-400',
                      alert.priority === 'HIGH' && 'bg-yellow-500/20 text-yellow-400',
                      alert.priority === 'MEDIUM' && 'bg-neon-cyan/20 text-neon-cyan'
                    )}>
                      {alert.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/50" />
                      <span className={cn('font-orbitron font-bold', getDaysColor(alert.daysRemaining))}>
                        {alert.daysRemaining} days
                      </span>
                      <span className="text-white/50">remaining</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(alert.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <NeonButton
                  size="sm"
                  variant="outline"
                  onClick={() => onViewGrant?.(alert.grantId)}
                >
                  View
                  <ArrowRight className="w-4 h-4" />
                </NeonButton>
              </div>

              {/* Progress bar for urgency */}
              <div className="mt-3">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      alert.daysRemaining <= 7 && 'bg-red-500 w-[90%]',
                      alert.daysRemaining > 7 && alert.daysRemaining <= 14 && 'bg-yellow-400 w-[60%]',
                      alert.daysRemaining > 14 && 'bg-neon-cyan w-[30%]'
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {alerts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Next 30 days</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-400">
                  {alerts.filter(a => a.daysRemaining <= 7).length} critical
                </span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-400">
                  {alerts.filter(a => a.daysRemaining > 7 && a.daysRemaining <= 14).length} soon
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </HoloCard>
  );
};

export default DeadlineAlerts;
