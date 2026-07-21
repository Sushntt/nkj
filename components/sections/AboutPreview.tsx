"use client"

import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"
import { ArrowRight } from "lucide-react"

export function AboutPreview() {
  return (
    <section className="py-24 bg-brand-900 text-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <p className="text-sm tracking-[0.3em] uppercase text-gold-400 mb-4">Our Philosophy</p>
            <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight">
              Jewellery That Speaks Without Words
            </h2>
            <p className="text-brand-300 leading-relaxed mb-8">
              In the heart of Jaipur, where centuries of craft meet contemporary vision, 
              Chinkara Jewels creates pieces that honour tradition while embracing modern minimalism. 
              Every curve, every setting, every polish is a conversation between heritage and innovation.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors tracking-wide text-sm uppercase"
            >
              Discover Our Story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80" 
                    alt="Craft" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden bg-gold-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-3xl font-serif">15+</p>
                    <p className="text-xs tracking-wider uppercase mt-1">Years of Craft</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-lg overflow-hidden bg-brand-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-3xl font-serif">5000+</p>
                    <p className="text-xs tracking-wider uppercase mt-1">Happy Clients</p>
                  </div>
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&q=80" 
                    alt="Jewellery" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
