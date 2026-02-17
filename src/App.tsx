import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Login } from '@/pages/Login';
import { Header } from '@/sections/Header';
import { Sidebar } from '@/sections/Sidebar';
import { StatsOverview } from '@/sections/StatsOverview';
import { GrantList } from '@/sections/GrantList';
import { AIAgentPanel } from '@/sections/AIAgentPanel';
import { DeadlineAlerts } from '@/sections/DeadlineAlerts';
import { ProposalAssistant } from '@/sections/ProposalAssistant';
import { SchoolProfile } from '@/sections/SchoolProfile';
import { HoloCard } from '@/components/HoloCard';
import { NeonButton } from '@/components/NeonButton';
import {
  useGrantsStore,
  useDashboardStore,
  useAIAgentStore,
  useNotificationsStore,
  useSchoolProfileStore,
  useProposalStore
} from '@/hooks/useStore';
import {
  Zap,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

type ViewType = 'dashboard' | 'grants' | 'ai-agent' | 'proposals' | 'alerts' | 'profile' | 'settings';

function AppContent() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize stores (they fetch from API on mount)
  const grantsStore = useGrantsStore();
  const dashboardStore = useDashboardStore();
  const aiAgentStore = useAIAgentStore();
  const notificationsStore = useNotificationsStore();
  const schoolProfileStore = useSchoolProfileStore();
  const proposalStore = useProposalStore();

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-400 font-display font-semibold">Loading GIAA Grant Agent...</p>
        </div>
      </div>
    );
  }

  // Auth gate — show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <HoloCard glowColor="cyan" className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2">
                Welcome, <span className="text-brand-400">{user?.name || 'User'}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl">
                Your intelligent grant discovery and management system. The AI agent is actively
                monitoring for new opportunities tailored to Glisten International Academy.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NeonButton
                onClick={() => aiAgentStore.runAgent()}
                loading={aiAgentStore.isRunning}
                icon={<RefreshCw className={cn('w-4 h-4', aiAgentStore.isRunning && 'animate-spin')} />}
              >
                Run Agent Now
              </NeonButton>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <p className="text-lg font-display font-bold text-brand-400">
                  {dashboardStore.stats.aiMatches}
                </p>
                <p className="text-xs text-slate-500">AI Matches</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-display font-bold text-emerald-400">
                  {dashboardStore.stats.fundedGrants}
                </p>
                <p className="text-xs text-slate-500">Funded</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-display font-bold text-amber-400">
                  {dashboardStore.stats.upcomingDeadlines}
                </p>
                <p className="text-xs text-slate-500">Deadlines</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-lg font-display font-bold text-violet-400">
                  {dashboardStore.stats.successRate}%
                </p>
                <p className="text-xs text-slate-500">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </HoloCard>

      {/* Stats Overview */}
      <StatsOverview
        stats={dashboardStore.stats}
        isRefreshing={dashboardStore.isRefreshing}
      />

      {/* Recent Grants & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrantList
            grants={grantsStore.grants.slice(0, 5)}
            isLoading={grantsStore.isLoading}
            onGrantClick={(grant) => {
              grantsStore.setSelectedGrant(grant);
              setCurrentView('grants');
            }}
            onStatusChange={grantsStore.updateGrantStatus}
          />
        </div>
        <div>
          <DeadlineAlerts
            alerts={dashboardStore.deadlineAlerts}
            onDismiss={dashboardStore.dismissAlert}
            onViewGrant={(grantId) => {
              const grant = grantsStore.grants.find(g => g.id === grantId);
              if (grant) {
                grantsStore.setSelectedGrant(grant);
                setCurrentView('grants');
              }
            }}
          />
        </div>
      </div>

      {/* AI Recommendations */}
      <HoloCard glowColor="purple" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Recommendations
          </h3>
          <NeonButton
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('grants')}
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </NeonButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {grantsStore.grants
            .filter(g => g.relevanceScore === 'HIGH' && g.status === 'NEW')
            .slice(0, 3)
            .map((grant) => (
              <div
                key={grant.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50
                         hover:border-violet-500/50 transition-all cursor-pointer group"
                onClick={() => {
                  grantsStore.setSelectedGrant(grant);
                  setCurrentView('grants');
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">
                    {grant.relevanceScore} MATCH
                  </span>
                  <span className="text-xs text-slate-500">
                    ${grant.amount.max.toLocaleString()}
                  </span>
                </div>
                <h4 className="text-white font-medium group-hover:text-violet-400 transition-colors">
                  {grant.name}
                </h4>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {grant.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-xs text-slate-500">
                    {grant.deadline ? `${Math.max(0, Math.ceil((new Date(grant.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left` : 'No deadline'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </HoloCard>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'grants':
        return (
          <div className="animate-in fade-in duration-500">
            <GrantList
              grants={grantsStore.grants}
              isLoading={grantsStore.isLoading}
              onGrantClick={(grant) => grantsStore.setSelectedGrant(grant)}
              onStatusChange={grantsStore.updateGrantStatus}
              selectedId={grantsStore.selectedGrant?.id}
            />
          </div>
        );
      case 'ai-agent':
        return (
          <div className="animate-in fade-in duration-500">
            {aiAgentStore.agent && (
              <AIAgentPanel
                agent={aiAgentStore.agent}
                isRunning={aiAgentStore.isRunning}
                logs={aiAgentStore.logs}
                onRunAgent={aiAgentStore.runAgent}
                onToggleAgent={aiAgentStore.toggleAgent}
              />
            )}
          </div>
        );
      case 'proposals':
        return (
          <div className="animate-in fade-in duration-500">
            <ProposalAssistant
              proposals={proposalStore.proposals}
              grants={grantsStore.grants}
              onGenerateProposal={proposalStore.generateAIProposal}
              onUpdateProposal={proposalStore.updateProposal}
            />
          </div>
        );
      case 'alerts':
        return (
          <div className="animate-in fade-in duration-500">
            <DeadlineAlerts
              alerts={dashboardStore.deadlineAlerts}
              onDismiss={dashboardStore.dismissAlert}
              onViewGrant={(grantId) => {
                const grant = grantsStore.grants.find(g => g.id === grantId);
                if (grant) {
                  grantsStore.setSelectedGrant(grant);
                  setCurrentView('grants');
                }
              }}
            />
          </div>
        );
      case 'profile':
        return (
          <div className="animate-in fade-in duration-500">
            {schoolProfileStore.profile && (
              <SchoolProfile
                profile={schoolProfileStore.profile}
                isEditing={schoolProfileStore.isEditing}
                onEdit={() => schoolProfileStore.setIsEditing(true)}
                onSave={(profile) => {
                  schoolProfileStore.updateProfile(profile);
                  schoolProfileStore.setIsEditing(false);
                }}
              />
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="animate-in fade-in duration-500">
            <HoloCard glowColor="cyan" className="p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Settings</h2>
              <p className="text-slate-400">
                Settings configuration panel coming soon. This will include:
              </p>
              <ul className="mt-4 space-y-2 text-slate-500">
                <li>• Notification preferences (WhatsApp, Email)</li>
                <li>• AI agent configuration &amp; scheduling</li>
                <li>• Grant source management</li>
                <li>• User permissions &amp; team management</li>
                <li>• Integration settings</li>
              </ul>
            </HoloCard>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Header
        agentStatus={aiAgentStore.agent?.status || 'ACTIVE'}
        unreadNotifications={notificationsStore.unreadCount}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadNotifications={notificationsStore.unreadCount}
      />

      {/* Main Content */}
      <main className={cn(
        'pt-16 min-h-screen transition-all duration-300',
        'lg:ml-64'
      )}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Page Title */}
          {currentView !== 'dashboard' && (
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold text-white capitalize">
                {currentView.replace('-', ' ')}
              </h1>
              <div className="h-px w-24 bg-gradient-to-r from-brand-500 to-transparent mt-2" />
            </div>
          )}

          {/* Content */}
          {renderContent()}
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => aiAgentStore.runAgent()}
        className={cn(
          'fixed bottom-6 right-6 lg:hidden',
          'w-14 h-14 rounded-full',
          'bg-brand-500 text-white',
          'flex items-center justify-center',
          'shadow-lg shadow-brand-500/25 transition-transform hover:scale-110',
          aiAgentStore.isRunning && 'animate-pulse'
        )}
      >
        <RefreshCw className={cn('w-6 h-6', aiAgentStore.isRunning && 'animate-spin')} />
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
