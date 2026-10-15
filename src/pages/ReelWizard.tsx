import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc, Timestamp } from '../lib/firebase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Sparkles, Video, Music, Mic, Sliders, Globe, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Play, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  { id: 'reddit', name: 'Reddit Stories', desc: 'Engaging r/AskReddit & scary stories with gameplay background' },
  { id: 'facts', name: 'Mind-Blowing Facts', desc: 'Fascinating psychology and science facts that hook viewers' },
  { id: 'stoicism', name: 'Stoic Wisdom', desc: 'Marcus Aurelius quotes and life philosophy reels' },
  { id: 'luxury', name: 'Luxury Lifestyle', desc: 'Motivational wealth & luxury aesthetic content' },
  { id: 'custom', name: 'Custom Niche', desc: 'Type your own custom topic and script prompt' }
];

const VOICES = [
  { id: 'adam', name: 'Adam (Deep & Authoritative)', lang: 'English (US)' },
  { id: 'rachel', name: 'Rachel (Warm & Engaging)', lang: 'English (US)' },
  { id: 'antoni', name: 'Antoni (Smooth & Cinematic)', lang: 'English (UK)' },
  { id: 'dommi', name: 'Dommi (Energetic & Fast)', lang: 'English (AU)' }
];

const STYLES = [
  { id: 'cinematic', name: 'Dark Cinematic 4K', preview: 'from-purple-900 to-black' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', preview: 'from-pink-600 to-purple-900' },
  { id: 'minimal', name: 'Minimalist Clean', preview: 'from-zinc-800 to-zinc-950' },
  { id: 'anime', name: 'Anime Visuals', preview: 'from-blue-600 to-indigo-950' }
];

export const ReelWizard: React.FC = () => {
  const { user, userProfile, deductCredits } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('reddit');
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState('30s');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [visualStyle, setVisualStyle] = useState('cinematic');
  const [voice, setVoice] = useState('adam');
  const [bgMusic, setBgMusic] = useState('lofi');
  const [publishingDest, setPublishingDest] = useState(['tiktok', 'instagram']);
  
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!user || !userProfile) return;

    if (userProfile.credits < 15) {
      alert('Insufficient credits! You need at least 15 credits to generate a video reel.');
      return;
    }

    setGenerating(true);
    setProgress(15);

    try {
      // Deduct credits via Firestore transaction/update
      const success = await deductCredits(15);
      if (!success) {
        alert('Failed to deduct credits. Please try again.');
        setGenerating(false);
        return;
      }

      setProgress(40);
      await new Promise(r => setTimeout(r, 1200));
      setProgress(75);
      await new Promise(r => setTimeout(r, 1000));

      // Save video project to Firestore
      const projectData = {
        uid: user.uid,
        category,
        title: title || `${category} Viral Reel`,
        script: script || 'AI generated cinematic narrative hook for high engagement...',
        duration,
        aspectRatio,
        visualStyle,
        voice,
        bgMusic,
        publishingDest,
        status: 'completed',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31940-large.mp4',
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'videoProjects'), projectData);

      setProgress(100);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      await new Promise(r => setTimeout(r, 1500));
      navigate('/dashboard/videos');
    } catch (err) {
      console.error('Error generating reel:', err);
      alert('Generation error. Please check Firestore permissions.');
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Wizard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span>AI Reel Creation Studio</span>
              </h1>
              <p className="text-sm text-zinc-400 mt-1">Configure your viral video parameters and generate instantly to Firestore.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Cost: 15 Credits</span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: 1, label: 'Story & Niche' },
              { num: 2, label: 'AI Voice & Style' },
              { num: 3, label: 'Review & Render' }
            ].map((s) => (
              <div 
                key={s.num} 
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-3 transition-all ${step === s.num ? 'bg-purple-600/20 border-purple-500 text-white' : step > s.num ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-zinc-500'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${step === s.num ? 'bg-purple-600 text-white' : step > s.num ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-400'}`}>
                  {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Story & Niche */}
        {step === 1 && (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-white">1. Select Content Niche & Topic</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${category === c.id ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-600/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                  <h3 className="text-sm font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-xs text-zinc-400">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Video Title / Hook Topic</label>
                <input 
                  type="text"
                  placeholder="e.g. The scariest encounter in deep ocean trench..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Custom Script (Optional - AI will generate if blank)</label>
                <textarea 
                  rows={4}
                  placeholder="Type or paste your hook narrative here..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Next: Voice & Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Voice & Style */}
        {step === 2 && (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-white">2. AI Voiceover & Visual Style</h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-3">AI Narration Voice</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VOICES.map((v) => (
                  <div 
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${voice === v.id ? 'bg-purple-600/20 border-purple-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{v.name}</div>
                      <div className="text-xs text-zinc-400">{v.lang}</div>
                    </div>
                    <Mic className={`w-5 h-5 ${voice === v.id ? 'text-purple-400' : 'text-zinc-500'}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-xs font-semibold text-zinc-300 mb-3">Visual Style Theme</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STYLES.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => setVisualStyle(s.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${visualStyle === s.id ? 'bg-purple-600/20 border-purple-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.preview}`} />
                      <span className="text-sm font-bold text-white">{s.name}</span>
                    </div>
                    {visualStyle === s.id && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button 
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Next: Review & Render</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Render */}
        {step === 3 && (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-white">3. Review & Render AI Video</h2>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Content Niche:</span>
                <span className="font-bold text-white capitalize">{category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Title / Topic:</span>
                <span className="font-bold text-white">{title || `${category} Viral Reel`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Duration & Aspect:</span>
                <span className="font-bold text-white">{duration} • {aspectRatio}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">AI Voice:</span>
                <span className="font-bold text-white capitalize">{voice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Visual Theme:</span>
                <span className="font-bold text-white capitalize">{visualStyle}</span>
              </div>
            </div>

            {generating && (
              <div className="p-6 rounded-2xl bg-purple-900/20 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 font-semibold animate-pulse">Rendering AI Reel & Syncing to Firestore...</span>
                  <span className="text-purple-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(2)}
                disabled={generating}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button 
                onClick={handleGenerate}
                disabled={generating}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-sm shadow-xl shadow-purple-600/40 hover:scale-[1.02] transition-all flex items-center gap-3"
              >
                <Sparkles className="w-4 h-4" />
                <span>Render Reel (15 Credits)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
