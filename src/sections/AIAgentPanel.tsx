import React from 'react';
import { cn } from '@/lib/utils';
import { HoloCard } from '@/components/HoloCard';
import { NeonButton } from '@/components/NeonButton';
import { StatusIndicator } from '@/components/StatusIndicator';
import { DataStream } from '@/components/DataStream';
import type { AIAgent } from '@/types';
import { 
  Play, 
  Pause, 
  Settings, 
  RefreshCw, 
  Cpu, 
  Globe, 
  Mail,
  MessageSquare,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AIAgentPanelProps {
  agent: AIAgent;
  isRunning: boolean;
  logs: string[];
  onRunAgent: () => void;
  onToggleAgent: () => void;
  className?: string;
}

export const AIAgentPanel: React.FC<AIAgentPanelProps> = ({
  agent,
  isRunning,
  logs,
  onRunAgent,
  onToggleAgent,
  className
}) => {
  const statusMap = {
    'ACTIVE': 'active',
    'PAUSED': 'idle',
    'ERROR': 'error'
  } as const;

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'DISCOVER': return <Globe className="w-4 h-4" />;
      case 'FILTER': return <CheckCircle className="w-4 h-4" />;
      case 'ANALYZE': return <Cpu className="w-4 h-4" />;
      case 'NOTIFY': return <Mail className="w-4 h-4" />;
      case 'DRAFT': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-neon-green';
      case 'RUNNING': return 'text-neon-cyan animate-pulse';
      case 'PENDING': return 'text-white/50';
      case 'FAILED': return 'text-red-400';
      default: return 'text-white/50';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Agent Control Panel */}
      <HoloCard glowColor="cyan" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Agent Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30',
                'border-2 transition-all duration-300',
                agent.status === 'ACTIVE' 
                  ? 'border-neon-cyan shadow-neon-cyan animate-pulse' 
                  : 'border-white/30'
              )}>
                <Cpu className="w-8 h-8 text-neon-cyan" />
              </div>
              <div className={cn(
                'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-bg',
                agent.status === 'ACTIVE' && 'bg-neon-green',
                agent.status === 'PAUSED' && 'bg-yellow-400',
                agent.status === 'ERROR' && 'bg-red-500'
              )} />
            </div>
            
            <div>
              <h2 className="text-xl font-orbitron text-white">{agent.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <StatusIndicator 
                  status={statusMap[agent.status]} 
                  size="sm"
                  pulse={agent.status === 'ACTIVE'}
                />
                <span className="text-sm text-white/50">
                  Last run: {new Date(agent.lastRun).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <NeonButton
              variant="outline"
              color={agent.status === 'ACTIVE' ? 'green' : 'cyan'}
              onClick={onToggleAgent}
              icon={agent.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {agent.status === 'ACTIVE' ? 'Pause' : 'Activate'}
            </NeonButton>
            
            <NeonButton
              onClick={onRunAgent}
              loading={isRunning}
              disabled={agent.status !== 'ACTIVE'}
              icon={<RefreshCw className={cn('w-4 h-4', isRunning && 'animate-spin')} />}
            >
              Run Now
            </NeonButton>
            
            <NeonButton
              variant="ghost"
              icon={<Settings className="w-4 h-4" />}
            >
              Configure
            </NeonButton>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-orbitron text-neon-cyan">{agent.stats.totalGrantsFound}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Grants Found</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-orbitron text-neon-green">{agent.stats.totalGrantsFiltered}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">AI Matches</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-orbitron text-neon-purple">{agent.stats.totalApplicationsSubmitted}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Applications</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-orbitron text-pink-500">
              ${(agent.stats.totalFundingSecured / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Funding Secured</p>
          </div>
        </div>
      </HoloCard>

      {/* Active Tasks & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <HoloCard glowColor="purple" className="p-6">
          <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-purple" />
            Active Tasks
          </h3>
          
          <div className="space-y-3">
            {agent.tasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all',
                  task.status === 'RUNNING' 
                    ? 'bg-neon-cyan/5 border-neon-cyan/30' 
                    : 'bg-dark-panel/30 border-white/10'
                )}
              >
                <div className={cn('transition-colors', getTaskStatusColor(task.status))}>
                  {getTaskIcon(task.type)}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'text-sm font-medium',
                    task.status === 'RUNNING' ? 'text-neon-cyan' : 'text-white'
                  )}>
                    {task.type}
                  </p>
                  <p className="text-xs text-white/50">
                    {task.status} • {task.priority} priority
                  </p>
                </div>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  task.status === 'COMPLETED' && 'bg-neon-green',
                  task.status === 'RUNNING' && 'bg-neon-cyan animate-pulse',
                  task.status === 'PENDING' && 'bg-white/30',
                  task.status === 'FAILED' && 'bg-red-500'
                )} />
              </div>
            ))}
          </div>

          {/* Success Rate */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">AI Success Rate</span>
              <span className="text-lg font-orbitron text-neon-green">{agent.stats.successRate}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all duration-500"
                style={{ width: `${agent.stats.successRate}%` }}
              />
            </div>
          </div>
        </HoloCard>

        {/* Data Stream */}
        <DataStream 
          data={logs}
          maxLines={12}
        />
      </div>

      {/* Grant Sources */}
      <HoloCard glowColor="green" className="p-6">
        <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-neon-green" />
          Connected Grant Sources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agent.configuration.grantSources.map((source) => (
            <div 
              key={source.id}
              className={cn(
                'p-4 rounded-lg border transition-all',
                source.isActive 
                  ? 'bg-neon-green/5 border-neon-green/30' 
                  : 'bg-dark-panel/30 border-white/10 opacity-50'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{source.name}</span>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  source.isActive ? 'bg-neon-green animate-pulse' : 'bg-white/30'
                )} />
              </div>
              <p className="text-xs text-white/50">{source.type}</p>
              {source.lastScraped && (
                <p className="text-xs text-white/30 mt-1">
                  Last: {new Date(source.lastScraped).toLocaleTimeString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </HoloCard>
    </div>
  );
};

export default AIAgentPanel;
