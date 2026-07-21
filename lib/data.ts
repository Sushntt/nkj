import { Product } from "@/types"
import { isAirtableConfigured, getProducts as getAirtableProducts } from "@/lib/airtable"
import { mockProducts } from "@/lib/mock-data"

export async function getAllProducts(): Promise<Product[]> {
  if (!isAirtableConfigured) return mockProducts

  try {
    const products = await getAirtableProducts()
    // If the Products table exists but happens to be empty, fall back
    // rather than showing a blank shop.
    return products.length > 0 ? products : mockProducts
  } catch (err) {
    console.error("Failed to load live products, falling back to demo data:", err)
    return mockProducts
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts()
  return products.find((p) => p.slug === slug) || null
}
