import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, getDocs, addDoc, deleteDoc, doc, Timestamp } from '../lib/firebase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Layers, Plus, Clock, Play, Trash2, CheckCircle2 } from 'lucide-react';

export const ContentSeries: React.FC = () => {
  const { user } = useAuth();
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Series Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('Reddit Stories');
  const [frequency, setFrequency] = useState('Daily');
  const [time, setTime] = useState('18:00');

  const fetchSeries = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'series'), where('uid', '==', user.uid));
      const snap = await getDocs(q);
      setSeriesList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching series:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [user]);

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name) return;

    try {
      const newSeries = {
        uid: user.uid,
        name,
        niche,
        frequency,
        time,
        status: 'active',
        createdAt: Timestamp.now()
      };
      await addDoc(collection(db, 'series'), newSeries);
      setShowModal(false);
      setName('');
      fetchSeries();
    } catch (err) {
      console.error('Error creating series:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this automated content series?')) return;
    try {
      await deleteDoc(doc(db, 'series', id));
      setSeriesList(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting series:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Automated Content Series</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Set up recurring video generation pipelines synced with Firestore.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Series Pipeline</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading series pipelines...</div>
      ) : seriesList.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl bg-white/[0.02] border border-white/10">
          <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No content series configured</h3>
          <p className="text-sm text-zinc-400 mt-1 mb-6">Automate daily or weekly short-form video creation effortlessly.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Series</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seriesList.map((s) => (
            <div key={s.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    {s.status || 'Active'}
                  </span>
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.name}</h3>
                <p className="text-xs text-zinc-400 mb-4">Niche: <strong className="text-white">{s.niche}</strong></p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>Frequency: <strong className="text-white">{s.frequency}</strong></span>
                <span>Time: <strong className="text-white">{s.time}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Series Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Create Content Series Pipeline</h2>

            <form onSubmit={handleCreateSeries} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Series Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Daily Reddit Mystery Stories"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Content Niche</label>
                <select 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#121217] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Reddit Stories">Reddit Stories</option>
                  <option value="Mind-Blowing Facts">Mind-Blowing Facts</option>
                  <option value="Stoic Wisdom">Stoic Wisdom</option>
                  <option value="Luxury Wealth">Luxury Wealth</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Frequency</label>
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121217] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Publish Time</label>
                  <input 
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-xl bg-white/5 text-zinc-300 font-semibold text-sm hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all"
                >
                  Save Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
