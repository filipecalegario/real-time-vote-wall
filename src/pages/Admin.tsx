import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePolls } from '@/hooks/usePolls';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Plus, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { activePoll, createPoll, closePoll, totalVotes } = usePolls();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !question.trim()) {
      toast.error('Preencha o título e a pergunta');
      return;
    }

    setIsSubmitting(true);
    const { error } = await createPoll(title, description, question);
    setIsSubmitting(false);

    if (error) {
      toast.error('Erro ao criar enquete: ' + error.message);
    } else {
      toast.success('Enquete criada com sucesso!');
      setTitle('');
      setDescription('');
      setQuestion('');
    }
  };

  const handleClosePoll = async () => {
    if (!confirm('Tem certeza que deseja encerrar esta enquete?')) return;

    setIsSubmitting(true);
    const { error } = await closePoll();
    setIsSubmitting(false);

    if (error) {
      toast.error('Erro ao encerrar enquete: ' + error.message);
    } else {
      toast.success('Enquete encerrada com sucesso!');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <Header />
      
      <main className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Mural
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Enquete Ativa */}
          <Card>
            <CardHeader>
              <CardTitle>Enquete Ativa</CardTitle>
              <CardDescription>
                {activePoll 
                  ? 'Gerencie a enquete em andamento'
                  : 'Nenhuma enquete ativa no momento'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activePoll ? (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold">{activePoll.title}</h3>
                    {activePoll.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {activePoll.description}
                      </p>
                    )}
                    <p className="text-sm font-medium mt-2 text-primary">
                      "{activePoll.question}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total de votos:</span>
                    <span className="font-bold">{totalVotes}</span>
                  </div>

                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleClosePoll}
                    disabled={isSubmitting}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Encerrar Enquete
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Crie uma nova enquete para começar
                </p>
              )}
            </CardContent>
          </Card>

          {/* Criar Nova Enquete */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Enquete</CardTitle>
              <CardDescription>
                {activePoll 
                  ? 'Ao criar uma nova, a enquete atual será encerrada'
                  : 'Defina o tema da votação'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePoll} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Avaliação da reunião"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Contexto adicional sobre a enquete..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question">Pergunta</Label>
                  <Input
                    id="question"
                    placeholder="Ex: Como você avalia esta reunião?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Os participantes votarão de 1 a 5
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Criando...' : 'Criar Enquete'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
