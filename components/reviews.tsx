"use client"

import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const reviews = [
  {
    name: 'Ahmed Khan',
    rating: 5,
    review: 'The Classic Wagyu is hands down the best burger in Karachi. Perfectly cooked, amazing flavor. Worth every rupee!',
    initial: 'AK',
  },
  {
    name: 'Sara Malik',
    rating: 5,
    review: 'Fatty Patty never disappoints. Their Chicken Jalapeno is my go-to. The spice level is perfect!',
    initial: 'SM',
  },
  {
    name: 'Faisal Raza',
    rating: 5,
    review: 'Best smashed burgers in town. The Beef Signature with extra cheese is absolutely incredible.',
    initial: 'FR',
  },
  {
    name: 'Hira Sheikh',
    rating: 4,
    review: 'Love the Moroccan Bowl! So flavorful and filling. Great option when you want something different from burgers.',
    initial: 'HS',
  },
  {
    name: 'Usman Ali',
    rating: 5,
    review: 'The Fatty Fries are loaded to perfection. Great delivery too - everything arrived hot and fresh.',
    initial: 'UA',
  },
  {
    name: 'Zara Noor',
    rating: 5,
    review: 'Ordered the All American and it was amazing! The double patty with special sauce is addictive.',
    initial: 'ZN',
  },
]

export function Reviews() {
  const [current, setCurrent] = useState(0)
  const itemsPerView = 3

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const getVisibleReviews = () => {
    const visible = []
    for (let i = 0; i < itemsPerView; i++) {
      visible.push(reviews[(current + i) % reviews.length])
    }
    return visible
  }

  return (
    <section id="reviews" className="bg-background py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
            What Our Customers Say
          </h2>
        </div>

        <div className="relative">
          <div className="grid gap-5 md:grid-cols-3">
            {getVisibleReviews().map((review, index) => (
              <div
                key={`${review.name}-${index}`}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C1121F] text-sm font-bold text-white">
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{review.name}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? 'fill-[#F4A261] text-[#F4A261]'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{review.review}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-[#C1121F] hover:text-white hover:border-[#C1121F]"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'w-6 bg-[#C1121F]' : 'w-2 bg-border hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-[#C1121F] hover:text-white hover:border-[#C1121F]"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
