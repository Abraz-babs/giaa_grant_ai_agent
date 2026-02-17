import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'green' | 'purple' | 'pink';
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showValue = true,
  label,
  className
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    cyan: 'stroke-neon-cyan',
    green: 'stroke-neon-green',
    purple: 'stroke-neon-purple',
    pink: 'stroke-pink-500'
  };

  const glowColors = {
    cyan: 'drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]',
    green: 'drop-shadow-[0_0_10px_rgba(0,255,100,0.8)]',
    purple: 'drop-shadow-[0_0_10px_rgba(180,0,255,0.8)]',
    pink: 'drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]'
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          className="circular-progress"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/10"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              colors[color],
              glowColors[color],
              'transition-all duration-500 ease-out'
            )}
          />
        </svg>
        
        {/* Center content */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn(
              'text-2xl font-orbitron font-bold',
              color === 'cyan' && 'text-neon-cyan',
              color === 'green' && 'text-neon-green',
              color === 'purple' && 'text-neon-purple',
              color === 'pink' && 'text-pink-500'
            )}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      
      {label && (
        <span className="mt-2 text-sm text-white/70 font-rajdhani uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
};

export default CircularProgress;
