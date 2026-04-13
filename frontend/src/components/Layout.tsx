import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/warehouses', label: 'Warehouses' },
    { path: '/purchase-orders', label: 'Purchase Orders' },
    { path: '/sales', label: 'Sales' },
    { path: '/stock', label: 'Stock' },
    { path: '/reports', label: 'Reports' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '1rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>IMS</h2>
        <nav>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'block',
                padding: '0.75rem',
                color: location.pathname === item.path ? '#3498db' : 'white',
                textDecoration: 'none',
                background: location.pathname === item.path ? '#34495e' : 'transparent',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #34495e' }}>
          <div style={{ marginBottom: '1rem' }}>{user?.firstName} {user?.lastName}</div>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#95a5a6' }}>{user?.role}</div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <Outlet />
      </main>
    </div>
  )
}

