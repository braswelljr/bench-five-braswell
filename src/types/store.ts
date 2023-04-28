export interface StoreContextI {
  products: ProductI[]
}

export interface StoreProviderI {
  children: React.ReactNode
}

export interface ProductI {
  id: string
  name: string
  price: number
  image: string
  size: number
}
