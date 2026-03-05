"use client"

import { useState } from 'react'
import { MapPin, Phone, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-red">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            Contact & Locations
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57903.02289991558!2d67.0011364!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f90167f12ed%3A0x6774e20e5cddfc6d!2sDHA%20Phase%208%2C%20Karachi!5e0!3m2!1sen!2spk!4v1706000000000!5m2!1sen!2spk"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fatty Patty Location"
              />
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/10">
                  <MapPin className="h-5 w-5 text-brand-red" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Our Locations</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">Creek Walk - DHA Ph8</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">HabittCity - Tipu Sultan</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/10">
                  <Phone className="h-5 w-5 text-brand-red" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Call or WhatsApp</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">0334 2024 000</p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/10">
                  <Clock className="h-5 w-5 text-brand-red" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Opening Hours</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">Mon - Sun: 12:00 PM - 1:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-foreground">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-red/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
