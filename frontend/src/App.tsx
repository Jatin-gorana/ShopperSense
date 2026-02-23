import React, { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/Overview';
import CustomerIntelligence from './pages/CustomerIntelligence';
import AffinityInsights from './pages/AffinityInsights';
import TrendsAnalytics from './pages/TrendsAnalytics';
import Recommendations from './pages/Recommendations';
import AIInsights from './pages/AIInsights';
import LiveDemo from './pages/LiveDemo';
import DataUpload from './pages/DataUpload';
import FilterSystem from './components/dashboard/FilterSystem';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState('overview');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        location: '',
        category: '',
        gender: '',
        ageGroup: ''
    });

    const renderPage = () => {
        switch (activePage) {
            case 'overview':
                return <Overview filters={filters} />;
            case 'customers':
                return <CustomerIntelligence filters={filters} />;
            case 'affinity':
                return <AffinityInsights filters={filters} />;
            case 'trends':
                return <TrendsAnalytics filters={filters} />;
            case 'recommendations':
                return <Recommendations filters={filters} />;
            case 'ai-insights':
                return <AIInsights filters={filters} onFilterChange={setFilters} onPageChange={setActivePage} />;
            case 'live-demo':
                return <LiveDemo onDataRefresh={() => setFilters({ ...filters })} />;
            case 'data-upload':
                return <DataUpload onDataRefresh={() => setFilters({ ...filters })} />;
            default:
                return <Overview filters={filters} />;
        }
    };

    const getPageTitle = () => {
        switch (activePage) {
            case 'overview': return 'Overview Dashboard';
            case 'customers': return 'Customer Intelligence';
            case 'affinity': return 'Affinity & Market Basket';
            case 'trends': return 'Sales Trends & Analytics';
            case 'recommendations': return 'Smart Recommendations';
            case 'ai-insights': return 'AI Business Insights';
            case 'live-demo': return 'Live Demo & Ingestion';
            case 'data-upload': return 'Data Upload & Ingestion';
            default: return 'ShopperSense AI';
        }
    };

    return (
        <DashboardLayout 
            activePage={activePage} 
            onPageChange={setActivePage} 
            title={getPageTitle()}
        >
            {activePage !== 'data-upload' && activePage !== 'live-demo' && (
                <FilterSystem filters={filters} onFilterChange={setFilters} />
            )}
            {renderPage()}
        </DashboardLayout>
    );
};

export default App;