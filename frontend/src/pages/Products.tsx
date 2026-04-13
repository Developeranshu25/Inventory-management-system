import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Products() {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [search, setSearch] = useState('')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: productsData } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const { data } = await api.get('/products', { params: { search, page: 1, pageSize: 100 } })
      return data
    }
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
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

  const createMutation = useMutation({
    mutationFn: async (product: any) => {
      const { data } = await api.post('/products', product)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...product }: any) => {
      const { data } = await api.put(`/products/${id}`, product)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
      setEditingProduct(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const product = {
      name: formData.get('name'),
      sku: formData.get('sku') || null,
      barcode: formData.get('barcode') || null,
      categoryId: parseInt(formData.get('categoryId') as string),
      supplierId: formData.get('supplierId') ? parseInt(formData.get('supplierId') as string) : null,
      unit: formData.get('unit'),
      costPrice: parseFloat(formData.get('costPrice') as string),
      sellingPrice: parseFloat(formData.get('sellingPrice') as string),
      minimumStockLevel: parseInt(formData.get('minimumStockLevel') as string),
      description: formData.get('description') || null,
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...product })
    } else {
      createMutation.mutate(product)
    }
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'WarehouseStaff'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Products</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add Product
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '300px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Name *</label>
                <input name="name" defaultValue={editingProduct?.name} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>SKU</label>
                <input name="sku" defaultValue={editingProduct?.sku} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Barcode</label>
                <input name="barcode" defaultValue={editingProduct?.barcode} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Category *</label>
                <select name="categoryId" defaultValue={editingProduct?.categoryId} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select category</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Supplier</label>
                <select name="supplierId" defaultValue={editingProduct?.supplierId} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select supplier</option>
                  {suppliers?.map((sup: any) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Unit *</label>
                <select name="unit" defaultValue={editingProduct?.unit || 'pcs'} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="box">box</option>
                </select>
              </div>
              <div>
                <label>Cost Price *</label>
                <input type="number" step="0.01" name="costPrice" defaultValue={editingProduct?.costPrice} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Selling Price *</label>
                <input type="number" step="0.01" name="sellingPrice" defaultValue={editingProduct?.sellingPrice} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Minimum Stock Level *</label>
                <input type="number" name="minimumStockLevel" defaultValue={editingProduct?.minimumStockLevel || 0} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Description</label>
              <textarea name="description" defaultValue={editingProduct?.description} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                {editingProduct ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null) }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>SKU</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Category</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Cost</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Price</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Stock</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsData?.items?.map((product: any) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{product.name}</td>
                <td style={{ padding: '1rem' }}>{product.sku || '-'}</td>
                <td style={{ padding: '1rem' }}>{product.categoryName}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>${product.costPrice.toFixed(2)}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>${product.sellingPrice.toFixed(2)}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: product.totalStock < product.minimumStockLevel ? '#dc3545' : 'inherit' }}>
                  {product.totalStock} {product.unit}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => { setEditingProduct(product); setShowForm(true) }}
                        style={{ padding: '0.25rem 0.5rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem' }}
                      >
                        Edit
                      </button>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => deleteMutation.mutate(product.id)}
                          style={{ padding: '0.25rem 0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!productsData?.items?.length && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No products found</div>
        )}
      </div>
    </div>
  )
}
