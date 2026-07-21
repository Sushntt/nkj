"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { formatPrice, generateWhatsAppMessage } from "@/lib/utils"
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleWhatsAppCheckout = async () => {
    const name = customerName.trim() || "Customer"
    const phone = customerPhone.trim() || "Not provided"

    setIsSubmitting(true)
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total: totalPrice,
        }),
      })
      clearCart()
    } catch (e) {
      console.error("Order logging failed, continuing to WhatsApp anyway:", e)
    } finally {
      setIsSubmitting(false)
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"
    const message = generateWhatsAppMessage(
      items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice,
      name,
      phone
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-100">
              <h2 className="text-xl font-serif tracking-wide text-brand-900">
                Shopping Bag ({items.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-brand-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-brand-700" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-brand-300 mb-4" />
                  <p className="text-brand-500 text-lg mb-2">Your bag is empty</p>
                  <p className="text-brand-400 text-sm mb-6">
                    Discover our handcrafted collection
                  </p>
                  <Button onClick={() => setIsOpen(false)} variant="outline" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-24 h-24 bg-brand-50 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="text-sm font-medium text-brand-900 hover:text-gold-600 transition-colors line-clamp-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-brand-500 mt-1">
                          {item.product.material}
                        </p>
                        <p className="text-sm font-medium text-brand-900 mt-2">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-brand-100 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4 text-brand-600" />
                            </motion.button>
                            <span className="text-sm font-medium text-brand-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-brand-100 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4 text-brand-600" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-100 p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-500">Subtotal</span>
                  <span className="font-medium text-brand-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-500">Shipping</span>
                  <span className="text-brand-400">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-2 border-t border-brand-100">
                  <span className="text-brand-900">Total</span>
                  <span className="text-brand-900">{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>

                <Button
                  onClick={handleWhatsAppCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Placing order..." : "Checkout via WhatsApp"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                  asChild
                >
                  <Link href="/shop">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-brand-400 hover:text-red-400 transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
