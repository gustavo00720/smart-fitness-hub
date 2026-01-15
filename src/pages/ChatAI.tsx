import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: 'Olá! Sou seu Coach de Treino IA. Posso ajudar com dicas de exercícios, nutrição e motivação. Como posso te ajudar hoje?'
};

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load student ID and message history
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get student ID
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (student) {
        setStudentId(student.id);

        // Load message history
        const { data: savedMessages } = await supabase
          .from('messages')
          .select('role, content')
          .eq('student_id', student.id)
          .order('created_at', { ascending: true });

        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages as Message[]);
        }
      }
    };

    loadData();
  }, []);

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!studentId) return;
    
    await supabase.from('messages').insert({
      student_id: studentId,
      role,
      content
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Save user message to database
    await saveMessage('user', input);

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });

      if (error) throw error;

      const responseContent = data.response || 'Desculpe, não consegui processar sua mensagem.';
      const assistantMessage: Message = {
        role: 'assistant',
        content: responseContent
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      await saveMessage('assistant', responseContent);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage = 'Desculpe, ocorreu um erro. Tente novamente mais tarde.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
      toast({
        title: 'Erro',
        description: 'Não foi possível obter resposta do coach.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <Card className="flex h-[calc(100vh-16rem)] flex-col">
          <div className="border-b p-4">
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <Bot className="h-6 w-6 text-primary" />
              TreinAI Coach
            </h1>
            <p className="text-sm text-muted-foreground">
              Seu assistente pessoal de treino
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-lg bg-muted px-4 py-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
