import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { ArrowRight, CreditCard, GraduationCap, Zap, Star, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch only a few featured products for the home page (e.g., newest 4)
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-voodoo-600 via-voodoo-700 to-voodoo-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-voodoo-400/30 blur-3xl"></div>
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-voodoo-300/20 blur-3xl"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Eleva tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-voodoo-200 to-voodoo-400">vida universitaria</span>
            </h1>
            <p className="text-xl md:text-2xl text-voodoo-100 max-w-2xl mx-auto md:mx-0 font-light leading-relaxed">
              La tienda oficial de tu campus. Materiales, tecnología y energía para tus sesiones de estudio, todo en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4">
              <Button size="lg" className="bg-white text-voodoo-700 hover:bg-voodoo-50 font-bold text-lg px-8 h-14 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" asChild>
                <Link href="/products">
                  Ver Catálogo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 hidden md:block relative animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
               <div className="absolute inset-0 bg-voodoo-500/30 blur-3xl rounded-full"></div>
               <GraduationCap className="h-64 w-64 text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">¿Por qué elegirnos?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Diseñamos esta experiencia pensando exclusivamente en las necesidades de los estudiantes.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-card hover:bg-voodoo-50 dark:hover:bg-voodoo-950/30 p-8 rounded-2xl shadow-sm border border-voodoo-100 dark:border-voodoo-800 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="h-16 w-16 bg-voodoo-100 dark:bg-voodoo-900/50 rounded-2xl flex items-center justify-center mb-6 text-voodoo-600 dark:text-voodoo-400 group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Entrega Flash</h3>
            <p className="text-muted-foreground leading-relaxed">Sabemos que el tiempo es oro. Recibe tus pedidos en puntos de encuentro del campus en menos de 24h.</p>
          </div>
          
          <div className="group bg-card hover:bg-voodoo-50 dark:hover:bg-voodoo-950/30 p-8 rounded-2xl shadow-sm border border-voodoo-100 dark:border-voodoo-800 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="h-16 w-16 bg-voodoo-100 dark:bg-voodoo-900/50 rounded-2xl flex items-center justify-center mb-6 text-voodoo-600 dark:text-voodoo-400 group-hover:scale-110 transition-transform">
              <CreditCard className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Precios Amigables</h3>
            <p className="text-muted-foreground leading-relaxed">Olvídate de los precios inflados. Ofrecemos tarifas especiales para estudiantes verificados.</p>
          </div>
          
          <div className="group bg-card hover:bg-voodoo-50 dark:hover:bg-voodoo-950/30 p-8 rounded-2xl shadow-sm border border-voodoo-100 dark:border-voodoo-800 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="h-16 w-16 bg-voodoo-100 dark:bg-voodoo-900/50 rounded-2xl flex items-center justify-center mb-6 text-voodoo-600 dark:text-voodoo-400 group-hover:scale-110 transition-transform">
              <Star className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Selección Premium</h3>
            <p className="text-muted-foreground leading-relaxed">Curaduría de productos útiles. Si no te sirve para aprobar o sobrevivir, no lo vendemos.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-voodoo-50 dark:bg-voodoo-900/20 py-20">
        <div className="container mx-auto px-4 max-w-7xl space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-voodoo-600 dark:text-voodoo-400 font-medium">
                <Coffee className="h-5 w-5" />
                <span>Favoritos del Campus</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Lo más vendido esta semana</h2>
            </div>
            <Button variant="outline" className="border-voodoo-200 dark:border-voodoo-800 hover:bg-voodoo-100 dark:hover:bg-voodoo-900/50 text-voodoo-700 dark:text-voodoo-300" asChild>
              <Link href="/products">Ver todo el catálogo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-voodoo-950 text-white p-12 md:p-16 text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-5"></div>
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-voodoo-500/20 blur-3xl"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              ¿Listo para el semestre?
            </h2>
            <p className="text-voodoo-100 text-xl max-w-2xl mx-auto leading-relaxed">
              Únete a miles de estudiantes que ya compran de manera inteligente. Ahorra tiempo y dinero con nosotros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-voodoo-600 hover:bg-voodoo-700 text-white font-bold h-14 px-8 text-lg shadow-lg hover:shadow-voodoo-500/25" asChild>
                <Link href="/products">Empezar a comprar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
