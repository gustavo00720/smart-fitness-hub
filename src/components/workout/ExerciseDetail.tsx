import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Timer,
  Target,
  Dumbbell,
  Info
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string | null;
  description?: string;
  instructions?: string[] | null;
  gif_url?: string | null;
  video_url?: string | null;
}

interface ExerciseDetailProps {
  exercise: Exercise;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string | null;
  currentSet: number;
  onCompleteSet: () => void;
  onClose: () => void;
  onStartRest: () => void;
}

const ExerciseDetail = ({
  exercise,
  sets,
  reps,
  restSeconds,
  notes,
  currentSet,
  onCompleteSet,
  onClose,
  onStartRest
}: ExerciseDetailProps) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'instrucoes'>('demo');

  const handleCompleteSet = () => {
    onCompleteSet();
    if (currentSet < sets) {
      onStartRest();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-strong border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-display font-bold truncate px-4">{exercise.name}</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main className="p-4 pb-32">
        {/* Exercise Demo */}
        <div className="aspect-video bg-secondary rounded-xl mb-6 overflow-hidden relative">
          {exercise.gif_url ? (
            <img 
              src={exercise.gif_url} 
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
          ) : exercise.video_url ? (
            <video 
              src={exercise.video_url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Dumbbell className="w-16 h-16 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground">Demonstração não disponível</p>
              </div>
            </div>
          )}
        </div>

        {/* Exercise Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <Target className="w-5 h-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-display font-bold">{sets}</p>
              <p className="text-xs text-muted-foreground">Séries</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <Dumbbell className="w-5 h-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-display font-bold">{reps}</p>
              <p className="text-xs text-muted-foreground">Repetições</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <Timer className="w-5 h-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-display font-bold">{restSeconds}s</p>
              <p className="text-xs text-muted-foreground">Descanso</p>
            </CardContent>
          </Card>
        </div>

        {/* Muscle & Equipment */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            {exercise.muscle_group}
          </span>
          {exercise.equipment && (
            <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm">
              {exercise.equipment}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'demo' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            Execução
          </button>
          <button
            onClick={() => setActiveTab('instrucoes')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'instrucoes' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            Instruções
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'demo' ? (
          <Card variant="glass">
            <CardContent className="p-4">
              {/* Set Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-display font-bold">{currentSet}/{sets} séries</span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: sets }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        i < currentSet 
                          ? 'bg-gradient-primary' 
                          : 'bg-secondary'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{notes}</p>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground text-center">
                {currentSet >= sets 
                  ? "Todas as séries concluídas!" 
                  : `Realize ${reps} repetições`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card variant="glass">
            <CardContent className="p-4">
              {exercise.instructions && exercise.instructions.length > 0 ? (
                <ol className="space-y-4">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-muted-foreground">{instruction}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Instruções não disponíveis
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-strong border-t border-border">
        {currentSet >= sets ? (
          <Button 
            variant="hero" 
            className="w-full"
            onClick={onClose}
          >
            Concluir Exercício
          </Button>
        ) : (
          <Button 
            variant="hero" 
            className="w-full"
            onClick={handleCompleteSet}
          >
            <Play className="w-4 h-4 mr-2" />
            Concluir Série {currentSet + 1}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetail;
