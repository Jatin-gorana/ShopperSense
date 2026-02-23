import React, { useState, useEffect } from 'react';
import { 
    ShoppingCart, 
    Link as LinkIcon, 
    Package, 
    Share2, 
    TrendingUp,
    Zap
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { transactionService } from '../services/transaction.service';

import axios from 'axios';

interface AffinityInsightsProps {
    filters: any;
}

const AffinityInsights: React.FC<AffinityInsightsProps> = ({ filters }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const res = await transactionService.getAffinity(filters, controller.signal);
                setData(res);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error("Failed to fetch affinity data", error);
            } finally {
                setLoading(false);
            }
        };
        setLoading(true);
        fetchData();
        return () => controller.abort();
    }, [filters]);

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-text-primary hidden sm:block">Affinity Insights</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Frequently Bought Together */}
                <GlassCard title="Frequently Bought Together" subtitle="Top performing product combinations">
                    <div className="space-y-4">
                        {loading && !data ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-24 w-full bg-card animate-pulse rounded-xl border border-card-border" />
                            ))
                        ) : (
                            data?.topBundles?.map((bundle: any, index: number) => (
                                <div key={index} className="flex flex-col gap-3 rounded-xl border border-card-border bg-card/50 p-4 hover:border-primary/30 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-text-primary">{bundle.name}</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] text-text-secondary">Lift: {bundle.lift}x</span>
                                                    <span className="text-[10px] text-text-secondary">Conf: {(bundle.confidence * 100).toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">{bundle.count}</p>
                                            <p className="text-[10px] text-text-secondary">Orders</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px] text-text-secondary">
                                            <span>Affinity Strength</span>
                                            <span>{bundle.strength}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-card-border rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary" 
                                                style={{ width: `${bundle.strength}%` }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {!loading && data?.topBundles?.length === 0 && (
                            <div className="text-center py-10 text-text-secondary text-sm">No significant co-occurrences found for this filter.</div>
                        )}
                    </div>
                </GlassCard>

                {/* Category Affinity Heatmap (Dynamic) */}
                <GlassCard title="Category Relationships" subtitle="Common cross-category purchase patterns">
                    <div className="space-y-4">
                        {loading && !data ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-16 w-full bg-card animate-pulse rounded-xl border border-card-border" />
                            ))
                        ) : (
                            data?.categoryAffinity?.map((pair: any, index: number) => (
                                <div key={index} className="group relative rounded-xl border border-card-border/50 p-3 hover:bg-card/30 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-primary">{pair.catA}</span>
                                            <Share2 size={12} className="text-text-secondary" />
                                            <span className="text-xs font-semibold text-secondary">{pair.catB}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-text-secondary">{pair.count} Pairs</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-card/50 rounded-full overflow-hidden border border-card-border">
                                        <div 
                                            className="h-full bg-gradient-to-r from-primary to-secondary" 
                                            style={{ width: `${Math.min(100, (pair.count / (data?.categoryAffinity[0]?.count || 1)) * 100)}%` }} 
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                        {!loading && data?.categoryAffinity?.length === 0 && (
                            <div className="text-center py-10 text-text-secondary text-sm">No category affinities detected.</div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Bundle Suggestions (derived from data or dynamic) */}
            <GlassCard title="Bundle Opportunity Cards" subtitle="Customers who buy X often buy Y">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {loading ? (
                         Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-40 rounded-2xl bg-card animate-pulse border border-card-border" />
                        ))
                    ) : (
                        (data?.topBundles?.slice(0, 3) || []).map((rec: any, i: number) => {
                            const [itemA, itemB] = rec.name.split(' + ');
                            return (
                                <div key={i} className="rounded-2xl border border-card-border bg-gradient-to-br from-primary/5 to-transparent p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                                        <Zap size={40} className="text-primary" />
                                    </div>
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4">
                                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Bundle Opportunity</h4>
                                            <p className="text-sm font-bold text-text-primary leading-tight">
                                                Customers buying <span className="text-primary">{itemA}</span> often also buy <span className="text-secondary">{itemB}</span>
                                            </p>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-card-border/50 pt-4">
                                            <div>
                                                <p className="text-[10px] text-text-secondary uppercase tracking-wider">Frequency</p>
                                                <p className="text-xs font-bold text-text-primary">{rec.count} Times</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-text-secondary uppercase tracking-wider">Confidence</p>
                                                <p className="text-xs font-bold text-secondary">{(rec.confidence * 100).toFixed(0)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </GlassCard>
        </div>
    );
};


export default AffinityInsights;
