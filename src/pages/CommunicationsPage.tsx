import React, { useState } from 'react';
import { MessageSquare, Send, Radio, Satellite, Wifi, ShieldAlert, CheckCircle2, User, Users, Target, ShieldCheck } from 'lucide-react';
import { INITIAL_TEAMS, INITIAL_PERSONNEL, INITIAL_MISSIONS, INITIAL_SOS_ALERTS } from '@/lib/mockData';
import type { Message, CommChannel, SatelliteStatus } from '@/types';
import { messageService, auditService } from '@/services';
import { useAuth } from '@/context/AuthContext';

export const CommunicationsPage: React.FC = () => {
  const { user, currentRole } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<string>('INC-001 (Emergency Engine Overheat)');
  const [selectedCommType, setSelectedCommType] = useState<CommChannel>('SATELLITE');
  const [messageText, setMessageText] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('CRITICAL');
  const [satelliteStatus, setSatelliteStatus] = useState<SatelliteStatus>('SATELLITE AVAILABLE');
  const [messagesList, setMessagesList] = useState<Message[]>([
    {
      id: 'msg-001',
      expedition_id: INITIAL_TEAMS[0].expedition_id,
      sender_id: '00000000-0000-0000-0000-000000000001',
      sender_name: 'Commander Admin (HQ)',
      team_id: INITIAL_TEAMS[0].id,
      incident_id: '55555555-5555-5555-5555-000000000001',
      channel: 'SATELLITE',
      message: 'Stop vehicle movement immediately and remain inside Rover cabin. Response team being dispatched.',
      priority: 'CRITICAL',
      status: 'ACKNOWLEDGED',
      created_at: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 'msg-002',
      expedition_id: INITIAL_TEAMS[0].expedition_id,
      sender_id: INITIAL_PERSONNEL[0].id,
      sender_name: 'Arjun Kumar (Team Alpha)',
      team_id: INITIAL_TEAMS[0].id,
      incident_id: '55555555-5555-5555-5555-000000000001',
      channel: 'SATELLITE',
      message: 'ACKNOWLEDGED. Cabin heating auxiliary turned on. Awaiting SAR arrival.',
      priority: 'HIGH',
      status: 'ACKNOWLEDGED',
      created_at: new Date(Date.now() - 120000).toISOString(),
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSubmitting(true);

    const newMsg: Omit<Message, 'id' | 'created_at'> = {
      expedition_id: INITIAL_TEAMS[0].expedition_id,
      sender_id: user?.id || '00000000-0000-0000-0000-000000000001',
      sender_name: `${user?.full_name || 'Commander Admin'} (${currentRole})`,
      channel: selectedCommType,
      message: messageText,
      priority: priority,
      status: 'DELIVERED',
    };

    await messageService.send(newMsg);

    const createdMsgObj: Message = {
      ...newMsg,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setMessagesList((prev) => [...prev, createdMsgObj]);

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Sent Contextual Channel Message',
      'Message',
      createdMsgObj.id,
      `Transmitted message on channel "${selectedChannel}" via ${selectedCommType}`
    );

    setMessageText('');
    setIsSubmitting(false);
    setFeedback(`Message transmitted to "${selectedChannel}" via ${selectedCommType} gateway.`);

    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              HQ Contextual Communications Engine
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            SATELLITE & RADIO CONTEXTUAL COMMUNICATIONS HUB
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Operational links: HQ &rarr; Satellite Gateway &rarr; Satellite Network &rarr; Field Personnel App.
          </p>
        </div>

        {/* Satellite Gateway Health Controls */}
        <div className="flex items-center space-x-3 bg-[#060c16] border border-slate-800 p-2.5 rounded-xl text-xs font-mono">
          <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Satellite Gateway State</div>
            <select
              value={satelliteStatus}
              onChange={(e) => setSatelliteStatus(e.target.value as SatelliteStatus)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="SATELLITE AVAILABLE" className="bg-[#0b1320] text-emerald-300">SATELLITE AVAILABLE (98%)</option>
              <option value="SATELLITE DEGRADED" className="bg-[#0b1320] text-amber-300">SATELLITE DEGRADED (45%)</option>
              <option value="SATELLITE UNAVAILABLE" className="bg-[#0b1320] text-red-300">SATELLITE UNAVAILABLE (0%)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[580px]">
        {/* Left: Operational Context Channels List (4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1320] border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-2 font-mono text-xs">
            {/* INCIDENTS LINKED CHANNELS */}
            <div className="text-[10px] font-semibold uppercase text-red-400 px-1 font-bold">
              🚨 Linked Incident Channels
            </div>
            <button
              onClick={() => setSelectedChannel('INC-001 (Emergency Engine Overheat)')}
              className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                selectedChannel.includes('INC-001')
                  ? 'bg-red-950/80 border border-red-500 text-red-200 font-bold shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'bg-[#060c16] text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>INC-001 Engine Overheat</span>
              </div>
              <span className="text-[9px] bg-red-900 px-1.5 py-0.5 rounded text-red-100 font-bold uppercase">SOS</span>
            </button>

            {/* MISSIONS LINKED CHANNELS */}
            <div className="text-[10px] font-semibold uppercase text-sky-400 px-1 pt-2 font-bold flex items-center justify-between">
              <span>🎯 Linked Mission Channels</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                {INITIAL_MISSIONS.filter((m) => m.status !== 'COMPLETED').length} Active
              </span>
            </div>
            {INITIAL_MISSIONS.filter((m) => m.status !== 'COMPLETED').map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedChannel(`Mission: ${m.title}`)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  selectedChannel.includes(m.title)
                    ? 'bg-sky-950 border border-sky-500 text-sky-300 font-bold'
                    : 'bg-[#060c16] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Target className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate max-w-[170px]">{m.title}</span>
                </div>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">MISSION</span>
              </button>
            ))}


            {/* GROUP TEAMS */}
            <div className="text-[10px] font-semibold uppercase text-slate-400 px-1 pt-2 font-bold">
              👥 Group Team Channels
            </div>
            {INITIAL_TEAMS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedChannel(t.name)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  selectedChannel === t.name
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-[#060c16] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.name}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{t.callsign}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-[#060c16] rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400">
            <span>GATEWAY STATE: </span>
            <strong className="text-emerald-400">{satelliteStatus}</strong>
          </div>
        </div>

        {/* Right: Message Stream (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1320] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          {/* Stream Header */}
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-100 uppercase">{selectedChannel}</span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-slate-400 text-[10px]">Gateway Protocol:</span>
              <select
                value={selectedCommType}
                onChange={(e) => setSelectedCommType(e.target.value as CommChannel)}
                className="bg-[#060c16] border border-slate-700 text-cyan-300 rounded px-2 py-0.5 text-xs"
              >
                <option value="SATELLITE">SATELLITE</option>
                <option value="RADIO">RADIO</option>
                <option value="INTERNET">INTERNET</option>
                <option value="OFFLINE QUEUE">OFFLINE QUEUE</option>
              </select>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center space-x-2 my-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 font-mono text-xs">
            {messagesList.map((msg) => {
              const isHQ = msg.sender_name.includes('HQ') || msg.sender_name.includes('Commander');
              return (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border max-w-lg space-y-1 ${
                    isHQ
                      ? 'bg-[#060c16] border-slate-800'
                      : 'bg-cyan-950/40 border-cyan-800/60 ml-auto text-right'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className={isHQ ? 'text-cyan-400' : 'text-sky-300'}>{msg.sender_name}</span>
                    <span className="text-slate-500">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs">{msg.message}</p>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>VIA {msg.channel}</span>
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                      <span>{msg.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2 font-mono">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Send linked message on ${selectedChannel}...`}
              required
              className="flex-1 bg-[#060c16] border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-lg uppercase"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
