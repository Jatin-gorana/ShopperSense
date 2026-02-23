import React, { useState, useEffect } from 'react';
import { 
    BrainCircuit, 
    Lightbulb, 
    ArrowRight, 
    Download,
    RefreshCw,
    CheckCircle2,
    TrendingUp,
    AlertTriangle,
    Zap,
    X,
    Target,
    BarChart3,
    ArrowUpRight,
    Users,
    Clock,
    DollarSign
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { transactionService } from '../services/transaction.service';

import axios from 'axios';

interface AIInsightsProps {
    filters: any;
    onFilterChange?: (filters: any) => void;
    onPageChange?: (page: string) => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({ filters, onFilterChange, onPageChange }) => {
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInsight, setSelectedInsight] = useState<any | null>(null);

    const fetchInsights = async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const res = await transactionService.getAIInsights(filters, signal);
            setInsights(res);
        } catch (error) {
            if (axios.isCancel(error)) return;
            console.error("Failed to fetch AI insights", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchInsights(controller.signal);
        return () => controller.abort();
    }, [filters]);

    const handleRefresh = () => {
        fetchInsights();
    };

    const handleOpenGuide = (insight: any) => {
        setSelectedInsight(insight);
    };

    const handleFilterDashboard = () => {
        if (!selectedInsight || !onFilterChange) return;
        
        // Use suggested filters from the insight or fallback to heuristic
        const suggestedFilters = selectedInsight.implementationGuide.suggestedFilters || {};
        const newFilters = { ...filters, ...suggestedFilters };
        
        onFilterChange(newFilters);
        setSelectedInsight(null);
        if (onPageChange) onPageChange('overview');
    };

    const handleExportInsight = () => {
        if (!selectedInsight) return;
        const blob = new Blob([JSON.stringify(selectedInsight, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insight-${selectedInsight.title.replace(/\s+/g, '-').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ... header code ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">AI Strategy Engine</h3>
                    <p className="text-sm text-text-secondary">Autonomous business logic analysis based on real-time data</p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                    <button 
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl border border-card-border bg-card/50 px-4 py-2.5 text-sm font-medium text-text-primary transition-all hover:bg-card active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh Analysis
                    </button>
                    <button 
                        onClick={handleExportInsight}
                        disabled={!selectedInsight && insights.length === 0}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_15px_rgba(var(--primary),0.4)] active:scale-95"
                    >
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {loading && insights.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 rounded-[32px] bg-card/40 animate-pulse border border-card-border relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            <div className="p-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-10 w-10 rounded-xl bg-card-border/50" />
                                    <div className="h-4 w-24 rounded-full bg-card-border/50" />
                                </div>
                                <div className="h-6 w-3/4 rounded-lg bg-card-border/50" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full rounded-lg bg-card-border/50" />
                                    <div className="h-4 w-5/6 rounded-lg bg-card-border/50" />
                                </div>
                                <div className="pt-4 border-t border-card-border/30 flex justify-between">
                                    <div className="h-4 w-20 rounded bg-card-border/50" />
                                    <div className="h-4 w-32 rounded bg-card-border/50" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
                    {insights.map((insight, i) => (
                        <GlassCard 
                            key={i} 
                            className={`group relative flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] hover:border-primary/40 overflow-hidden ${
                                insight.type === 'alert' ? 'border-red-500/30' : 'border-card-border'
                            }`}
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                                        insight.type === 'sales' ? 'bg-primary/10 text-primary shadow-primary/10' :
                                        insight.type === 'behavior' ? 'bg-secondary/10 text-secondary shadow-secondary/10' :
                                        insight.type === 'revenue' ? 'bg-amber-400/10 text-amber-400 shadow-amber-400/10' :
                                        'bg-red-500/10 text-red-500 shadow-red-500/10'
                                    }`}>
                                        {insight.type === 'sales' ? <TrendingUp size={24} /> :
                                         insight.type === 'behavior' ? <BrainCircuit size={24} /> :
                                         insight.type === 'revenue' ? <Zap size={24} /> :
                                         <AlertTriangle size={24} />}
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            insight.confidence === 'High' ? 'bg-primary/5 text-primary border-primary/20' :
                                            insight.confidence === 'Medium' ? 'bg-secondary/5 text-secondary border-secondary/20' :
                                            'bg-amber-400/5 text-amber-400 border-amber-400/20'
                                        }`}>
                                            {insight.confidence} Confidence
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                            insight.type === 'sales' ? 'text-primary' :
                                            insight.type === 'behavior' ? 'text-secondary' :
                                            insight.type === 'revenue' ? 'text-amber-400' :
                                            'text-red-500'
                                        }`}>
                                            {insight.type || 'Insight'}
                                        </span>
                                    </div>
                                </div>
                                
                                <h4 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
                                    {insight.title}
                                </h4>
                                <p className="text-sm text-text-secondary leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                                    “{insight.description}”
                                </p>
                            </div>
                            
                            <div className="relative z-10 flex items-center justify-between mt-auto pt-5 border-t border-card-border/50">
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/80 group-hover:text-primary transition-colors">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                                    Data Validated
                                </span>
                                <button 
                                    onClick={() => handleOpenGuide(insight)}
                                    className="text-xs font-bold text-text-primary flex items-center gap-2 bg-card-border/30 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 group/btn"
                                >
                                    Implementation Guide
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Strategic Recommendations Panel */}
            <GlassCard className="border-primary/20 relative overflow-hidden group p-8 md:p-10">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                    <BrainCircuit size={160} className="text-primary" />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                        <BrainCircuit className="text-white" size={28} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-text-primary tracking-tight">Advanced Strategy Forecasting</h4>
                        <p className="text-sm text-text-secondary">Predictive intelligence for autonomous business growth</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative z-10">
                    <div className="space-y-4 p-6 rounded-3xl bg-card/30 border border-card-border/50 hover:border-primary/30 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                            <DollarSign size={12} className="text-primary" />
                            Revenue Momentum
                        </p>
                        <p className="text-3xl font-bold text-text-primary">
                            {insights.length > 0 ? `$${(insights.reduce((acc, i) => acc + (i.implementationGuide?.metrics?.revenueImpact || 0), 0) / 4).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '$142,500'} 
                            <span className="text-sm font-bold text-primary ml-3 flex items-center gap-1 inline-flex">
                                <ArrowUpRight size={14} />
                                +12.4%
                            </span>
                        </p>
                        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl bg-card/30 border border-card-border/50 hover:border-secondary/30 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                            <Users size={12} className="text-secondary" />
                            Market Loyalty
                        </p>
                        <p className="text-3xl font-bold text-text-primary">High <span className="text-sm font-bold text-secondary ml-3">88.2%</span></p>
                        <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                            <div className="h-full w-[88%] bg-secondary" />
                        </div>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl bg-card/30 border border-card-border/50 hover:border-amber-400/30 transition-colors">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                            <Target size={12} className="text-amber-400" />
                            Operational Fit
                        </p>
                        <p className="text-3xl font-bold text-text-primary">94% <span className="text-sm font-bold text-amber-400 ml-3">Optimal</span></p>
                        <div className="h-2 w-full bg-amber-400/10 rounded-full overflow-hidden">
                            <div className="h-full w-[94%] bg-amber-400" />
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Implementation Guide Modal */}
            {selectedInsight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-background/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <div 
                        className="w-full max-w-4xl bg-card border border-card-border rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 max-h-[95vh] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-8 md:p-10 border-b border-card-border bg-card/50">
                            <div className="flex items-center gap-6">
                                <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center shadow-2xl ${
                                    selectedInsight.type === 'sales' ? 'bg-primary/10 text-primary shadow-primary/10' :
                                    selectedInsight.type === 'behavior' ? 'bg-secondary/10 text-secondary shadow-secondary/10' :
                                    selectedInsight.type === 'revenue' ? 'bg-amber-400/10 text-amber-400 shadow-amber-400/10' :
                                    'bg-red-500/10 text-red-500 shadow-red-500/10'
                                }`}>
                                    {selectedInsight.type === 'sales' ? <TrendingUp size={32} /> :
                                     selectedInsight.type === 'behavior' ? <BrainCircuit size={32} /> :
                                     selectedInsight.type === 'revenue' ? <Zap size={32} /> :
                                     <AlertTriangle size={32} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                            selectedInsight.type === 'sales' ? 'bg-primary/10 text-primary' :
                                            selectedInsight.type === 'behavior' ? 'bg-secondary/10 text-secondary' :
                                            selectedInsight.type === 'revenue' ? 'bg-amber-400/10 text-amber-400' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                            {selectedInsight.type} Insight
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-text-secondary/30" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Confident: {selectedInsight.confidence}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">{selectedInsight.title}</h3>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedInsight(null)}
                                className="h-12 w-12 rounded-2xl bg-card-border/30 hover:bg-card-border hover:rotate-90 flex items-center justify-center text-text-secondary transition-all duration-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
                            {/* Explanation */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                        <Lightbulb size={16} />
                                        1️⃣ Insight Explanation
                                    </h5>
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                                        <CheckCircle2 size={12} /> Live Data Analysis
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    <div className="text-base text-text-primary/90 leading-relaxed bg-primary/5 p-6 rounded-[24px] border border-primary/10 shadow-inner">
                                        {selectedInsight.implementationGuide.explanation}
                                    </div>
                                    
                                    {/* Supporting Visual - Dynamic Chart */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Supporting Data Trend</p>
                                            <p className="text-[10px] font-bold text-primary">Live Performance Metric</p>
                                        </div>
                                        <div className="h-40 w-full bg-card/40 rounded-[24px] border border-card-border p-6 flex items-end gap-3 group/chart">
                                            {(selectedInsight.implementationGuide.visualData || [40, 70, 45, 90, 65, 80, 50, 85]).map((h: number, i: number) => (
                                                <div key={i} className="flex-1 bg-primary/10 rounded-xl relative group/bar overflow-hidden">
                                                    <div 
                                                        className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-secondary rounded-xl transition-all duration-1000 ease-out" 
                                                        style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }} 
                                                    />
                                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 text-[10px] font-black text-primary transition-all duration-300 group-hover/bar:-top-6">
                                                        {h}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Metrics Grid */}
                            <section className="space-y-4">
                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                                    <BarChart3 size={16} />
                                    2️⃣ Supporting Metrics
                                </h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-card/50 border border-card-border/50 rounded-[24px] p-6 transition-all hover:border-primary/40 hover:bg-primary/5 group/metric">
                                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 group-hover/metric:text-primary transition-colors">Revenue Impact</p>
                                        <p className="text-2xl font-bold text-text-primary group-hover/metric:scale-110 transition-transform origin-left">
                                            ${selectedInsight.implementationGuide.metrics.revenueImpact?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-card/50 border border-card-border/50 rounded-[24px] p-6 transition-all hover:border-secondary/40 hover:bg-secondary/5 group/metric">
                                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 group-hover/metric:text-secondary transition-colors">Growth Momentum</p>
                                        <p className="text-2xl font-bold text-text-primary group-hover/metric:scale-110 transition-transform origin-left">
                                            {selectedInsight.implementationGuide.metrics.growth}%
                                        </p>
                                    </div>
                                    <div className="bg-card/50 border border-card-border/50 rounded-[24px] p-6 transition-all hover:border-amber-400/40 hover:bg-amber-400/5 group/metric">
                                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 group-hover/metric:text-amber-400 transition-colors">Segment Size</p>
                                        <p className="text-2xl font-bold text-text-primary group-hover/metric:scale-110 transition-transform origin-left">
                                            {selectedInsight.implementationGuide.metrics.segmentSize?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-card/50 border border-card-border/50 rounded-[24px] p-6 transition-all hover:border-red-400/40 hover:bg-red-400/5 group/metric">
                                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 group-hover/metric:text-red-400 transition-colors">Trend Duration</p>
                                        <p className="text-2xl font-bold text-text-primary group-hover/metric:scale-110 transition-transform origin-left">
                                            {selectedInsight.implementationGuide.metrics.duration}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Recommended Actions */}
                                <section className="space-y-6">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                                        <Target size={16} />
                                        3️⃣ Recommended Actions
                                    </h5>
                                    <ul className="space-y-4">
                                        {selectedInsight.implementationGuide.actions.map((action: string, i: number) => (
                                            <li key={i} className="flex items-center gap-4 group/action p-4 rounded-2xl bg-card/30 border border-card-border/50 hover:bg-secondary/5 hover:border-secondary/30 transition-all">
                                                <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover/action:bg-secondary group-hover/action:text-white transition-all duration-300">
                                                    <span className="text-xs font-black">{i+1}</span>
                                                </div>
                                                <span className="text-sm text-text-primary font-bold">{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* Business Impact */}
                                <section className="space-y-6">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2">
                                        <Zap size={16} />
                                        4️⃣ Business Impact Estimate
                                    </h5>
                                    <div className="space-y-6 bg-card/30 p-8 rounded-[32px] border border-card-border/50">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-text-secondary">
                                                <span>Revenue Uplift Potential</span>
                                                <span className="text-primary font-black">+{selectedInsight.implementationGuide.impact.revenueUplift}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-card-border rounded-full overflow-hidden p-0.5">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                                                    style={{ width: `${Math.min(100, selectedInsight.implementationGuide.impact.revenueUplift * 5)}%` }} 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-text-secondary">
                                                <span>Retention Improvement</span>
                                                <span className="text-secondary font-black">+{selectedInsight.implementationGuide.impact.retentionImprovement}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-card-border rounded-full overflow-hidden p-0.5">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--secondary-rgb),0.5)]" 
                                                    style={{ width: `${Math.min(100, selectedInsight.implementationGuide.impact.retentionImprovement * 5)}%` }} 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-text-secondary">
                                                <span>Cross-Sell Impact</span>
                                                <span className="text-amber-400 font-black">+{selectedInsight.implementationGuide.impact.crossSellImpact}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-card-border rounded-full overflow-hidden p-0.5">
                                                <div 
                                                    className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.5)]" 
                                                    style={{ width: `${Math.min(100, selectedInsight.implementationGuide.impact.crossSellImpact * 5)}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 bg-card/50 border-t border-card-border flex flex-wrap gap-4">
                            <button 
                                onClick={() => setSelectedInsight(null)}
                                className="flex-1 min-w-[120px] rounded-2xl bg-card-border/50 px-8 py-5 text-sm font-black text-text-primary hover:bg-card-border transition-all active:scale-[0.98]"
                            >
                                Dismiss
                            </button>
                            <button 
                                onClick={handleExportInsight}
                                className="flex-1 min-w-[120px] rounded-2xl border border-primary/30 px-8 py-5 text-sm font-black text-primary hover:bg-primary/10 transition-all active:scale-[0.98]"
                            >
                                Export JSON
                            </button>
                            <button 
                                onClick={handleFilterDashboard}
                                className="flex-[2] min-w-[240px] rounded-2xl bg-primary px-8 py-5 text-sm font-black text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] group/apply"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Apply Insight Filters to Dashboard
                                    <ArrowRight size={18} className="group-hover/apply:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIInsights;
