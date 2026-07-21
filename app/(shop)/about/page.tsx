import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations/Reveal"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <Reveal className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-gold-600 mb-4">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-serif text-brand-900 mb-6">
            Crafted with Heritage,<br />Worn with Pride
          </h1>
          <p className="text-brand-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Chinkara Jewels draws inspiration from the graceful Indian gazelle — 
            a symbol of elegance, resilience, and natural beauty. Just as the chinkara 
            moves with quiet grace through the desert, our jewellery embodies understated luxury.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal direction="left">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                alt="Artisan crafting jewellery"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80"
                alt="Finished jewellery pieces"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-100 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl font-serif text-brand-900 mb-4">Our Values</h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Artisan Craftsmanship",
                desc: "Every piece is handcrafted by master artisans in Jaipur, preserving centuries-old techniques passed down through generations.",
              },
              {
                title: "Ethical Sourcing",
                desc: "We source our gold, diamonds, and gemstones from certified ethical suppliers. Fair wages and sustainable practices guide every decision.",
              },
              {
                title: "Timeless Design",
                desc: "Our designs bridge ancient motifs and modern minimalism. Each piece is created to be treasured for generations, not seasons.",
              },
            ].map((value) => (
              <StaggerItem key={value.title}>
                <div className="bg-white p-8 rounded-lg">
                  <h3 className="text-xl font-serif text-brand-900 mb-4">{value.title}</h3>
                  <p className="text-brand-600 leading-relaxed">{value.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl font-serif text-brand-900 mb-4">Our Process</h2>
          <p className="text-brand-500">From concept to creation, every step is guided by precision and passion</p>
        </Reveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Design", desc: "Sketches inspired by nature, architecture, and tradition" },
            { step: "02", title: "Craft", desc: "Hand-carved wax models transformed into precious metal" },
            { step: "03", title: "Set", desc: "Gemstones placed with microscopic precision" },
            { step: "04", title: "Polish", desc: "Final finishing that brings out the inner fire" },
          ].map((item) => (
            <StaggerItem key={item.step}>
              <div className="text-center">
                <span className="text-5xl font-serif text-gold-300 mb-4 block">{item.step}</span>
                <h3 className="text-lg font-medium text-brand-900 mb-2">{item.title}</h3>
                <p className="text-sm text-brand-500">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  )
}
