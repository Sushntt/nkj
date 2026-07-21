// Airtable data layer for real Orders + Products (powers the shop, product pages,
// stock tracking, and the analytics dashboard).
//
// Setup required in your Airtable base:
//
// 1) "Products" table with these fields:
//   - Name            (Single line text)
//   - Slug            (Single line text) — leave blank to auto-generate from Name
//   - Description     (Long text)
//   - Price           (Number)
//   - Original Price  (Number, optional — shows a strikethrough price when set)
//   - Images          (Attachment field — upload the product photos here. "Image" also works.)
//   - Category        (Single select: Necklaces, Earrings, Rings, Bracelets, Bangles)
//   - Subcategory     (Single line text, optional)
//   - Tags            (Single line text, optional — comma separated, e.g. "gold,minimal")
//   - Stock           (Number) — this is what drives "OUT OF STOCK"
//   - Material        (Single line text, optional)
//   - Featured        (Checkbox)
//   - Bestseller      (Checkbox)
//   - New Arrival     (Checkbox)
//
// 2) "Orders" table with these fields:
//   - Customer Name   (Single line text)
//   - Phone           (Single line text)
//   - Items           (Long text)   -> JSON string: [{ productId, name, quantity, price }]
//   - Total           (Number)
//   - Status          (Single select: pending, confirmed, shipped, delivered, cancelled)
//   - Created At       (Single line text) -> ISO date string, e.g. 2025-07-20T10:00:00Z
//
// No separate "Customers" table is needed — customers are derived from Orders
// by grouping on phone number.

import { Product } from "@/types"
import { generateSlug } from "@/lib/utils"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const ORDERS_TABLE = "Orders"
const PRODUCTS_TABLE = "Products"

export const isAirtableConfigured = Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID)

export interface AirtableOrderRecord {
  id: string
  customerName: string
  phone: string
  items: { productId?: string; name: string; quantity: number; price: number }[]
  total: number
  status: string
  createdAt: string
}

async function airtableRequest(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Airtable request failed (${res.status}): ${body}`)
  }

  return res.json()
}

function parseItems(raw: string | undefined): AirtableOrderRecord["items"] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function mapProduct(rec: any): Product {
  const f = rec.fields
  const stockCount = typeof f["Stock"] === "number" ? f["Stock"] : 0
  const imageField = f["Images"] || f["Image"]
  const images = Array.isArray(imageField) ? imageField.map((img: any) => img.url) : []

  return {
    id: rec.id,
    name: f["Name"] || "Untitled",
    slug: f["Slug"] || generateSlug(f["Name"] || rec.id),
    description: f["Description"] || "",
    price: f["Price"] || 0,
    originalPrice: f["Original Price"] || undefined,
    images: images.length > 0 ? images : ["/images/product-1.jpg"],
    category: f["Category"] || "Uncategorized",
    subcategory: f["Subcategory"] || undefined,
    tags: f["Tags"] ? String(f["Tags"]).split(",").map((t: string) => t.trim()) : [],
    inStock: stockCount > 0,
    stockCount,
    material: f["Material"] || undefined,
    featured: !!f["Featured"],
    newArrival: !!f["New Arrival"],
    bestseller: !!f["Bestseller"],
    createdAt: f["Created At"] || rec.createdTime,
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!isAirtableConfigured) {
    throw new Error("Airtable is not configured (missing AIRTABLE_API_KEY / AIRTABLE_BASE_ID)")
  }

  const records: Product[] = []
  let offset: string | undefined

  do {
    const query = offset ? `?offset=${offset}` : ""
    const data = await airtableRequest(`${encodeURIComponent(PRODUCTS_TABLE)}${query}`)
    for (const rec of data.records || []) {
      records.push(mapProduct(rec))
    }
    offset = data.offset
  } while (offset)

  return records
}

// Reduces stock for each ordered item by its quantity (never below 0).
// Called right after an order is logged so "OUT OF STOCK" reflects reality.
export async function decrementStock(items: { productId?: string; quantity: number }[]) {
  if (!isAirtableConfigured) return

  for (const item of items) {
    if (!item.productId) continue
    try {
      const rec = await airtableRequest(`${encodeURIComponent(PRODUCTS_TABLE)}/${item.productId}`)
      const currentStock = typeof rec.fields["Stock"] === "number" ? rec.fields["Stock"] : 0
      const newStock = Math.max(0, currentStock - item.quantity)

      await airtableRequest(`${encodeURIComponent(PRODUCTS_TABLE)}/${item.productId}`, {
        method: "PATCH",
        body: JSON.stringify({ fields: { Stock: newStock } }),
      })
    } catch (err) {
      console.error(`Failed to decrement stock for product ${item.productId}:`, err)
    }
  }
}

export async function getOrders(): Promise<AirtableOrderRecord[]> {
  if (!isAirtableConfigured) {
    throw new Error("Airtable is not configured (missing AIRTABLE_API_KEY / AIRTABLE_BASE_ID)")
  }

  const records: AirtableOrderRecord[] = []
  let offset: string | undefined

  do {
    const query = offset ? `?offset=${offset}` : ""
    const data = await airtableRequest(`${encodeURIComponent(ORDERS_TABLE)}${query}`)

    for (const rec of data.records || []) {
      records.push({
        id: rec.id,
        customerName: rec.fields["Customer Name"] || "Unknown",
        phone: rec.fields["Phone"] || "",
        items: parseItems(rec.fields["Items"]),
        total: rec.fields["Total"] || 0,
        status: rec.fields["Status"] || "pending",
        createdAt: rec.fields["Created At"] || rec.createdTime,
      })
    }

    offset = data.offset
  } while (offset)

  return records
}

export async function createOrder(order: {
  customerName: string
  phone: string
  items: { productId?: string; name: string; quantity: number; price: number }[]
  total: number
}) {
  if (!isAirtableConfigured) {
    // Silently no-op in environments without Airtable configured (e.g. local preview)
    // so checkout still works via WhatsApp even before the base is set up.
    return null
  }

  const result = await airtableRequest(encodeURIComponent(ORDERS_TABLE), {
    method: "POST",
    body: JSON.stringify({
      fields: {
        "Customer Name": order.customerName,
        Phone: order.phone,
        Items: JSON.stringify(order.items),
        Total: order.total,
        Status: "pending",
        "Created At": new Date().toISOString(),
      },
    }),
  })

  // Deduct stock right away so the site reflects it immediately
  await decrementStock(order.items)

  return result
}
