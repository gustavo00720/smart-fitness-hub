import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Copy, Flame, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Student {
  id: string;
  streak_days: number;
  xp: number;
  level: number;
  goal: string | null;
  profile: {
    full_name: string;
    email: string;
  } | null;
}

export default function DashboardTrainer() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!user) return;

      setLoading(true);

      // Get professional data
      const { data: professional, error: profError } = await supabase
        .from("professionals")
        .select("id, invite_code")
        .eq("user_id", user.id)
        .single();

      if (profError || !professional) {
        console.error("Error fetching professional:", profError);
        setLoading(false);
        return;
      }

      setCode(professional.invite_code);

      // Get students with their profiles
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("id, streak_days, xp, level, goal, user_id")
        .eq("professional_id", professional.id);

      if (studentsError) {
        console.error("Error fetching students:", studentsError);
        setLoading(false);
        return;
      }

      // Fetch profiles for each student
      const studentsWithProfiles: Student[] = [];
      for (const student of studentsData || []) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("user_id", student.user_id)
          .single();

        studentsWithProfiles.push({
          ...student,
          profile,
        });
      }

      setStudents(studentsWithProfiles);
      setLoading(false);
    };

    fetchTrainerData();
  }, [user]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Painel do Personal</h1>
        </div>

        {/* Affiliate Code Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Código de Afiliação</p>
              <p className="text-2xl font-bold font-mono">{code}</p>
            </div>
            <Button variant="outline" size="icon" onClick={copyCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Students Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Meus Alunos ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum aluno vinculado ainda.</p>
                <p className="text-sm mt-2">
                  Compartilhe seu código <strong>{code}</strong> com seus alunos!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        {student.profile?.full_name || "Aluno"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.profile?.email}
                      </p>
                      {student.goal && (
                        <Badge variant="secondary">{student.goal}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="flex items-center gap-1 text-orange-500">
                          <Flame className="h-4 w-4" />
                          <span className="font-bold">{student.streak_days}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">dias</p>
                      </div>
                      <div>
                        <p className="font-bold text-primary">Nv. {student.level}</p>
                        <p className="text-xs text-muted-foreground">{student.xp} XP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
