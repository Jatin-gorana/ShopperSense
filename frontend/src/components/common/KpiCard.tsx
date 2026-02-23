import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: number;
    trendLabel?: string;
    iconColor?: string;
    className?: string;
}

const useCountUp = (target: number, duration: number = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = target;
        if (start === end) return;

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(progress * (end - start) + start);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [target, duration]);

    return count;
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, trend, trendLabel, iconColor = "text-primary", className }) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    const animatedValue = useCountUp(numericValue);
    
    const displayValue = typeof value === 'number' 
        ? Math.floor(animatedValue).toLocaleString() 
        : String(value).startsWith('$') 
            ? `$${animatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            : value;

    return (
        <GlassCard className={cn("p-5 transition-transform duration-300 hover:scale-[1.02]", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">{displayValue}</h2>
                    {trend !== undefined && (
                        <div className="flex items-center gap-1">
                            <span className={cn(
                                "text-xs font-medium",
                                trend >= 0 ? "text-primary" : "text-red-500"
                            )}>
                                {trend >= 0 ? "+" : ""}{trend}%
                            </span>
                            {trendLabel && <span className="text-[10px] text-text-secondary uppercase tracking-wider">{trendLabel}</span>}
                        </div>
                    )}
                </div>
                <div className={cn("rounded-lg bg-primary/5 p-3 dark:bg-white/5", iconColor)}>
                    <Icon size={24} />
                </div>
            </div>
        </GlassCard>
    );
};


export default KpiCard;
