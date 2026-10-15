import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, getDocs, deleteDoc, doc, orderBy } from '../lib/firebase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Video, Sparkles, Trash2, Download, Play, Plus, Search, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VideoProjects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'videoProjects'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching video projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video project?')) return;
    try {
      await deleteDoc(doc(db, 'videoProjects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
      if (selectedVideo?.id === id) setSelectedVideo(null);
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-purple-400" />
            <span>AI Video Projects</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Manage and preview all generated video reels stored in Firestore.</p>
        </div>
        <Link 
          to="/dashboard/wizard"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Reel</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading Firestore video projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl bg-white/[0.02] border border-white/10">
          <Video className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No video projects found</h3>
          <p className="text-sm text-zinc-400 mt-1 mb-6">Create your first AI-generated reel using the wizard.</p>
          <Link 
            to="/dashboard/wizard"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Wizard</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-purple-500/50 transition-all">
              <div className="relative aspect-[9/16] bg-zinc-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <video 
                  src={proj.videoUrl} 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  muted
                  loop
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
                <div className="absolute z-20 bottom-4 left-4 right-4">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 uppercase tracking-wider mb-2 inline-block">
                    {proj.category}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{proj.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedVideo(proj)}
                  className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>

              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-zinc-400">{proj.duration || '30s'} • {proj.voice || 'Adam'}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedVideo(proj)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                    title="Preview"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-6 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{selectedVideo.title}</h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="aspect-[9/16] rounded-2xl bg-black overflow-hidden relative mb-4">
              <video 
                src={selectedVideo.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-zinc-300">
              <p><strong>Script:</strong> {selectedVideo.script}</p>
              <p><strong>Style:</strong> {selectedVideo.visualStyle} • <strong>Voice:</strong> {selectedVideo.voice}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
