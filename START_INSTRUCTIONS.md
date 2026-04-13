# 🚀 How to Run the Inventory Management System

## Prerequisites

### 1. Local .NET SDK (already in the repo ✅)
This project includes a local .NET 8 SDK in the `.dotnet` folder, so you **do not need to install .NET globally**.

### 2. Node.js (Already Installed ✅)
You have Node.js v24.11.1 installed - that's perfect!

---

## 🎯 Quick Start (Recommended)

You will use **two terminals**: one for the backend API, one for the frontend.

### Terminal 1 – Backend (API on port 5050)

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"

# Use the project-local .NET SDK
export PATH="$PWD/.dotnet:$PATH"
export DOTNET_CLI_HOME="$PWD/.dotnet_cli"
export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
export DOTNET_USE_POLLING_FILE_WATCHER=1

# Go to the API project
cd src/IMS.API

# Restore and run
dotnet restore
dotnet run --urls http://localhost:5050
```

Backend will start at: `http://localhost:5050`

### Terminal 2 – Frontend (Vite dev server)

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system/frontend"

# First time only (or when deps change)
npm install

# Start dev server
npm run dev
```

Frontend will start at: `http://localhost:3000`

### Alternative: Use the helper scripts

From the project root:

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"

# Backend only (uses local .NET, port 5050)
./start-backend.sh

# Frontend only
./run-frontend.sh
```

---

## 📝 First Time Setup

### Backend Setup:
1. Navigate to project root and enable local .NET:
   ```bash
   cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"
   export PATH="$PWD/.dotnet:$PATH"
   export DOTNET_CLI_HOME="$PWD/.dotnet_cli"
   export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
   export DOTNET_USE_POLLING_FILE_WATCHER=1
   ```

2. Navigate to API project:
   ```bash
   cd src/IMS.API
   ```

3. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

4. Run the API:
   ```bash
   dotnet run --urls http://localhost:5050
   ```

5. The API will:
   - Create SQLite database automatically (`inventory.db`)
   - Create default admin user
   - Start on `http://localhost:5050`
   - Swagger UI available at `http://localhost:5050/swagger`

### Frontend Setup:
1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done ✅):
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Frontend will start on `http://localhost:3000`

---

## 🔐 Login Credentials

- **Email:** `admin@ims.com`
- **Password:** `admin123`
- **Role:** Admin

---

## ✅ Verify It's Running

1. **Backend:** Open `http://localhost:5050/swagger` - you should see API documentation
2. **Frontend:** Open `http://localhost:3000` - you should see the login page

---

## 🐛 Troubleshooting

### Backend Issues:

**"dotnet: command not found"**
- Make sure you exported the local `.dotnet` folder:
  ```bash
  cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"
  export PATH="$PWD/.dotnet:$PATH"
  export DOTNET_CLI_HOME="$PWD/.dotnet_cli"
  export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
  ```

**Port 5050 already in use:**
- Change port in `src/IMS.API/Properties/launchSettings.json`
- Or kill the process using port 5050:
  ```bash
  lsof -ti:5050 | xargs kill
  ```

**Database errors:**
- Delete `inventory.db` file and restart
- Database will be recreated automatically

### Frontend Issues:

**Port 3000 already in use:**
- Change port in `frontend/vite.config.ts`
- Or kill the process:
  ```bash
  lsof -ti:3000 | xargs kill
  ```

**Module not found errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Ensure backend is running on port 5050
- Check CORS settings in `src/IMS.API/Program.cs`

---

## 📊 What to Expect

Once both services are running:

1. **Open browser:** `http://localhost:3000`
2. **Login** with admin credentials
3. **Dashboard** shows statistics
4. **Navigate** through all modules:
   - Products
   - Categories
   - Suppliers
   - Warehouses
   - Purchase Orders
   - Sales
   - Stock
   - Reports

---

## 🎉 Success!

If you see the login page and can log in, everything is working correctly!

---

**Note:** The frontend dev server is already starting. Once .NET SDK is installed, start the backend in a separate terminal.
