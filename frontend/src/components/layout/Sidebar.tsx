import React from 'react';
import { 
    LayoutDashboard, 
    Users, 
    ShoppingCart, 
    TrendingUp, 
    Sparkles, 
    BrainCircuit,
    PlusCircle,
    BarChart3,
    Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    activePage: string;
    onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
    const menuItems = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'customers', name: 'Customer Intelligence', icon: Users },
        { id: 'affinity', name: 'Affinity Insights', icon: ShoppingCart },
        { id: 'trends', name: 'Trends & Analytics', icon: TrendingUp },
        { id: 'recommendations', name: 'Recommendations', icon: Sparkles },
        { id: 'ai-insights', name: 'AI Insights', icon: BrainCircuit },
        { id: 'data-upload', name: 'Data Upload', icon: Upload },
        { id: 'live-demo', name: 'Live Demo Mode', icon: PlusCircle },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-full lg:w-64 border-r border-card-border bg-card/80 lg:bg-card/80 backdrop-blur-2xl transition-all duration-300">
            <div className="flex h-20 items-center gap-3 px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                    <BarChart3 className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight">ShopperSense</h1>
                    <p className="text-[10px] font-medium text-primary uppercase tracking-[0.2em]">Behavioral AI</p>
                </div>
            </div>

            <nav className="mt-8 space-y-1 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className={cn(
                                "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive 
                                    ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(var(--primary),0.05)]" 
                                    : "text-text-secondary hover:bg-primary/5 hover:text-text-primary"
                            )}
                        >
                            <Icon size={20} className={cn(
                                "transition-transform duration-200 group-hover:scale-110",
                                isActive ? "text-primary" : "text-text-secondary"
                            )} />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="absolute bottom-8 left-0 w-full px-6">
                <div className="rounded-2xl border border-card-border bg-card/50 p-4">
                    <p className="text-xs text-text-secondary">Database Connection</p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                        <span className="text-sm font-medium text-text-primary">Database Live</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
