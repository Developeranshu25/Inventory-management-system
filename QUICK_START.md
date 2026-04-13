# ⚡ Quick Start Guide

## Current Status

✅ **Frontend:** Can run on http://localhost:3000  
✅ **Backend:** Uses the local .NET SDK bundled in this project

---

## 🚀 To Run Everything:

Use **two terminals** – one for backend, one for frontend.

### Terminal 1 – Backend (API on port 5050)

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"

# Use the project-local .NET SDK
export PATH="$PWD/.dotnet:$PATH"
export DOTNET_CLI_HOME="$PWD/.dotnet_cli"
export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
export DOTNET_USE_POLLING_FILE_WATCHER=1

cd src/IMS.API
dotnet restore
dotnet run --urls http://localhost:5050
```

### Terminal 2 – Frontend

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system/frontend"

# First time only
npm install

npm run dev
```

---

## 🌐 Access the Application

Once both are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5050
- **Swagger Docs:** http://localhost:5050/swagger

**Login:**
- Email: `admin@ims.com`
- Password: `admin123`

---

## ✅ What's Already Done

- ✅ Frontend dependencies installed
- ✅ Frontend dev server configured
- ✅ All code files created
- ✅ Database will auto-create on first backend run

---

## 📝 Next Steps

1. **Install .NET SDK** (if not already installed)
2. **Run the backend** using one of the methods above
3. **Open browser** to http://localhost:3000
4. **Login** and start using the system!

---

**Note:** The frontend may already be running. Check http://localhost:3000 in your browser!
