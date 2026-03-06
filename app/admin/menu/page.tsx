"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  Loader2, 
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
}

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  category_id: string
  display_order: number
  category?: { name: string }
}

interface MenuItemForm {
  id?: string
  name: string
  description: string
  price: string
  category_id: string
  image_url: string
  is_available: boolean
  display_order: string
}

const initialFormState: MenuItemForm = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  image_url: '',
  is_available: true,
  display_order: '0',
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState<MenuItemForm>(initialFormState)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchMenu = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/menu')
      const data = await response.json()
      if (data.data) {
        setCategories(data.data.categories)
        setItems(data.data.items)
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
      toast.error('Failed to fetch menu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    setTogglingId(id)
    try {
      const response = await fetch(`/api/admin/menu/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', is_available: !currentStatus }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_available: !currentStatus } : item
      ))

      toast.success(`Item ${!currentStatus ? 'enabled' : 'disabled'}`)
    } catch (error) {
      toast.error('Failed to update availability')
    } finally {
      setTogglingId(null)
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData(initialFormState)
    setIsModalOpen(true)
  }

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id,
      image_url: item.image_url || '',
      is_available: item.is_available,
      display_order: item.display_order?.toString() || '0',
    })
    setIsModalOpen(true)
  }

  const openDeleteDialog = (item: MenuItem) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        display_order: parseInt(formData.display_order) || 0,
      }

      const method = editingItem ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      if (editingItem) {
        setItems(prev => prev.map(item => 
          item.id === editingItem.id ? data.data : item
        ))
        toast.success('Menu item updated successfully')
      } else {
        setItems(prev => [...prev, data.data])
        toast.success('Menu item created successfully')
      }

      setIsModalOpen(false)
      setFormData(initialFormState)
      setEditingItem(null)
    } catch (error) {
      toast.error(editingItem ? 'Failed to update item' : 'Failed to create item')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/menu?id=${itemToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setItems(prev => prev.filter(item => item.id !== itemToDelete.id))
      toast.success('Menu item deleted successfully')
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (error) {
      toast.error('Failed to delete item')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Manage menu items and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMenu}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Button onClick={openCreateModal} className="bg-brand-red hover:bg-brand-red/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No menu items found</p>
          <Button onClick={openCreateModal} variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add your first item
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border bg-card overflow-hidden transition-all",
                item.is_available ? "border-border" : "border-destructive/30 bg-destructive/5"
              )}
            >
              <div className="relative h-40">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className={cn("object-cover", !item.is_available && "opacity-50")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                {!item.is_available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/50">
                    <span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-primary-foreground">
                      Unavailable
                    </span>
                  </div>
                )}
                {/* Edit/Delete buttons */}
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-lg bg-background/90 p-2 text-foreground shadow-sm transition-colors hover:bg-background"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(item)}
                    className="rounded-lg bg-background/90 p-2 text-destructive shadow-sm transition-colors hover:bg-background"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category?.name}</p>
                  </div>
                  <span className="flex-shrink-0 font-bold text-brand-red">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>
                {item.description && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                )}
                <button
                  onClick={() => toggleAvailability(item.id, item.is_available)}
                  disabled={togglingId === item.id}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    item.is_available
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  )}
                >
                  {togglingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : item.is_available ? (
                    <>
                      <ToggleRight className="h-4 w-4" />
                      Available
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4" />
                      Unavailable
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_available" className="font-normal">Available for ordering</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-red hover:bg-brand-red/90" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? 'Update Item' : 'Create Item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{itemToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
