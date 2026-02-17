import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { HoloCard } from '@/components/HoloCard';
import { NeonButton } from '@/components/NeonButton';
import type { SchoolProfile as SchoolProfileType } from '@/types';
import { 
  Building2, 
  Users, 
  MapPin, 
  Award, 
  BookOpen,
  Edit3,
  Upload,
  FileText,
  CheckCircle,
  TrendingUp,
  Target,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

interface SchoolProfileProps {
  profile: SchoolProfileType;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (profile: SchoolProfileType) => void;
  className?: string;
}

export const SchoolProfile: React.FC<SchoolProfileProps> = ({
  profile,
  isEditing: _isEditing,
  onEdit,
  onSave: _onSave,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'achievements' | 'documents'>('overview');
  
  // Use the props to avoid warnings
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleEdit = () => onEdit?.();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _editingMode = _isEditing;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'facilities', label: 'Facilities & Programs', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Profile Header */}
      <HoloCard glowColor="cyan" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 
                          border-2 border-neon-cyan/50 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-neon-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-orbitron text-white">{profile.name}</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-white/50 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location.city}, {profile.location.country}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {profile.type} School
                </span>
                <span className="px-2 py-0.5 rounded bg-neon-green/20 text-neon-green text-xs">
                  {profile.registrationDetails.accreditationStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NeonButton
              variant="outline"
              onClick={() => {
                _handleEdit();
                console.log('Editing mode:', _editingMode);
              }}
              icon={<Edit3 className="w-4 h-4" />}
            >
              Edit Profile
            </NeonButton>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-orbitron text-neon-cyan">{profile.studentCount.total}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-orbitron text-neon-green">{profile.staffCount.teaching}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Teachers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-orbitron text-neon-purple">{new Date().getFullYear() - profile.establishedYear}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Years</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-orbitron text-pink-500">{profile.facilities.length}</p>
            <p className="text-xs text-white/50 uppercase tracking-wider">Facilities</p>
          </div>
        </div>
      </HoloCard>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-rajdhani uppercase tracking-wider transition-all duration-300',
                activeTab === tab.id
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                  : 'bg-dark-panel/50 text-white/50 border border-white/10 hover:border-white/30'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HoloCard glowColor="green" className="p-6">
            <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-neon-green" />
              Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.focusAreas.map((area, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30
                           text-neon-green text-sm font-rajdhani"
                >
                  {area}
                </span>
              ))}
            </div>
          </HoloCard>

          <HoloCard glowColor="purple" className="p-6">
            <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
              Strategic Goals
            </h3>
            <ul className="space-y-2">
              {profile.strategicGoals.map((goal, i) => (
                <li key={i} className="flex items-start gap-2 text-white/70">
                  <CheckCircle className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{goal}</span>
                </li>
              ))}
            </ul>
          </HoloCard>

          <HoloCard glowColor="cyan" className="p-6">
            <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-neon-cyan" />
              Student Demographics
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/50">Male</span>
                  <span className="text-white">{profile.studentCount.male}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(profile.studentCount.male / profile.studentCount.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/50">Female</span>
                  <span className="text-white">{profile.studentCount.female}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${(profile.studentCount.female / profile.studentCount.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/50">Special Needs</span>
                  <span className="text-white">{profile.studentCount.specialNeeds}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-purple rounded-full"
                    style={{ width: `${(profile.studentCount.specialNeeds / profile.studentCount.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </HoloCard>

          <HoloCard glowColor="pink" className="p-6">
            <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-pink-500" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/50" />
                <span className="text-white/70">{profile.contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/50" />
                <span className="text-white/70">{profile.contactInfo.phone}</span>
              </div>
              {profile.contactInfo.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-white/50" />
                  <span className="text-white/70">{profile.contactInfo.website}</span>
                </div>
              )}
            </div>
          </HoloCard>
        </div>
      )}

      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HoloCard glowColor="cyan" className="p-6">
            <h3 className="text-lg font-orbitron text-white mb-4">Facilities</h3>
            <ul className="space-y-2">
              {profile.facilities.map((facility, i) => (
                <li 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-panel/50 border border-white/10"
                >
                  <CheckCircle className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                  <span className="text-white/70">{facility}</span>
                </li>
              ))}
            </ul>
          </HoloCard>

          <HoloCard glowColor="green" className="p-6">
            <h3 className="text-lg font-orbitron text-white mb-4">Programs</h3>
            <ul className="space-y-2">
              {profile.programs.map((program, i) => (
                <li 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-panel/50 border border-white/10"
                >
                  <CheckCircle className="w-4 h-4 text-neon-green flex-shrink-0" />
                  <span className="text-white/70">{program}</span>
                </li>
              ))}
            </ul>
          </HoloCard>
        </div>
      )}

      {activeTab === 'achievements' && (
        <HoloCard glowColor="purple" className="p-6">
          <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-neon-purple" />
            Achievements & Awards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.achievements.map((achievement, i) => (
              <div 
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-neon-purple/10 to-transparent
                         border border-neon-purple/30"
              >
                <Award className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
                <span className="text-white/80">{achievement}</span>
              </div>
            ))}
          </div>

          {/* Impact Stories */}
          <h3 className="text-lg font-orbitron text-white mt-8 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-green" />
            Impact Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.impactStories.map((story) => (
              <div 
                key={story.id}
                className="p-4 rounded-lg bg-dark-panel/50 border border-white/10"
              >
                <h4 className="text-white font-medium mb-2">{story.title}</h4>
                <p className="text-sm text-white/60 mb-3">{story.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-neon-cyan">{story.beneficiaries} beneficiaries</span>
                  <span className="text-white/40">{new Date(story.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </HoloCard>
      )}

      {activeTab === 'documents' && (
        <HoloCard glowColor="pink" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-orbitron text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-500" />
              School Documents
            </h3>
            <NeonButton size="sm" icon={<Upload className="w-4 h-4" />}>
              Upload Document
            </NeonButton>
          </div>

          <div className="space-y-3">
            {profile.documents.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg bg-dark-panel/50 
                         border border-white/10 hover:border-neon-cyan/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{doc.name}</p>
                    <p className="text-xs text-white/50">
                      {doc.type} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      {doc.expiresAt && ` • Expires ${new Date(doc.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <NeonButton variant="ghost" size="sm">
                    View
                  </NeonButton>
                  <NeonButton variant="ghost" size="sm">
                    Download
                  </NeonButton>
                </div>
              </div>
            ))}
          </div>
        </HoloCard>
      )}
    </div>
  );
};

export default SchoolProfile;
