import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-xl shadow-purple-600/30">
        <Play className="w-8 h-8 text-white fill-white ml-0.5" />
      </div>
      <h1 className="text-4xl font-black mb-2">404 — Page Not Found</h1>
      <p className="text-zinc-400 text-sm max-w-md mb-8">
        The page you are looking for does not exist in Reelaty AI studio or has been moved.
      </p>
      <Link 
        to="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return Home</span>
      </Link>
    </div>
  );
}
