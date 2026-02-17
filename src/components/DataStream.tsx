import React from 'react';
import { cn } from '@/lib/utils';

interface DataStreamProps {
  data: string[];
  maxLines?: number;
  className?: string;
}

export const DataStream: React.FC<DataStreamProps> = ({
  data,
  maxLines = 10,
  className
}) => {
  const displayData = data.slice(-maxLines);

  return (
    <div className={cn(
      'bg-dark-bg/80 border border-neon-cyan/30 rounded-lg p-4',
      'font-mono-tech text-sm',
      className
    )}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neon-cyan/20">
        <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
        <span className="text-neon-cyan uppercase tracking-wider">System Log</span>
      </div>
      
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {displayData.map((line, index) => (
          <div 
            key={index}
            className="text-white/70 animate-in fade-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-neon-cyan/50">{`>`}</span>{' '}
            <span className={cn(
              line.includes('ERROR') && 'text-red-400',
              line.includes('SUCCESS') && 'text-neon-green',
              line.includes('WARNING') && 'text-yellow-400'
            )}>
              {line}
            </span>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-white/30 italic">Waiting for data stream...</div>
        )}
      </div>
      
      {/* Scan line effect */}
      <div className="relative h-4 mt-2 overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent animate-scan" />
      </div>
    </div>
  );
};

export default DataStream;
