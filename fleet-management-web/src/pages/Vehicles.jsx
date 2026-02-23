import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Truck,
    ChevronRight,
    ExternalLink,
    Edit2,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import { useGetVehiclesQuery, useAddVehicleMutation } from '../redux/api/fleetApi';

const VehicleStatus = ({ status }) => {
    const configs = {
        Active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        Maintenance: 'bg-amber-50 text-amber-600 border-amber-100',
        In_Trip: 'bg-blue-50 text-blue-600 border-blue-100',
        Retired: 'bg-slate-50 text-slate-500 border-slate-100'
    };
    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border",
            configs[status] || configs.Active
        )}>
            {status.replace('_', ' ')}
        </span>
    );
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Vehicles = () => {
    const { data: vehicles, isLoading } = useGetVehiclesQuery();
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-64 bg-slate-100 rounded-[2rem]"></div>
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fleet Vehicles</h1>
                    <p className="text-slate-500 font-medium">Manage and track your primary transit assets.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-500/20 hover:bg-brand-600 hover:-translate-y-0.5 transition-all">
                    <Plus size={18} />
                    Add New Vehicle
                </button>
            </div>

            <div className="glass-card rounded-[2rem] border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by model, plate, or driver..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 border border-slate-100 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                            <Filter size={20} />
                        </button>
                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                        <p className="text-sm font-bold text-slate-500">Showing {vehicles?.length || 0} Assets</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Driver</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Odometer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Efficiency</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(vehicles || [
                                { model: 'Volvo FH16', plate: 'BC-4029', status: 'In_Trip', driver: 'Marco Rossi', odometer: '124,500 km', env: 'Euro 6' },
                                { model: 'Scania R500', plate: 'TX-9011', status: 'Maintenance', driver: 'Elena Smith', odometer: '89,230 km', env: 'Euro 6' },
                                { model: 'Mercedes Actros', plate: 'LM-2283', status: 'Active', driver: 'David Berg', odometer: '45,000 km', env: 'Euro 6' },
                                { model: 'MAN TGX', plate: 'XY-4822', status: 'Active', driver: 'Sarah Connor', odometer: '15,400 km', env: 'Euro 6' },
                            ]).map((vehicle, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-500 group-hover:border-brand-100 transition-all shadow-sm">
                                                <Truck size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{vehicle.model}</p>
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                                    {vehicle.plate} • <span className="text-emerald-600 uppercase font-bold tracking-tighter text-[10px]">{vehicle.env}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <VehicleStatus status={vehicle.status} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                                {vehicle.driver?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{vehicle.driver}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-slate-700">{vehicle.odometer}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600">8.2L</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all" title="View Details">
                                                <ExternalLink size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page 1 of 1</p>
                    <div className="flex gap-2">
                        <button disabled className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 bg-white disabled:opacity-50">Previous</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Hint Card */}
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-amber-900 mb-1">Maintenance Overdue</h4>
                    <p className="text-sm text-amber-700 leading-relaxed">Two vehicles are nearing their scheduled maintenance interval. Consider grounding them for service to avoid performance degradation.</p>
                </div>
            </div>
        </div>
    );
};

export default Vehicles;
