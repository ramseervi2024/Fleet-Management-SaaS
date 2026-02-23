import React, { useState } from 'react';
import {
    Plus,
    Search,
    Phone,
    Mail,
    Award,
    Clock,
    MoreVertical,
    ShieldCheck,
    Star,
    MapPin
} from 'lucide-react';
import { useGetDriversQuery } from '../redux/api/fleetApi';

const DriverCard = ({ driver }) => (
    <div className="glass-card p-6 rounded-[2rem] border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
            <div className="relative">
                <div className="w-20 h-20 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-2xl font-bold text-slate-400 group-hover:text-brand-500 group-hover:scale-105 transition-all outline outline-offset-4 outline-transparent group-hover:outline-brand-200 shadow-sm border border-slate-200">
                    {driver.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white shadow-sm" title="Active">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                <MoreVertical size={20} />
            </button>
        </div>

        <div className="mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{driver.name}</h3>
            <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i <= 4 ? "currentColor" : "none"} />)}
                </div>
                <span className="text-xs font-bold text-slate-400 tracking-widest">{driver.experience || '5 YRS EXP'}</span>
            </div>
        </div>

        <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <ShieldCheck size={16} />
                </div>
                <span>License: {driver.license || 'CDL Class A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <MapPin size={16} />
                </div>
                <span>Assigned: {driver.vehicle || 'Volvo FH16'}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 font-bold text-xs transition-all border border-slate-100 group-hover:border-slate-200">
                <Phone size={14} />
                CALL
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-brand-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all">
                DETAILS
            </button>
        </div>
    </div>
);

const Drivers = () => {
    const { data: drivers, isLoading } = useGetDriversQuery();
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) {
        return <div className="space-y-6 animate-pulse">
            <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[2rem]"></div>)}
            </div>
        </div>;
    }

    const displayedDrivers = drivers || [
        { name: 'Marco Rossi', vehicle: 'Volvo FH16', experience: '8 YRS EXP', license: 'CDL Class A' },
        { name: 'Elena Smith', vehicle: 'Scania R500', experience: '6 YRS EXP', license: 'CDL Class A' },
        { name: 'David Berg', vehicle: 'Mercedes Actros', experience: '4 YRS EXP', license: 'CDL Class B' },
        { name: 'Sarah Connor', vehicle: 'MAN TGX', experience: '12 YRS EXP', license: 'CDL Class A' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Driver Registry</h1>
                    <p className="text-slate-500 font-medium">Manage your elite team of transit professionals.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-500/20 hover:bg-brand-600 hover:-translate-y-0.5 transition-all">
                    <Plus size={18} />
                    Onboard Driver
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, vehicle, or license..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-4 px-4 h-full">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active: 18</span>
                    </div>
                    <div className="w-px h-6 bg-slate-100"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Offline: 4</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                {displayedDrivers.map((driver, i) => (
                    <DriverCard key={i} driver={driver} />
                ))}
            </div>
        </div>
    );
};

export default Drivers;
