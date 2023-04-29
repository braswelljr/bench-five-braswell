import {
  Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { useToast } from '~/hooks/useToast'
import { getDownloadURL, storageRef, uploadBytes } from '~/utils/firebase'
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
  const [products, setProducts] = useState<ProductI[]>(() => {
    const products = localStorage.getItem('--products--')
    return products ? JSON.parse(products) : []
  })
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('--products--', JSON.stringify(products))
  }, [products])

  const ADD = useCallback(
    async (product: ProductRequestI) => {
      // set loading
      setLoading(true)
      // destructure the product keys
      const { id, name, price, type, description, size, image } = product
      const i = id || uuid()
      const date = new Date().toISOString()
      if (
        products.some(
          (product: ProductI) => product.id === id || product.name.trim() === name.trim()
        )
      ) {
        toast({
          title: 'Action failed',
          description: 'Product already exists',
          variant: 'warning'
        })

        return
      }

      // upload the image to firebase storage
      const pathReference = storageRef(`/bench-five/images/${i}`)

      // upload the image to firebase storage
      const res = await uploadBytes(pathReference, image[0], { contentType: image[0].type })

      // check if the image is uploaded
      if (!res) {
        toast({
          title: 'Action failed',
          description: 'Image upload failed',
          variant: 'error'
        })
      }

      // create a new product
      getDownloadURL(pathReference)
        .then(url => {
          const newProduct = {
            id: i,
            name,
            price,
            type,
            size,
            description,
            image: url,
            createdAt: date,
            updatedAt: date
          }

          setProducts((prevProducts: ProductI[]) => [...prevProducts, newProduct])

          toast({
            title: 'Action successful',
            description: 'Product created successfully',
            variant: 'success'
          })
          // set loading

          // navigate to the product page
          navigate(`/`)
        })
        .catch(() => {
          toast({
            title: 'Action failed',
            description: 'Product creation failed',
            variant: 'error'
          })
        })
        .finally(() => setLoading(false))
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

    toast({
      title: 'Action successful',
      description: 'Product deleted successfully',
      variant: 'success'
    })

    // set loading
    setLoading(false)
  }, [])

  const DELETE_MANY = useCallback((ids: string[]): void => {
    // set loading
    setLoading(true)
    if (ids.length < 1) {
      toast({
        title: 'Action incomplete',
        description: 'No products to be deleted',
        variant: 'info'
      })

      return
    }
    setProducts((prevProducts: ProductI[]) =>
      prevProducts.filter((product: ProductI) => !ids.includes(product.id))
    )

    toast({
      title: 'Action successful',
      description: 'Products deleted successfully',
      variant: 'success'
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
