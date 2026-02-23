import React from 'react';
import {
    Truck,
    Users,
    MapPin,
    TrendingUp,
    AlertCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { useGetDashboardStatsQuery } from '../redux/api/fleetApi';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="glass-card p-6 rounded-3xl hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300",
                color
            )}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                    trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trendValue}
                </div>
            )}
        </div>
        <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
    </div>
);

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Dashboard = () => {
    const { data: stats, isLoading } = useGetDashboardStatsQuery();

    const chartData = [
        { name: 'Mon', trips: 4000 },
        { name: 'Tue', trips: 3000 },
        { name: 'Wed', trips: 2000 },
        { name: 'Thu', trips: 2780 },
        { name: 'Fri', trips: 1890 },
        { name: 'Sat', trips: 2390 },
        { name: 'Sun', trips: 3490 },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl"></div>)}
                </div>
                <div className="h-96 bg-slate-100 rounded-3xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fleet Intelligence</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time overview of your logistics performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Clock size={18} />
                        Past 7 Days
                    </button>
                    <button className="px-5 py-2.5 bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-500/20 hover:bg-brand-600 hover:-translate-y-0.5 transition-all">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Vehicles"
                    value={stats?.vehicles ? `${stats.vehicles.active}/${stats.vehicles.total}` : '24/30'}
                    icon={Truck}
                    trend="up"
                    trendValue="12%"
                    color="bg-brand-500 shadow-brand-500/30"
                />
                <StatCard
                    title="Available Drivers"
                    value={stats?.drivers ? `${stats.drivers.available}/${stats.drivers.total}` : '18/22'}
                    icon={Users}
                    trend="down"
                    trendValue="3%"
                    color="bg-indigo-500 shadow-indigo-500/30"
                />
                <StatCard
                    title="On-Going Trips"
                    value={stats?.trips?.active || '12'}
                    icon={MapPin}
                    trend="up"
                    trendValue="8%"
                    color="bg-emerald-500 shadow-emerald-500/30"
                />
                <StatCard
                    title="Fuel Efficiency"
                    value="8.4 km/L"
                    icon={TrendingUp}
                    trend="up"
                    trendValue="5.4%"
                    color="bg-amber-500 shadow-amber-500/30"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8 rounded-[2rem] border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">Fleet Utilization</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Daily trip volume and distance metrics</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="trips"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTrips)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border-slate-100">
                    <h3 className="text-xl font-extrabold text-slate-900 mb-6">Service Alerts</h3>
                    <div className="space-y-4">
                        {[
                            { title: 'Brake Check', subtitle: 'Truck VH-402 • High Priority', time: '2h ago', icon: AlertCircle, color: 'text-rose-500 bg-rose-50' },
                            { title: 'Tire Rotation', subtitle: 'Van VN-08 • Scheduled', time: '5h ago', icon: Wrench, color: 'text-amber-500 bg-amber-50' },
                            { title: 'Oil Change', subtitle: 'Truck VH-105 • Complete', time: '1d ago', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
                        ].map((alert, i) => {
                            const Icon = alert.icon;
                            return (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", alert.color)}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">{alert.title}</h4>
                                        <p className="text-xs text-slate-500 truncate">{alert.subtitle}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{alert.time}</span>
                                </div>
                            );
                        })}
                    </div>
                    <button className="w-full mt-6 py-3 border-2 border-slate-100 hover:border-slate-200 rounded-2xl text-slate-600 font-bold text-sm transition-all">
                        View Maintenance Log
                    </button>
                </div>
            </div>
        </div>
    );
};

const Wrench = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

export default Dashboard;
