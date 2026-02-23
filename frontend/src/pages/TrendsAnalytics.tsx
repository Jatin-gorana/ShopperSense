import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, 
    BarChart3, 
    Calendar, 
    Zap, 
    ArrowUpRight,
    Search
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { 
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell
} from 'recharts';
import { transactionService } from '../services/transaction.service';

import axios from 'axios';

interface TrendsAnalyticsProps {
    filters: any;
}

const TrendsAnalytics: React.FC<TrendsAnalyticsProps> = ({ filters }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const res = await transactionService.getTrends(filters, controller.signal);
                setData(res);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error("Failed to fetch trends data", error);
            } finally {
                setLoading(false);
            }
        };
        setLoading(true);
        fetchData();
        return () => controller.abort();
    }, [filters]);

    const topCategory = (data?.categoryPerformance || []).sort((a: any, b: any) => b.revenue - a.revenue)[0];

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-text-primary hidden sm:block">Trends & Analytics</h1>

            {/* Trend Indicators */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {loading && !data ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-card animate-pulse border border-card-border" />
                    ))
                ) : (
                    <>
                        <TrendIndicator 
                            title="Fastest Growing Category" 
                            value={(data?.categoryPerformance || []).sort((a: any, b: any) => b.growth - a.growth)[0]?.category || 'N/A'} 
                            growth={`${(data?.categoryPerformance || []).sort((a: any, b: any) => b.growth - a.growth)[0]?.growth || 0}% Growth`} 
                            icon={TrendingUp}
                            color="text-primary"
                        />
                        <TrendIndicator 
                            title="Top Performing Region" 
                            value={(data?.locationInsights || []).sort((a: any, b: any) => b.revenue - a.revenue)[0]?.location || 'N/A'} 
                            growth={`${(data?.locationInsights || []).sort((a: any, b: any) => b.revenue - a.revenue)[0]?.growth || 0}% Monthly`} 
                            icon={Zap}
                            color="text-secondary"
                        />
                        <TrendIndicator 
                            title="Busiest Shopping Day" 
                            value={(data?.peakDays || []).sort((a: any, b: any) => b.count - a.count)[0]?.day || 'N/A'} 
                            growth="Peak Volume" 
                            icon={Calendar}
                            color="text-[#FFB800]"
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Daily Sales Performance with Moving Average */}
                <GlassCard title="Sales Trends Over Time" subtitle="Daily revenue vs 7-day moving average">
                    <div className="h-[250px] sm:h-[300px] w-full">
                        {loading && !data ? (
                             <div className="h-full w-full flex items-center justify-center">
                                <div className="h-12 w-12 border-4 border-secondary/20 border-t-secondary animate-spin rounded-full" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.dailySales || []}>
                                    <defs>
                                        <linearGradient id="colorTrends" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="var(--text-secondary)" 
                                        fontSize={10} 
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                    />
                                    <YAxis 
                                        stroke="var(--text-secondary)" 
                                        fontSize={10} 
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(1)+'k' : val}`}
                                    />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="amount" name="Daily Revenue" stroke="var(--secondary)" strokeWidth={2} fillOpacity={1} fill="url(#colorTrends)" />
                                    <Area type="monotone" dataKey="movingAverage" name="7d Moving Avg" stroke="var(--primary)" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </GlassCard>

                {/* Monthly Revenue Growth */}
                <GlassCard title="Monthly Revenue Growth" subtitle="Revenue trajectory and growth percentages">
                    <div className="h-[250px] sm:h-[300px] w-full">
                        {loading && !data ? (
                             <div className="h-full w-full flex items-center justify-center">
                                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary animate-spin rounded-full" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.monthlyTrends || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
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
                                    <Bar dataKey="revenue" name="Monthly Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Peak Shopping Hours */}
                <GlassCard title="Peak Shopping Hours" subtitle="Hourly distribution of transaction activity">
                    <div className="h-[250px] w-full mt-4">
                        {loading && !data ? (
                            <div className="h-full w-full bg-card animate-pulse rounded-xl border border-card-border" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.peakHours || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                                    <XAxis dataKey="hour" stroke="var(--text-secondary)" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-secondary)" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" name="Orders" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.1} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </GlassCard>

                {/* Category Growth Trends */}
                <GlassCard title="Category Growth Trends" subtitle="Highest revenue growth by category">
                    <div className="space-y-4">
                        {loading && !data ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-12 w-full bg-card animate-pulse rounded-xl border border-card-border" />
                            ))
                        ) : (
                            (data?.categoryPerformance || []).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5).map((cat: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-card-border bg-card/30">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${cat.growth >= 0 ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-red-500'}`} />
                                        <span className="text-sm font-medium text-text-primary">{cat.category}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-text-primary">${cat.revenue.toLocaleString()}</span>
                                        <span className={`text-xs font-bold ${cat.growth >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                            {cat.growth >= 0 ? '+' : ''}{cat.growth}%
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};


const TrendIndicator = ({ title, value, growth, icon: Icon, color }: any) => (
    <GlassCard className="relative overflow-hidden group p-5">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={40} className="text-text-primary" />
        </div>
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{title}</p>
        <h3 className="mt-2 text-xl font-bold text-text-primary truncate pr-10">{value}</h3>
        <div className="mt-2 flex items-center gap-1">
            <span className={`text-sm font-bold ${color}`}>{growth}</span>
            <ArrowUpRight size={14} className={color} />
        </div>
    </GlassCard>
);

export default TrendsAnalytics;
