"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Reveal } from "@/components/animations/Reveal"
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <Reveal delay={0}>
            <div>
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase mb-4">
                Chinkara
              </h3>
              <p className="text-sm leading-relaxed text-brand-400">
                Handcrafted luxury jewellery inspired by the grace of the Indian gazelle. 
                Each piece tells a story of tradition, artistry, and timeless elegance.
              </p>
              <div className="flex gap-4 mt-6">
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 bg-brand-900 rounded-full hover:bg-gold-600 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </motion.a>
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 bg-brand-900 rounded-full hover:bg-gold-600 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </motion.a>
              </div>
            </div>
          </Reveal>

          {/* Quick Links */}
          <Reveal delay={0.1}>
            <div>
              <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/shop", label: "Shop All" },
                  { href: "/shop?category=Necklaces", label: "Necklaces" },
                  { href: "/shop?category=Earrings", label: "Earrings" },
                  { href: "/shop?category=Rings", label: "Rings" },
                  { href: "/shop?category=Bracelets", label: "Bracelets" },
                  { href: "/shop?category=Pendants", label: "Pendants" },
                  { href: "/about", label: "Our Story" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-400 hover:text-gold-400 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Support */}
          <Reveal delay={0.2}>
            <div>
              <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/faq", label: "FAQ" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/account", label: "My Account" },
                  { href: "/account/orders", label: "Order History" },
                  { href: "/admin", label: "Admin Dashboard" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-400 hover:text-gold-400 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.3}>
            <div>
              <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brand-400">
                    42 Johari Bazaar, Jaipur, Rajasthan 302003, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <a
                    href="tel:+919876543210"
                    className="text-sm text-brand-400 hover:text-gold-400 transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <a
                    href="mailto:hello@chinkarajewels.com"
                    className="text-sm text-brand-400 hover:text-gold-400 transition-colors"
                  >
                    hello@chinkarajewels.com
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-brand-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-500">
            © 2024 Chinkara Jewels. All rights reserved. BIS Hallmarked.
          </p>
          <div className="flex gap-6">
            <Link href="/faq" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/faq" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
