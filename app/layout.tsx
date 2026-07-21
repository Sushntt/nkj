import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CartDrawer } from "@/components/layout/CartDrawer"
import { WishlistDrawer } from "@/components/layout/WishlistDrawer"
import { CartProvider } from "@/hooks/useCart"
import { WishlistProvider } from "@/hooks/useWishlist"
import { AuthProvider } from "@/hooks/useAuth"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Chinkara Jewels | Handcrafted Luxury Jewellery",
  description: "Discover handcrafted luxury jewellery inspired by Indian heritage. Gold, diamonds, pearls, and gemstones crafted with timeless elegance.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-brand-50 text-brand-900">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <CartDrawer />
              <WishlistDrawer />
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
