# ShopperSense AI - API Specification

## Base URL
`VITE_API_BASE_URL`

## Transaction Endpoints

### List Transactions
- **URL**: `/transactions`
- **Method**: `GET`
- **Query Params**: 
  - `category` (optional)
  - `location` (optional)
  - `gender` (optional)
  - `startDate` (optional)
  - `endDate` (optional)
- **Authentication**: None

    "purchase_date": "string (ISO)",
    "payment_method": "string",
    "metadata": "object (optional)"
  }
  ```
- **Authentication**: None

### Bulk Create Transactions
- **URL**: `/transactions/bulk`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "transactions": [
      {
        "customer_id": "string",
        "age": "number",
        "gender": "string",
        "location": "string",
        "product_category": "string",
        "product_name": "string",
        "purchase_amount": "number",
        "quantity": "number",
        "purchase_date": "string (ISO)",
        "payment_method": "string",
        "metadata": "object (optional)"
      }
    ]
  }
  ```
- **Authentication**: None

## Analytics Endpoints

### Get KPIs
- **URL**: `/transactions/analytics/kpis`
- **Method**: `GET`
- **Authentication**: None

### Get Segments
- **URL**: `/transactions/analytics/segments`
- **Method**: `GET`
- **Authentication**: None

### Get Affinity
- **URL**: `/transactions/analytics/affinity`
- **Method**: `GET`
- **Authentication**: None

### Get Trends
- **URL**: `/transactions/analytics/trends`
- **Method**: `GET`
- **Authentication**: None

### Get Recommendations
- **URL**: `/transactions/analytics/recommendations`
- **Method**: `GET`
- **Authentication**: None

### Get AI Insights
- **URL**: `/transactions/analytics/ai-insights`
- **Method**: `GET`
- **Authentication**: None
