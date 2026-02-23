import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Crown, 
    Zap, 
    AlertTriangle, 
    UserPlus,
    BarChart2,
    PieChart as PieChartIcon
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { 
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    PieChart,
    Pie,
    CartesianGrid
} from 'recharts';
import { transactionService } from '../services/transaction.service';

import axios from 'axios';

interface CustomerIntelligenceProps {
    filters: any;
}

const CustomerIntelligence: React.FC<CustomerIntelligenceProps> = ({ filters }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const res = await transactionService.getSegments(filters, controller.signal);
                setData(res);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error("Failed to fetch customer data", error);
            } finally {
                setLoading(false);
            }
        };
        setLoading(true);
        fetchData();
        return () => controller.abort();
    }, [filters]);

    const segmentData = [
        { name: 'High Value', value: data?.segments?.highValue || 0, icon: Crown, color: '#00F5D4' },
        { name: 'Frequent', value: data?.segments?.frequent || 0, icon: Zap, color: '#7B61FF' },
        { name: 'At Risk', value: data?.segments?.atRisk || 0, icon: AlertTriangle, color: '#FF4E4E' },
        { name: 'New', value: data?.segments?.new || 0, icon: UserPlus, color: '#FFB800' },
        { name: 'Regular', value: data?.segments?.regular || 0, icon: Users, color: '#94A3B8' },
    ];

    const COLORS = ['#00F5D4', '#7B61FF', '#FFB800', '#FF4E4E', '#94A3B8'];

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-text-primary hidden sm:block">Customer Intelligence</h1>

            {/* Segment Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {loading && !data ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-card animate-pulse border border-card-border" />
                    ))
                ) : (
                    segmentData.map((seg) => (
                        <GlassCard key={seg.name} className="p-4 text-center group flex flex-col items-center justify-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 dark:bg-white/5 transition-transform group-hover:scale-110" style={{ color: seg.color }}>
                                <seg.icon size={24} />
                            </div>
                            <p className="text-xs font-medium text-text-secondary uppercase tracking-widest">{seg.name}</p>
                            <h3 className="mt-1 text-2xl font-bold text-text-primary">{seg.value}</h3>
                        </GlassCard>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Segment Distribution */}
                <GlassCard title="Segment Distribution" subtitle="Customer population by cluster">
                    <div className="h-[300px] w-full">
                        {loading && !data ? (
                             <div className="h-full w-full flex items-center justify-center">
                                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary animate-spin rounded-full" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={segmentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {segmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </GlassCard>

                {/* Engagement Clusters */}
                <GlassCard title="Gender Distribution" subtitle="Customer demographics by gender">
                    <div className="h-[300px] w-full">
                         {loading && !data ? (
                             <div className="h-full w-full flex items-center justify-center">
                                <div className="h-12 w-12 border-4 border-secondary/20 border-t-secondary animate-spin rounded-full" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Object.entries(data?.demographics?.gender || {}).map(([name, value]) => ({ name, value }))}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="var(--text-secondary)" 
                                        fontSize={10} 
                                        axisLine={false} 
                                        tickLine={false} 
                                    />
                                    <YAxis 
                                        stroke="var(--text-secondary)" 
                                        fontSize={10} 
                                        axisLine={false} 
                                        tickLine={false} 
                                    />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* High Value Customers Table */}
            <GlassCard title="Top High-Value Customers" subtitle="Individual performance of top tier shoppers">
                <div className="overflow-x-auto -mx-6 px-6">
                    {loading && !data ? (
                        <div className="space-y-4 p-4">
                            {Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-12 w-full bg-card animate-pulse rounded-lg border border-card-border" />
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-card-border text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                                    <th className="px-4 py-4">Customer ID</th>
                                    <th className="px-4 py-4">Total Orders</th>
                                    <th className="px-4 py-4">Total Spend</th>
                                    <th className="px-4 py-4">First Purchase</th>
                                    <th className="px-4 py-4">Last Activity</th>
                                    <th className="px-4 py-4">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-card-border">
                                {data?.highValueCustomers?.map((customer: any) => (
                                    <tr key={customer.id} className="group hover:bg-primary/5 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {customer.id.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-text-primary">{customer.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-text-secondary">{customer.count} orders</td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-semibold text-primary">${customer.totalSpend.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-text-secondary">{new Date(customer.firstDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-xs text-text-secondary">{new Date(customer.lastDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-4">
                                            <div className="h-1.5 w-24 rounded-full bg-primary/10 overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-primary to-secondary" 
                                                    style={{ width: `${Math.min(100, (customer.totalSpend / 1000) * 100)}%` }} 
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};


export default CustomerIntelligence;
