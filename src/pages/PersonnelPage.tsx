import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, Battery, Radio, MapPin, Target, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { INITIAL_PERSONNEL, INITIAL_TEAMS, INITIAL_MISSIONS } from '@/lib/mockData';
import type { Personnel, PersonnelStatus } from '@/types';
import { PersonnelDrawer } from '@/features/personnel/components/PersonnelDrawer';

export const PersonnelPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'battery' | 'last_ping'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);

  // Exactly 20 unique Antarctic field personnel (4 per team)
  const fullRoster = INITIAL_PERSONNEL;


  // Filtering & Sorting
  const filteredPersonnel = useMemo(() => {
    return fullRoster
      .filter((p) => {
        const matchesSearch = p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.location_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        const matchesTeam = teamFilter === 'ALL' || p.team_id === teamFilter;
        return matchesSearch && matchesStatus && matchesTeam;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') comp = a.full_name.localeCompare(b.full_name);
        else if (sortBy === 'status') comp = a.status.localeCompare(b.status);
        else if (sortBy === 'battery') comp = b.battery_level - a.battery_level;
        else if (sortBy === 'last_ping') comp = new Date(b.last_ping).getTime() - new Date(a.last_ping).getTime();
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [fullRoster, searchQuery, statusFilter, teamFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredPersonnel.length / itemsPerPage);
  const paginatedPersonnel = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPersonnel.slice(start, start + itemsPerPage);
  }, [filteredPersonnel, currentPage]);

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Field Personnel Management Engine
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            FIELD PERSONNEL DIRECTORY ({fullRoster.length} TOTAL REGISTERED)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Filterable & searchable roster supporting up to 200 field personnel with live telemetry status.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search personnel, role..."
              className="w-full bg-[#060c16] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={teamFilter}
            onChange={(e) => {
              setTeamFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#060c16] border border-slate-700 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Teams</option>
            {INITIAL_TEAMS.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#060c16] border border-slate-700 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON_MISSION">ON MISSION</option>
            <option value="EMERGENCY">EMERGENCY</option>
            <option value="IDLE">IDLE</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#060c16] border border-slate-700 text-cyan-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="battery">Sort by Battery</option>
            <option value="last_ping">Sort by Last Ping</option>
          </select>
        </div>
      </div>

      {/* Personnel Roster Table (Section 30 Columns) */}
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#08101d] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Name / Role</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Battery</th>
                <th className="px-4 py-3">Communication</th>
                <th className="px-4 py-3">Last Update</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {paginatedPersonnel.map((person) => {
                const team = INITIAL_TEAMS.find((t) => t.id === person.team_id);
                return (
                  <tr
                    key={person.id}
                    onClick={() => setSelectedPersonnel(person)}
                    className="hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-100">{person.full_name}</div>
                      <div className="text-[11px] text-cyan-400 font-sans">{person.role}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-cyan-300 font-semibold">{team?.name || 'Team Alpha'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        person.status === 'EMERGENCY'
                          ? 'bg-red-950 text-red-300 border border-red-500/80 animate-sos-flash'
                          : person.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : person.status === 'ON_MISSION'
                          ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                          : person.status === 'OFFLINE'
                          ? 'bg-slate-900 text-slate-400 border border-slate-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{person.location_name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {Math.abs(person.latitude).toFixed(4)}° {person.latitude < 0 ? 'S' : 'N'},{' '}
                        {Math.abs(person.longitude).toFixed(4)}° {person.longitude < 0 ? 'W' : 'E'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <Battery className={`w-3.5 h-3.5 ${person.battery_level < 30 ? 'text-red-400' : 'text-emerald-400'}`} />
                        <span className={person.battery_level < 30 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                          {person.battery_level}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <Radio className="w-3.5 h-3.5 text-sky-400" />
                        <span>{person.comm_channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(person.last_ping).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPersonnel(person);
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-700 hover:border-cyan-400 text-cyan-300 text-[11px] cursor-pointer"
                      >
                        TELEMETRY &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-4 bg-[#08101d] border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
          <div>
            Showing <strong className="text-slate-200">{paginatedPersonnel.length}</strong> of{' '}
            <strong className="text-slate-200">{filteredPersonnel.length}</strong> personnel entries
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 inline" /> PREV
            </button>
            <span>Page {currentPage} of {totalPages || 1}</span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
            >
              NEXT <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        </div>
      </div>

      {/* Personnel Detail Drawer */}
      <PersonnelDrawer
        personnel={selectedPersonnel}
        onClose={() => setSelectedPersonnel(null)}
        missions={INITIAL_MISSIONS}
      />
    </div>
  );
};
