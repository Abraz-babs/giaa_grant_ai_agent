import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  color?: 'cyan' | 'green' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  color = 'cyan',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className,
  type = 'button'
}) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const colorStyles = {
    cyan: {
      primary: 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 hover:shadow-neon-cyan',
      secondary: 'bg-neon-cyan/10 border-neon-cyan/50 text-neon-cyan/80 hover:bg-neon-cyan/20',
      outline: 'bg-transparent border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10',
      ghost: 'bg-transparent border-transparent text-neon-cyan hover:bg-neon-cyan/10'
    },
    green: {
      primary: 'bg-neon-green/20 border-neon-green text-neon-green hover:bg-neon-green/30 hover:shadow-neon-green',
      secondary: 'bg-neon-green/10 border-neon-green/50 text-neon-green/80 hover:bg-neon-green/20',
      outline: 'bg-transparent border-neon-green text-neon-green hover:bg-neon-green/10',
      ghost: 'bg-transparent border-transparent text-neon-green hover:bg-neon-green/10'
    },
    purple: {
      primary: 'bg-neon-purple/20 border-neon-purple text-neon-purple hover:bg-neon-purple/30 hover:shadow-neon-purple',
      secondary: 'bg-neon-purple/10 border-neon-purple/50 text-neon-purple/80 hover:bg-neon-purple/20',
      outline: 'bg-transparent border-neon-purple text-neon-purple hover:bg-neon-purple/10',
      ghost: 'bg-transparent border-transparent text-neon-purple hover:bg-neon-purple/10'
    },
    pink: {
      primary: 'bg-pink-500/20 border-pink-500 text-pink-500 hover:bg-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]',
      secondary: 'bg-pink-500/10 border-pink-500/50 text-pink-500/80 hover:bg-pink-500/20',
      outline: 'bg-transparent border-pink-500 text-pink-500 hover:bg-pink-500/10',
      ghost: 'bg-transparent border-transparent text-pink-500 hover:bg-pink-500/10'
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative font-orbitron uppercase tracking-wider font-medium',
        'border rounded-md transition-all duration-300',
        'flex items-center justify-center gap-2',
        'overflow-hidden group',
        sizes[size],
        colorStyles[color][variant],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default NeonButton;
