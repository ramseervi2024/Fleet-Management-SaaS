import React, { useState, useMemo } from 'react';
import {
    Navigation,
    Search,
    Filter,
    Clock,
    Flag,
    Zap,
    ChevronRight,
    Phone,
    MessageSquare,
    TrendingUp,
    MapPin,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import { useGetTripsQuery } from '../redux/api/fleetApi';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Tracking = () => {
    const { data: trips, isLoading } = useGetTripsQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrip, setSelectedTrip] = useState(null);

    const activeTrips = useMemo(() => {
        return trips?.filter(t => t.status === 'in-progress') || [];
    }, [trips]);

    const filteredTrips = activeTrips.filter(t => {
        const driverName = typeof t.driver === 'object' ? t.driver.name : t.driver;
        const vehicle = typeof t.vehicle === 'object' ? t.vehicle.registrationNumber : t.vehicle;
        return (
            driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.destination?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.destination?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const currentTrip = selectedTrip || filteredTrips[0];

    const googleMapsEmbedUrl = useMemo(() => {
        if (!currentTrip) return '';
        const location = currentTrip.currentLocation?.lat && currentTrip.currentLocation?.lng
            ? `${currentTrip.currentLocation.lat},${currentTrip.currentLocation.lng}`
            : currentTrip.currentLocation?.address || currentTrip.destination?.address || currentTrip.destination;
        return `https://www.google.com/maps?q=${encodeURIComponent(location)}&t=k&z=15&output=embed`;
    }, [currentTrip]);

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-140px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw size={48} className="text-brand-500 animate-spin" />
                    <p className="text-slate-500 font-bold">Initializing Live Telemetry...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] -mt-4 -mx-4 lg:-mx-8 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar: Active Mission List */}
            <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col h-full lg:h-auto">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Live Tracking</h1>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            {activeTrips.length} Active
                        </span>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search active missions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                            <div
                                key={trip._id}
                                onClick={() => setSelectedTrip(trip)}
                                className={cn(
                                    "p-4 rounded-2xl border transition-all cursor-pointer group",
                                    currentTrip?._id === trip._id
                                        ? "bg-brand-50 border-brand-200 shadow-md shadow-brand-500/5 scale-[1.02]"
                                        : "bg-white border-slate-100 hover:bg-slate-50"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all",
                                            currentTrip?._id === trip._id ? "bg-brand-500" : "bg-slate-200 text-slate-400"
                                        )}>
                                            <Navigation size={18} className={currentTrip?._id === trip._id ? "animate-pulse" : ""} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Driver</p>
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[140px]">
                                                {typeof trip.driver === 'object' ? trip.driver.name : trip.driver}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Speed</p>
                                        <p className="text-sm font-bold text-brand-600">84 km/h</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                        <p className="text-[11px] font-medium text-slate-500 truncate">{trip.origin?.address || trip.from || 'Warehouse A'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <p className="text-[11px] font-bold text-slate-700 truncate">{trip.destination?.address || trip.to || 'City Port'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100/50">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> ETA: 2h 45m
                                    </span>
                                    <span className="text-emerald-500 font-extrabold">65% Process</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                <Search size={24} />
                            </div>
                            <p className="text-slate-500 font-bold text-sm">No Missions Found</p>
                            <p className="text-slate-400 text-xs mt-1">Try adjusting your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area: Map & Analytics */}
            <div className="flex-1 relative flex flex-col bg-slate-100 overflow-hidden">
                {/* Map Wrapper */}
                <div className="flex-1 relative">
                    {currentTrip ? (
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={googleMapsEmbedUrl}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200">
                            <MapPin size={64} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold">Select a mission to track live telemetry</p>
                        </div>
                    )}

                    {/* HUD: Top Center Info */}
                    {currentTrip && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
                            <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl shadow-slate-900/10 border border-white/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 animate-pulse">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-extrabold text-slate-900">
                                            {typeof currentTrip.vehicle === 'object' ? currentTrip.vehicle.registrationNumber : currentTrip.vehicle}
                                        </h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                                            En route to {currentTrip.destination?.address || currentTrip.destination}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 pr-4">
                                    <div className="text-right border-r border-slate-200 pr-6">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temperature</p>
                                        <p className="text-sm font-extrabold text-slate-900 leading-none mt-1">-4.2°C <span className="text-emerald-500 text-[10px] ml-1">Optimal</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fuel</p>
                                        <p className="text-sm font-extrabold text-slate-900 leading-none mt-1">72% <span className="text-slate-400 text-[10px] ml-1">840km left</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HUD: Left Telemetry */}
                    {currentTrip && (
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                            {[
                                { label: 'Speed', value: '84 km/h', icon: Navigation, color: 'text-brand-500 bg-brand-50' },
                                { label: 'Altitude', value: '240m', icon: TrendingUp, color: 'text-indigo-500 bg-indigo-50' },
                                { label: 'Signal', value: '4G LTE', icon: Zap, color: 'text-emerald-500 bg-emerald-50' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 min-w-[120px] transition-transform hover:scale-105 cursor-pointer">
                                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-2", stat.color)}>
                                        <stat.icon size={16} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-sm font-extrabold text-slate-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Control Bar */}
                {currentTrip && (
                    <div className="p-6 bg-white border-t border-slate-200">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Driver Profile</p>
                                        <p className="text-sm font-bold text-slate-900 leading-none">{typeof currentTrip.driver === 'object' ? currentTrip.driver.name : currentTrip.driver}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-2 h-2 rounded-full bg-amber-400"></div>)}
                                            <span className="text-[10px] font-bold text-slate-500 ml-1">4.9/5</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-slate-100"></div>
                                <div className="flex items-center gap-4">
                                    <button className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm">
                                        <Phone size={20} />
                                    </button>
                                    <button className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-100 transition-all shadow-sm">
                                        <MessageSquare size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 w-full max-w-lg">
                                <div className="flex justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                                    <span>Route Progress</span>
                                    <span className="text-slate-900">340 km / 520 km</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                    <div className="h-full bg-brand-500 rounded-full relative" style={{ width: '65%' }}>
                                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 skew-x-12 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-[10px] font-bold text-slate-500">{currentTrip.origin?.address || currentTrip.origin}</p>
                                    <p className="text-[10px] font-bold text-slate-900">{currentTrip.destination?.address || currentTrip.destination}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center gap-1 px-4 py-2 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 animate-pulse cursor-pointer">
                                    <AlertTriangle size={18} />
                                    <span className="text-[10px] font-bold uppercase">Incident Alert</span>
                                </div>
                                <button className="px-6 py-3 bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all flex items-center gap-2">
                                    Generate Log
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const User = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default Tracking;
