import { Context, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useToast } from '~/hooks/useToast'
import { ProductI, ProductRequestI, StoreContextI, StoreProviderI } from '~/types/store'

/**
 * StorenContext - The context for store
 * @type {Context<StoreContextI>}
 */
export const StoreContext: Context<StoreContextI> = createContext<StoreContextI>({
  products: [],
  isLoading: false,
  ADD: () => {},
  GET: () => undefined,
  UPDATE: () => {},
  DELETE: () => {},
  DELETE_MANY: () => {}
})

/**
 * StoreProvider - The provider for store
 * @param {StoreProviderProps} { children } - The children of the provider
 * @returns {JSX.Element}
 */
export default function StoreProvider({ children }: StoreProviderI): JSX.Element {
  const [isLoading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductI[]>([])
  const { toast } = useToast()

  const ADD = useCallback(
    (product: ProductRequestI): void => {
      // set loading
      setLoading(true)
      // destructure the product keys
      const { id, name, price, type, description, size, image } = product
      const i = id || uuid()
      const date = new Date().toISOString()

      if (products.some((product: ProductI) => product.id === id)) {
        toast({
          title: 'Action failed',
          description: 'Product already exists',
          variant: 'info'
        })
      }

      setProducts((prevProducts: ProductI[]) => [
        ...prevProducts,
        {
          id: i,
          name,
          price,
          type,
          size,
          description,
          image,
          createdAt: date,
          updatedAt: date
        }
      ])

      // check if product is available in store
      if (products.some((product: ProductI) => product.id === id))
        toast({
          title: 'Action successful',
          description: 'Product created successfully',
          variant: 'success'
        })
      else
        toast({
          title: 'Action failed',
          description: 'Product creation failed',
          variant: 'error'
        })

      // set loading
      setLoading(false)
    },
    [toast, products]
  )

  const GET = useCallback(
    (id: string): ProductI | undefined => products.find((product: ProductI) => product.id === id),
    [products]
  )

  const UPDATE = useCallback(
    (id: string, product: Partial<ProductI>): void => {
      // set loading
      setLoading(true)
      const productIndex = products.findIndex(product => product.id === id)
      // check if product is available in store
      if (productIndex === -1) {
        toast({
          title: 'Action failed',
          description: 'Product updation failed',
          variant: 'error'
        })

        // set loading
        setLoading(false)

        return
      }

      const updatedProduct = { ...products[productIndex], ...product }
      const filteredInput = Object.fromEntries(
        Object.entries(product).filter(([, value]) => Boolean(value))
      ) as unknown as ProductI

      // check if the product is updated
      if (!Object.keys(filteredInput).length) {
        toast({
          title: 'Action failed',
          description: 'Product updation failed',
          variant: 'error'
        })

        // set loading
        setLoading(false)

        return
      }

      // update the product
      setProducts((prevProducts: ProductI[]) => {
        const updatedProducts = [...prevProducts]

        updatedProducts[productIndex] = updatedProduct

        // set loading
        setLoading(false)

        return updatedProducts
      })

      // check if the product is not updated
    },
    [toast, products]
  )

  const DELETE = useCallback((id: string): void => {
    // set loading
    setLoading(true)

    // delete the product
    setProducts((prevProducts: ProductI[]) =>
      prevProducts.filter((product: ProductI) => product.id !== id)
    )

    // check if product is available in store
    if (products.some((product: ProductI) => product.id === id))
      toast({
        title: 'Action successful',
        description: 'Product deleted successfully',
        variant: 'success'
      })
    else
      toast({
        title: 'Action failed',
        description: 'Product deletion failed',
        variant: 'error'
      })

    // set loading
    setLoading(false)
  }, [])

  const DELETE_MANY = useCallback((ids: string[]): void => {
    // set loading
    setLoading(true)
    setProducts((prevProducts: ProductI[]) =>
      prevProducts.filter((product: ProductI) => !ids.includes(product.id))
    )

    // check if product is available in store
    if (products.some((product: ProductI) => ids.includes(product.id)))
      toast({
        title: 'Action successful',
        description: 'Products deleted successfully',
        variant: 'success'
      })
    else
      toast({
        title: 'Action failed',
        description: 'Products deletion failed',
        variant: 'error'
      })

    // set loading
    setLoading(false)
  }, [])

  const memoeizedValue: StoreContextI = useMemo(
    () => ({
      products,
      isLoading,
      ADD,
      GET,
      UPDATE,
      DELETE,
      DELETE_MANY
    }),
    [products, ADD]
  )

  return <StoreContext.Provider value={memoeizedValue}>{children}</StoreContext.Provider>
}

/**
 * useStore - The hook for Store
 * @returns {StoreContextI}
 *
 * @example
 * const { products } = useStore()
 */
export function useStore(): StoreContextI {
  return useContext(StoreContext)
}
