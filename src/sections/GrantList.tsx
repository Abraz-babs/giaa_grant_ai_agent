import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { HoloCard } from '@/components/HoloCard';
import { NeonButton } from '@/components/NeonButton';
import type { Grant, GrantCategory } from '@/types';
import {
  Search,
  ChevronDown,
  ExternalLink,
  Calendar,
  DollarSign,
  Building2,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface GrantListProps {
  grants: Grant[];
  isLoading?: boolean;
  onGrantClick?: (grant: Grant) => void;
  onStatusChange?: (grantId: string, status: Grant['status']) => void;
  className?: string;
}

const categoryColors: Record<GrantCategory, string> = {
  STEM: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  AI_EDUCATION: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  ROBOTICS: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  EDUCATION_INNOVATION: 'bg-green-500/20 text-green-400 border-green-500/30',
  INCLUSIVE_EDUCATION: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  AGRICULTURE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  SUSTAINABILITY: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  ENTREPRENEURSHIP: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  INFRASTRUCTURE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  YOUTH_DEVELOPMENT: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  TECHNOLOGY: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  GENERAL: 'bg-white/10 text-white/70 border-white/20'
};

const statusConfig = {
  NEW: { icon: HelpCircle, color: 'text-gray-400', bg: 'bg-gray-500/20' },
  REVIEWING: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  APPLYING: { icon: ArrowRight, color: 'text-neon-cyan', bg: 'bg-neon-cyan/20' },
  SUBMITTED: { icon: CheckCircle, color: 'text-neon-green', bg: 'bg-neon-green/20' },
  FUNDED: { icon: DollarSign, color: 'text-neon-green', bg: 'bg-neon-green/30' },
  REJECTED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
};

const relevanceConfig = {
  HIGH: { color: 'text-neon-green', bg: 'bg-neon-green/20', label: 'High Match' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Medium' },
  LOW: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Low' }
};

export const GrantList: React.FC<GrantListProps & { selectedId?: string }> = ({
  grants,
  isLoading,
  onStatusChange,
  className,
  selectedId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GrantCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<Grant['status'] | 'ALL'>('ALL');
  const [expandedGrant, setExpandedGrant] = useState<string | null>(null);

  // Auto-expand selected grant when it changes
  React.useEffect(() => {
    if (selectedId) {
      setExpandedGrant(selectedId);
      // Optional: scroll to element logic could go here
    }
  }, [selectedId]);

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = !searchQuery ||
      grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || grant.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || grant.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort: High > Medium > Low
  const sortedGrants = filteredGrants.sort((a, b) => {
    const scoreMap: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return (scoreMap[b.relevanceScore] || 0) - (scoreMap[a.relevanceScore] || 0);
  });

  const formatAmount = (amount: Grant['amount']) => {
    if (!amount) return 'Amount TBD';
    const { min, max, currency } = amount;
    if (min === 0 && max === 0) return 'Amount TBD';
    if (min === max) return `${currency} ${min.toLocaleString()}`;
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <HoloCard glowColor="cyan" className={cn('p-6', className)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-orbitron text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-neon-cyan" />
            Grant Opportunities
          </h2>
          <p className="text-white/50 text-sm mt-1">
            {sortedGrants.length} grants found • {grants.filter(g => g.relevanceScore === 'HIGH').length} high relevance matches
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search grants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-panel/50 border border-neon-cyan/30 rounded-lg
                       text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan
                       font-rajdhani text-sm w-48"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as GrantCategory | 'ALL')}
            className="px-4 py-2 bg-dark-panel/50 border border-neon-cyan/30 rounded-lg
                     text-white focus:outline-none focus:border-neon-cyan
                     font-rajdhani text-sm cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {Object.keys(categoryColors).map(cat => (
              <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Grant['status'] | 'ALL')}
            className="px-4 py-2 bg-dark-panel/50 border border-neon-cyan/30 rounded-lg
                     text-white focus:outline-none focus:border-neon-cyan
                     font-rajdhani text-sm cursor-pointer"
          >
            <option value="ALL">All Status</option>
            {Object.keys(statusConfig).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grants List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredGrants.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <p className="mb-4">
              {grants.length === 0
                ? "No grants loaded. Please try refreshing the data."
                : "No grants found matching your criteria"}
            </p>
            {grants.length === 0 && (
              <NeonButton
                variant="ghost"
                onClick={() => window.location.reload()}
              >
                Refresh Data
              </NeonButton>
            )}
          </div>
        ) : (

          sortedGrants.map((grant) => {
            const daysRemaining = getDaysRemaining(grant.deadline);
            const isExpanded = expandedGrant === grant.id;
            const StatusIcon = statusConfig[grant.status].icon;
            const relevance = relevanceConfig[grant.relevanceScore] || relevanceConfig['LOW'];

            return (
              <div
                key={grant.id}
                id={`grant-${grant.id}`}
                className={cn(
                  'group relative border rounded-lg transition-all duration-300',
                  'bg-dark-panel/30 border-white/10 hover:border-neon-cyan/50',
                  isExpanded && 'border-neon-cyan/50 bg-dark-panel/50'
                )}
              >
                {/* Main Row */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedGrant(isExpanded ? null : grant.id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Grant Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-orbitron text-white group-hover:text-neon-cyan transition-colors">
                          {grant.name}
                        </h3>
                        <span className={cn(
                          'px-2 py-0.5 text-xs rounded border font-rajdhani uppercase tracking-wider',
                          categoryColors[grant.category] || categoryColors.GENERAL
                        )}>
                          {grant.category.replace('_', ' ')}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 text-xs rounded flex items-center gap-1',
                          relevance.bg, relevance.color
                        )}>
                          <Star className="w-3 h-3" />
                          {relevance.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/60 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {grant.organization}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatAmount(grant.amount)}
                        </span>
                        <span className={cn(
                          'flex items-center gap-1',
                          daysRemaining !== null && daysRemaining <= 14 && 'text-red-400',
                          daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 14 && 'text-yellow-400'
                        )}>
                          <Calendar className="w-4 h-4" />
                          {daysRemaining !== null ? `${daysRemaining} days remaining` : 'No Deadline'}
                        </span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm flex items-center gap-2',
                        statusConfig[grant.status].bg,
                        statusConfig[grant.status].color
                      )}>
                        <StatusIcon className="w-4 h-4" />
                        {grant.status}
                      </span>
                      <ChevronDown className={cn(
                        'w-5 h-5 text-white/50 transition-transform',
                        isExpanded && 'rotate-180'
                      )} />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/10 pt-4 animate-in slide-in-from-top-2">
                    <p className="text-white/70 text-sm mb-4">{grant.description}</p>

                    {grant.aiSummary && (
                      <div className="p-3 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 mb-4">
                        <p className="text-xs text-neon-cyan uppercase tracking-wider mb-1">AI Analysis</p>
                        <p className="text-sm text-white/80">{grant.aiSummary}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Eligibility</p>
                        <ul className="space-y-1">
                          {grant.eligibility.map((item, i) => (
                            <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-neon-green" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Requirements</p>
                        <ul className="space-y-1">
                          {grant.requirements.map((item, i) => (
                            <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {grant.applicationReadiness && (
                      <div className="p-3 rounded-lg bg-dark-panel/50 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white/50 uppercase tracking-wider">Application Readiness</span>
                          <span className={cn(
                            'text-sm font-orbitron',
                            grant.applicationReadiness.score >= 80 ? 'text-neon-green' :
                              grant.applicationReadiness.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                          )}>
                            {grant.applicationReadiness.score}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              grant.applicationReadiness.score >= 80 ? 'bg-neon-green' :
                                grant.applicationReadiness.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                            )}
                            style={{ width: `${grant.applicationReadiness.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-white/50 mt-2">
                          Estimated success rate: {grant.applicationReadiness.estimatedSuccessRate}%
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <NeonButton
                        size="sm"
                        onClick={() => {
                          if (grant.websiteUrl) {
                            // Direct navigation with security best practices
                            const newWindow = window.open(grant.websiteUrl, '_blank', 'noopener,noreferrer');
                            if (newWindow) newWindow.opener = null;
                          }
                        }}
                        disabled={!grant.websiteUrl}
                        className={!grant.websiteUrl ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        {grant.websiteUrl ? 'Visit Official Site' : 'No Link Available'}
                        <ExternalLink className="w-4 h-4" />
                      </NeonButton>

                      {grant.status === 'NEW' && (
                        <NeonButton
                          size="sm"
                          variant="outline"
                          color="green"
                          onClick={() => onStatusChange?.(grant.id, 'REVIEWING')}
                        >
                          Start Review
                        </NeonButton>
                      )}

                      {grant.status === 'REVIEWING' && (
                        <NeonButton
                          size="sm"
                          variant="outline"
                          color="cyan"
                          onClick={() => onStatusChange?.(grant.id, 'APPLYING')}
                        >
                          Start Application
                        </NeonButton>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </HoloCard>
  );
};

export default GrantList;
