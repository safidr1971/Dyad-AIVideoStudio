import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, getDocs, orderBy, limit, Timestamp } from '../lib/firebase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Sparkles, Video, Layers, Calendar, Zap, ArrowRight, Play, CheckCircle2, Clock, Plus, Flame, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const projQuery = query(
          collection(db, 'videoProjects'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const projSnap = await getDocs(projQuery);
        setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const seriesQuery = query(
          collection(db, 'series'),
          where('uid', '==', user.uid),
          limit(3)
        );
        const seriesSnap = await getDocs(seriesQuery);
        setSeries(seriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching dashboard Firestore data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-[#121217] border border-white/10 overflow-hidden mb-10 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>Firebase Connected • ai-video-studio-fac95</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Welcome back, {userProfile?.displayName || 'Creator'}! ✨
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            Your AI video automation studio is fully synced with Firestore. Ready to generate viral TikToks and Instagram Reels?
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link 
              to="/dashboard/wizard"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Reel Wizard</span>
            </Link>
            <Link 
              to="/dashboard/series"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Create Series Pipeline</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Credit Balance</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{userProfile?.credits || 0}</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active plan: {userProfile?.plan || 'Creator'}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Video Projects</span>
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{projects.length}</div>
          <div className="text-xs text-zinc-400 mt-2">Saved in Firestore DB</div>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Content Series</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{series.length}</div>
          <div className="text-xs text-zinc-400 mt-2">Automated pipelines</div>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Publish Status</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">Online</div>
          <div className="text-xs text-emerald-400 mt-2">Firebase sync operational</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              <span>Recent Video Projects</span>
            </h2>
            <Link to="/dashboard/videos" className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
              <Video className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No video projects yet</p>
              <p className="text-xs text-zinc-400 mt-1 mb-4">Create your first AI reel to get started.</p>
              <Link 
                to="/dashboard/wizard"
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-medium text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Reel</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{proj.title || 'Untitled Reel'}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{proj.category} • {proj.duration || '30s'} • {proj.voice || 'Adam'}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${proj.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {proj.status || 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Active Content Series</span>
            </h2>
            <Link to="/dashboard/series" className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {series.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
              <Layers className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No automated series active</p>
              <p className="text-xs text-zinc-400 mt-1 mb-4">Set up a recurring series pipeline.</p>
              <Link 
                to="/dashboard/series"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-medium text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Series</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {series.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Schedule: {s.frequency || 'Daily'} • Niche: {s.niche}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
