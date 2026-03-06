"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[#1a1a1a]/60" 
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 backdrop-blur-xl md:px-16 md:py-16"
        >
          <motion.span 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-4 inline-block rounded-full bg-[#FCA311]/20 px-4 py-1.5 text-sm font-medium tracking-wider text-[#FCA311]"
          >
            ESTD 2020
          </motion.span>
          
          <motion.h1 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            <span className="text-balance">Bold Flavor.</span>
            <br />
            <span className="text-[#FCA311] text-balance">Real Burgers.</span>
          </motion.h1>
          
          <motion.p 
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/70 text-pretty md:text-xl"
          >
            Premium smashed burgers, loaded fries and signature bowls.
          </motion.p>
          
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-[#C1121F] px-10 py-4 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:scale-105 hover:bg-[#C1121F]/90 hover:shadow-xl active:scale-95"
            >
              Order Now
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              View Menu
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-2 w-1 rounded-full bg-white/60" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
