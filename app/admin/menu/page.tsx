"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save, ImagePlus } from 'lucide-react'
import { menuItems, categories } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminMenuPage() {
  const [items, setItems] = useState(menuItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'beef-burgers',
  })

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    toast.success('Item deleted successfully')
  }

  const handleSaveEdit = () => {
    if (!editingItem) return
    setItems(items.map((item) => (item.id === editingItem.id ? editingItem : item)))
    setEditingItem(null)
    toast.success('Item updated successfully')
  }

  const handleAddNew = () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Please fill in all required fields')
      return
    }
    const item: MenuItem = {
      id: `new-${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      price: parseInt(newItem.price),
      category: newItem.category,
      image: '/images/beef-burger.jpg',
      rating: 4.5,
    }
    setItems([...items, item])
    setNewItem({ name: '', description: '', price: '', category: 'beef-burgers' })
    setIsAddingNew(false)
    toast.success('Item added successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Menu Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, or remove menu items
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 rounded-xl bg-[#C1121F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-semibold transition-all',
              selectedCategory === 'all'
                ? 'bg-[#C1121F] text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold transition-all',
                selectedCategory === cat.id
                  ? 'bg-[#C1121F] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-video">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block rounded-full bg-[#FCA311]/90 px-2.5 py-1 text-[10px] font-semibold text-[#1A1A1A]">
                  {categories.find((c) => c.id === item.category)?.name}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <p className="text-lg font-bold text-[#C1121F] flex-shrink-0">
                  Rs. {item.price.toLocaleString()}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-destructive/10 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No items found</p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Edit Item</h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Price (Rs.)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C1121F] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Modal */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setIsAddingNew(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Add New Item</h2>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Description</label>
                  <textarea
                    rows={3}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Enter item description"
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Price (Rs.) *</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="Enter price"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNew}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C1121F] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C1121F]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
