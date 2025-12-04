import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { customerName, customerEmail, items, total, paymentMethod, addressId, deliveryAddress, deliveryPhone } = body

    // Validate request
    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check stock availability
    for (const item of items) {
      const { data: product } = await supabase.from("products").select("stock").eq("id", item.productId).single()

      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insuficiente para ${item.productName}` }, { status: 400 })
      }
    }

    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert({
        total,
        status: "completed",
        customer_name: customerName,
        customer_email: customerEmail,
        user_id: user?.id || null,
        payment_method: paymentMethod || "efectivo",
        address_id: addressId || null,
        delivery_address: deliveryAddress,
        delivery_phone: deliveryPhone,
      })
      .select()
      .single()

    if (saleError) throw saleError

    // Create sale items and update stock
    for (const item of items) {
      // Insert sale item
      const { error: itemError } = await supabase.from("sale_items").insert({
        sale_id: sale.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price_at_sale: item.price,
      })

      if (itemError) throw itemError

      // Update product stock
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        product_id: item.productId,
        quantity: item.quantity,
      })

      if (stockError) {
        // If RPC doesn't exist, use manual update
        const { data: product } = await supabase.from("products").select("stock").eq("id", item.productId).single()

        if (product) {
          await supabase
            .from("products")
            .update({ stock: product.stock - item.quantity })
            .eq("id", item.productId)
        }
      }
    }

    return NextResponse.json({ success: true, saleId: sale.id })
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Error al procesar la venta" }, { status: 500 })
  }
}
