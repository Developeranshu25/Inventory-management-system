import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Warehouses() {
  const [showForm, setShowForm] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const { data } = await api.get('/warehouses')
      return data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (warehouse: any) => {
      const { data } = await api.post('/warehouses', warehouse)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      setShowForm(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...warehouse }: any) => {
      const { data } = await api.put(`/warehouses/${id}`, warehouse)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      setShowForm(false)
      setEditingWarehouse(null)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const warehouse = {
      name: formData.get('name'),
      code: formData.get('code') || null,
      address: formData.get('address') || null,
      contactPerson: formData.get('contactPerson') || null,
      phone: formData.get('phone') || null,
    }

    if (editingWarehouse) {
      updateMutation.mutate({ id: editingWarehouse.id, ...warehouse })
    } else {
      createMutation.mutate(warehouse)
    }
  }

  const canEdit = user?.role === 'Admin'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Warehouses</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingWarehouse(null)
              setShowForm(true)
            }}
            style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add Warehouse
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>{editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Name *</label>
                <input name="name" defaultValue={editingWarehouse?.name} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Code</label>
                <input name="code" defaultValue={editingWarehouse?.code} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Contact Person</label>
                <input name="contactPerson" defaultValue={editingWarehouse?.contactPerson} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label>Phone</label>
                <input name="phone" defaultValue={editingWarehouse?.phone} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Address</label>
              <textarea name="address" defaultValue={editingWarehouse?.address} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                {editingWarehouse ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingWarehouse(null) }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Code</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Contact</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Phone</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses?.map((warehouse: any) => (
              <tr key={warehouse.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{warehouse.name}</td>
                <td style={{ padding: '1rem' }}>{warehouse.code || '-'}</td>
                <td style={{ padding: '1rem' }}>{warehouse.contactPerson || '-'}</td>
                <td style={{ padding: '1rem' }}>{warehouse.phone || '-'}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: warehouse.isActive ? '#28a745' : '#dc3545', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {canEdit && (
                    <button
                      onClick={() => { setEditingWarehouse(warehouse); setShowForm(true) }}
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
        {!warehouses?.length && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No warehouses found</div>
        )}
      </div>
    </div>
  )
}
