import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Categories() {
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
      return data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (category: any) => {
      const { data } = await api.post('/categories', category)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setShowForm(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...category }: any) => {
      const { data } = await api.put(`/categories/${id}`, category)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setShowForm(false)
      setEditingCategory(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const category = {
      name: formData.get('name'),
      description: formData.get('description') || null,
      parentCategoryId: formData.get('parentCategoryId') ? parseInt(formData.get('parentCategoryId') as string) : null,
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...category })
    } else {
      createMutation.mutate(category)
    }
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Categories</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingCategory(null)
              setShowForm(true)
            }}
            style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add Category
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Name *</label>
              <input name="name" defaultValue={editingCategory?.name} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Description</label>
              <textarea name="description" defaultValue={editingCategory?.description} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Parent Category</label>
              <select name="parentCategoryId" defaultValue={editingCategory?.parentCategoryId} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="">None (Top Level)</option>
                {categories?.filter((c: any) => c.id !== editingCategory?.id).map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingCategory(null) }} style={{ padding: '0.75rem 1.5rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Parent</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Products</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category: any) => (
              <tr key={category.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{category.name}</td>
                <td style={{ padding: '1rem' }}>{category.parentCategoryName || '-'}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>{category.productCount}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => { setEditingCategory(category); setShowForm(true) }}
                        style={{ padding: '0.25rem 0.5rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem' }}
                      >
                        Edit
                      </button>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => deleteMutation.mutate(category.id)}
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
        {!categories?.length && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>No categories found</div>
        )}
      </div>
    </div>
  )
}
