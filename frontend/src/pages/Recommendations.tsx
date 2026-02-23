import React, { useState, useEffect } from 'react';
import { 
    Sparkles, 
    ArrowRight, 
    ShoppingCart, 
    Star, 
    Zap,
    Gift
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { transactionService } from '../services/transaction.service';

import axios from 'axios';

interface RecommendationsProps {
    filters: any;
}

const Recommendations: React.FC<RecommendationsProps> = ({ filters }) => {
    const [recs, setRecs] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const res = await transactionService.getRecommendations(filters, controller.signal);
                setRecs(res);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        };
        setLoading(true);
        fetchData();
        return () => controller.abort();
    }, [filters]);

    return (
        <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom duration-700">
            <h1 className="text-2xl font-bold text-text-primary hidden sm:block">Recommendations</h1>

            {/* Cross-Sell Section */}
            <div>
                <div className="mb-4 flex items-center gap-2">
                    <Zap className="text-primary" size={20} />
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">Cross-Sell Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading && !recs ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl bg-card animate-pulse border border-card-border" />
                        ))
                    ) : (
                        recs?.crossSell?.map((item: any, i: number) => (
                            <RecommendationCard 
                                key={i}
                                product={item.title}
                                subtitle={item.subtitle}
                                reason={item.reason}
                                type="Cross-Sell"
                                borderColor="border-primary/30"
                                icon={ShoppingCart}
                                accentColor="text-primary"
                            />
                        ))
                    )}
                    {!loading && recs?.crossSell?.length === 0 && (
                        <div className="col-span-full py-10 text-center text-text-secondary text-sm">No cross-sell opportunities identified for this segment.</div>
                    )}
                </div>
            </div>

            {/* Upsell Section */}
            <div>
                <div className="mb-4 flex items-center gap-2">
                    <TrendingUpIcon className="text-secondary" size={20} />
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">Upsell Opportunities</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading && !recs ? (
                        Array(2).fill(0).map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl bg-card animate-pulse border border-card-border" />
                        ))
                    ) : (
                        recs?.upsell?.map((item: any, i: number) => (
                            <RecommendationCard 
                                key={i}
                                product={item.title}
                                subtitle={item.subtitle}
                                reason={item.reason}
                                type="Upsell"
                                borderColor="border-secondary/30"
                                icon={Star}
                                accentColor="text-secondary"
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Segment-Specific Recommendations */}
            <div>
                <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="text-[#FFB800]" size={20} />
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">Segment Strategy Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading && !recs ? (
                        Array(1).fill(0).map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl bg-card animate-pulse border border-card-border" />
                        ))
                    ) : (
                        recs?.segment?.map((item: any, i: number) => (
                            <RecommendationCard 
                                key={i}
                                product={item.title}
                                subtitle={item.subtitle}
                                reason={item.reason}
                                type="Segment Based"
                                borderColor="border-[#FFB800]/30"
                                icon={Gift}
                                accentColor="text-[#FFB800]"
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};


const RecommendationCard = ({ product, subtitle, reason, type, borderColor, icon: Icon, accentColor }: any) => (
    <GlassCard className={`group relative p-0 overflow-hidden border-2 ${borderColor} transition-all duration-300 hover:scale-[1.02]`}>
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 dark:bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    {type}
                </span>
                <Icon size={18} className={`${accentColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </div>
            <h4 className="text-lg font-bold text-text-primary mb-1">{product}</h4>
            <p className="text-[10px] font-medium text-text-secondary uppercase mb-3 tracking-wider">{subtitle}</p>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed italic">“{reason}”</p>
            
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 dark:bg-white/5 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-primary/20 dark:hover:bg-white/10 active:scale-95">
                Generate Campaign
                <ArrowRight size={16} />
            </button>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </GlassCard>
);

const TrendingUpIcon = ({ size, className }: any) => (
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
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export default Recommendations;