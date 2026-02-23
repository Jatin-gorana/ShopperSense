import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Settings, User, Moon, Sun, Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onPageChange: (page: string) => void;
    title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activePage, onPageChange, title }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as 'light' | 'dark') || 'dark';
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handlePageChange = (page: string) => {
        onPageChange(page);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar activePage={activePage} onPageChange={handlePageChange} />
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="relative h-full w-64">
                    <Sidebar activePage={activePage} onPageChange={handlePageChange} />
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute right-[-48px] top-4 rounded-xl bg-card p-2 text-text-primary border border-card-border"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
            
            <main className="lg:pl-64 transition-all duration-300">
                {/* Top Navigation */}
                <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-card-border bg-background/50 px-4 md:px-8 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden rounded-lg p-2 text-text-secondary hover:bg-card hover:text-text-primary transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold text-text-primary tracking-tight truncate">{title}</h2>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="relative hidden xl:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search analytics..."
                                className="h-10 w-48 xl:w-64 rounded-xl border border-card-border bg-card/50 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary/30 focus:bg-card"
                            />
                        </div>
                        
                        <div className="flex items-center gap-1 md:gap-3">
                            <button 
                                onClick={toggleTheme}
                                className="rounded-lg p-2 text-text-secondary hover:bg-card hover:text-text-primary transition-colors"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button className="relative hidden md:block rounded-lg p-2 text-text-secondary hover:bg-card hover:text-text-primary transition-colors">
                                <Bell size={20} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary)]" />
                            </button>
                            <button className="hidden sm:block rounded-lg p-2 text-text-secondary hover:bg-card hover:text-text-primary transition-colors">
                                <Settings size={20} />
                            </button>
                            <div className="h-8 w-px bg-card-border mx-1 md:mx-2" />
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-text-primary leading-none">Admin User</p>
                                    <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider">Business Analyst</p>
                                </div>
                                <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-secondary to-primary p-0.5">
                                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
                                        <User size={20} className="text-text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
