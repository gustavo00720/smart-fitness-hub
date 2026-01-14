import { Progress } from '@/components/ui/progress';
import { Flame, Star, Trophy } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  xp: number;
  level: number;
}

export default function StreakDisplay({ streak, xp, level }: StreakDisplayProps) {
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const progressToNextLevel = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{streak} dias</p>
            <p className="text-sm text-muted-foreground">Ofensiva atual</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <Trophy className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">Nível {level}</p>
            <p className="text-sm text-muted-foreground">{xp} XP total</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-4 w-4" />
            Progresso para Nível {level + 1}
          </span>
          <span className="text-muted-foreground">
            {xp - xpForCurrentLevel}/{xpForNextLevel - xpForCurrentLevel} XP
          </span>
        </div>
        <Progress value={progressToNextLevel} className="h-3" />
      </div>
    </div>
  );
}
