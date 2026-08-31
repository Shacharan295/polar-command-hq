import React, { useState } from 'react';
import { Boxes, Package, CheckCircle2, XCircle, Truck, AlertTriangle, ArrowRightLeft, Plus, Send, Clock, ShieldCheck, History } from 'lucide-react';
import { INITIAL_RESOURCES, INITIAL_RESOURCE_REQUESTS, INITIAL_TEAMS } from '@/lib/mockData';
import type { Resource, ResourceRequest, ResourceRequestStatus, Cargo, CargoStatus } from '@/types';
import { resourceService, resourceRequestService, auditService } from '@/services';
import { ManageResourceModal } from '@/features/resources/components/ManageResourceModal';
import { useAuth } from '@/context/AuthContext';

export const LogisticsPage: React.FC = () => {
  const { user, currentRole } = useAuth();
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [requests, setRequests] = useState<ResourceRequest[]>(INITIAL_RESOURCE_REQUESTS);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Cargo Shipments Data (Section 15 & 16)
  const [cargoList, setCargoList] = useState<Cargo[]>([
    {
      id: 'CRG-101',
      expedition_id: '11111111-1111-1111-1111-111111111111',
      contents: 'Arctic Grade Diesel Fuel (200L)',
      quantity: 200,
      unit: 'Liters',
      origin: 'Main Supply Hub Svalbard',
      destination: 'Camp B - North Ridge',
      assigned_team_id: INITIAL_TEAMS[2].id,
      priority: 'HIGH',
      status: 'IN_TRANSIT',
      eta: '45 mins',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'CRG-102',
      expedition_id: '11111111-1111-1111-1111-111111111111',
      contents: 'Emergency Portable Heating Unit',
      quantity: 1,
      unit: 'Unit',
      origin: 'Main Supply Hub Svalbard',
      destination: 'Camp B - North Ridge',
      assigned_team_id: INITIAL_TEAMS[0].id,
      priority: 'CRITICAL',
      status: 'DISPATCHED',
      eta: '30 mins',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'CRG-100',
      expedition_id: '11111111-1111-1111-1111-111111111111',
      contents: 'Ration Pack MRE (50 Boxes)',
      quantity: 50,
      unit: 'Boxes',
      origin: 'Main Supply Hub Svalbard',
      destination: 'Adventdalen Radar Station',
      assigned_team_id: INITIAL_TEAMS[3].id,
      priority: 'NORMAL',
      status: 'DELIVERED',
      eta: 'Arrived',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  // Active Cargo vs Delivered History (Section 25)
  const activeCargoList = cargoList.filter((c) => c.status !== 'DELIVERED');
  const deliveredCargoList = cargoList.filter((c) => c.status === 'DELIVERED');

  // Derived Resource Shortages (Section 17)
  const autoShortages = resources.filter((r) => r.quantity_available <= r.critical_threshold);

  const handleApproveRequest = async (request: ResourceRequest) => {
    const targetResource = resources.find((r) => r.id === request.resource_id);
    if (!targetResource) {
      setFeedback('Error: Target resource stockpile record not found.');
      return;
    }

    // Inventory Math (Section 10)
    const check = resourceService.validateAvailability(targetResource, request.quantity_requested);
    if (!check.valid) {
      setFeedback(`❌ ASSIGNMENT DENIED: ${check.message}`);
      return;
    }

    // Available -> Reserved
    const updatedResources = resources.map((r) => {
      if (r.id === targetResource.id) {
        const newAvailable = r.quantity_available - request.quantity_requested;
        const newReserved = r.quantity_reserved + request.quantity_requested;
        return {
          ...r,
          quantity_available: newAvailable,
          quantity_reserved: newReserved,
          status: newAvailable <= r.critical_threshold ? ('CRITICAL' as const) : r.status,
        };
      }
      return r;
    });

    const updatedRequests = requests.map((req) =>
      req.id === request.id ? { ...req, status: 'APPROVED' as ResourceRequestStatus, reviewed_by: user?.full_name || 'Commander Admin' } : req
    );

    setResources(updatedResources);
    setRequests(updatedRequests);

    await resourceRequestService.updateStatus(request.id, 'APPROVED', user?.full_name || 'Commander Admin');
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Approved Field Resource Requisition',
      'ResourceRequest',
      request.id,
      `Approved request for ${request.quantity_requested} ${request.unit} of ${request.resource_name}`
    );

    setFeedback(`Approved resource request: Available stock decreased by ${request.quantity_requested} ${request.unit}, moved to reserved.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRejectRequest = async (request: ResourceRequest) => {
    const updatedRequests = requests.map((req) =>
      req.id === request.id ? { ...req, status: 'REJECTED' as ResourceRequestStatus, reviewed_by: user?.full_name || 'Commander Admin' } : req
    );
    setRequests(updatedRequests);

    await resourceRequestService.updateStatus(request.id, 'REJECTED', user?.full_name || 'Commander Admin');
    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      'Rejected Resource Request',
      'ResourceRequest',
      request.id,
      `Rejected resource request for ${request.resource_name}`
    );

    setFeedback(`Resource request for ${request.resource_name} rejected.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAdvanceCargoStatus = async (cargoId: string, nextStatus: CargoStatus) => {
    const updatedCargo = cargoList.map((c) => {
      if (c.id === cargoId) {
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCargoList(updatedCargo);

    await auditService.logAction(
      user?.full_name || 'Commander Admin',
      currentRole,
      `Updated Cargo Shipment Status to ${nextStatus}`,
      'Cargo',
      cargoId,
      `Cargo ${cargoId} transition to status ${nextStatus}`
    );

    setFeedback(`Cargo shipment ${cargoId} state updated to ${nextStatus}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1424] border border-cyan-900/60 p-5 rounded-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Boxes className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              Logistics & Cargo Control Center
            </span>
          </div>
          <h1 className="text-xl font-extrabold font-heading text-slate-100">
            EXPEDITION INVENTORY, CARGO CONVOYS & REQUISITIONS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review requisitions, manage inventory stock math, track active cargo shipments, and resolve auto-derived shortages.
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-lg border text-xs font-mono flex items-center space-x-2 ${
          feedback.includes('❌') 
            ? 'bg-red-950/80 border-red-500/80 text-red-200' 
            : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Auto-Derived Shortage Alerts Banner (Section 17) */}
      {autoShortages.length > 0 && (
        <div className="p-4 bg-amber-950/60 border border-amber-500/80 rounded-xl space-y-2 font-mono text-xs">
          <div className="flex items-center space-x-2 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>⚠️ AUTO-DERIVED RESOURCE SHORTAGE ALERTS ({autoShortages.length} STOCKPILES BELOW THRESHOLD)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {autoShortages.map((s) => (
              <div key={s.id} className="p-2.5 bg-[#060c16] rounded border border-amber-900/80 text-[11px] flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-100">{s.name}</span>
                  <div className="text-[10px] text-slate-400">{s.location_name}</div>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold">{s.quantity_available} {s.unit}</span>
                  <div className="text-[9px] text-slate-500">Threshold: {s.critical_threshold}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Resource Requisitions Table */}
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>FIELD RESOURCE REQUISITION REQUESTS ({requests.length})</span>
          </h2>
          <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">
            DATABASE WORKFLOW ENGINE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#08101d] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Resource Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Target Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">HQ Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-100">{req.resource_name}</div>
                    <div className="text-[10px] text-slate-400">ID: {req.id}</div>
                  </td>
                  <td className="px-4 py-3 text-cyan-300 font-bold">
                    {req.quantity_requested} {req.unit}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-amber-400 font-bold">{req.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {req.location_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      req.status === 'PENDING'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/60 animate-pulse'
                        : req.status === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApproveRequest(req)}
                          className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          APPROVE
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req)}
                          className="px-2.5 py-1 rounded bg-red-950 border border-red-700 hover:bg-red-900 text-red-300 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          REJECT
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Reviewed by {req.reviewed_by || 'Commander Admin'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Cargo Shipments Control Section (Section 15 & 16) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Cargo Shipments */}
        <div className="lg:col-span-8 bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-400" />
              <span>ACTIVE CARGO SHIPMENTS & CONVOYS ({activeCargoList.length})</span>
            </h2>
            <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800 font-bold">
              CARGO TRACKING
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08101d] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Cargo ID / Contents</th>
                  <th className="px-3 py-2.5">Route</th>
                  <th className="px-3 py-2.5">ETA</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Convoy Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {activeCargoList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-sky-300">{c.id}: {c.contents}</div>
                      <div className="text-[10px] text-slate-400">Qty: {c.quantity} {c.unit}</div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">
                      <div>{c.origin}</div>
                      <div className="text-[10px] text-cyan-400">&rarr; {c.destination}</div>
                    </td>
                    <td className="px-3 py-2.5 text-amber-300 font-bold">{c.eta}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'IN_TRANSIT'
                          ? 'bg-sky-950 text-sky-300 border border-sky-500/60 animate-pulse'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {c.status === 'PREPARING' && (
                        <button
                          onClick={() => handleAdvanceCargoStatus(c.id, 'DISPATCHED')}
                          className="px-2 py-0.5 rounded bg-sky-950 border border-sky-700 hover:bg-sky-900 text-sky-300 text-[10px] font-bold cursor-pointer"
                        >
                          DISPATCH &rarr;
                        </button>
                      )}
                      {c.status === 'DISPATCHED' && (
                        <button
                          onClick={() => handleAdvanceCargoStatus(c.id, 'IN_TRANSIT')}
                          className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700 hover:bg-indigo-900 text-indigo-300 text-[10px] font-bold cursor-pointer"
                        >
                          IN TRANSIT &rarr;
                        </button>
                      )}
                      {c.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleAdvanceCargoStatus(c.id, 'ARRIVED')}
                          className="px-2 py-0.5 rounded bg-amber-950 border border-amber-700 hover:bg-amber-900 text-amber-300 text-[10px] font-bold cursor-pointer"
                        >
                          ARRIVED &rarr;
                        </button>
                      )}
                      {c.status === 'ARRIVED' && (
                        <button
                          onClick={() => handleAdvanceCargoStatus(c.id, 'DELIVERED')}
                          className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold cursor-pointer"
                        >
                          DELIVERED ✓
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivered Cargo History (Section 25) */}
        <div className="lg:col-span-4 bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-3 font-sans">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-xs font-mono font-bold text-emerald-400">
            <History className="w-4 h-4" />
            <span>DELIVERED CARGO HISTORY ({deliveredCargoList.length})</span>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto font-mono text-xs">
            {deliveredCargoList.map((c) => (
              <div key={c.id} className="p-3 bg-[#060c16] rounded-lg border border-slate-800/80 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-200">{c.id}: {c.contents}</span>
                  <span className="text-emerald-400 text-[10px] font-bold">✓ DELIVERED</span>
                </div>
                <div className="text-[10px] text-slate-400">Destination: {c.destination}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Inventory Stockpiles Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
          <Boxes className="w-4 h-4 text-cyan-400" />
          <span>EXPEDITION INVENTORY STOCKPILES ({resources.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <div key={res.id} className="bg-[#0b1320] border border-slate-800 rounded-xl p-5 space-y-4 font-sans">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{res.category}</span>
                  <h3 className="text-base font-bold font-heading text-slate-100 mt-0.5">{res.name}</h3>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  res.status === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border border-red-500/80 animate-pulse'
                    : res.status === 'LOW'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {res.status}
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Available Stock:</span>
                  <span className="text-sm font-bold text-cyan-300">{res.quantity_available} {res.unit}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Reserved / In Transit:</span>
                  <span>{res.quantity_reserved} / {res.quantity_in_transit} {res.unit}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[10px]">
                  <span>Critical Threshold:</span>
                  <span className="text-amber-400">{res.critical_threshold} {res.unit}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{res.location_name}</span>
                <button
                  onClick={() => setSelectedResource(res)}
                  className="px-2.5 py-1 bg-cyan-950 border border-cyan-800 hover:border-cyan-400 text-cyan-300 rounded text-xs font-mono cursor-pointer"
                >
                  MANAGE STOCK &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manage Resource Modal */}
      {selectedResource && (
        <ManageResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onResourceUpdated={(updated) => {
            setResources((prev) => prev.map((r) => r.id === updated.id ? updated : r));
          }}
        />
      )}
    </div>
  );
};
