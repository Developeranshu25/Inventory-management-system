import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function PurchaseOrders() {
  const [showForm, setShowForm] = useState(false)
  const [selectedPO, setSelectedPO] = useState<any>(null)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: posData } = useQuery({
    queryKey: ['purchaseorders'],
    queryFn: async () => {
      const { data } = await api.get('/purchaseorders', { params: { page: 1, pageSize: 50 } })
      return data
    }
  })

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data } = await api.get('/suppliers', { params: { page: 1, pageSize: 100 } })
      return data.items || []
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

  const createMutation = useMutation({
    mutationFn: async (po: any) => {
      const { data } = await api.post('/purchaseorders', po)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseorders'] })
      setShowForm(false)
    }
  })

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/purchaseorders/${id}/approve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseorders'] })
    }
  })

  const receiveMutation = useMutation({
    mutationFn: async ({ id, warehouseId }: { id: number; warehouseId: number }) => {
      await api.post(`/purchaseorders/${id}/receive`, { warehouseId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseorders'] })
      setSelectedPO(null)
    }
  })

  const [poItems, setPoItems] = useState([{ productId: '', quantity: '', unitCost: '' }])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const po = {
      supplierId: parseInt(formData.get('supplierId') as string),
      orderDate: formData.get('orderDate') || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: formData.get('expectedDeliveryDate') || null,
      items: poItems.filter(item => item.productId && item.quantity && item.unitCost).map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        unitCost: parseFloat(item.unitCost)
      }))
    }
    createMutation.mutate(po)
  }

  const canCreate = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'WarehouseStaff'
  const canApprove = user?.role === 'Admin' || user?.role === 'Manager'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Purchase Orders</h1>
        {canCreate && (
          <button
            onClick={() => {
              setShowForm(true)
              setPoItems([{ productId: '', quantity: '', unitCost: '' }])
            }}
            style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Create PO
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Create Purchase Order</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Supplier *</label>
                <select name="supplierId" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select supplier</option>
                  {suppliers?.map((sup: any) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Order Date</label>
                <input type="date" name="orderDate" defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Expected Delivery Date</label>
                <input type="date" name="expectedDeliveryDate" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Items</label>
              {poItems.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const newItems = [...poItems]
                      newItems[index].productId = e.target.value
                      setPoItems(newItems)
                    }}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select product</option>
                    {products?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...poItems]
                      newItems[index].quantity = e.target.value
                      setPoItems(newItems)
                    }}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Cost"
                    value={item.unitCost}
                    onChange={(e) => {
                      const newItems = [...poItems]
                      newItems[index].unitCost = e.target.value
                      setPoItems(newItems)
                    }}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  {poItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPoItems(poItems.filter((_, i) => i !== index))}
                      style={{ padding: '0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPoItems([...poItems, { productId: '', quantity: '', unitCost: '' }])}
                style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                + Add Item
              </button>
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                Create PO
              </button>
              <button type="button" onClick={() => { setShowForm(false); setPoItems([{ productId: '', quantity: '', unitCost: '' }]) }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedPO && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>PO: {selectedPO.poNumber}</h2>
          <p><strong>Supplier:</strong> {selectedPO.supplierName}</p>
          <p><strong>Status:</strong> {selectedPO.status}</p>
          <p><strong>Total:</strong> ${selectedPO.totalAmount.toFixed(2)}</p>
          {selectedPO.status === 'Approved' && (
            <div style={{ marginTop: '1rem' }}>
              <label>Receive to Warehouse:</label>
              <select
                id="receiveWarehouse"
                style={{ marginLeft: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {warehouses?.map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const warehouseId = parseInt((document.getElementById('receiveWarehouse') as HTMLSelectElement).value)
                  receiveMutation.mutate({ id: selectedPO.id, warehouseId })
                }}
                style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Receive Goods
              </button>
            </div>
          )}
          <button onClick={() => setSelectedPO(null)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>PO Number</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Supplier</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Total</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posData?.items?.map((po: any) => (
              <tr key={po.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{po.poNumber}</td>
                <td style={{ padding: '1rem' }}>{po.supplierName}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: po.status === 'Received' ? '#28a745' : po.status === 'Approved' ? '#17a2b8' : '#ffc107', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
                    {po.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>${po.totalAmount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>{new Date(po.orderDate || po.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedPO(po)}
                    style={{ padding: '0.25rem 0.5rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem' }}
                  >
                    View
                  </button>
                  {canApprove && po.status === 'Draft' && (
                    <button
                      onClick={() => approveMutation.mutate(po.id)}
                      style={{ padding: '0.25rem 0.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!posData?.items?.length && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No purchase orders found</div>
        )}
      </div>
    </div>
  )
}
