import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Store, Key, AlertCircle, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [pendingCerts, setPendingCerts] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await api.get('/users/stats');
                const requestsRes = await api.get('/shop-requests');
                const certsRes = await api.get('/certifications/admin/all');

                setStats(statsRes.data);
                setPendingRequests(requestsRes.data.filter(r => r.status === 'pending'));
                setPendingCerts(certsRes.data.filter(r => r.requestStatus === 'pending'));
            } catch (err) {
                console.error(err);
            }
        };
        fetchDashboardData();
    }, []);

    const cards = [
        { label: 'Total Users', value: stats?.total || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Distributors', value: stats?.distributor || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Shops', value: stats?.shop || 0, icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Technicians', value: stats?.technician || 0, icon: Key, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-slate-500">Platform overview and statistics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className={`${card.bg} p-3 rounded-xl`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Requests Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Pending Shop Requests</h2>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        {pendingRequests.length} Pending
                    </span>
                </div>
                <div className="divide-y divide-slate-100">
                    {pendingRequests.length > 0 ? (
                        pendingRequests.slice(0, 5).map((req) => (
                            <div key={req._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-900">{req.shopName}</p>
                                    <p className="text-sm text-slate-500">{req.email} • {req.country}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg">View Details</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-400">
                            <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
                            <p>No pending requests at the moment</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pending Certification Requests Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Pending Certification Requests</h2>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {pendingCerts.length} Pending
                    </span>
                </div>
                <div className="divide-y divide-slate-100">
                    {pendingCerts.length > 0 ? (
                        pendingCerts.slice(0, 5).map((cert) => (
                            <div key={cert._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{cert.shopName}</p>
                                        <p className="text-sm text-slate-500">
                                            {cert.shopCity} • {cert.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg">View Details</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-400">
                            <ShieldCheck size={40} className="mx-auto mb-4 opacity-20" />
                            <p>No pending certifications at the moment</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
