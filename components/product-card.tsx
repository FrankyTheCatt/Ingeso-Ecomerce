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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image_url || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <Badge className="absolute right-2 top-2" variant="secondary">
            ¡Últimas unidades!
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute right-2 top-2" variant="destructive">
            Agotado
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
        <p className="text-2xl font-bold mt-3">{formatPrice(product.price)}</p>
        <p className="text-xs text-muted-foreground mt-1">Stock: {product.stock} unidades</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0 || isAdding}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Agregado!" : "Agregar al carrito"}
        </Button>
      </CardFooter>
    </Card>
  )
}
