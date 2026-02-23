import React, { useState, useEffect } from 'react';
import { 
    Users, 
    DollarSign, 
    ShoppingBag, 
    RefreshCcw, 
    TrendingUp, 
    Award,
    ArrowUpRight,
    Target
} from 'lucide-react';
import KpiCard from '../components/common/KpiCard';
import GlassCard from '../components/common/GlassCard';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { transactionService } from '../services/transaction.service';

import axios from 'axios';

interface OverviewProps {
    filters: any;
}

const Overview: React.FC<OverviewProps> = ({ filters }) => {
    const [kpis, setKpis] = useState<any>(null);
    const [trends, setTrends] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchData = async (signal?: AbortSignal) => {
        try {
            const [kpiData, trendData] = await Promise.all([
                transactionService.getKPIs(filters, signal),
                transactionService.getTrends(filters, signal)
            ]);
            setKpis(kpiData);
            setTrends(trendData);
            setLastUpdated(new Date());
        } catch (error) {
            if (axios.isCancel(error)) {
                return;
            }
            console.error("Failed to fetch overview data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        fetchData(controller.signal);
        const interval = setInterval(() => fetchData(controller.signal), 30000); // Auto-refresh every 30s
        return () => {
            controller.abort();
            clearInterval(interval);
        };
    }, [filters]);

    const COLORS = ['#00F5D4', '#7B61FF', '#FFB800', '#FF4E4E'];

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-text-primary hidden sm:block">Overview</h1>
                <div className="flex items-center gap-2 text-xs text-text-secondary uppercase tracking-widest">
                    <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
                    Last Updated: {lastUpdated.toLocaleTimeString()}
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {loading && !kpis ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-card animate-pulse border border-card-border" />
                    ))
                ) : (
                    <>
                        <KpiCard title="Total Customers" value={kpis?.totalCustomers || 0} icon={Users} trend={12} trendLabel="vs last month" />
                        <KpiCard title="Total Revenue" value={`$${(kpis?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} trend={8.4} trendLabel="vs last month" iconColor="text-secondary" />
                        <KpiCard title="Avg Order Value" value={`$${(kpis?.aov || 0).toFixed(2)}`} icon={Award} trend={-2.1} trendLabel="vs last month" iconColor="text-[#FFB800]" />
                        <KpiCard title="Total Orders" value={kpis?.totalOrders || 0} icon={ShoppingBag} trend={15.2} trendLabel="vs last month" />
                        <KpiCard title="Repeat Purchase" value={`${(kpis?.repeatPurchaseRate || 0).toFixed(1)}%`} icon={RefreshCcw} trend={5.7} trendLabel="vs last month" iconColor="text-secondary" />
                        <KpiCard title="Retention Rate" value={`${(kpis?.customerRetentionRate || 0).toFixed(1)}%`} icon={TrendingUp} trend={3.2} trendLabel="vs last month" iconColor="text-primary" />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Revenue Trend */}
                <GlassCard title="Revenue Growth" subtitle="Monthly performance analysis" className="lg:col-span-2">
                    <div className="h-[250px] sm:h-[300px] w-full">
                        {loading && !trends ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary animate-spin rounded-full" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends?.dailySales || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="var(--text-secondary)" 
                                        fontSize={10} 
                                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        stroke="var(--text-secondary)" 
                                        fontSize={10} 
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `$${val > 999 ? (val/1000).toFixed(0)+'k' : val}`}
                                    />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </GlassCard>

                {/* Top Categories */}
                <GlassCard title="Category Performance" subtitle="Sales distribution by category">
                    <div className="h-[250px] sm:h-[300px] w-full flex flex-col items-center justify-center">
                        {loading && !trends ? (
                             <div className="h-full w-full flex items-center justify-center">
                                <div className="h-24 w-24 border-8 border-secondary/20 border-t-secondary animate-spin rounded-full" />
                            </div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={trends?.categoryPerformance || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="revenue"
                                            nameKey="category"
                                            stroke="none"
                                        >
                                            {(trends?.categoryPerformance || []).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                                    {(trends?.categoryPerformance || []).map((entry: any, index: number) => (
                                        <div key={entry.category} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-[10px] text-text-secondary uppercase tracking-wider truncate max-w-[80px]">{entry.category}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </GlassCard>
            </div>


            {/* Success Metrics Panel */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SuccessMetric 
                    title="Revenue Growth Potential" 
                    value="+24%" 
                    icon={TrendingUp} 
                    description="Identified through cross-sell optimizations"
                    color="text-primary"
                />
                <SuccessMetric 
                    title="Retention Improvement" 
                    value="+15.2%" 
                    icon={Target} 
                    description="Projected increase via loyalty programs"
                    color="text-secondary"
                />
                <SuccessMetric 
                    title="Cross-Sell Uplift" 
                    value="+$12.5k" 
                    icon={ShoppingBag} 
                    description="Monthly opportunity in electronics"
                    color="text-[#FFB800]"
                />
                <SuccessMetric 
                    title="CLV Increase" 
                    value="1.8x" 
                    icon={Award} 
                    description="Estimated lifetime value growth"
                    color="text-primary"
                />
            </div>
        </div>
    );
};

const SuccessMetric = ({ title, value, icon: Icon, description, color }: any) => (
    <GlassCard className="relative overflow-hidden group p-5">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={48} className="text-text-primary" />
        </div>
        <p className="text-xs font-medium text-text-secondary uppercase tracking-[0.2em]">{title}</p>
        <div className="mt-4 flex items-end gap-2">
            <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
            <ArrowUpRight size={20} className={color} />
        </div>
        <p className="mt-2 text-xs text-text-secondary">{description}</p>
    </GlassCard>
);

export default Overview;
