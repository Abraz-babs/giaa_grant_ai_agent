import React from 'react';
import { cn } from '@/lib/utils';

interface HexagonStatProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: 'cyan' | 'green' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const HexagonStat: React.FC<HexagonStatProps> = ({
  value,
  label,
  icon,
  color = 'cyan',
  size = 'md',
  className
}) => {
  const sizes = {
    sm: { width: 100, fontSize: 'text-xl', labelSize: 'text-xs' },
    md: { width: 140, fontSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { width: 180, fontSize: 'text-4xl', labelSize: 'text-base' }
  };

  const colors = {
    cyan: 'stroke-neon-cyan fill-neon-cyan/10',
    green: 'stroke-neon-green fill-neon-green/10',
    purple: 'stroke-neon-purple fill-neon-purple/10',
    pink: 'stroke-pink-500 fill-pink-500/10'
  };

  const textColors = {
    cyan: 'text-neon-cyan',
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    pink: 'text-pink-500'
  };

  const glowColors = {
    cyan: 'drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]',
    green: 'drop-shadow-[0_0_15px_rgba(0,255,100,0.5)]',
    purple: 'drop-shadow-[0_0_15px_rgba(180,0,255,0.5)]',
    pink: 'drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]'
  };

  const { width, fontSize, labelSize } = sizes[size];
  const height = width * 1.1547; // hexagon height ratio

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width, height }}>
        {/* Hexagon SVG */}
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 115.47"
          className={cn(
            'absolute inset-0 transition-all duration-300',
            glowColors[color]
          )}
        >
          <polygon
            points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87"
            className={cn(
              'transition-all duration-300',
              colors[color]
            )}
            strokeWidth="2"
          />
        </svg>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && (
            <div className={cn('mb-1', textColors[color])}>
              {icon}
            </div>
          )}
          <span className={cn(
            'font-orbitron font-bold',
            fontSize,
            textColors[color]
          )}>
            {value}
          </span>
        </div>
      </div>
      
      {/* Label */}
      <span className={cn(
        'mt-2 text-white/70 font-rajdhani uppercase tracking-wider text-center',
        labelSize
      )}>
        {label}
      </span>
    </div>
  );
};

export default HexagonStat;
