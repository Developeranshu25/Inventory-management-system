import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Reports() {
  const [activeReport, setActiveReport] = useState<'lowstock' | 'expiring' | 'sales' | 'topselling'>('lowstock')
  const [fromDate, setFromDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const { user } = useAuth()

  const { data: lowStock } = useQuery({
    queryKey: ['low-stock-report'],
    queryFn: async () => {
      const { data } = await api.get('/reports/low-stock')
      return data
    },
    enabled: activeReport === 'lowstock'
  })

  const { data: expiring } = useQuery({
    queryKey: ['expiring-items'],
    queryFn: async () => {
      const { data } = await api.get('/reports/expiring-items', { params: { daysAhead: 30 } })
      return data
    },
    enabled: activeReport === 'expiring'
  })

  const { data: salesReport } = useQuery({
    queryKey: ['sales-report', fromDate, toDate],
    queryFn: async () => {
      const { data } = await api.get('/reports/sales', { params: { fromDate, toDate } })
      return data
    },
    enabled: activeReport === 'sales'
  })

  const { data: topSelling } = useQuery({
    queryKey: ['top-selling'],
    queryFn: async () => {
      const { data } = await api.get('/reports/top-selling', { params: { top: 10 } })
      return data
    },
    enabled: activeReport === 'topselling'
  })

  const canView = user?.role === 'Admin' || user?.role === 'Manager'

  if (!canView) {
    return <div><h1>Reports</h1><p>You don't have permission to view reports.</p></div>
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Reports & Analytics</h1>

      <div style={{ marginBottom: '1rem', borderBottom: '2px solid #dee2e6' }}>
        <button
          onClick={() => setActiveReport('lowstock')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeReport === 'lowstock' ? '#007bff' : 'transparent',
            color: activeReport === 'lowstock' ? 'white' : '#007bff',
            border: 'none',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        >
          Low Stock
        </button>
        <button
          onClick={() => setActiveReport('expiring')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeReport === 'expiring' ? '#007bff' : 'transparent',
            color: activeReport === 'expiring' ? 'white' : '#007bff',
            border: 'none',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        >
          Expiring Items
        </button>
            <button
              onClick={() => setActiveReport('sales')}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeReport === 'sales' ? '#007bff' : 'transparent',
                color: activeReport === 'sales' ? 'white' : '#007bff',
                border: 'none',
                cursor: 'pointer',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px'
              }}
            >
              Sales Report
            </button>
        <button
          onClick={() => setActiveReport('topselling')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeReport === 'topselling' ? '#007bff' : 'transparent',
            color: activeReport === 'topselling' ? 'white' : '#007bff',
            border: 'none',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        >
          Top Selling
        </button>
      </div>

      {activeReport === 'sales' && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label>From Date:</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label>To Date:</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        </div>
      )}

      {activeReport === 'lowstock' && (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>SKU</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Current Stock</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Minimum</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Deficit</th>
              </tr>
            </thead>
            <tbody>
              {lowStock?.map((item: any) => (
                <tr key={item.productId} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{item.productName}</td>
                  <td style={{ padding: '1rem' }}>{item.sku || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#dc3545' }}>{item.currentStock}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>{item.minimumStockLevel}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#dc3545', fontWeight: 'bold' }}>{item.deficit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!lowStock?.length && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No low stock items</div>
          )}
        </div>
      )}

      {activeReport === 'expiring' && (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Batch</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Quantity</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Expiry Date</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Days Until Expiry</th>
              </tr>
            </thead>
            <tbody>
              {expiring?.map((item: any) => (
                <tr key={`${item.productId}-${item.batchNumber}`} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{item.productName}</td>
                  <td style={{ padding: '1rem' }}>{item.batchNumber || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ padding: '1rem' }}>{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: item.daysUntilExpiry <= 7 ? '#dc3545' : '#ffc107' }}>
                    {item.daysUntilExpiry} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!expiring?.length && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No expiring items in the next 30 days</div>
          )}
        </div>
      )}

      {activeReport === 'sales' && (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Invoices</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Total Sales</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {salesReport?.map((item: any) => (
                <tr key={item.date} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{new Date(item.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>{item.invoiceCount}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>${item.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#28a745' }}>${item.totalProfit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!salesReport?.length && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No sales data for selected period</div>
          )}
        </div>
      )}

      {activeReport === 'topselling' && (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Quantity Sold</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topSelling?.map((item: any, index: number) => (
                <tr key={item.productId} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ marginRight: '0.5rem', fontWeight: 'bold', color: '#007bff' }}>#{index + 1}</span>
                    {item.productName}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>{item.quantitySold}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#28a745', fontWeight: 'bold' }}>${item.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!topSelling?.length && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No sales data available</div>
          )}
        </div>
      )}
    </div>
  )
}
