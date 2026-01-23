import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePolls } from '@/hooks/usePolls';
import { Header } from '@/components/Header';
import { VoteCard } from '@/components/VoteCard';
import { VoteStats } from '@/components/VoteStats';
import { VotingButtons } from '@/components/VotingButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { Vote, Clock } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { activePoll, votes, userVote, voteStats, totalVotes, loading: pollLoading, vote } = usePolls();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleVote = async (value: number) => {
    const { error } = await vote(value);
    if (error) {
      toast.error('Erro ao votar: ' + error.message);
    } else {
      toast.success(userVote ? 'Voto atualizado!' : 'Voto registrado!');
    }
  };

  if (authLoading || pollLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <Header />
      
      <main className="container py-8">
        {activePoll ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Coluna da Enquete e Votação */}
            <div className="lg:col-span-1 space-y-6">
              {/* Card da Enquete */}
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs text-primary mb-2">
                    <Clock className="w-3 h-3" />
                    <span>Enquete Ativa</span>
                  </div>
                  <CardTitle className="text-xl">{activePoll.title}</CardTitle>
                  {activePoll.description && (
                    <CardDescription>{activePoll.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-lg font-medium text-center">
                      "{activePoll.question}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Votação */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Seu Voto</CardTitle>
                </CardHeader>
                <CardContent>
                  <VotingButtons
                    userVote={userVote}
                    onVote={handleVote}
                  />
                </CardContent>
              </Card>

              {/* Card de Estatísticas */}
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <VoteStats voteStats={voteStats} totalVotes={totalVotes} />
                </CardContent>
              </Card>
            </div>

            {/* Mural de Votos */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="w-5 h-5 text-primary" />
                    Mural de Votos
                  </CardTitle>
                  <CardDescription>
                    Votos atualizados em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {votes.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AnimatePresence mode="popLayout">
                        {votes.map((voteItem) => (
                          <VoteCard
                            key={voteItem.id}
                            displayName={voteItem.display_name}
                            value={voteItem.value}
                            isCurrentUser={voteItem.user_id === user.id}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Vote className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>Nenhum voto ainda</p>
                      <p className="text-sm">Seja o primeiro a votar!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <Vote className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
              <h2 className="text-xl font-semibold mb-2">Nenhuma enquete ativa</h2>
              <p className="text-muted-foreground">
                Aguarde o administrador criar uma nova enquete para você participar.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
