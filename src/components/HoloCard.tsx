import React from 'react';
import { cn } from '@/lib/utils';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'green' | 'purple' | 'pink';
  cornerGlow?: boolean;
  scanLine?: boolean;
  floating?: boolean;
}

export const HoloCard: React.FC<HoloCardProps> = ({ 
  children, 
  className,
  glowColor = 'cyan',
  cornerGlow = true,
  scanLine = false,
  floating = false
}) => {
  const glowColors = {
    cyan: 'shadow-neon-cyan border-neon-cyan/50',
    green: 'shadow-neon-green border-neon-green/50',
    purple: 'shadow-neon-purple border-neon-purple/50',
    pink: 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.5)]'
  };

  return (
    <div 
      className={cn(
        'relative bg-dark-panel/90 backdrop-blur-sm rounded-lg overflow-hidden',
        'border transition-all duration-300',
        glowColors[glowColor],
        cornerGlow && 'glow-corner',
        scanLine && 'scan-line',
        floating && 'floating',
        className
      )}
    >
      {/* Top glow line */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-px',
        glowColor === 'cyan' && 'bg-gradient-to-r from-transparent via-neon-cyan to-transparent',
        glowColor === 'green' && 'bg-gradient-to-r from-transparent via-neon-green to-transparent',
        glowColor === 'purple' && 'bg-gradient-to-r from-transparent via-neon-purple to-transparent',
        glowColor === 'pink' && 'bg-gradient-to-r from-transparent via-pink-500 to-transparent'
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Bottom glow line */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-px opacity-50',
        glowColor === 'cyan' && 'bg-gradient-to-r from-transparent via-neon-cyan to-transparent',
        glowColor === 'green' && 'bg-gradient-to-r from-transparent via-neon-green to-transparent',
        glowColor === 'purple' && 'bg-gradient-to-r from-transparent via-neon-purple to-transparent',
        glowColor === 'pink' && 'bg-gradient-to-r from-transparent via-pink-500 to-transparent'
      )} />
    </div>
  );
};

export default HoloCard;
