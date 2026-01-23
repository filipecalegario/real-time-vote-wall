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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm',
        valueColors[value],
        isCurrentUser && 'ring-2 ring-primary ring-offset-1'
      )}
    >
      <div className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold',
        valueBgColors[value]
      )}>
        {value}
      </div>
      <span className="font-medium text-foreground truncate max-w-[120px]">
        {displayName}
        {isCurrentUser && <span className="text-xs text-muted-foreground ml-1">(você)</span>}
      </span>
    </motion.div>
  );
}
