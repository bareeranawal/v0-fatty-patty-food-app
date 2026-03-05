"use client"

import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-burger.jpg"
          alt="Premium burger"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/60" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center lg:px-8">
        <div className="animate-fade-in-up rounded-3xl border border-white/10 bg-white/5 px-8 py-12 backdrop-blur-xl md:px-16 md:py-16">
          <span className="mb-4 inline-block rounded-full bg-[#F4A261]/20 px-4 py-1.5 text-sm font-medium tracking-wider text-[#F4A261] animate-fade-in-up-delay-1">
            ESTD 2020
          </span>
          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-in-up-delay-1">
            <span className="text-balance">Original Taste.</span>
            <br />
            <span className="text-[#F4A261] text-balance">Ultimate Burgers.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/70 text-pretty md:text-xl animate-fade-in-up-delay-2">
            Premium smashed burgers, loaded fries and signature bowls.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full bg-[#C1121F] px-10 py-4 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:scale-105 hover:bg-[#C1121F]/90 hover:shadow-xl active:scale-95 animate-fade-in-up-delay-3"
          >
            Order Now
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
            <div className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
