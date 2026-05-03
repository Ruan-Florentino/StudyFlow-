import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Share2, Plus, Image as ImageIcon, Loader2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard, AnimatedButton, cn } from './UI';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  id: string;
  content: string;
  media_url?: string;
  type: string;
  created_at: string;
  user_id: string;
  user: {
    name: string;
    profile_pic: string;
  };
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
}

export const CommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    // Subscribe to changes
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(name, profile_pic),
          likes(user_id),
          comments(id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data.map((post: any) => ({
        ...post,
        likes_count: post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
        user_has_liked: post.likes?.some((l: any) => l.user_id === user?.id) || false
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('posts').insert({
        content: newPostContent,
        user_id: user.id,
        type: 'status'
      });
      if (error) throw error;
      setNewPostContent('');
      setIsCreating(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = async (postId: string, hasLiked: boolean) => {
    if (!user) return;
    try {
      if (hasLiked) {
        await supabase.from('likes').delete().match({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 translate-y-10 group">
         <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse group-hover:bg-primary/30 transition-all" />
            <Loader2 className="animate-spin text-primary relative z-10" size={40} />
         </div>
         <p className="mt-4 text-xs font-premium-mono tracking-[0.2em] text-white/40 uppercase">Sincronizando Feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-premium-title italic uppercase">Comunidade</h2>
        <AnimatedButton 
          onClick={() => setIsCreating(true)} 
          className="text-xs py-1.5 px-4 bg-primary/20 text-primary border-primary/30"
        >
          <Plus size={16} className="mr-1" /> Novo Post
        </AnimatedButton>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-4 mb-6 border-primary/30 bg-primary/5">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="O que você está estudando agora?"
                className="w-full h-24 bg-transparent border-none resize-none focus:ring-0 text-sm placeholder:text-white/20"
              />
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                <button className="text-white/40 hover:text-white transition-colors">
                  <ImageIcon size={18} />
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="text-xs font-bold text-white/40 uppercase px-3"
                  >
                    Cancelar
                  </button>
                  <AnimatedButton 
                    onClick={handleCreatePost} 
                    disabled={isSubmitting || !newPostContent.trim()}
                    className="text-xs py-1 px-4 bg-primary text-black border-primary"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : 'Publicar'}
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-4 border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                  {post.user?.profile_pic ? (
                    <img src={post.user.profile_pic} alt={post.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white/20" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white/90">{post.user?.name || 'Estudante'}</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                <button 
                  onClick={() => toggleLike(post.id, post.user_has_liked)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    post.user_has_liked ? "text-pink-500" : "text-white/40 hover:text-white"
                  )}
                >
                  <Heart size={16} fill={post.user_has_liked ? "currentColor" : "none"} />
                  {post.likes_count}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                  <MessageSquare size={16} />
                  {post.comments_count}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors ml-auto">
                  <Share2 size={16} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 text-sm">Nenhum post ainda. Seja o primeiro a compartilhar!</p>
          </div>
        )}
      </div>
    </div>
  );
};
