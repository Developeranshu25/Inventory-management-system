# 🚀 Start the Application NOW

## ✅ Frontend Status
**Starting...** The frontend dev server is launching in the background.

---

## 🔧 Backend - Start in Your Terminal

The backend runs using the **local .NET SDK bundled in this project**. Start it manually in a new terminal:

### Option 1: Use Terminal (Recommended)

Open a **new terminal window** and run:

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

### Option 2: Use the Script

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"
./start-backend.sh
```

---

## 🌐 Access URLs

Once both are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5050  
- **Swagger Docs:** http://localhost:5050/swagger

---

## 🔐 Login

- **Email:** `admin@ims.com`
- **Password:** `admin123`

---

## ✅ Quick Check

**Frontend:** Open http://localhost:3000 in your browser

**Backend:** Check http://localhost:5050/swagger - you should see all API endpoints including:
- `/api/users` (NEW - User Management)
- `/api/salesreturns` (NEW - Sales Returns)
- `/api/reports/dead-stock` (NEW)
- `/api/reports/supplier-performance` (NEW)

---

## 📝 What's New

1. **User Management** - Admin can manage users via `/api/users`
2. **Sales Returns** - Handle returns via `/api/salesreturns`
3. **Dead Stock Report** - Find slow-moving inventory
4. **Supplier Performance** - Track supplier metrics
5. **Overstock Alerts** - Prevent overstocking

---

**Frontend is starting! Start the backend in your terminal to complete the setup.**
