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
    MapPin,
    TrendingUp
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { useGetDriversQuery, useAddDriverMutation } from '../redux/api/fleetApi';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ExportButton from '../components/common/ExportButton';
import GuestRestrictionModal from '../components/common/GuestRestrictionModal';

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
                <span className="text-xs font-bold text-slate-400 tracking-widest">{driver.experience || 'NEW JOINER'}</span>
            </div>
        </div>

        <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <ShieldCheck size={16} />
                </div>
                <span>License: {driver.licenseNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <MapPin size={16} />
                </div>
                <span>Assigned: {driver.assignedVehicle?.registrationNumber || 'Unassigned'}</span>
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
    const [addDriver, { isLoading: isAdding }] = useAddDriverMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDriver(formData).unwrap();
            setIsModalOpen(false);
            setFormData({ name: '', email: '', phone: '', licenseNumber: '' });
            toast.success('Driver onboarded successfully!');
        } catch (err) {
            toast.error(err.data?.message || 'Failed to onboard driver');
        }
    };

    if (isLoading) {
        return <div className="space-y-6 animate-pulse">
            <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[2rem]"></div>)}
            </div>
        </div>;
    }

    const displayedDrivers = drivers || [
        { name: 'Ramesh Seervi', vehicle: 'Tata Prima', experience: '12 YRS EXP', license: 'HGV MH-12' },
        { name: 'Gaurav Sharma', vehicle: 'Mahindra Blazo', experience: '8 YRS EXP', license: 'HGV DL-04' },
        { name: 'Manjunath Swamy', vehicle: 'Ashok Leyland', experience: '10 YRS EXP', license: 'HGV KA-05' },
        { name: 'Suresh Raina', vehicle: 'BharatBenz 3523R', experience: '15 YRS EXP', license: 'HGV TN-07' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Driver Registry</h1>
                    <p className="text-slate-500 font-medium">Manage your elite team of transit professionals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportButton
                        data={drivers || []}
                        filename="Fleet_Drivers_Roster"
                        columns={[
                            { header: 'Name', key: 'name' },
                            { header: 'Email', key: 'email' },
                            { header: 'Phone', key: 'phone' },
                            { header: 'License', key: 'licenseNumber' },
                            { header: 'Type', key: 'licenseType' }
                        ]}
                    />
                    <button
                        onClick={() => {
                            if (localStorage.getItem('token') === 'dev-bypass-token') {
                                setIsGuestModalOpen(true);
                            } else {
                                setIsModalOpen(true);
                            }
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-500/20 hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus size={18} />
                        Onboard Driver
                    </button>
                </div>
            </div>

            {/* Drivers Performance Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8 rounded-[2rem] border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Experience Distribution</h3>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Class A', count: 12 },
                                { name: 'Class B', count: 8 },
                                { name: 'Class C', count: 5 },
                                { name: 'Class D', count: 3 },
                                { name: 'Class E', count: 2 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40}>
                                    {[0, 1, 2, 3, 4].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2rem] border-slate-100 flex flex-col justify-center">
                    <div className="text-center">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Driver Safety Score</p>
                        <h2 className="text-5xl font-black text-emerald-500">98.4</h2>
                        <div className="flex items-center justify-center gap-1 mt-2 text-emerald-600 font-bold text-sm">
                            <TrendingUp size={16} />
                            <span>+1.2% this month</span>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Onboard New Driver">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                            placeholder="e.g. Ramesh Seervi"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                placeholder="ramesh@fleetpro.in"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">License Number</label>
                            <input
                                type="text"
                                required
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                                placeholder="MH-12-20150012345"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">License Type</label>
                            <select
                                required
                                value={formData.licenseType}
                                onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                            >
                                <option value="A">Class A</option>
                                <option value="B">Class B</option>
                                <option value="C">Class C</option>
                                <option value="D">Class D</option>
                                <option value="E">Class E</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">License Expiry Date</label>
                        <input
                            type="date"
                            required
                            value={formData.licenseExpiry}
                            onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                    >
                        {isAdding ? 'Onboarding...' : 'Onboard Driver'}
                    </button>
                </form>
            </Modal>

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

            <GuestRestrictionModal
                isOpen={isGuestModalOpen}
                onClose={() => setIsGuestModalOpen(false)}
            />
        </div>
    );
};

export default Drivers;
