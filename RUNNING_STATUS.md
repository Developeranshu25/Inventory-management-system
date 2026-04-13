# 🚀 Application Running Status

## ✅ Current Status

### Frontend: ✅ **RUNNING**
- **URL:** http://localhost:3000
- **Status:** Active and accessible

### Backend: ✅ **RUNNING**
- **URL:** http://localhost:5050
- **Swagger:** http://localhost:5050/swagger
- **Status:** Active and accessible

---

## 🌐 Access the Application

### 1. Open Frontend
```
http://localhost:3000
```

### 2. Login Credentials
- **Email:** `admin@ims.com`
- **Password:** `admin123`
- **Role:** Admin

### 3. API Documentation
```
http://localhost:5050/swagger
```

---

## ✨ New Features Available

### User Management (Admin Only)
- Navigate to: **Users** section (if added to frontend)
- Or use API: `GET /api/users`

### Sales Returns
- Use API: `POST /api/salesreturns`
- Returns automatically restock inventory

### New Reports
- Dead Stock: `GET /api/reports/dead-stock`
- Supplier Performance: `GET /api/reports/supplier-performance`

### Enhanced Alerts
- Overstock alerts now active
- Check: `GET /api/alerts`

---

## 🔄 To Restart Services

### Stop Current Services:
```bash
# Find and kill backend process
lsof -ti:5050 | xargs kill

# Find and kill frontend process  
lsof -ti:3000 | xargs kill
```

### Restart Backend:
```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"

# Use the project-local .NET SDK
export PATH="$PWD/.dotnet:$PATH"
export DOTNET_CLI_HOME="$PWD/.dotnet_cli"
export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
export DOTNET_USE_POLLING_FILE_WATCHER=1

cd src/IMS.API
dotnet run --urls http://localhost:5050
```

### Restart Frontend:
```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system/frontend"
npm run dev
```

---

## ✅ Verification

Both services are running and ready to use!

1. ✅ Frontend accessible at http://localhost:3000
2. ✅ Backend API accessible at http://localhost:5050
3. ✅ Swagger documentation available
4. ✅ All new features loaded

---

**Status:** ✅ **BOTH SERVICES RUNNING**
