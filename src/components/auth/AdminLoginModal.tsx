import React, { useState } from 'react';
import { Compass, ShieldCheck, Key, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AdminLoginModal: React.FC = () => {
  const { loginAsAdmin, isLoading } = useAuth();
  const [email, setEmail] = useState('commander@dhruva.org');
  const [password, setPassword] = useState('dhruva-admin-2026');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginAsAdmin(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b14]/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#0b1320] border border-cyan-900/60 rounded-2xl shadow-2xl overflow-hidden relative font-sans">
        {/* Top Decorative Radar Bar */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 w-full animate-pulse" />
        
        <div className="p-8 space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-slate-100 tracking-wider">
              DHRUVA COMMAND
            </h1>
            <p className="text-xs text-cyan-300 font-mono tracking-widest uppercase">
              Integrated Expedition HQ Command Center
            </p>
          </div>

          {/* Admin Notice */}
          <div className="p-3.5 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-xs text-slate-300 space-y-1">
            <div className="flex items-center space-x-2 text-cyan-300 font-semibold font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SINGLE HQ ADMIN ACCESS</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Authenticate as HQ Admin to unlock full operational command capabilities, live telemetry, and SOS dispatch response.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">
                HQ Admin Identity
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="commander@dhruva.org"
                />

                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">
                Access Authorization Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="••••••••••••"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>{isLoading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE HQ ADMIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footnote */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Full operational visibility granted to HQ Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
