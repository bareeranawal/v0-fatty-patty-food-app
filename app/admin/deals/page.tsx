"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Loader2, 
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Tag
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Deal {
  id: string
  name: string
  description: string | null
  deal_type: string
  fixed_price: number | null
  discount_percentage: number | null
  is_active: boolean
  image_url: string | null
  valid_from: string
  valid_until: string | null
}

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchDeals = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/menu')
      const data = await response.json()
      if (data.data?.deals) {
        setDeals(data.data.deals)
        
        // Sync deals to localStorage for customer website
        const dealsForStorage = data.data.deals
          .filter((deal: Deal) => deal.is_active)
          .map((deal: Deal) => ({
            id: deal.id,
            name: deal.name,
            title: deal.description || deal.name,
            items: [], // API doesn't provide items list, would need to be added
            price: deal.fixed_price || 0,
            image: deal.image_url || '/images/deals.jpg',
          }))
        localStorage.setItem('deals', JSON.stringify(dealsForStorage))
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
      toast.error('Failed to fetch deals')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  const toggleDealStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id)
    try {
      const response = await fetch(`/api/admin/menu/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'deal', is_available: !currentStatus }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      const updatedDeals = deals.map(deal => 
        deal.id === id ? { ...deal, is_active: !currentStatus } : deal
      )
      setDeals(updatedDeals)

      // Sync to localStorage
      const dealsForStorage = updatedDeals
        .filter(deal => deal.is_active)
        .map(deal => ({
          id: deal.id,
          name: deal.name,
          title: deal.description || deal.name,
          items: [],
          price: deal.fixed_price || 0,
          image: deal.image_url || '/images/deals.jpg',
        }))
      localStorage.setItem('deals', JSON.stringify(dealsForStorage))

      toast.success(`Deal ${!currentStatus ? 'activated' : 'deactivated'}`)
    } catch {
      toast.error('Failed to update deal status')
    } finally {
      setTogglingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deals Management</h1>
          <p className="text-sm text-muted-foreground">Manage promotions and special offers</p>
        </div>
        <button
          onClick={fetchDeals}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Deals Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No deals configured yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={cn(
                "rounded-xl border bg-card overflow-hidden transition-all",
                deal.is_active ? "border-border" : "border-destructive/30 bg-destructive/5"
              )}
            >
              <div className="relative h-40">
                {deal.image_url ? (
                  <Image
                    src={deal.image_url}
                    alt={deal.name}
                    fill
                    className={cn("object-cover", !deal.is_active && "opacity-50")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-red to-brand-gold">
                    <Tag className="h-12 w-12 text-primary-foreground" />
                  </div>
                )}
                {!deal.is_active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/50">
                    <span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-primary-foreground">
                      Inactive
                    </span>
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-brand-dark">
                    {deal.name}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-foreground">{deal.name}</h3>
                  {deal.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
                  )}
                </div>
                
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">{deal.deal_type}</span>
                  {deal.fixed_price && (
                    <span className="font-bold text-brand-red">Rs. {deal.fixed_price.toLocaleString()}</span>
                  )}
                  {deal.discount_percentage && (
                    <span className="font-bold text-brand-red">{deal.discount_percentage}% OFF</span>
                  )}
                </div>

                <div className="mb-3 text-xs text-muted-foreground">
                  Valid: {formatDate(deal.valid_from)}
                  {deal.valid_until && ` - ${formatDate(deal.valid_until)}`}
                </div>

                <button
                  onClick={() => toggleDealStatus(deal.id, deal.is_active)}
                  disabled={togglingId === deal.id}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    deal.is_active
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  )}
                >
                  {togglingId === deal.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : deal.is_active ? (
                    <>
                      <ToggleRight className="h-4 w-4" />
                      Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4" />
                      Inactive
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
