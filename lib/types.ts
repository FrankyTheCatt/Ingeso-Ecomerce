export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  category_id: string | null
  image_url: string | null
  created_at: string
}

export interface Sale {
  id: string
  total: number
  status: string
  customer_name: string | null
  customer_email: string | null
  payment_method: string | null
  address_id: string | null
  delivery_address: string | null
  delivery_phone: string | null
  created_at: string
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string | null
  product_name: string
  quantity: number
  price_at_sale: number
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface UserAddress {
  id: string
  user_id: string
  address: string
  phone: string
  country: string
  region: string
  is_default: boolean
  created_at: string
}
