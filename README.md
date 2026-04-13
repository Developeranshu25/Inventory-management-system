<<<<<<< HEAD
# Inventory Management System (IMS)

A comprehensive Inventory Management System built with ASP.NET Core 8 Web API and React.

## Features

### Core Modules
- ✅ **Product Management** - Add/Edit/Delete products with SKU, barcode, variants
- ✅ **Category Management** - Hierarchical categories and subcategories
- ✅ **Supplier Management** - Track suppliers and their details
- ✅ **Warehouse Management** - Multi-warehouse support
- ✅ **Purchase Management** - Create, approve, and receive purchase orders
- ✅ **Sales Management** - Create invoices and track sales
- ✅ **Stock Management** - Real-time stock levels, adjustments, transfers
- ✅ **Reports & Analytics** - Dashboard, low stock, sales reports
- ✅ **Alerts & Notifications** - Low stock and expiry alerts
- ✅ **User Management** - Role-based access control (Admin, Manager, Warehouse Staff, Sales Staff)

## Technology Stack

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core (SQLite for development, SQL Server for production)
- JWT Authentication
- BCrypt for password hashing

### Frontend
- React 18 with TypeScript
- Vite
- React Router
- TanStack Query (React Query)
- Axios

## Project Structure

```
InventoryManagementSystem/
├── src/
│   ├── IMS.API/              # Web API project
│   │   ├── Controllers/      # API controllers
│   │   ├── Services/         # JWT service
│   │   └── Program.cs        # Startup configuration
│   ├── IMS.Core/             # Core domain models and DTOs
│   │   ├── Entities/         # Domain entities
│   │   └── DTOs/             # Data transfer objects
│   └── IMS.Infrastructure/   # Data access and services
│       ├── Data/             # DbContext
│       └── Services/         # Business logic services
└── frontend/                  # React frontend
    └── src/
        ├── pages/            # Page components
        ├── components/       # Reusable components
        ├── contexts/         # React contexts
        └── services/         # API services
```

## Setup Instructions

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (optional, SQLite is used by default)

### Backend Setup

1. Navigate to the solution directory:
```bash
cd "src/IMS.API"
```

2. Restore packages:
```bash
dotnet restore
```

3. Run the API:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Default Login Credentials

- **Email:** admin@ims.com
- **Password:** admin123
- **Role:** Admin

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (Admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create warehouse
- `PUT /api/warehouses/{id}` - Update warehouse

### Purchase Orders
- `GET /api/purchaseorders` - Get all purchase orders
- `GET /api/purchaseorders/{id}` - Get purchase order details
- `POST /api/purchaseorders` - Create purchase order
- `POST /api/purchaseorders/{id}/approve` - Approve purchase order
- `POST /api/purchaseorders/{id}/receive` - Receive goods

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/{id}` - Get sale details
- `POST /api/sales` - Create sale/invoice

### Stock
- `GET /api/stock/levels` - Get stock levels
- `GET /api/stock/transactions` - Get stock transactions
- `POST /api/stock/adjust` - Adjust stock
- `POST /api/stock/transfer` - Transfer stock between warehouses

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/low-stock` - Get low stock report
- `GET /api/reports/expiring-items` - Get expiring items report
- `GET /api/reports/sales` - Get sales report
- `GET /api/reports/top-selling` - Get top selling products

### Alerts
- `GET /api/alerts` - Get alerts
- `POST /api/alerts/{id}/read` - Mark alert as read

## User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration

### Manager
- Monitor inventory
- Approve purchase orders
- View all reports

### Warehouse Staff
- Add stock entries
- Process stock transfers
- Update stock counts
- Create purchase orders

### Sales Staff
- Create sales invoices
- Check product availability
- View sales reports

## Database

The system uses SQLite by default for development. To use SQL Server:

1. Update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=IMS;User Id=sa;Password=YourPassword;TrustServerCertificate=true"
  }
}
```

2. Update `Program.cs` to use `UseSqlServer` instead of `UseSqlite`

3. Run migrations:
```bash
dotnet ef migrations add InitialCreate --project src/IMS.Infrastructure --startup-project src/IMS.API
dotnet ef database update --project src/IMS.Infrastructure --startup-project src/IMS.API
```

## Development

### Adding a New Entity

1. Create entity in `IMS.Core/Entities/`
2. Add DbSet to `ApplicationDbContext`
3. Create DTOs in `IMS.Core/DTOs/`
4. Create service in `IMS.Infrastructure/Services/`
5. Create controller in `IMS.API/Controllers/`

### Running Tests

Tests can be added to a separate test project. Example:
```bash
dotnet new xunit -n IMS.Tests
dotnet add IMS.Tests reference src/IMS.Core
dotnet add IMS.Tests reference src/IMS.Infrastructure
```

## Production Deployment

1. Update `appsettings.json` with production connection string
2. Set JWT secret key in environment variables
3. Build frontend: `npm run build`
4. Configure reverse proxy (nginx/IIS) for frontend
5. Deploy API to hosting service (Azure, AWS, etc.)

## License

This project is provided as-is for educational and commercial use.

## Support

For issues and questions, please create an issue in the repository.

=======
# Inventory-management-system
>>>>>>> 6e1d5ae276e1bd0a50e2ecce04bd1eeaa33a2376
