import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative p-2.5 bg-slate-900 rounded-2xl border border-slate-700/50 ring-1 ring-white/5 shadow-2xl">
               <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              خيال <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-extrabold">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              أطلق العنان لإبداعك
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 flex items-center gap-2 shadow-sm backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">
                    Gemini 2.5 Flash
                </span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;