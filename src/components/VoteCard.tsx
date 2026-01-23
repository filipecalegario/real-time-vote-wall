import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoteCardProps {
  displayName: string;
  value: number;
  isCurrentUser?: boolean;
}

const valueColors: Record<number, string> = {
  1: 'bg-red-500/10 border-red-500/30 text-red-600',
  2: 'bg-orange-500/10 border-orange-500/30 text-orange-600',
  3: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600',
  4: 'bg-lime-500/10 border-lime-500/30 text-lime-600',
  5: 'bg-green-500/10 border-green-500/30 text-green-600'
};

const valueBgColors: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500'
};

export function VoteCard({ displayName, value, isCurrentUser }: VoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center justify-between p-3 rounded-xl border-2 transition-all',
        valueColors[value],
        isCurrentUser && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
          valueBgColors[value]
        )}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-foreground">
          {displayName}
          {isCurrentUser && <span className="text-xs text-muted-foreground ml-2">(você)</span>}
        </span>
      </div>
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold',
        valueBgColors[value],
        'text-white shadow-lg'
      )}>
        {value}
      </div>
    </motion.div>
  );
}
