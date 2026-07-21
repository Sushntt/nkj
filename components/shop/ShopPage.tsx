"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Product } from "@/types"
import { ProductCard } from "./ProductCard"
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations/Reveal"
import { Grid3X3, LayoutList } from "lucide-react"

export function ShopPage({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products]
  )

  useEffect(() => {
    const category = searchParams.get("category")
    if (category && categories.includes(category)) {
      setSelectedCategory(category)
    }
  }, [searchParams, categories])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filtered = useMemo(() => {
    let result = [...products]
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break
      case "price-high": result.sort((a, b) => b.price - a.price); break
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case "bestseller": result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0)); break
    }

    return result
  }, [products, selectedCategory, sortBy])

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-900 mb-4">The Collection</h1>
        <p className="text-brand-500 max-w-xl mx-auto">
          Discover our curated selection of handcrafted jewellery, each piece a testament to timeless artistry
        </p>
      </Reveal>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-brand-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm tracking-wide transition-all rounded-full ${
                selectedCategory === cat
                  ? "bg-brand-900 text-white"
                  : "bg-brand-100 text-brand-700 hover:bg-brand-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-sm text-brand-700 border-b border-brand-300 pb-1 focus:outline-none focus:border-brand-900"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="bestseller">Bestsellers</option>
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-brand-200" : "hover:bg-brand-100"}`}
            >
              <Grid3X3 className="w-4 h-4 text-brand-700" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-brand-200" : "hover:bg-brand-100"}`}
            >
              <LayoutList className="w-4 h-4 text-brand-700" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-brand-500 mb-6">{filtered.length} pieces</p>

      <StaggerContainer
        className={`grid gap-8 ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {filtered.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}
