import {
  Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { ProductI, StoreContextI, StoreProviderI } from '~/types/store'

/**
 * StorenContext - The context for store
 * @type {Context<StoreContextI>}
 */
export const StoreContext: Context<StoreContextI> = createContext<StoreContextI>({
  products: []
})

/**
 * StoreProvider - The provider for store
 * @param {StoreProviderProps} { children } - The children of the provider
 * @returns {JSX.Element}
 */
export default function StoreProvider({ children }: StoreProviderI): JSX.Element {
  const [products, _setProducts] = useState<ProductI[]>([])

  const memoeizedValue: StoreContextI = useMemo(
    () => ({
      products
    }),
    [products]
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
