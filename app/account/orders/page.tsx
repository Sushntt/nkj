"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Reveal } from "@/components/animations/Reveal"
import { mockOrders } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-600 bg-blue-50", label: "Confirmed" },
  shipped: { icon: Truck, color: "text-purple-600 bg-purple-50", label: "Shipped" },
  delivered: { icon: Package, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Cancelled" },
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/shop")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="pt-28 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  const userOrders = mockOrders.filter((o) => o.userId === user.id)

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Reveal>
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>
        <h1 className="text-4xl font-serif text-brand-900 mb-8">Order History</h1>
      </Reveal>

      <div className="space-y-6">
        {userOrders.length === 0 ? (
          <Reveal>
            <div className="text-center py-16 bg-white rounded-lg border border-brand-200">
              <Package className="w-16 h-16 text-brand-300 mx-auto mb-4" />
              <p className="text-brand-500 text-lg">No orders yet</p>
              <p className="text-brand-400 text-sm mt-2">Your order history will appear here</p>
            </div>
          </Reveal>
        ) : (
          userOrders.map((order, i) => {
            const StatusIcon = statusConfig[order.status].icon
            return (
              <Reveal key={order.id} delay={i * 0.1}>
                <div className="bg-white rounded-lg border border-brand-200 overflow-hidden">
                  <div className="p-6 border-b border-brand-100 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-brand-500 mb-1">Order #{order.id}</p>
                      <p className="text-xs text-brand-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig[order.status].color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{statusConfig[order.status].label}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-brand-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-brand-900 truncate">{item.product.name}</p>
                            <p className="text-xs text-brand-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-brand-900">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-brand-100 flex justify-between items-center">
                      <span className="text-sm text-brand-500">Total</span>
                      <span className="text-lg font-medium text-brand-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })
        )}
      </div>
    </div>
  )
}
