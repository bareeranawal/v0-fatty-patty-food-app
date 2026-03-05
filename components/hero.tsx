"use client"

import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-burger.jpg"
          alt="Premium burger"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand-dark/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center lg:px-8">
        {/* Glass Card */}
        <div className="rounded-3xl border border-primary-foreground/10 bg-primary-foreground/5 px-8 py-12 backdrop-blur-xl md:px-16 md:py-16">
          <span className="mb-4 inline-block rounded-full bg-brand-gold/20 px-4 py-1.5 text-sm font-medium tracking-wider text-brand-gold">
            ESTD 2020
          </span>
          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
            <span className="text-balance">Original Taste.</span>
            <br />
            <span className="text-brand-gold text-balance">Ultimate Burgers.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-primary-foreground/70 text-pretty md:text-xl">
            Premium smashed burgers, loaded fries and signature bowls.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="#menu"
              className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-4 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-brand-red/90 hover:shadow-xl"
            >
              Order Now
            </Link>
            <Link
              href="#menu"
              className="inline-flex items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-8 py-4 text-sm font-semibold tracking-wide text-primary-foreground backdrop-blur-sm transition-all hover:scale-105 hover:bg-primary-foreground/10"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-primary-foreground/30 p-1">
            <div className="h-2 w-1 animate-bounce rounded-full bg-primary-foreground/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
