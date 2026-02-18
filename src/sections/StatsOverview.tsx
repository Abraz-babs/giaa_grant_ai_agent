import React from 'react';
import { cn } from '@/lib/utils';
import { HoloCard } from '@/components/HoloCard';
import { HexagonStat } from '@/components/HexagonStat';
import { CircularProgress } from '@/components/CircularProgress';
import type { DashboardStats } from '@/types';
import {
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  AlertTriangle,
  Cpu,
  Target
} from 'lucide-react';

interface StatsOverviewProps {
  stats: DashboardStats;
  isRefreshing?: boolean;
  className?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  isRefreshing,
  className
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <HoloCard glowColor="cyan" className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider font-rajdhani">Total Grants</p>
              <p className={cn(
                'text-3xl font-orbitron font-bold text-neon-cyan mt-1',
                isRefreshing && 'animate-pulse'
              )}>
                {stats.totalGrants}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-neon-cyan/10">
              <FileText className="w-5 h-5 text-neon-cyan" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <span className="text-xs text-neon-green">Active monitoring</span>
          </div>
        </HoloCard>

        <HoloCard glowColor="green" className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider font-rajdhani">Active Applications</p>
              <p className={cn(
                'text-3xl font-orbitron font-bold text-neon-green mt-1',
                isRefreshing && 'animate-pulse'
              )}>
                {stats.activeApplications}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-neon-green/10">
              <Clock className="w-5 h-5 text-neon-green" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs text-white/50">Ready to start</span>
          </div>
        </HoloCard>

        <HoloCard glowColor="purple" className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider font-rajdhani">Total Funding</p>
              <p className={cn(
                'text-3xl font-orbitron font-bold text-neon-purple mt-1',
                isRefreshing && 'animate-pulse'
              )}>
                {formatCurrency(stats.totalFunding)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-neon-purple/10">
              <DollarSign className="w-5 h-5 text-neon-purple" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-neon-green" />
            <span className="text-xs text-neon-green">{stats.fundedGrants} grants secured</span>
          </div>
        </HoloCard>

        <HoloCard glowColor="pink" className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider font-rajdhani">Success Rate</p>
              <p className={cn(
                'text-3xl font-orbitron font-bold text-pink-500 mt-1',
                isRefreshing && 'animate-pulse'
              )}>
                {stats.successRate}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Target className="w-5 h-5 text-pink-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <span className="text-xs text-neon-green">Awaiting data</span>
          </div>
        </HoloCard>
      </div>

      {/* Secondary Stats with Hexagons and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hexagon Stats */}
        <HoloCard glowColor="cyan" className="p-6">
          <h3 className="text-lg font-orbitron text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-neon-cyan" />
            AI Intelligence
          </h3>
          <div className="flex justify-around">
            <HexagonStat
              value={stats.aiMatches}
              label="AI Matches"
              color="cyan"
              size="md"
            />
            <HexagonStat
              value={stats.pendingReview}
              label="To Review"
              color="purple"
              size="md"
            />
            <HexagonStat
              value={stats.upcomingDeadlines}
              label="Deadlines"
              color="pink"
              size="md"
            />
          </div>
        </HoloCard>

        {/* Success Rate Circle */}
        <HoloCard glowColor="green" className="p-6">
          <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-green" />
            Performance
          </h3>
          <div className="flex items-center justify-center">
            <CircularProgress
              value={stats.successRate}
              size={140}
              strokeWidth={10}
              color="green"
              label="Success Rate"
            />
          </div>
        </HoloCard>

        {/* Urgent Alerts */}
        <HoloCard glowColor="pink" className="p-6">
          <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-pink-500" />
            Urgent Alerts
          </h3>
          <div className="space-y-4">
            {stats.upcomingDeadlines > 0 ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-white font-rajdhani font-medium">Deadline Approaching</p>
                    <p className="text-red-400 text-sm">{stats.upcomingDeadlines} grants need attention</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white font-rajdhani font-medium">Pending Review</p>
                    <p className="text-yellow-400 text-sm">{stats.pendingReview} grants to evaluate</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-white/50">
                <CheckCircle className="w-12 h-12 text-neon-green mb-2" />
                <p>All caught up!</p>
              </div>
            )}
          </div>
        </HoloCard>
      </div>
    </div>
  );
};

export default StatsOverview;
