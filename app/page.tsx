import { Hero } from "@/components/sections/Hero"
import { FeaturedProducts } from "@/components/sections/FeaturedProducts"
import { Categories } from "@/components/sections/Categories"
import { AboutPreview } from "@/components/sections/AboutPreview"
import { Testimonials } from "@/components/sections/Testimonials"
import { Newsletter } from "@/components/sections/Newsletter"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <AboutPreview />
      <Testimonials />
      <Newsletter />
    </>
  )
}
