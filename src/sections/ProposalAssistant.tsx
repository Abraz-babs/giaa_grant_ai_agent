import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { HoloCard } from '@/components/HoloCard';
import { NeonButton } from '@/components/NeonButton';
import type { Proposal, Grant } from '@/types';
import {
  FileText,
  Sparkles,
  Save,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Copy
} from 'lucide-react';

interface ProposalAssistantProps {
  proposals: Proposal[];
  grants: Grant[];
  onGenerateProposal?: (grantId: string) => void;
  onUpdateProposal?: (proposalId: string, content: any) => void;
  className?: string;
}

export const ProposalAssistant: React.FC<ProposalAssistantProps> = ({
  proposals,
  grants,
  onGenerateProposal,
  onUpdateProposal,
  className
}) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedGrant, setSelectedGrant] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedGrant) return;
    setIsGenerating(true);
    await onGenerateProposal?.(selectedGrant);
    setIsGenerating(false);
    setSelectedGrant('');
  };

  const getGrantName = (grantId: string) => {
    return grants.find(g => g.id === grantId)?.name || 'Unknown Grant';
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'DRAFT': return 'text-yellow-400 bg-yellow-500/20';
      case 'REVIEW': return 'text-neon-cyan bg-neon-cyan/20';
      case 'FINAL': return 'text-neon-green bg-neon-green/20';
      case 'SUBMITTED': return 'text-neon-purple bg-neon-purple/20';
      default: return 'text-white/50 bg-white/10';
    }
  };

  const handleDownload = () => {
    if (!selectedProposal) return;

    const grantName = getGrantName(selectedProposal.grantId);
    let textContent = `PROPOSAL: ${selectedProposal.title}\n`;
    textContent += `GRANT: ${grantName}\n`;
    textContent += `STATUS: ${selectedProposal.status}\n`;
    textContent += `DATE: ${new Date().toLocaleDateString()}\n\n`;
    textContent += `----------------------------------------\n\n`;

    selectedProposal.content.forEach(section => {
      textContent += `[${section.title.toUpperCase()}]\n`;
      textContent += `${section.content}\n\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProposal.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Generate New Proposal */}
      <HoloCard glowColor="cyan" className="p-6">
        <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neon-cyan" />
          AI Proposal Generator
        </h3>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedGrant}
            onChange={(e) => setSelectedGrant(e.target.value)}
            className="flex-1 px-4 py-3 bg-dark-panel/50 border border-neon-cyan/30 rounded-lg
                     text-white focus:outline-none focus:border-neon-cyan
                     font-rajdhani"
          >
            <option value="">Select a grant to generate proposal...</option>
            {grants.filter(g => g.status !== 'REJECTED' && g.status !== 'FUNDED').map(grant => (
              <option key={grant.id} value={grant.id}>
                {grant.name} ({grant.relevanceScore} match)
              </option>
            ))}
          </select>

          <NeonButton
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!selectedGrant}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Generate Full Proposal (v2.0)
          </NeonButton>
        </div>

        <p className="text-sm text-white/50 mt-3">
          AI will analyze the grant requirements and generate a tailored proposal based on your school profile.
        </p>
      </HoloCard>

      {/* Proposals List */}
      <HoloCard glowColor="purple" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-orbitron text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-neon-purple" />
            Your Proposals
          </h3>
          <span className="text-sm text-white/50">
            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
          </span>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No proposals yet</p>
            <p className="text-sm">Generate your first proposal above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className={cn(
                  'p-4 rounded-lg border transition-all cursor-pointer',
                  'bg-dark-panel/30 border-white/10 hover:border-neon-purple/50',
                  selectedProposal?.id === proposal.id && 'border-neon-purple/50 bg-neon-purple/5'
                )}
                onClick={() => setSelectedProposal(
                  selectedProposal?.id === proposal.id ? null : proposal
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{proposal.title}</h4>
                    <p className="text-sm text-white/50">
                      For: {getGrantName(proposal.grantId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs uppercase font-rajdhani',
                      getStatusColor(proposal.status)
                    )}>
                      {proposal.status}
                    </span>
                    {proposal.aiGenerated && (
                      <span className="px-2 py-1 rounded bg-neon-cyan/20 text-neon-cyan text-xs">
                        AI Generated
                      </span>
                    )}
                    {selectedProposal?.id === proposal.id ? (
                      <ChevronUp className="w-5 h-5 text-white/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/50" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {selectedProposal?.id === proposal.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top-2">
                    {/* Sections */}
                    <div className="space-y-3">
                      {proposal.content.map((section) => (
                        <div
                          key={section.id}
                          className="border border-white/10 rounded-lg overflow-hidden"
                        >
                          <button
                            className="w-full px-4 py-3 flex items-center justify-between bg-dark-panel/50
                                     hover:bg-dark-panel/70 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSection(
                                expandedSection === section.id ? null : section.id
                              );
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-white font-medium">{section.title}</span>
                              <span className="text-xs text-white/50">
                                {section.wordCount}/{section.maxWords} words
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {section.aiSuggestions && section.aiSuggestions.length > 0 && (
                                <span className="px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan text-xs">
                                  {section.aiSuggestions.length} AI suggestions
                                </span>
                              )}
                              {expandedSection === section.id ? (
                                <ChevronUp className="w-4 h-4 text-white/50" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-white/50" />
                              )}
                            </div>
                          </button>

                          {expandedSection === section.id && (
                            <div className="p-4 bg-dark-bg/50">
                              <textarea
                                value={section.content}
                                onChange={(e) => {
                                  onUpdateProposal?.(proposal.id, {
                                    content: proposal.content.map(c =>
                                      c.id === section.id
                                        ? { ...c, content: e.target.value, wordCount: e.target.value.split(' ').length }
                                        : c
                                    )
                                  });
                                }}
                                className="w-full h-32 bg-dark-panel/50 border border-white/10 rounded-lg
                                         text-white p-3 focus:outline-none focus:border-neon-cyan
                                         resize-none font-rajdhani"
                              />

                              {/* AI Suggestions */}
                              {section.aiSuggestions && section.aiSuggestions.length > 0 && (
                                <div className="mt-3 p-3 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20">
                                  <p className="text-xs text-neon-cyan uppercase tracking-wider mb-2">
                                    AI Suggestions
                                  </p>
                                  <ul className="space-y-1">
                                    {section.aiSuggestions.map((suggestion, i) => (
                                      <li
                                        key={i}
                                        className="text-sm text-white/70 flex items-center gap-2 cursor-pointer
                                                 hover:text-neon-cyan transition-colors"
                                      >
                                        <Sparkles className="w-3 h-3 text-neon-cyan" />
                                        {suggestion}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <NeonButton size="sm" icon={<Save className="w-4 h-4" />}>
                        Save Changes
                      </NeonButton>
                      <NeonButton
                        size="sm"
                        variant="outline"
                        color="green"
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Mark as Final
                      </NeonButton>
                      <NeonButton
                        size="sm"
                        variant="outline"
                        icon={<Download className="w-4 h-4" />}
                        onClick={handleDownload}
                      >
                        Download
                      </NeonButton>
                      <NeonButton
                        size="sm"
                        variant="ghost"
                        icon={<Copy className="w-4 h-4" />}
                      >
                        Duplicate
                      </NeonButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </HoloCard>
    </div>
  );
};

export default ProposalAssistant;
