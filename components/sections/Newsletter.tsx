"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { Send, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setTimeout(() => setSubscribed(false), 3000)
    setEmail("")
  }

  return (
    <section className="py-24 bg-brand-100">
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="text-sm tracking-[0.3em] uppercase text-gold-600 mb-4">Stay Connected</p>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-900 mb-4">Join the Inner Circle</h2>
          <p className="text-brand-600 mb-8">
            Be the first to discover new collections, exclusive offers, and stories from our Jaipur studio.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
            <Button type="submit" disabled={subscribed}>
              <motion.span
                animate={subscribed ? { scale: [1, 1.1, 1] } : {}}
                className="flex items-center gap-2"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {subscribed ? "Subscribed!" : "Subscribe"}
              </motion.span>
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
