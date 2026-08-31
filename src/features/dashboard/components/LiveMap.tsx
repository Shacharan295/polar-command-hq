import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Personnel, SOSAlert, Mission } from '@/types';
import { INITIAL_TEAMS } from '@/lib/mockData';

interface LiveMapProps {
  personnel: Personnel[];
  sosAlerts: SOSAlert[];
  missions: Mission[];
  onSelectPersonnel: (person: Personnel) => void;
  selectedPersonnelId?: string;
}

const createPolarMarker = (person: Personnel, isSOS: boolean) => {
  let bgColor = '#38bdf8';
  let borderColor = '#0284c7';
  let labelIcon = '👤';
  let animationCss = '';

  if (isSOS || person.status === 'EMERGENCY') {
    bgColor = '#ef4444';
    borderColor = '#f87171';
    labelIcon = '🚨';
    animationCss = 'animation: polarPulse 1.2s infinite;';
  } else if (person.status === 'ON_MISSION') {
    bgColor = '#0284c7';
    borderColor = '#38bdf8';
    labelIcon = '🎯';
  } else if (person.status === 'ACTIVE') {
    bgColor = '#10b981';
    borderColor = '#34d399';
    labelIcon = '👤';
  } else if (person.status === 'OFFLINE') {
    bgColor = '#64748b';
    borderColor = '#94a3b8';
    labelIcon = '⚪';
  }

  return L.divIcon({
    className: 'custom-polar-map-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        border: 2px solid ${borderColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 14px ${bgColor};
        color: #ffffff;
        font-size: 14px;
        cursor: pointer;
        ${animationCss}
      ">
        ${labelIcon}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createTeamMarker = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-team-map-marker',
    html: `
      <div style="
        background-color: ${color};
        border: 2px solid #ffffff;
        width: 38px;
        height: 38px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 16px ${color};
        color: #000000;
        font-weight: bold;
        font-family: monospace;
        font-size: 11px;
        cursor: pointer;
      ">
        ${label}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

export const LiveMap: React.FC<LiveMapProps> = ({
  personnel,
  sosAlerts,
  missions,
  onSelectPersonnel,
  selectedPersonnelId,
}) => {
  // Base coordinates around Antarctic McMurdo HQ (-77.8489° S, 166.6686° E)
  const defaultCenter: [number, number] = [-77.8489, 166.6686];
  const defaultZoom = 8;

  // Realistic Geographically Distributed Antarctic Outpost Bases
  const teamOutposts = [
    { team: INITIAL_TEAMS[0], lat: -77.5300, lng: 167.1700, label: 'T-A', location: 'Mount Erebus Ridge Camp B' },
    { team: INITIAL_TEAMS[1], lat: -78.5000, lng: 169.2000, label: 'T-B', location: 'Ross Ice Shelf Base' },
    { team: INITIAL_TEAMS[2], lat: -77.8489, lng: 166.6686, label: 'T-C', location: 'McMurdo Main Supply Hub' },
    { team: INITIAL_TEAMS[3], lat: -75.1000, lng: 123.3300, label: 'T-D', location: 'Concordia Station Dome C' },
    { team: INITIAL_TEAMS[4], lat: -77.8520, lng: 166.6750, label: 'T-E', location: 'McMurdo SAR Heliport Base' },
  ];

  // Transit route polyline corridors connecting Antarctic bases
  const rossTransitRoute: [number, number][] = [
    [-77.8489, 166.6686],
    [-78.1000, 168.0000],
    [-78.5000, 169.2000],
  ];

  const erebusTransitRoute: [number, number][] = [
    [-77.8489, 166.6686],
    [-77.6500, 166.9000],
    [-77.5300, 167.1700],
  ];

  return (
    <div className="w-full h-full min-h-[460px] rounded-b-xl overflow-hidden relative border-t border-cyan-950 font-sans">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ height: '100%', minHeight: '460px', background: '#070e1a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Transit Route Polylines */}
        <Polyline
          positions={rossTransitRoute}
          pathOptions={{ color: '#38bdf8', weight: 3, dashArray: '6, 8', opacity: 0.7 }}
        />
        <Polyline
          positions={erebusTransitRoute}
          pathOptions={{ color: '#f59e0b', weight: 3, dashArray: '6, 8', opacity: 0.7 }}
        />

        {/* Team Base Outpost Markers */}
        {teamOutposts.map((outpost) => (
          <Marker
            key={outpost.team.id}
            position={[outpost.lat, outpost.lng]}
            icon={createTeamMarker(outpost.team.color_code, outpost.label)}
          >
            <Tooltip permanent direction="top" offset={[0, -20]} className="custom-polar-tooltip">
              <span className="font-mono text-[10px] font-bold">{outpost.team.name}</span>
            </Tooltip>
            <Popup className="custom-polar-popup">
              <div className="p-2 font-mono text-xs text-slate-100 bg-[#09111e] rounded-lg">
                <div className="font-bold text-cyan-300">{outpost.team.name} ({outpost.team.callsign})</div>
                <div className="text-[11px] text-slate-400 mt-1">{outpost.location}</div>
                <div className="text-[10px] text-slate-500 mt-1">Coordinates: {Math.abs(outpost.lat).toFixed(2)}° S, {outpost.lng.toFixed(2)}° E</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Personnel Markers */}
        {personnel.map((person) => {
          const isSOS = sosAlerts.some(
            (s) => s.personnel_id === person.id && s.status !== 'RESOLVED'
          );

          return (
            <Marker
              key={person.id}
              position={[person.latitude, person.longitude]}
              icon={createPolarMarker(person, isSOS)}
              eventHandlers={{
                click: () => onSelectPersonnel(person),
              }}
            >
              <Tooltip direction="top" offset={[0, -16]}>
                <span className="font-mono text-[10px] font-bold">
                  {person.full_name} ({person.status})
                </span>
              </Tooltip>
              <Popup className="custom-polar-popup">
                <div className="p-2.5 font-mono text-xs text-slate-100 bg-[#09111e] rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center justify-between">
                    <span>{person.full_name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-200">
                      {person.status}
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] font-sans">{person.role}</div>
                  <div className="text-[10px] text-slate-400">{person.location_name}</div>
                  <div className="text-[10px] text-emerald-400">
                    Battery: {person.battery_level}% • {person.comm_channel}
                  </div>
                  <button
                    onClick={() => onSelectPersonnel(person)}
                    className="w-full mt-2 py-1 bg-cyan-950 border border-cyan-500 text-cyan-300 rounded text-[10px] font-bold cursor-pointer hover:bg-cyan-900"
                  >
                    OPEN TELEMETRY DRAWER &rarr;
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-[#08101d]/90 border border-slate-800/80 p-3 rounded-lg backdrop-blur-md text-[10px] font-mono text-slate-300 space-y-1.5 shadow-xl">
        <div className="font-bold uppercase text-slate-400 text-[9px] tracking-wider mb-1">
          Tactical Map Telemetry Legend
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>🚨 SOS Emergency Incident</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>🎯 On Assigned Mission</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>👤 Active Field Personnel</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span>⚪ Offline / Disconnected</span>
        </div>
      </div>
    </div>
  );
};
