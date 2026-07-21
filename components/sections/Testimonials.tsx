"use client"

import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations/Reveal"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "The craftsmanship is extraordinary. My Kundan bangle set arrived beautifully packaged and even more stunning in person. The WhatsApp ordering was seamless.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    location: "Bangalore",
    text: "Bought the solitaire ring for my fiancée. The quality of the diamond and the minimal setting exceeded all expectations. Truly a piece for a lifetime.",
    rating: 5,
  },
  {
    name: "Meera Reddy",
    location: "Hyderabad",
    text: "Chinkara has become my go-to for gifting. The pearl drop earrings were perfect for my mother's birthday. The personal touch in packaging makes all the difference.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="text-center mb-16">
        <p className="text-sm tracking-[0.3em] uppercase text-gold-600 mb-4">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-serif text-brand-900">What Our Clients Say</h2>
      </Reveal>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <StaggerItem key={t.name}>
            <div className="bg-white p-8 rounded-lg border border-brand-200">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                ))}
              </div>
              <p className="text-brand-700 leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
              <div>
                <p className="font-medium text-brand-900">{t.name}</p>
                <p className="text-sm text-brand-500">{t.location}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
