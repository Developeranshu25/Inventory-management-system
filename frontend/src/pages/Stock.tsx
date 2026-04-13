import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Stock() {
  const [activeTab, setActiveTab] = useState<'levels' | 'transactions' | 'adjust' | 'transfer'>('levels')
  const [showAdjustForm, setShowAdjustForm] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: stockLevels } = useQuery({
    queryKey: ['stock-levels'],
    queryFn: async () => {
      const { data } = await api.get('/stock/levels')
      return data
    }
  })

  const { data: transactions } = useQuery({
    queryKey: ['stock-transactions'],
    queryFn: async () => {
      const { data } = await api.get('/stock/transactions', { params: { page: 1, pageSize: 50 } })
      return data
    }
  })

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products', { params: { page: 1, pageSize: 100 } })
      return data.items || []
    }
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const { data } = await api.get('/warehouses')
      return data
    }
  })

  const adjustMutation = useMutation({
    mutationFn: async (adjustment: any) => {
      const { data } = await api.post('/stock/adjust', adjustment)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] })
      queryClient.invalidateQueries({ queryKey: ['stock-transactions'] })
      setShowAdjustForm(false)
    }
  })

  const transferMutation = useMutation({
    mutationFn: async (transfer: any) => {
      const { data } = await api.post('/stock/transfer', transfer)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] })
      queryClient.invalidateQueries({ queryKey: ['stock-transactions'] })
      setShowTransferForm(false)
    }
  })

  const handleAdjustSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const adjustment = {
      productId: parseInt(formData.get('productId') as string),
      warehouseId: parseInt(formData.get('warehouseId') as string),
      quantity: parseInt(formData.get('quantity') as string),
      notes: formData.get('notes') || null,
    }
    adjustMutation.mutate(adjustment)
  }

  const handleTransferSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const transfer = {
      productId: parseInt(formData.get('productId') as string),
      fromWarehouseId: parseInt(formData.get('fromWarehouseId') as string),
      toWarehouseId: parseInt(formData.get('toWarehouseId') as string),
      quantity: parseInt(formData.get('quantity') as string),
      notes: formData.get('notes') || null,
    }
    transferMutation.mutate(transfer)
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'WarehouseStaff'

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Stock Management</h1>

      <div style={{ marginBottom: '1rem', borderBottom: '2px solid #dee2e6' }}>
        <button
          onClick={() => setActiveTab('levels')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'levels' ? '#007bff' : 'transparent',
            color: activeTab === 'levels' ? 'white' : '#007bff',
            border: 'none',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        >
          Stock Levels
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'transactions' ? '#007bff' : 'transparent',
            color: activeTab === 'transactions' ? 'white' : '#007bff',
            border: 'none',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        >
          Transactions
        </button>
        {canEdit && (
          <>
            <button
              onClick={() => { setActiveTab('adjust'); setShowAdjustForm(true) }}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'adjust' ? '#007bff' : 'transparent',
                color: activeTab === 'adjust' ? 'white' : '#007bff',
                border: 'none',
                cursor: 'pointer',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px'
              }}
            >
              Adjust Stock
            </button>
            <button
              onClick={() => { setActiveTab('transfer'); setShowTransferForm(true) }}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'transfer' ? '#007bff' : 'transparent',
                color: activeTab === 'transfer' ? 'white' : '#007bff',
                border: 'none',
                cursor: 'pointer',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px'
              }}
            >
              Transfer Stock
            </button>
          </>
        )}
      </div>

      {activeTab === 'levels' && (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Warehouse</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Quantity</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Batch</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {stockLevels?.map((level: any) => (
                <tr key={level.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{level.productName}</td>
                  <td style={{ padding: '1rem' }}>{level.warehouseName}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>{level.quantity}</td>
                  <td style={{ padding: '1rem' }}>{level.batchNumber || '-'}</td>
                  <td style={{ padding: '1rem' }}>{level.expiryDate ? new Date(level.expiryDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!stockLevels?.length && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No stock levels found</div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Warehouse</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Quantity</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.items?.map((tx: any) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{tx.productName}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: tx.transactionType === 'StockIn' ? '#28a745' : tx.transactionType === 'StockOut' ? '#dc3545' : '#17a2b8', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {tx.transactionType}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{tx.warehouseName}{tx.toWarehouseName && ` → ${tx.toWarehouseName}`}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: tx.quantity > 0 ? '#28a745' : '#dc3545' }}>
                    {tx.quantity > 0 ? '+' : ''}{tx.quantity}
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!transactions?.items?.length && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No transactions found</div>
          )}
        </div>
      )}

      {showAdjustForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Adjust Stock</h2>
          <p style={{ color: '#6c757d', marginBottom: '1rem' }}>Use positive number for stock in, negative for stock out</p>
          <form onSubmit={handleAdjustSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Product *</label>
                <select name="productId" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select product</option>
                  {products?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Warehouse *</label>
                <select name="warehouseId" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select warehouse</option>
                  {warehouses?.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Quantity * (positive = in, negative = out)</label>
                <input type="number" name="quantity" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Notes</label>
              <textarea name="notes" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                Adjust
              </button>
              <button type="button" onClick={() => { setShowAdjustForm(false); setActiveTab('levels') }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showTransferForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Transfer Stock</h2>
          <form onSubmit={handleTransferSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Product *</label>
                <select name="productId" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select product</option>
                  {products?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>From Warehouse *</label>
                <select name="fromWarehouseId" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select warehouse</option>
                  {warehouses?.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>To Warehouse *</label>
                <select name="toWarehouseId" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select warehouse</option>
                  {warehouses?.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Quantity *</label>
                <input type="number" name="quantity" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Notes</label>
              <textarea name="notes" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                Transfer
              </button>
              <button type="button" onClick={() => { setShowTransferForm(false); setActiveTab('levels') }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
