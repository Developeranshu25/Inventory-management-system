import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Sales() {
  const [showForm, setShowForm] = useState(false)
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: salesData } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data } = await api.get('/sales', { params: { page: 1, pageSize: 50 } })
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

  const createMutation = useMutation({
    mutationFn: async (sale: any) => {
      const { data } = await api.post('/sales', sale)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      setShowForm(false)
    }
  })

  const [saleItems, setSaleItems] = useState([{ productId: '', quantity: '', unitPrice: '', discountPercent: '0' }])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const sale = {
      warehouseId: parseInt(formData.get('warehouseId') as string),
      customerName: formData.get('customerName') || null,
      customerPhone: formData.get('customerPhone') || null,
      customerEmail: formData.get('customerEmail') || null,
      taxPercent: parseFloat(formData.get('taxPercent') as string) || 0,
      discountAmount: parseFloat(formData.get('discountAmount') as string) || 0,
      items: saleItems.filter(item => item.productId && item.quantity && item.unitPrice).map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        discountPercent: parseFloat(item.discountPercent) || 0
      }))
    }
    createMutation.mutate(sale)
  }

  const canCreate = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'SalesStaff'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Sales</h1>
        {canCreate && (
          <button
            onClick={() => {
              setShowForm(true)
              setSaleItems([{ productId: '', quantity: '', unitPrice: '', discountPercent: '0' }])
            }}
            style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Create Sale
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Create Sale</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
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
                <label>Customer Name</label>
                <input name="customerName" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Customer Phone</label>
                <input name="customerPhone" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Customer Email</label>
                <input type="email" name="customerEmail" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Tax %</label>
                <input type="number" step="0.01" name="taxPercent" defaultValue="0" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Discount Amount</label>
                <input type="number" step="0.01" name="discountAmount" defaultValue="0" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Items</label>
              {saleItems.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const newItems = [...saleItems]
                      newItems[index].productId = e.target.value
                      const product = products?.find((p: any) => p.id === parseInt(e.target.value))
                      if (product) {
                        newItems[index].unitPrice = product.sellingPrice.toString()
                      }
                      setSaleItems(newItems)
                    }}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select product</option>
                    {products?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} (Stock: {p.totalStock})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...saleItems]
                      newItems[index].quantity = e.target.value
                      setSaleItems(newItems)
                    }}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const newItems = [...saleItems]
                      newItems[index].unitPrice = e.target.value
                      setSaleItems(newItems)
                    }}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Discount %"
                    value={item.discountPercent}
                    onChange={(e) => {
                      const newItems = [...saleItems]
                      newItems[index].discountPercent = e.target.value
                      setSaleItems(newItems)
                    }}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  {saleItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSaleItems(saleItems.filter((_, i) => i !== index))}
                      style={{ padding: '0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSaleItems([...saleItems, { productId: '', quantity: '', unitPrice: '', discountPercent: '0' }])}
                style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                + Add Item
              </button>
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                Create Sale
              </button>
              <button type="button" onClick={() => { setShowForm(false); setSaleItems([{ productId: '', quantity: '', unitPrice: '', discountPercent: '0' }]) }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedSale && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Invoice: {selectedSale.invoiceNumber}</h2>
          <p><strong>Customer:</strong> {selectedSale.customerName || 'Walk-in'}</p>
          <p><strong>Total:</strong> ${selectedSale.totalAmount.toFixed(2)}</p>
          <button onClick={() => setSelectedSale(null)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Invoice</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Customer</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Warehouse</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Total</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesData?.items?.map((sale: any) => (
              <tr key={sale.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{sale.invoiceNumber}</td>
                <td style={{ padding: '1rem' }}>{sale.customerName || 'Walk-in'}</td>
                <td style={{ padding: '1rem' }}>{sale.warehouseName}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>${sale.totalAmount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>{new Date(sale.saleDate).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedSale(sale)}
                    style={{ padding: '0.25rem 0.5rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!salesData?.items?.length && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No sales found</div>
        )}
      </div>
    </div>
  )
}
