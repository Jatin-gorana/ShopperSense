import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, title, subtitle }) => {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-2xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-primary/30",
            "dark:bg-card/60 dark:backdrop-blur-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
            "light:shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
            className
        )}>
            {/* Glow effects - only visible in dark mode */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-secondary/10 blur-[80px] hidden dark:block" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-[80px] hidden dark:block" />

            {(title || subtitle) && (
                <div className="mb-6">
                    {title && <h3 className="text-lg font-semibold text-text-primary tracking-tight">{title}</h3>}
                    {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
                </div>
            )}
            
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
