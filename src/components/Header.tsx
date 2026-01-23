import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const { profile, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Vote className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">Enquete ao Vivo</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Olá, <span className="font-medium text-foreground">{profile?.display_name}</span>
            </span>
            {isAdmin && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Admin
              </Badge>
            )}
          </div>
          
          {isAdmin && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <Settings className="w-4 h-4 mr-2" />
                Gerenciar
              </Link>
            </Button>
          )}
          
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
