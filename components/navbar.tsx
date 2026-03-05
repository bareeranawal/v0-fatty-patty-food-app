"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X, Info } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { menuItems } from '@/lib/menu-data'
import type { MenuItem } from '@/lib/menu-data'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Menu', href: '#menu' },
  { name: 'Deals', href: '#offers' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

interface NavbarProps {
  onItemClick?: (item: MenuItem) => void
}

export function Navbar({ onItemClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAbout, setShowAbout] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchOpen])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    ).slice(0, 6)
  }, [searchQuery])

  const handleResultClick = (item: MenuItem) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-brand-red/95 backdrop-blur-md shadow-lg'
            : 'bg-brand-red'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-brand-gold/40">
              <Image
                src="/images/logo.png"
                alt="Fatty Patty"
                width={80}
                height={80}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <span className="hidden font-serif text-lg font-bold text-primary-foreground sm:block">
              Fatty Patty
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) =>
              link.name === 'About Us' ? (
                <button
                  key={link.name}
                  onClick={() => setShowAbout(true)}
                  className="text-sm font-medium tracking-wide text-primary-foreground/80 transition-colors hover:text-brand-gold"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-primary-foreground/80 transition-colors hover:text-brand-gold"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchContainerRef} className="relative">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }
                    }}
                    className="w-40 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:bg-primary-foreground/20 focus:outline-none sm:w-56"
                  />
                  <button
                    onClick={() => { setIsSearchOpen(false); setSearchQuery('') }}
                    className="ml-1 rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {/* Search Results Dropdown */}
                  {searchQuery.trim() && (
                    <div className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:w-80">
                      {searchResults.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {searchResults.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleResultClick(item)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                            >
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                              </div>
                              <span className="flex-shrink-0 text-sm font-bold text-brand-red">
                                Rs. {item.price.toLocaleString()}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-muted-foreground">No items found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  aria-label="Search menu"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-dark">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 lg:hidden',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-3 pt-1">
            {navLinks.map((link) =>
              link.name === 'About Us' ? (
                <button
                  key={link.name}
                  onClick={() => { setShowAbout(true); setIsMobileMenuOpen(false) }}
                  className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* About Us Modal */}
      {showAbout && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-dark/60 p-4 backdrop-blur-sm"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="About Fatty Patty"
          >
            <button
              onClick={() => setShowAbout(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark/50 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-brand-dark/70"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="bg-brand-red px-8 pb-6 pt-8 text-center">
              <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-3 border-brand-gold/40">
                <Image
                  src="/images/logo.png"
                  alt="Fatty Patty"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="font-serif text-2xl font-bold text-primary-foreground">About Fatty Patty</h2>
              <span className="mt-1 inline-block text-sm text-primary-foreground/70">Established 2020</span>
            </div>
            <div className="p-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Established in 2020, Fatty Patty is dedicated to delivering bold flavors and premium quality fast food. From juicy burgers to satisfying bowls and crispy tenders, we focus on freshness, taste, and consistency. Our mission is simple: serve happiness in every bite.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-brand-red" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Our Locations</p>
                  <p className="text-xs text-muted-foreground">Creek Walk DHA Phase 8 &bull; Habit City Tipu Sultan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
