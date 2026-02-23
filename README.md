# ShopperSense AI

A full-stack retail analytics platform that provides AI-powered insights into customer behavior, product affinity, sales trends, and personalized recommendations.

## Overview

ShopperSense AI is a modern web application designed to help retailers understand their customers better through advanced analytics and AI-driven insights. The platform processes transaction data to deliver actionable intelligence on customer segments, product relationships, purchasing patterns, and business opportunities.

## Architecture

### Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite (Rolldown) for blazing-fast builds
- TailwindCSS 4 for styling
- Recharts for data visualization
- Framer Motion for animations
- AI SDK for AI-powered features
- Axios for API communication

**Backend**
- Node.js with TypeScript
- Hono (lightweight web framework)
- Prisma ORM with PostgreSQL
- JWT authentication
- Bcrypt for password hashing
- Cloud storage integrations (AWS S3, Azure Blob, Google Cloud Storage)

**Infrastructure**
- Docker containerization
- PostgreSQL database
- pnpm for package management

### Project Structure

```
.
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API service layer
│   │   ├── lib/          # Utility functions
│   │   ├── data/         # Mock data for development
│   │   └── agentSdk/     # AI agent integration
│   ├── Dockerfile        # Frontend container config
│   └── vite.config.ts    # Vite configuration
│
├── backend/              # Node.js backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic layer
│   │   ├── middlewares/  # Express middlewares
│   │   ├── prisma/       # Database schema
│   │   ├── integrations/ # Third-party integrations
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Helper functions
│   ├── Dockerfile        # Backend container config
│   └── prisma.config.ts  # Prisma configuration
│
└── .gitignore            # Git ignore rules
```

## Key Features

### 1. Overview Dashboard
- Real-time KPIs (revenue, transactions, customers, AOV)
- Sales trends visualization
- Top products and categories
- Customer demographics breakdown

### 2. Customer Intelligence
- Customer segmentation analysis
- Demographic insights (age, gender, location)
- Purchase behavior patterns
- Customer lifetime value metrics

### 3. Affinity & Market Basket Analysis
- Product co-purchase patterns
- Category affinity insights
- Cross-sell opportunities
- Bundle recommendations

### 4. Sales Trends & Analytics
- Time-series sales analysis
- Seasonal patterns
- Category performance
- Payment method preferences

### 5. Smart Recommendations
- Personalized product suggestions
- Customer-specific recommendations
- AI-powered upsell opportunities

### 6. AI Business Insights
- Natural language insights generation
- Automated business intelligence
- Trend detection and alerts
- Strategic recommendations

### 7. Data Management
- CSV file upload for bulk data ingestion
- Live demo data generation
- Transaction management
- Data validation and processing

## Database Schema

### Core Models

**User**
- Authentication and user management
- Email-based identification
- Soft delete support

**UserIdentity**
- Multi-provider authentication (Google, GitHub, Email/Password, Phone OTP)
- Provider-specific metadata storage
- Secure credential management

**Otp**
- One-time password management
- Support for email and phone verification
- Purpose-based OTP (login, registration, 2FA, password reset)
- Expiration and attempt tracking

**Transaction**
- Customer purchase records
- Product and category information
- Demographic data (age, gender, location)
- Payment method tracking
- Flexible metadata storage

## API Endpoints

### Transaction Management
- `GET /transactions` - List transactions with filters
- `POST /transactions` - Create single transaction
- `POST /transactions/bulk` - Bulk transaction creation

### Analytics
- `GET /transactions/analytics/kpis` - Key performance indicators
- `GET /transactions/analytics/segments` - Customer segments
- `GET /transactions/analytics/affinity` - Product affinity analysis
- `GET /transactions/analytics/trends` - Sales trends
- `GET /transactions/analytics/recommendations` - Smart recommendations
- `GET /transactions/analytics/ai-insights` - AI-generated insights

### System
- `GET /` - Server status
- `GET /health` - Health check
- `GET /version.json` - API version

## Setup & Installation

### Prerequisites
- Node.js 22.x or higher
- pnpm 10.x
- PostgreSQL database
- Docker (optional, for containerized deployment)

### Environment Configuration

**Backend (.env)**
```bash
PORT=9000
DATABASE_URL=postgresql://user:password@localhost:5432/shoppersense
JWT_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30

# Optional: LLM Provider Configuration
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key

# Optional: Payment Integration
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_key
```

**Frontend (.env)**
```bash
VITE_API_BASE_URL=http://localhost:9000
VITE_AGENT_BASE_URL=http://localhost:3000
VITE_USE_MOCK_DATA=false
```

### Local Development

**Backend**
```bash
cd backend
pnpm install
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm dev              # Start development server
```

**Frontend**
```bash
cd frontend
pnpm install
pnpm dev              # Start development server
```

### Docker Deployment

**Backend**
```bash
cd backend
docker build -t shoppersense-backend .
docker run -p 9000:3000 shoppersense-backend
```

**Frontend**
```bash
cd frontend
docker build -t shoppersense-frontend .
docker run -p 5173:3000 shoppersense-frontend
```

## Development Scripts

### Backend
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm eslint` - Lint code
- `pnpm prettier` - Format code
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:seed` - Seed database with sample data

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm eslint` - Lint code
- `pnpm prettier` - Format code
- `pnpm serve:dist` - Serve production build locally

## Key Assumptions

### Data Model
- Transactions are the primary data entity
- Each transaction represents a single product purchase
- Customer identification is done via `customer_id` string
- All monetary values are stored as Decimal for precision
- Soft deletes are implemented across all models

### Authentication
- Multi-provider authentication support (OAuth, Email/Password, Phone OTP)
- JWT-based session management
- Refresh token rotation for security
- OTP expiration and rate limiting

### Analytics
- Real-time analytics computed on-demand
- Filtering by date range, location, category, gender, age group
- Mock data mode available for development/demo purposes
- AI insights require LLM provider configuration

### Performance
- Database indexes on frequently queried fields
- Pagination support for large datasets
- Efficient aggregation queries
- Client-side caching for static data

### Security
- CORS enabled for cross-origin requests
- Secure headers in production
- Password hashing with bcrypt
- JWT secret rotation recommended
- Environment-based configuration
- Non-root Docker containers

### Deployment
- Containerized architecture for scalability
- Health check endpoints for monitoring
- Graceful shutdown handling
- Database connection pooling
- Support for multiple cloud storage providers

## Integration Capabilities

The platform includes integration guides for:
- LLM providers (Anthropic, OpenAI, Google Gemini)
- Payment gateways (Stripe)
- OAuth providers (Google, GitHub)
- Email notifications
- SMS/OTP services
- Image generation APIs
- Cloud storage (AWS S3, Azure Blob, Google Cloud Storage)

See individual integration documentation files in the `backend/` directory for detailed setup instructions.

## Future Enhancements

- Real-time data streaming
- Advanced ML models for predictive analytics
- Multi-tenant support
- Role-based access control (RBAC)
- Export functionality (PDF, Excel)
- Scheduled reports and alerts
- Mobile application
- GraphQL API support

## License

ISC

## Support

For issues, questions, or contributions, please refer to the project repository.