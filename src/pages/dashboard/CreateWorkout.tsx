import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dumbbell, 
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Search
} from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useExercises } from "@/hooks/useExercises";
import { useWorkouts } from "@/hooks/useWorkouts";
import { toast } from "@/hooks/use-toast";

interface WorkoutExercise {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
}

const daysOfWeek = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
];

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { students, loading: loadingStudents } = useStudents();
  const { exercises, muscleGroups, loading: loadingExercises } = useExercises();
  const { createWorkout } = useWorkouts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchExercise, setSearchExercise] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchExercise.toLowerCase());
    const matchesMuscle = !selectedMuscle || ex.muscle_group === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const addExercise = (exercise: typeof exercises[0]) => {
    setWorkoutExercises(prev => [
      ...prev,
      {
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        sets: 3,
        reps: "12",
        rest_seconds: 60,
        notes: ""
      }
    ]);
    setShowExerciseSelector(false);
    setSearchExercise("");
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    setWorkoutExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Erro", description: "Digite o nome do treino.", variant: "destructive" });
      return;
    }
    if (!studentId) {
      toast({ title: "Erro", description: "Selecione um aluno.", variant: "destructive" });
      return;
    }
    if (workoutExercises.length === 0) {
      toast({ title: "Erro", description: "Adicione pelo menos um exercício.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const { error } = await createWorkout({
      name,
      description,
      student_id: studentId,
      day_of_week: dayOfWeek ? parseInt(dayOfWeek) : undefined,
      exercises: workoutExercises.map(ex => ({
        exercise_id: ex.exercise_id,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes
      }))
    });

    setIsSubmitting(false);

    if (!error) {
      navigate('/dashboard/personal/treinos');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
          <Link to="/dashboard/personal/treinos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-display font-bold">Novo Treino</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="space-y-6">
          {/* Basic Info */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Treino *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student">Aluno *</Label>
                  <Select value={studentId} onValueChange={setStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingStudents ? (
                        <SelectItem value="" disabled>Carregando...</SelectItem>
                      ) : students.length === 0 ? (
                        <SelectItem value="" disabled>Nenhum aluno encontrado</SelectItem>
                      ) : (
                        students.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.profile?.full_name || 'Sem nome'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Dia da Semana (opcional)</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map(day => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Observações gerais sobre o treino..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exercises */}
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exercícios ({workoutExercises.length})</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExerciseSelector(!showExerciseSelector)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              {/* Exercise Selector */}
              {showExerciseSelector && (
                <div className="mb-6 p-4 rounded-lg bg-secondary/30 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar exercício..."
                        value={searchExercise}
                        onChange={(e) => setSearchExercise(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedMuscle} onValueChange={(val) => setSelectedMuscle(val === "all" ? "" : val)}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Grupo muscular" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {muscleGroups.map(muscle => (
                          <SelectItem key={muscle} value={muscle}>
                            {muscle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {loadingExercises ? (
                      <div className="text-center py-4 text-muted-foreground">
                        Carregando exercícios...
                      </div>
                    ) : filteredExercises.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        Nenhum exercício encontrado
                      </div>
                    ) : (
                      filteredExercises.map(exercise => (
                        <button
                          key={exercise.id}
                          onClick={() => addExercise(exercise)}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors text-left"
                        >
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {exercise.muscle_group} • {exercise.equipment || 'Sem equipamento'}
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-primary" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Added Exercises */}
              {workoutExercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum exercício adicionado</p>
                  <p className="text-sm">Clique em "Adicionar" para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workoutExercises.map((exercise, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4 p-4 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center text-muted-foreground">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{exercise.exercise_name}</p>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeExercise(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Séries</Label>
                            <Input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                              min={1}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Repetições</Label>
                            <Input
                              value={exercise.reps}
                              onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                              placeholder="10-12"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Descanso (s)</Label>
                            <Input
                              type="number"
                              value={exercise.rest_seconds}
                              onChange={(e) => updateExercise(index, 'rest_seconds', parseInt(e.target.value) || 0)}
                              min={0}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Observações</Label>
                          <Input
                            value={exercise.notes}
                            onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                            placeholder="Ex: Manter cotovelos estáveis"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link to="/dashboard/personal/treinos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button 
              variant="hero" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Criar Treino"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateWorkout;
