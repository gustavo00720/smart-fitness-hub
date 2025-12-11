import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  ChevronRight,
  Timer,
  Flame,
  CheckCircle,
  Play,
  Pause
} from "lucide-react";
import RestTimer from "./RestTimer";
import ExerciseDetail from "./ExerciseDetail";

interface WorkoutExercise {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  order_index: number;
  notes: string | null;
  exercise?: {
    id: string;
    name: string;
    muscle_group: string;
    equipment: string | null;
    description?: string;
    instructions?: string[] | null;
    gif_url?: string | null;
    video_url?: string | null;
  } | null;
}

interface WorkoutSessionProps {
  workoutName: string;
  exercises: WorkoutExercise[];
  onComplete: () => void;
  onClose: () => void;
}

interface ExerciseProgress {
  [exerciseId: string]: number; // number of completed sets
}

const WorkoutSession = ({ 
  workoutName, 
  exercises, 
  onComplete, 
  onClose 
}: WorkoutSessionProps) => {
  const [progress, setProgress] = useState<ExerciseProgress>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentRestSeconds, setCurrentRestSeconds] = useState(60);
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);

  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const isExerciseComplete = (exerciseId: string, sets: number) => {
    return (progress[exerciseId] || 0) >= sets;
  };

  const getCompletedExercisesCount = () => {
    return exercises.filter(ex => isExerciseComplete(ex.id, ex.sets)).length;
  };

  const getTotalSetsCompleted = () => {
    return Object.values(progress).reduce((sum, sets) => sum + sets, 0);
  };

  const getTotalSets = () => {
    return exercises.reduce((sum, ex) => sum + ex.sets, 0);
  };

  const progressPercent = (getTotalSetsCompleted() / getTotalSets()) * 100;

  const handleExerciseClick = (exercise: WorkoutExercise) => {
    setSelectedExercise(exercise);
  };

  const handleCompleteSet = () => {
    if (!selectedExercise) return;
    
    setProgress(prev => ({
      ...prev,
      [selectedExercise.id]: (prev[selectedExercise.id] || 0) + 1
    }));
  };

  const handleStartRest = () => {
    if (selectedExercise) {
      setCurrentRestSeconds(selectedExercise.rest_seconds);
      setShowRestTimer(true);
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
  };

  const handleFinishWorkout = () => {
    setIsTimerRunning(false);
    onComplete();
  };

  const allExercisesComplete = getCompletedExercisesCount() === exercises.length;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-strong border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Treino em andamento</p>
            <h1 className="font-display font-bold">{workoutName}</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="p-4 pb-32">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card variant="glass">
            <CardContent className="p-3 text-center">
              <Timer className="w-5 h-5 mx-auto text-primary mb-1" />
              <p className="text-xl font-display font-bold">{formatTime(elapsedTime)}</p>
              <p className="text-xs text-muted-foreground">Tempo</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-3 text-center">
              <Flame className="w-5 h-5 mx-auto text-primary mb-1" />
              <p className="text-xl font-display font-bold">{getTotalSetsCompleted()}</p>
              <p className="text-xs text-muted-foreground">Séries</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-3 text-center">
              <CheckCircle className="w-5 h-5 mx-auto text-primary mb-1" />
              <p className="text-xl font-display font-bold">{getCompletedExercisesCount()}/{exercises.length}</p>
              <p className="text-xs text-muted-foreground">Exercícios</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {Math.round(progressPercent)}% concluído
          </p>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          {exercises.map((exercise, index) => {
            const completedSets = progress[exercise.id] || 0;
            const isComplete = completedSets >= exercise.sets;

            return (
              <button
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isComplete 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'bg-secondary/30 hover:bg-secondary/50'
                }`}
              >
                {/* Order Number */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold transition-all ${
                  isComplete 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Exercise Info */}
                <div className="flex-1 text-left">
                  <p className={`font-medium ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
                    {exercise.exercise?.name || 'Exercício'}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{exercise.sets}x{exercise.reps}</span>
                    <span>•</span>
                    <span>{completedSets}/{exercise.sets} séries</span>
                  </div>
                </div>

                {/* Set Progress Dots */}
                <div className="flex gap-1.5">
                  {Array.from({ length: exercise.sets }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i < completedSets 
                          ? 'bg-primary' 
                          : 'bg-secondary'
                      }`}
                    />
                  ))}
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-strong border-t border-border">
        {allExercisesComplete ? (
          <Button 
            variant="hero" 
            className="w-full glow-primary"
            onClick={handleFinishWorkout}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Finalizar Treino
          </Button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Selecione um exercício para continuar
            </p>
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Pausar Treino
            </Button>
          </div>
        )}
      </div>

      {/* Rest Timer Overlay */}
      {showRestTimer && (
        <RestTimer
          seconds={currentRestSeconds}
          onComplete={handleRestComplete}
          onClose={handleRestComplete}
        />
      )}

      {/* Exercise Detail Overlay */}
      {selectedExercise && selectedExercise.exercise && (
        <ExerciseDetail
          exercise={{
            id: selectedExercise.exercise.id,
            name: selectedExercise.exercise.name,
            muscle_group: selectedExercise.exercise.muscle_group,
            equipment: selectedExercise.exercise.equipment,
            instructions: selectedExercise.exercise.instructions,
            gif_url: selectedExercise.exercise.gif_url,
            video_url: selectedExercise.exercise.video_url
          }}
          sets={selectedExercise.sets}
          reps={selectedExercise.reps}
          restSeconds={selectedExercise.rest_seconds}
          notes={selectedExercise.notes}
          currentSet={progress[selectedExercise.id] || 0}
          onCompleteSet={handleCompleteSet}
          onClose={() => setSelectedExercise(null)}
          onStartRest={handleStartRest}
        />
      )}
    </div>
  );
};

export default WorkoutSession;
