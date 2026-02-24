import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    Users,
    MapPin,
    Wrench,
    Fuel,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    User,
    BarChart3,
    Navigation
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SidebarLink = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
            active
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        )}
    >
        <Icon size={20} className={cn("transition-colors", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
        <span className="font-medium">{label}</span>
    </Link>
);

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Close sidebar on navigation on mobile
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const menuItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/tracking', icon: Navigation, label: 'Live Tracking' },
        { to: '/vehicles', icon: Truck, label: 'Vehicles' },
        { to: '/drivers', icon: Users, label: 'Drivers' },
        { to: '/trips', icon: MapPin, label: 'Trips' },
        { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
        { to: '/fuel-logs', icon: Fuel, label: 'Fuel Logs' },
        { to: '/reports', icon: BarChart3, label: 'Reports' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 overflow-y-auto",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                            <Truck size={24} />
                        </div>
                        {isSidebarOpen && <span className="text-xl font-bold tracking-tight text-slate-900">FleetPro</span>}
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {menuItems.map((item) => (
                            <SidebarLink
                                key={item.to}
                                {...item}
                                active={location.pathname === item.to}
                            />
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                        >
                            <LogOut size={20} />
                            {isSidebarOpen && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search vehicles, drivers..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-all">
                            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                                <User size={20} />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900 leading-tight">Admin User</p>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Fleet Manager</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Confirm Logout"
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <LogOut size={32} />
                    </div>
                    <p className="text-slate-600 font-medium text-lg mb-8">
                        Are you sure you want to log out? <br />
                        <span className="text-slate-400 text-sm">You will need to sign in again to access your dashboard.</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="py-4 bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all"
                        >
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MainLayout;
