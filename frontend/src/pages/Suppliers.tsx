import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Suppliers() {
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<any>(null)
  const [search, setSearch] = useState('')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers', search],
    queryFn: async () => {
      const { data } = await api.get('/suppliers', { params: { search, page: 1, pageSize: 100 } })
      return data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (supplier: any) => {
      const { data } = await api.post('/suppliers', supplier)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      setShowForm(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...supplier }: any) => {
      const { data } = await api.put(`/suppliers/${id}`, supplier)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      setShowForm(false)
      setEditingSupplier(null)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const supplier = {
      name: formData.get('name'),
      phone: formData.get('phone') || null,
      email: formData.get('email') || null,
      address: formData.get('address') || null,
      gstTaxId: formData.get('gstTaxId') || null,
      contactPerson: formData.get('contactPerson') || null,
    }

    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, ...supplier })
    } else {
      createMutation.mutate(supplier)
    }
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Suppliers</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingSupplier(null)
              setShowForm(true)
            }}
            style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add Supplier
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '300px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Name *</label>
                <input name="name" defaultValue={editingSupplier?.name} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Contact Person</label>
                <input name="contactPerson" defaultValue={editingSupplier?.contactPerson} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Phone</label>
                <input name="phone" defaultValue={editingSupplier?.phone} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" name="email" defaultValue={editingSupplier?.email} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>GST/Tax ID</label>
                <input name="gstTaxId" defaultValue={editingSupplier?.gstTaxId} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Address</label>
              <textarea name="address" defaultValue={editingSupplier?.address} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                {editingSupplier ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingSupplier(null) }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Contact</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Phone</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliersData?.items?.map((supplier: any) => (
              <tr key={supplier.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{supplier.name}</td>
                <td style={{ padding: '1rem' }}>{supplier.contactPerson || '-'}</td>
                <td style={{ padding: '1rem' }}>{supplier.email || '-'}</td>
                <td style={{ padding: '1rem' }}>{supplier.phone || '-'}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: supplier.isActive ? '#28a745' : '#dc3545', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
                    {supplier.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {canEdit && (
                    <button
                      onClick={() => { setEditingSupplier(supplier); setShowForm(true) }}
                      style={{ padding: '0.25rem 0.5rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!suppliersData?.items?.length && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No suppliers found</div>
        )}
      </div>
    </div>
  )
}
