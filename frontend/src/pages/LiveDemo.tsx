import React, { useState } from 'react';
import { 
    PlusCircle, 
    Save, 
    RefreshCcw, 
    CheckCircle2,
    Database,
    Package,
    MapPin,
    CreditCard,
    User
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { transactionService } from '../services/transaction.service';

interface LiveDemoProps {
    onDataRefresh: () => void;
}

const LiveDemo: React.FC<LiveDemoProps> = ({ onDataRefresh }) => {
    const [formData, setFormData] = useState({
        customer_id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
        age: '28',
        gender: 'Female',
        location: 'New York',
        product_category: 'Electronics',
        product_name: 'Wireless Earbuds',
        purchase_amount: '129.99',
        quantity: '1',
        purchase_date: new Date().toISOString().split('T')[0],
        payment_method: 'Credit Card'
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionService.createTransaction({
                ...formData,
                age: parseInt(formData.age),
                purchase_amount: parseFloat(formData.purchase_amount),
                quantity: parseInt(formData.quantity)
            });
            setSuccess(true);
            onDataRefresh(); // Refresh dashboard data
            setTimeout(() => setSuccess(false), 3000);
            // Reset some fields
            setFormData(prev => ({
                ...prev,
                customer_id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
            }));
        } catch (error) {
            console.error("Failed to add transaction", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto animate-in zoom-in duration-500 space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Live Demo Mode</h3>
                <p className="text-text-secondary">Add a new transaction to see real-time dashboard updates</p>
            </div>

            <GlassCard title="Transaction Entry" subtitle="Manual data ingestion system">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <User size={14} /> Customer Information
                            </h4>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Customer ID</label>
                                <input 
                                    name="customer_id" 
                                    value={formData.customer_id} 
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Age</label>
                                    <input 
                                        type="number" 
                                        name="age" 
                                        value={formData.age} 
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Gender</label>
                                    <select 
                                        name="gender" 
                                        value={formData.gender} 
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                    >
                                        <option value="Male" className="bg-card">Male</option>
                                        <option value="Female" className="bg-card">Female</option>
                                        <option value="Other" className="bg-card">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Location</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                                    <input 
                                        name="location" 
                                        value={formData.location} 
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-card-border bg-background pl-11 pr-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                                <Package size={14} /> Product & Payment
                            </h4>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Category</label>
                                <select 
                                    name="product_category" 
                                    value={formData.product_category} 
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                >
                                    <option value="Electronics" className="bg-card">Electronics</option>
                                    <option value="Fashion" className="bg-card">Fashion</option>
                                    <option value="Home" className="bg-card">Home</option>
                                    <option value="Groceries" className="bg-card">Groceries</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-secondary mb-1">Product Name</label>
                                <input 
                                    name="product_name" 
                                    value={formData.product_name} 
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Amount ($)</label>
                                    <input 
                                        type="number" 
                                        name="purchase_amount" 
                                        value={formData.purchase_amount} 
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-text-secondary mb-1">Quantity</label>
                                    <input 
                                        type="number" 
                                        name="quantity" 
                                        value={formData.quantity} 
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Purchase Date</label>
                            <input 
                                type="date" 
                                name="purchase_date" 
                                value={formData.purchase_date} 
                                onChange={handleChange}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary mb-1">Payment Method</label>
                            <div className="relative">
                                <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                                <select 
                                    name="payment_method" 
                                    value={formData.payment_method} 
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-card-border bg-background pl-11 pr-4 py-3 text-sm text-text-primary outline-none focus:border-primary/30 transition-all"
                                >
                                    <option value="Credit Card" className="bg-card">Credit Card</option>
                                    <option value="Debit Card" className="bg-card">Debit Card</option>
                                    <option value="Cash" className="bg-card">Cash</option>
                                    <option value="Digital Wallet" className="bg-card">Digital Wallet</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-card-border">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <Database size={16} />
                            <span className="text-xs">Database Destination: PostgreSQL / transactions</span>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <RefreshCcw className="animate-spin" size={18} /> : (success ? <CheckCircle2 size={18} /> : <Save size={18} />)}
                            {loading ? 'Processing...' : (success ? 'Transaction Saved!' : 'Commit Transaction')}
                        </button>
                    </div>
                </form>
            </GlassCard>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-card-border bg-card/50 p-4">
                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Real-time Sync Enabled</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-card-border bg-card/50 p-4">
                    <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary)]" />
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">AI Insights Auto-refresh</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-card-border bg-card/50 p-4">
                    <div className="h-2 w-2 rounded-full bg-[#FFB800] shadow-[0_0_8px_#FFB800]" />
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">PostgreSQL Primary DB</p>
                </div>
            </div>
        </div>
    );
};

export default LiveDemo;
