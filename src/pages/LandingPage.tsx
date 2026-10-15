import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Video, Calendar, CreditCard, ShieldCheck, Zap, ArrowRight, Play, CheckCircle2, Star, Users, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-purple-500 selection:text-white overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-6 border-b border-white/10 backdrop-blur-md bg-[#09090b]/80 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-[1px] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center">
              <Play className="w-5 h-5 text-purple-400 fill-purple-400 ml-0.5" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Reelaty<span className="text-purple-500">.ai</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#wizard" className="hover:text-white transition-colors">AI Studio</a>
          <a href="#series" className="hover:text-white transition-colors">Content Series</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link 
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <button 
                onClick={onOpenAuth}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Started Free</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 lg:px-16 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-8 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Powered by Firebase Real-Time Firestore & AI Video Models</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Create Viral <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">AI Video Reels</span> in Minutes.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          The ultimate Reelaty-inspired AI video studio. Generate cinematic scripts, hyper-realistic voiceovers, stunning visuals, and auto-publish across TikTok, Instagram, and YouTube.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link 
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-base shadow-xl shadow-purple-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>Open AI Studio Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-base shadow-xl shadow-purple-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Creating Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <a 
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
            <span>Explore Features</span>
          </a>
        </div>

        {/* Social Proof / Stats */}
        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">10M+</div>
            <div className="text-xs md:text-sm text-zinc-400 mt-1">Reels Generated</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">99.8%</div>
            <div className="text-xs md:text-sm text-zinc-400 mt-1">Firebase Sync SLA</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">4.9★</div>
            <div className="text-xs md:text-sm text-zinc-400 mt-1">Creator Rating</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">150+</div>
            <div className="text-xs md:text-sm text-zinc-400 mt-1">Countries Active</div>
          </div>
        </div>

        {/* Hero Video Mockup Preview */}
        <div className="mt-16 relative rounded-3xl p-2 bg-gradient-to-b from-purple-500/30 via-pink-500/10 to-transparent border border-white/15 shadow-2xl shadow-purple-900/50">
          <div className="rounded-2xl bg-[#121217] overflow-hidden border border-white/10 aspect-[16/9] flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-[#09090b] to-[#09090b]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-20 h-20 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-tight">AI Cinematic Video Engine Active</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-md">Connected to Firebase Firestore project <code className="text-purple-400 font-mono">ai-video-studio-fac95</code> with live persistence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-28 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Everything you need to <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">dominate social media</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base md:text-lg">
            Powered by enterprise-grade Firebase database architecture and state-of-the-art AI video generation models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Script & Story Studio</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Generate compelling hook-driven scripts, engaging narratives, and visual prompts customized for TikTok and Instagram Reels.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-pink-500/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cinematic Video Wizard</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Synthesize realistic voiceovers, dynamic auto-captions, background soundtracks, and 4K vertical visuals seamlessly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Automated Series & Calendar</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Set up automated content pipelines that generate and schedule posts to your connected social channels automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-28 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Simple, transparent <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">credit pricing</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base md:text-lg">
            All plans include full access to Firebase synced video projects, HD renders, and priority generation queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Creator Plan */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Creator</div>
              <div className="text-4xl font-black text-white mb-4">$29<span className="text-sm font-normal text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-400 mb-6">Perfect for solo creators launching automated short-form channels.</p>
              
              <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> 500 Credits / month</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> HD 1080p Video Renders</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> 2 Active Series Pipelines</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Firebase Cloud Sync</li>
              </ul>
            </div>
            <button 
              onClick={onOpenAuth}
              className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan (Featured) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-900/40 via-purple-900/10 to-transparent border-2 border-purple-500 shadow-2xl shadow-purple-900/50 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
              Most Popular
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-2">Pro Studio</div>
              <div className="text-4xl font-black text-white mb-4">$79<span className="text-sm font-normal text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-300 mb-6">Designed for professional creators and agencies scaling viral accounts.</p>
              
              <ul className="space-y-3 text-sm text-zinc-200 mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> 2,000 Credits / month</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> 4K Ultra HD Renders</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Unlimited Series Pipelines</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Auto-Publishing to 5 Platforms</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Priority Generation Queue</li>
              </ul>
            </div>
            <button 
              onClick={onOpenAuth}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Agency Plan */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-pink-400 uppercase tracking-wider mb-2">Agency</div>
              <div className="text-4xl font-black text-white mb-4">$199<span className="text-sm font-normal text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-400 mb-6">For multi-brand operations and full-scale social media teams.</p>
              
              <ul className="space-y-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-pink-400" /> 6,000 Credits / month</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-pink-400" /> Dedicated Render Nodes</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-pink-400" /> Team Member Access Roles</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-pink-400" /> Custom AI Voice Training</li>
              </ul>
            </div>
            <button 
              onClick={onOpenAuth}
              className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 lg:px-16 text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <span className="text-white font-bold tracking-tight">Reelaty.ai Studio</span>
          </div>
          <p>© {new Date().getFullYear()} Reelaty AI Video Platform. Connected to Firebase <code className="text-purple-400">ai-video-studio-fac95</code>.</p>
          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
