"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  Loader2, 
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
  category?: { name: string }
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

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
        <button
          onClick={fetchMenu}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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
    </div>
  )
}
