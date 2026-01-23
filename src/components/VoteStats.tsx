import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoteStatsProps {
  voteStats: Record<number, number>;
  totalVotes: number;
}

const valueBgColors: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500'
};

const valueLabels: Record<number, string> = {
  1: 'Péssimo',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente'
};

export function VoteStats({ voteStats, totalVotes }: VoteStatsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-foreground mb-4">Resultado Consolidado</h3>
      
      {[5, 4, 3, 2, 1].map((value) => {
        const count = voteStats[value] || 0;
        const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
        
        return (
          <div key={value} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold',
                  valueBgColors[value]
                )}>
                  {value}
                </div>
                <span className="text-muted-foreground">{valueLabels[value]}</span>
              </div>
              <span className="font-medium">
                {count} {count === 1 ? 'voto' : 'votos'} ({percentage.toFixed(0)}%)
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={cn('h-full rounded-full', valueBgColors[value])}
              />
            </div>
          </div>
        );
      })}
      
      <div className="pt-4 border-t border-border mt-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Total de votos:</span>
          <span className="font-bold text-foreground text-lg">{totalVotes}</span>
        </div>
      </div>
    </div>
  );
}
