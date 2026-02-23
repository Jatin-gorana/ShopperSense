import React from 'react';
import GlassCard from '../common/GlassCard';
import { Filter, Calendar, MapPin, Tag, Users2 } from 'lucide-react';

interface Filters {
    startDate: string;
    endDate: string;
    location: string;
    category: string;
    gender: string;
    ageGroup: string;
}

interface FilterSystemProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
}

const FilterSystem: React.FC<FilterSystemProps> = ({ filters, onFilterChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <GlassCard className="mb-6 md:mb-8 p-4 md:p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 md:gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                        <Filter size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
                    </div>
                    <button 
                        onClick={() => onFilterChange({
                            startDate: '',
                            endDate: '',
                            location: '',
                            category: '',
                            gender: '',
                            ageGroup: ''
                        })}
                        className="lg:hidden text-xs font-medium text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4"
                    >
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 flex-1">
                    {/* Date Range */}
                    <div className="flex items-center gap-2 bg-primary/5 dark:bg-white/5 rounded-xl px-3 py-2 border border-card-border transition-colors hover:border-primary/30">
                        <Calendar size={14} className="text-text-secondary shrink-0" />
                        <div className="flex items-center gap-1 flex-1 overflow-hidden">
                            <input 
                                type="date" 
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleChange}
                                className="bg-transparent text-[10px] sm:text-xs text-text-primary outline-none w-full"
                            />
                            <span className="text-text-secondary text-[10px]">-</span>
                            <input 
                                type="date" 
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleChange}
                                className="bg-transparent text-[10px] sm:text-xs text-text-primary outline-none w-full"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 bg-primary/5 dark:bg-white/5 rounded-xl px-3 py-2 border border-card-border transition-colors hover:border-primary/30">
                        <MapPin size={14} className="text-text-secondary shrink-0" />
                        <select 
                            name="location" 
                            value={filters.location}
                            onChange={handleChange}
                            className="bg-transparent text-xs text-text-primary outline-none cursor-pointer w-full"
                        >
                            <option value="" className="bg-card">All Locations</option>
                            <option value="New York" className="bg-card">New York</option>
                            <option value="London" className="bg-card">London</option>
                            <option value="Tokyo" className="bg-card">Tokyo</option>
                            <option value="Paris" className="bg-card">Paris</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 bg-primary/5 dark:bg-white/5 rounded-xl px-3 py-2 border border-card-border transition-colors hover:border-primary/30">
                        <Tag size={14} className="text-text-secondary shrink-0" />
                        <select 
                            name="category" 
                            value={filters.category}
                            onChange={handleChange}
                            className="bg-transparent text-xs text-text-primary outline-none cursor-pointer w-full"
                        >
                            <option value="" className="bg-card">All Categories</option>
                            <option value="Electronics" className="bg-card">Electronics</option>
                            <option value="Fashion" className="bg-card">Fashion</option>
                            <option value="Home" className="bg-card">Home</option>
                            <option value="Groceries" className="bg-card">Groceries</option>
                        </select>
                    </div>

                    {/* Gender */}
                    <div className="flex items-center gap-2 bg-primary/5 dark:bg-white/5 rounded-xl px-3 py-2 border border-card-border transition-colors hover:border-primary/30">
                        <Users2 size={14} className="text-text-secondary shrink-0" />
                        <select 
                            name="gender" 
                            value={filters.gender}
                            onChange={handleChange}
                            className="bg-transparent text-xs text-text-primary outline-none cursor-pointer w-full"
                        >
                            <option value="" className="bg-card">All Genders</option>
                            <option value="Male" className="bg-card">Male</option>
                            <option value="Female" className="bg-card">Female</option>
                            <option value="Other" className="bg-card">Other</option>
                        </select>
                    </div>
                </div>

                <button 
                    onClick={() => onFilterChange({
                        startDate: '',
                        endDate: '',
                        location: '',
                        category: '',
                        gender: '',
                        ageGroup: ''
                    })}
                    className="hidden lg:block text-xs font-medium text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4 whitespace-nowrap"
                >
                    Reset All
                </button>
            </div>
        </GlassCard>
    );
};

export default FilterSystem;
