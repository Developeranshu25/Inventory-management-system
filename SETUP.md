# Setup Guide - Inventory Management System

## Quick Start

### Prerequisites
- .NET 8 SDK installed
- Node.js 18+ and npm installed
- Git (optional)

### Step 1: Backend Setup

1. From the project root, enable the local .NET SDK:
```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"
export PATH="$PWD/.dotnet:$PATH"
export DOTNET_CLI_HOME="$PWD/.dotnet_cli"
export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
export DOTNET_USE_POLLING_FILE_WATCHER=1
```

2. Navigate to the API project:
```bash
cd src/IMS.API
```

3. Restore NuGet packages:
```bash
dotnet restore
```

4. Run the backend:
```bash
dotnet run --urls http://localhost:5050
```

The API will start at `http://localhost:5050`
- Swagger UI: `http://localhost:5050/swagger`
- API Base: `http://localhost:5050/api`

### Step 2: Frontend Setup

1. Open a new terminal and navigate to frontend:
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

The frontend will start at `http://localhost:3000`

### Step 3: Login

Use the default admin credentials:
- **Email:** admin@ims.com
- **Password:** admin123

## Project Structure

```
InventoryManagementSystem/
├── src/
│   ├── IMS.API/              # Web API (Controllers, Program.cs)
│   ├── IMS.Core/             # Domain Models & DTOs
│   └── IMS.Infrastructure/   # Data Access & Services
├── frontend/                 # React Frontend
└── README.md                 # Full documentation
```

## Database

The system uses SQLite by default (inventory.db file will be created automatically).

To use SQL Server:
1. Update `appsettings.json` connection string
2. Change `UseSqlite` to `UseSqlServer` in `Program.cs`
3. Run migrations: `dotnet ef database update`

## API Testing

### Using Swagger
1. Navigate to `http://localhost:5050/swagger`
2. Click "Authorize" and enter: `Bearer <your-token>`
3. Test endpoints directly from Swagger UI

### Using cURL

Login:
```bash
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ims.com","password":"admin123"}'
```

Get Products (with token):
```bash
curl -X GET http://localhost:5050/api/products \
  -H "Authorization: Bearer <your-token>"
```

## Troubleshooting

### Backend Issues

**Port already in use:**
- Change port in `Properties/launchSettings.json`

**Database errors:**
- Delete `inventory.db` file and restart
- Check connection string in `appsettings.json`

**Missing packages:**
```bash
dotnet restore
```

### Frontend Issues

**Port already in use:**
- Change port in `vite.config.ts`

**Module not found:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Ensure backend is running on port 5050
- Check CORS settings in `Program.cs`

## Development Workflow

1. Start backend: `cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system" && export PATH="$PWD/.dotnet:$PATH" && export DOTNET_CLI_HOME="$PWD/.dotnet_cli" && export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 && cd src/IMS.API && dotnet run --urls http://localhost:5050`
2. Start frontend: `cd frontend && npm run dev`
3. Make changes to code
4. Hot reload will update automatically

## Building for Production

### Backend
```bash
cd src/IMS.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

## Next Steps

1. Create your first product
2. Add a supplier
3. Create a warehouse
4. Create a purchase order
5. Receive goods
6. Create a sale

For detailed API documentation, see `README.md`
