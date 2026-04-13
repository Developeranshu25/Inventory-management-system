import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/reports/dashboard')
      return data
    }
  })

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Total Products</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalProducts}</div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Low Stock Items</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{stats.lowStockCount}</div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Warehouses</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalWarehouses}</div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Pending POs</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pendingPurchaseOrders}</div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Today Sales</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>${stats.todaySales.toFixed(2)}</div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Month Sales</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>${stats.monthSales.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

