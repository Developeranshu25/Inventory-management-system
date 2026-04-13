import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'
import Warehouses from './pages/Warehouses'
import PurchaseOrders from './pages/PurchaseOrders'
import Sales from './pages/Sales'
import Stock from './pages/Stock'
import Reports from './pages/Reports'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="sales" element={<Sales />} />
        <Route path="stock" element={<Stock />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

