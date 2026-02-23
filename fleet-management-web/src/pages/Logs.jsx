import React, { useState } from 'react';
import {
    MapPin,
    Wrench,
    Fuel,
    Plus,
    Search,
    ChevronRight,
    Clock,
    Navigation,
    Droplets,
    Calendar
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';
import {
    useGetTripsQuery,
    useAddTripMutation,
    useGetMaintenanceQuery,
    useAddMaintenanceMutation,
    useGetFuelLogsQuery,
    useAddFuelLogMutation,
    useGetVehiclesQuery,
    useGetDriversQuery
} from '../redux/api/fleetApi';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
            active
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
        )}
    >
        <Icon size={18} />
        {label}
    </button>
);

const Logs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sync tab with URL path
    const getTabFromPath = () => {
        const path = location.pathname;
        if (path.includes('maintenance')) return 'maintenance';
        if (path.includes('fuel-logs')) return 'fuel';
        return 'trips'; // default
    };

    const activeTab = getTabFromPath();

    // Mutation Hooks
    const [addTrip, { isLoading: isAddingTrip }] = useAddTripMutation();
    const [addMaintenance, { isLoading: isAddingMaint }] = useAddMaintenanceMutation();
    const [addFuelLog, { isLoading: isAddingFuel }] = useAddFuelLogMutation();

    // Reference Data
    const { data: vehicles } = useGetVehiclesQuery();
    const { data: drivers } = useGetDriversQuery();

    const [formData, setFormData] = useState({
        // Trip
        vehicle: '',
        driver: '',
        startLocation: '',
        endLocation: '',
        distance: '',
        // Maintenance
        type: 'Routine Check',
        cost: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        // Fuel
        quantity: '',
        pricePerUnit: '',
        totalCost: '',
        station: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === 'trips') {
                await addTrip({
                    vehicle: formData.vehicle,
                    driver: formData.driver,
                    startLocation: formData.startLocation,
                    endLocation: formData.endLocation,
                    distance: Number(formData.distance)
                }).unwrap();
            } else if (activeTab === 'maintenance') {
                await addMaintenance({
                    vehicle: formData.vehicle,
                    type: formData.type,
                    cost: Number(formData.cost),
                    scheduledDate: formData.scheduledDate
                }).unwrap();
            } else {
                await addFuelLog({
                    vehicle: formData.vehicle,
                    driver: formData.driver,
                    quantity: Number(formData.quantity),
                    totalCost: Number(formData.totalCost),
                    station: formData.station
                }).unwrap();
            }
            setIsModalOpen(false);
            setFormData({ vehicle: '', driver: '', startLocation: '', endLocation: '', distance: '', type: 'Routine Check', cost: '', scheduledDate: new Date().toISOString().split('T')[0], quantity: '', pricePerUnit: '', totalCost: '', station: '' });
        } catch (err) {
            alert(err.data?.message || 'Action failed');
        }
    };

    const handleTabChange = (tab) => {
        const pathMap = {
            trips: '/trips',
            maintenance: '/maintenance',
            fuel: '/fuel-logs'
        };
        navigate(pathMap[tab]);
    };

    const { data: trips, isLoading: tripsLoading } = useGetTripsQuery();
    const { data: maintenance, isLoading: maintenanceLoading } = useGetMaintenanceQuery();
    const { data: fuelLogs, isLoading: fuelLoading } = useGetFuelLogsQuery();

    const isLoading = tripsLoading || maintenanceLoading || fuelLoading;

    if (isLoading) {
        return <div className="space-y-6 animate-pulse">
            <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3].map(i => <div key={i} className="h-12 w-32 bg-slate-200 rounded-2xl shrink-0"></div>)}
            </div>
            <div className="h-96 bg-slate-100 rounded-[2rem]"></div>
        </div>;
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Operations Log</h1>
                    <p className="text-slate-500 font-medium">Historical data and real-time tracking of fleet activities.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all"
                >
                    <Plus size={18} />
                    New {activeTab === 'fuel' ? 'Fuel Log' : activeTab.slice(0, -1)} Entry
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`New ${activeTab === 'fuel' ? 'Fuel Log' : activeTab.slice(0, -1)} Details`}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle</label>
                            <select
                                required
                                value={formData.vehicle}
                                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                            >
                                <option value="">Select Vehicle</option>
                                {vehicles?.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} ({v.model})</option>)}
                            </select>
                        </div>
                        {activeTab !== 'maintenance' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Driver</label>
                                <select
                                    required
                                    value={formData.driver}
                                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                >
                                    <option value="">Select Driver</option>
                                    {drivers?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    {activeTab === 'trips' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">From</label>
                                    <input
                                        type="text" required
                                        value={formData.startLocation}
                                        onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                        placeholder="Origin City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">To</label>
                                    <input
                                        type="text" required
                                        value={formData.endLocation}
                                        onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                        placeholder="Destination City"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Distance (km)</label>
                                <input
                                    type="number" required
                                    value={formData.distance}
                                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                    placeholder="450"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'maintenance' && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Maintenance Type</label>
                                <input
                                    type="text" required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                    placeholder="Engine Service"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cost ($)</label>
                                    <input
                                        type="number" required
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                        placeholder="250"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                                    <input
                                        type="date" required
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'fuel' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity (Liters)</label>
                                    <input
                                        type="number" required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                        placeholder="50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Total Cost ($)</label>
                                    <input
                                        type="number" required
                                        value={formData.totalCost}
                                        onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                        placeholder="75"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Fuel Station</label>
                                <input
                                    type="text" required
                                    value={formData.station}
                                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                    placeholder="Shell Express"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isAddingTrip || isAddingMaint || isAddingFuel}
                        className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                    >
                        {(isAddingTrip || isAddingMaint || isAddingFuel) ? 'Processing...' : `Save ${activeTab === 'fuel' ? 'Fuel Log' : activeTab.slice(0, -1)}`}
                    </button>
                </form>
            </Modal>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                <TabButton active={activeTab === 'trips'} onClick={() => handleTabChange('trips')} icon={MapPin} label="Trips" />
                <TabButton active={activeTab === 'maintenance'} onClick={() => handleTabChange('maintenance')} icon={Wrench} label="Maintenance" />
                <TabButton active={activeTab === 'fuel'} onClick={() => handleTabChange('fuel')} icon={Fuel} label="Fuel Logs" />
            </div>

            <div className="glass-card rounded-[2rem] border-slate-100 overflow-hidden min-h-[500px]">
                {activeTab === 'trips' && (
                    <div className="divide-y divide-slate-100">
                        {(trips || [
                            { from: 'Rome, IT', to: 'Milan, IT', status: 'In Transit', driver: 'Marco Rossi', vehicle: 'Volvo FH16', time: 'Started 2h ago', distance: '580 km' },
                            { from: 'Paris, FR', to: 'Lyon, FR', status: 'Completed', driver: 'Elena Smith', vehicle: 'Scania R500', time: 'Today, 14:20', distance: '460 km' },
                            { from: 'Berlin, DE', to: 'Munich, DE', status: 'Completed', driver: 'David Berg', vehicle: 'Mercedes Actros', time: 'Yesterday', distance: '590 km' },
                        ]).map((trip, i) => (
                            <div key={i} className="p-6 hover:bg-slate-50 transition-all cursor-pointer group">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                                            <Navigation size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-900">{trip.from}</span>
                                                <ChevronRight size={14} className="text-slate-400" />
                                                <span className="text-sm font-bold text-slate-900">{trip.to}</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 mt-1">{trip.vehicle} • {trip.driver}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 px-6 lg:border-x border-slate-100">
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-1 rounded-lg",
                                                trip.status === 'In Transit' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                            )}>{trip.status}</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Distance</p>
                                            <span className="text-xs font-bold text-slate-900">{trip.distance}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between lg:justify-end gap-4 min-w-[120px]">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={14} />
                                            <span className="text-xs font-semibold">{trip.time}</span>
                                        </div>
                                        <button className="p-2 border border-slate-100 rounded-xl group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div className="divide-y divide-slate-100">
                        {(maintenance || [
                            { type: 'Engine Service', vehicle: 'Van VN-08', provider: 'AutoTech Labs', cost: '$450.00', status: 'Completed', date: 'Feb 20, 2026' },
                            { type: 'Tire Replacement', vehicle: 'Truck VH-402', provider: 'FleetFix Pro', cost: '$1,200.00', status: 'In Progress', date: 'Feb 22, 2026' },
                        ]).map((item, i) => (
                            <div key={i} className="p-6 hover:bg-slate-50 transition-all flex items-center gap-6">
                                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                                    <Wrench size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900">{item.type}</h4>
                                    <p className="text-xs font-medium text-slate-500">{item.vehicle} • {item.provider}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">{item.cost}</p>
                                    <p className="text-xs font-medium text-slate-400">{item.date}</p>
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold border shrink-0",
                                    item.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                )}>{item.status}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'fuel' && (
                    <div className="divide-y divide-slate-100">
                        {(fuelLogs || [
                            { vehicle: 'Volvo FH16', amount: '450 L', cost: '$680.00', station: 'Shell Global', date: 'Today, 09:12' },
                            { vehicle: 'Scania R500', amount: '320 L', cost: '$490.00', station: 'BP Express', date: 'Yesterday, 18:45' },
                        ]).map((log, i) => (
                            <div key={i} className="p-6 hover:bg-slate-50 transition-all flex items-center gap-6">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                                    <Droplets size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900">{log.vehicle}</h4>
                                    <p className="text-xs font-medium text-slate-500">{log.station}</p>
                                </div>
                                <div className="text-center px-8 border-x border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Qty</p>
                                    <span className="text-xs font-bold text-slate-900">{log.amount}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">{log.cost}</p>
                                    <p className="text-xs font-medium text-slate-400">{log.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Logs;
