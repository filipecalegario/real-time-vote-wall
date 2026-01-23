import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VotingButtonsProps {
  userVote: number | null;
  onVote: (value: number) => void;
  disabled?: boolean;
}

const valueBgColors: Record<number, string> = {
  1: 'bg-red-500 hover:bg-red-600',
  2: 'bg-orange-500 hover:bg-orange-600',
  3: 'bg-yellow-500 hover:bg-yellow-600',
  4: 'bg-lime-500 hover:bg-lime-600',
  5: 'bg-green-500 hover:bg-green-600'
};

const valueLabels: Record<number, string> = {
  1: 'Péssimo',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente'
};

export function VotingButtons({ userVote, onVote, disabled }: VotingButtonsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        {userVote 
          ? 'Você pode alterar seu voto a qualquer momento'
          : 'Clique em uma opção para votar'}
      </p>
      
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onVote(value)}
            disabled={disabled}
            className={cn(
              'w-14 h-14 rounded-xl text-white font-bold text-xl transition-all',
              'shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
              valueBgColors[value],
              userVote === value && 'ring-4 ring-primary ring-offset-2 scale-110'
            )}
            title={valueLabels[value]}
          >
            {value}
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <span>{valueLabels[1]}</span>
        <span>{valueLabels[5]}</span>
      </div>
    </div>
  );
}
