# 🔧 Install .NET SDK to Run Backend

## ✅ Current Status

- ✅ **Frontend:** Can run at http://localhost:3000
- ✅ **Backend:** Uses the local .NET SDK bundled in this project

---

## 📥 Local .NET 8 SDK

This project already includes a local .NET 8 SDK in the `.dotnet` folder, so you **do not need to install .NET globally**.

---

## ✅ Verify Installation

You can verify the bundled SDK by running (from the project root):

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"
export PATH="$PWD/.dotnet:$PATH"
dotnet --version
```

---

## 🚀 Start Backend

Use the local .NET SDK from the project root:

```bash
cd "/Users/anshuyadav/Documents/ankur coding/Inventory management system"

export PATH="$PWD/.dotnet:$PATH"
export DOTNET_CLI_HOME="$PWD/.dotnet_cli"
export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
export DOTNET_USE_POLLING_FILE_WATCHER=1

cd src/IMS.API
dotnet restore
dotnet run --urls http://localhost:5050
```

---

## 🌐 Access Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5050
- **Swagger:** http://localhost:5050/swagger

**Login:**
- Email: `admin@ims.com`
- Password: `admin123`

---

## ⚡ Quick Command Reference

```bash
# Check if .NET is installed
dotnet --version

# Start backend (after .NET install)
cd src/IMS.API && dotnet run

# Start frontend (already running)
cd frontend && npm run dev
```

---

**The frontend is already running! Just install .NET SDK and start the backend!**
