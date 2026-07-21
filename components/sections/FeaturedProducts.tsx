import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations/Reveal"
import { ProductCard } from "@/components/shop/ProductCard"
import { getAllProducts } from "@/lib/data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function FeaturedProducts() {
  const products = await getAllProducts()
  const flagged = products.filter((p) => p.featured || p.bestseller)
  const featured = (flagged.length > 0 ? flagged : products).slice(0, 4)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="text-center mb-16">
        <p className="text-sm tracking-[0.3em] uppercase text-gold-600 mb-4">Curated Selection</p>
        <h2 className="text-3xl md:text-4xl font-serif text-brand-900 mb-4">Featured Pieces</h2>
        <p className="text-brand-500 max-w-xl mx-auto">
          Handpicked favourites from our master artisans, each piece embodying quiet luxury
        </p>
      </Reveal>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <Reveal className="text-center mt-12" delay={0.4}>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-brand-900 hover:text-gold-600 transition-colors tracking-wide text-sm uppercase"
        >
          View All Collection
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Reveal>
    </section>
  )
}
