import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Poll {
  id: string;
  title: string;
  description: string | null;
  question: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  closed_at: string | null;
}

interface Vote {
  id: string;
  poll_id: string;
  user_id: string;
  value: number;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string;
  };
}

interface VoteWithProfile extends Vote {
  display_name: string;
}

export function usePolls() {
  const { user } = useAuth();
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<VoteWithProfile[]>([]);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch active poll and votes
  useEffect(() => {
    fetchActivePoll();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!activePoll) return;

    const votesChannel = supabase
      .channel('votes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${activePoll.id}`
        },
        () => {
          fetchVotes(activePoll.id);
        }
      )
      .subscribe();

    const pollsChannel = supabase
      .channel('polls-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'polls'
        },
        () => {
          fetchActivePoll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(pollsChannel);
    };
  }, [activePoll?.id]);

  // Update user's vote when votes change
  useEffect(() => {
    if (user && votes.length > 0) {
      const myVote = votes.find(v => v.user_id === user.id);
      setUserVote(myVote?.value ?? null);
    } else {
      setUserVote(null);
    }
  }, [votes, user]);

  const fetchActivePoll = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching active poll:', error);
      }

      setActivePoll(data || null);

      if (data) {
        await fetchVotes(data.id);
      } else {
        setVotes([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVotes = async (pollId: string) => {
    try {
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', pollId)
        .order('updated_at', { ascending: false });

      if (votesError) {
        console.error('Error fetching votes:', votesError);
        return;
      }

      // Fetch profiles for each vote
      const userIds = votesData?.map(v => v.user_id) || [];
      
      if (userIds.length === 0) {
        setVotes([]);
        return;
      }

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p.display_name]) || []);

      const votesWithProfiles: VoteWithProfile[] = (votesData || []).map(vote => ({
        ...vote,
        display_name: profilesMap.get(vote.user_id) || 'Anônimo'
      }));

      setVotes(votesWithProfiles);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const vote = async (value: number) => {
    if (!user || !activePoll) return { error: new Error('Não autenticado ou enquete inativa') };

    try {
      // Check if user already voted
      const existingVote = votes.find(v => v.user_id === user.id);

      if (existingVote) {
        // Update vote
        const { error } = await supabase
          .from('votes')
          .update({ value })
          .eq('id', existingVote.id);

        if (error) return { error };
      } else {
        // Insert new vote
        const { error } = await supabase
          .from('votes')
          .insert({
            poll_id: activePoll.id,
            user_id: user.id,
            value
          });

        if (error) return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const createPoll = async (title: string, description: string, question: string) => {
    if (!user) return { error: new Error('Não autenticado') };

    try {
      // First, close any active poll
      await supabase
        .from('polls')
        .update({ is_active: false, closed_at: new Date().toISOString() })
        .eq('is_active', true);

      // Create new poll
      const { error } = await supabase
        .from('polls')
        .insert({
          title,
          description: description || null,
          question,
          created_by: user.id,
          is_active: true
        });

      if (error) return { error };

      await fetchActivePoll();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const closePoll = async () => {
    if (!activePoll) return { error: new Error('Nenhuma enquete ativa') };

    try {
      const { error } = await supabase
        .from('polls')
        .update({ is_active: false, closed_at: new Date().toISOString() })
        .eq('id', activePoll.id);

      if (error) return { error };

      setActivePoll(null);
      setVotes([]);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Calculate vote statistics
  const voteStats = votes.reduce((acc, vote) => {
    acc[vote.value] = (acc[vote.value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const totalVotes = votes.length;

  return {
    activePoll,
    votes,
    userVote,
    voteStats,
    totalVotes,
    loading,
    vote,
    createPoll,
    closePoll,
    refetch: fetchActivePoll
  };
}
