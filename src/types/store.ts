import { FullMetadata } from 'firebase/storage'

export interface StoreContextI {
  products: ProductI[]
  isLoading: boolean
  ADD: (product: ProductRequestI) => Promise<void>
  GET: (id: string) => ProductI | undefined
  UPDATE: (id: string, product: Partial<ProductI>) => void
  DELETE: (id: string) => Promise<void>
  DELETE_MANY: (ids: string[]) => void
}

export interface StoreProviderI {
  children: React.ReactNode
}

export type ProductType = 'dvd' | 'book' | 'furniture'
export type ProductSize =
  | {
      width: number
      height: number
      length: number
    }
  | {
      size: number
    }
  | {
      weight: number
    }

export interface ProductII {
  id: string
  name: string
  price: number
  image: {
    url: string
    metadata?: FullMetadata
  }
  type: ProductType
  size: {
    width?: number
    height?: number
    length?: number
    size?: number
    weight?: number
  }
  description: string
  createdAt: string
  updatedAt: string
}

export interface ProductI {
  id: string
  name: string
  price: number
  image: {
    url: string
    metadata?: FullMetadata
  }
  type: ProductType
  size: ProductSize
  description: string
  createdAt: string
  updatedAt: string
}

export interface ProductRequestI {
  id?: string
  name: string
  price: number
  image: FileList
  type: ProductType
  size: ProductSize
  description: string
}
