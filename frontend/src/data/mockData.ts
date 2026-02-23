export const MOCK_TRANSACTIONS = [
    {
        id: '1',
        customer_id: 'C001',
        age: 28,
        gender: 'Female',
        location: 'New York',
        product_category: 'Electronics',
        product_name: 'Smartphone',
        purchase_amount: 899.99,
        quantity: 1,
        purchase_date: new Date().toISOString(),
        payment_method: 'Credit Card'
    },
    {
        id: '2',
        customer_id: 'C002',
        age: 35,
        gender: 'Male',
        location: 'London',
        product_category: 'Fashion',
        product_name: 'Designer Watch',
        purchase_amount: 1200.00,
        quantity: 1,
        purchase_date: new Date(Date.now() - 86400000).toISOString(),
        payment_method: 'PayPal'
    },
    {
        id: '3',
        customer_id: 'C003',
        age: 22,
        gender: 'Female',
        location: 'Paris',
        product_category: 'Beauty',
        product_name: 'Skincare Set',
        purchase_amount: 150.50,
        quantity: 2,
        purchase_date: new Date(Date.now() - 172800000).toISOString(),
        payment_method: 'Credit Card'
    }
];

export const MOCK_KPIS = {
    totalCustomers: 1250,
    totalRevenue: 450000,
    aov: 360.50,
    totalOrders: 1520,
    repeatPurchaseRate: 65.4,
    customerRetentionRate: 72.8
};

export const MOCK_SEGMENTS = {
    segments: {
        highValue: 150,
        frequent: 450,
        atRisk: 120,
        new: 320,
        regular: 210
    },
    highValueCustomers: [
        { id: 'C002', totalSpend: 15400, count: 12, lastDate: new Date().toISOString() },
        { id: 'C015', totalSpend: 12800, count: 8, lastDate: new Date().toISOString() }
    ]
};

export const MOCK_AFFINITY = {
    topBundles: [
        { name: 'Smartphone + Case', count: 145 },
        { name: 'Laptop + Mouse', count: 98 },
        { name: 'Headphones + Spotify Sub', count: 75 }
    ]
};

export const MOCK_TRENDS = {
    dailySales: [
        { date: '2026-02-15', amount: 12000 },
        { date: '2026-02-16', amount: 15000 },
        { date: '2026-02-17', amount: 13000 },
        { date: '2026-02-18', amount: 18000 },
        { date: '2026-02-19', amount: 21000 },
        { date: '2026-02-20', amount: 19000 },
        { date: '2026-02-21', amount: 24000 }
    ],
    categorySales: [
        { category: 'Electronics', amount: 180000 },
        { category: 'Fashion', amount: 120000 },
        { category: 'Home', amount: 90000 },
        { category: 'Beauty', amount: 60000 }
    ]
};

export const MOCK_AI_INSIGHTS = [
    {
        type: 'sales',
        title: 'Electronics Growth Surge',
        description: 'Electronics category revenue increased by 24% over the last 30 days, driven by new smartphone launches.',
        confidence: 'High',
        implementationGuide: {
            explanation: 'The Electronics segment is currently your strongest growth lever, contributing $180,000 in monthly revenue. The surge correlates with high-interest tech events and successful product placement.',
            metrics: { revenueImpact: 180000, growth: 24, segmentSize: 450, duration: 'Last 30 days' },
            actions: ['Scale ad spend on high-margin gadgets', 'Launch early-access for upcoming releases', 'Optimize checkout for mobile shoppers'],
            impact: { revenueUplift: 15, retentionImprovement: 8, crossSellImpact: 12 },
            visualData: [40, 45, 55, 60, 58, 70, 85, 95],
            suggestedFilters: { category: 'Electronics' }
        }
    },
    {
        type: 'behavior',
        title: 'High-Value Loyalty Patterns',
        description: 'Top 20% of customers account for 65% of total revenue. Retention is critical for this segment.',
        confidence: 'High',
        implementationGuide: {
            explanation: 'Data shows that high-value customers shop 3x more frequently than average users. Maintaining their loyalty is 5x cheaper than acquiring new customers of similar value.',
            metrics: { revenueImpact: 292500, growth: 12, segmentSize: 250, duration: 'Year to Date' },
            actions: ['Implement tiered loyalty program', 'Send personalized anniversary rewards', 'Assign dedicated support channels'],
            impact: { revenueUplift: 20, retentionImprovement: 25, crossSellImpact: 10 },
            visualData: [60, 62, 65, 68, 70, 72, 75, 78],
            suggestedFilters: {}
        }
    },
    {
        type: 'revenue',
        title: 'Cross-Sell Opportunity: Home Office',
        description: 'Significant affinity detected between Laptop buyers and Ergonomic Chair categories.',
        confidence: 'Medium',
        implementationGuide: {
            explanation: 'Analysis reveal that 38% of customers who purchase a Laptop return within 14 days to buy home office furniture. Capturing this at checkout could boost AOV.',
            metrics: { revenueImpact: 45000, growth: 18, segmentSize: 180, duration: 'Last 60 days' },
            actions: ['Create "Productivity Bundle"', 'Add post-purchase upsell emails', 'Cross-promote in search results'],
            impact: { revenueUplift: 12, retentionImprovement: 5, crossSellImpact: 35 },
            visualData: [20, 25, 30, 45, 40, 55, 60, 65],
            suggestedFilters: { category: 'Home Office' }
        }
    },
    {
        type: 'alert',
        title: 'Sudden Drop in Fashion Sales',
        description: 'Fashion category revenue dropped by 15% in the London region over the last week.',
        confidence: 'High',
        implementationGuide: {
            explanation: 'A regional sales dip in London suggests either inventory stockouts or increased local competition. Urgent review of regional logistics is recommended.',
            metrics: { revenueImpact: -12000, growth: -15, segmentSize: 85, duration: 'Last 7 days' },
            actions: ['Verify regional stock levels', 'Check competitor pricing in London', 'Launch emergency "Flash Sale" for London'],
            impact: { revenueUplift: 8, retentionImprovement: 12, crossSellImpact: 5 },
            visualData: [80, 75, 70, 65, 55, 45, 40, 35],
            suggestedFilters: { location: 'London', category: 'Fashion' }
        }
    }
];
