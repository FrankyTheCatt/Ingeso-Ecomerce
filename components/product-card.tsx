"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 dark:border-slate-800">
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={product.image_url || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <Badge className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm">
            ¡Últimas unidades!
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute right-2 top-2" variant="destructive">
            Agotado
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg line-clamp-1 mb-1 text-slate-900 dark:text-slate-100">{product.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        <div className="flex items-end justify-between mt-4">
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{formatPrice(product.price)}</p>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            {product.stock} disponibles
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button 
          className={`w-full font-semibold transition-all duration-200 ${
            isAdding 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-100"
          }`}
          onClick={handleAddToCart} 
          disabled={product.stock === 0 || isAdding}
        >
          <ShoppingCart className={`mr-2 h-4 w-4 ${isAdding ? "animate-bounce" : ""}`} />
          {isAdding ? "¡Listo!" : "Añadir"}
        </Button>
      </CardFooter>
    </Card>
  )
}
