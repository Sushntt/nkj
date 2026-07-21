import { NextResponse } from "next/server"
import { getOrders, isAirtableConfigured, type AirtableOrderRecord } from "@/lib/airtable"
import { mockOrders, mockProducts } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

interface CustomerSummary {
  name: string
  phone: string
  orders: number
  totalSpent: number
  firstOrderAt: string
}

function computeAnalytics(orders: AirtableOrderRecord[]) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0

  // Customers derived by grouping on phone number
  const customerMap = new Map<string, CustomerSummary>()
  for (const order of orders) {
    const key = order.phone || order.customerName
    const existing = customerMap.get(key)
    if (existing) {
      existing.orders += 1
      existing.totalSpent += order.total
      if (order.createdAt < existing.firstOrderAt) existing.firstOrderAt = order.createdAt
    } else {
      customerMap.set(key, {
        name: order.customerName,
        phone: order.phone,
        orders: 1,
        totalSpent: order.total,
        firstOrderAt: order.createdAt,
      })
    }
  }
  const customerList = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
  const totalCustomers = customerList.length
  const repeatCustomers = customerList.filter((c) => c.orders > 1).length

  // Top products by units sold, parsed from each order's item list
  const productSales = new Map<string, { name: string; sales: number; revenue: number }>()
  for (const order of orders) {
    for (const item of order.items) {
      const existing = productSales.get(item.name)
      const revenue = item.price * item.quantity
      if (existing) {
        existing.sales += item.quantity
        existing.revenue += revenue
      } else {
        productSales.set(item.name, { name: item.name, sales: item.quantity, revenue })
      }
    }
  }
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // Revenue trend by day
  const trendMap = new Map<string, { revenue: number; orders: number }>()
  for (const order of orders) {
    const date = order.createdAt.slice(0, 10)
    const existing = trendMap.get(date)
    if (existing) {
      existing.revenue += order.total
      existing.orders += 1
    } else {
      trendMap.set(date, { revenue: order.total, orders: 1 })
    }
  }
  const revenueTrend = Array.from(trendMap.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return {
    revenue: totalRevenue,
    orders: totalOrders,
    customers: totalCustomers,
    repeatCustomers,
    avgOrderValue,
    topProducts,
    revenueTrend,
    customerList,
    recentOrders,
  }
}

export async function GET() {
  if (isAirtableConfigured) {
    try {
      const orders = await getOrders()
      return NextResponse.json({ source: "live", data: computeAnalytics(orders) })
    } catch (err) {
      console.error("Failed to load live analytics, falling back to demo data:", err)
    }
  }

  // Demo fallback so the dashboard is still usable before Airtable is wired up
  const demoOrders: AirtableOrderRecord[] = mockOrders.map((o) => ({
    id: o.id,
    customerName: o.userId,
    phone: o.userId,
    items: o.items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
    total: o.total,
    status: o.status,
    createdAt: o.createdAt,
  }))

  return NextResponse.json({ source: "demo", data: computeAnalytics(demoOrders) })
}
