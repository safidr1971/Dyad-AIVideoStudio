import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, getDocs } from '../lib/firebase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Share2, Video } from 'lucide-react';

export const PublishCalendar: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'videoProjects'), where('uid', '==', user.uid));
        const snap = await getDocs(q);
        setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching calendar data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            <span>Publishing Calendar & Queue</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Review scheduled social media posts and auto-publishing history.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading publishing schedule...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl bg-white/[0.02] border border-white/10">
          <CalendarIcon className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No scheduled posts</h3>
          <p className="text-sm text-zinc-400 mt-1">Create video reels to see them scheduled in your calendar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div key={proj.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Destinations: TikTok, Instagram Reels • Format: {proj.aspectRatio}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Scheduled for Auto-Publish</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Queue #{idx + 1} • Sync ID: {proj.id.slice(0, 8)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
