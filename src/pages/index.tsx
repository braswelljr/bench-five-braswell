import { useState } from 'react'
import { HiX } from 'react-icons/hi'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '~/context/useStore'
import { toDollars } from '~/utils/currency'
import { ProductII } from '~/types/store'

export default function App() {
  const { products, DELETE_MANY } = useStore()
  const deleteIds: string[] = []
  const [selectedProduct, setSelectedProduct] = useState<ProductII | null>(null)

  return (
    <main className="">
      {/* navigation */}
      <nav className="flex items-center justify-between border-b-2 border-neutral-800 px-6 py-6 md:px-12">
        <h1 className="text-2xl font-bold">Product List</h1>
        <ul className="flex items-center space-x-4">
          <Link
            to="/add-product"
            className="rounded border-2 border-neutral-800 px-3 py-1.5 font-bold"
          >
            Add
          </Link>
          <button
            type="button"
            className="rounded-sm border-2 border-neutral-800 px-3 py-1.5 font-bold"
            onClick={() => DELETE_MANY(deleteIds)}
          >
            Mass Delete
          </button>
        </ul>
      </nav>
      {/* body */}
      <section className="mx-auto max-w-5xl px-6 py-7 max-lg:mx-5 md:px-12 xl:max-w-7xl">
        {Array.isArray(products) && products.length > 0 ? (
          <div className="">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
              {products.map((product: ProductII, i) => (
                <motion.div
                  key={product.id}
                  layoutId={product.id}
                  className="grid grid-cols-[3rem,1fr] rounded-md border-2 border-neutral-800 p-4"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* action */}
                  <div className="">
                    <input
                      type="checkbox"
                      name={'check-' + i}
                      id={'check-' + i}
                      className="accent-brown-200 block h-5 w-5 rounded border-0 bg-neutral-300 accent-neutral-900 outline-none transition-all focus:outline-none focus:ring-0 dark:bg-neutral-900"
                      tabIndex={-1}
                      onChange={e =>
                        e.target.checked
                          ? deleteIds.push(product.id)
                          : deleteIds.splice(deleteIds.indexOf(product.id), 1)
                      }
                    />
                  </div>
                  {/* body */}
                  <div className="space-y-7 text-sm">
                    <div className="space-y-2">
                      <div className="line-clamp-1">{product.id}</div>
                      <div className="font-bold uppercase">{product.name}</div>
                      <div className="">{toDollars(product.price)}</div>
                      <div className="text-sm">
                        {product.type === 'dvd' && product.size && product.size.size && (
                          <div className="">Size : {product.size.size} MB</div>
                        )}
                        {product.type === 'book' && product.size && product.size.weight && (
                          <div className="">Weight : {product.size.weight} KG</div>
                        )}
                        {product.type === 'furniture' && product.size && (
                          <div className="">
                            Dimensions : {product.size.height} x {product.size.width} x{' '}
                            {product.size.length}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* actions */}
                    <div className="">
                      <button
                        type="button"
                        className="bg-neutral-300 px-2 py-1 text-sm font-bold uppercase"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {selectedProduct && (
                <motion.div
                  className="fixed inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    className="absolute inset-0 block h-full w-full bg-neutral-900 bg-opacity-40"
                    tabIndex={-1}
                    onClick={() => setSelectedProduct(null)}
                  />
                  <motion.div
                    className="relative z-10 grid w-11/12 grid-cols-1 items-stretch rounded-md bg-white max-sm:max-w-3xl sm:w-auto md:grid-cols-[2fr,3fr]"
                    onClick={() => null}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    layoutId={selectedProduct.id}
                  >
                    <div className="grid min-h-[20rem] place-items-center bg-neutral-500">
                      <img src={selectedProduct.image} alt={selectedProduct.name} />
                    </div>
                    <div className="relative px-3 py-4 pr-4 pt-4">
                      <button
                        type="button"
                        className="absolute right-4 top-4 rounded-lg bg-neutral-300 p-2"
                        onClick={() => setSelectedProduct(null)}
                      >
                        <HiX className="h-6 w-6 text-neutral-900" />
                      </button>
                      <div className="mx-auto flex h-full w-11/12 flex-col justify-between text-xsm max-sm:space-y-8 sm:text-base ">
                        {/* about */}
                        <div className="space-y-2">
                          <div className="line-clamp-1">{selectedProduct.id}</div>
                          <div className="font-bold uppercase">{selectedProduct.name}</div>
                          <div className="">{toDollars(selectedProduct.price)}</div>
                          <div className="text-sm">
                            {selectedProduct.type === 'dvd' &&
                              selectedProduct.size &&
                              selectedProduct.size.size && (
                                <div className="">Size : {selectedProduct.size.size} MB</div>
                              )}
                            {selectedProduct.type === 'book' &&
                              selectedProduct.size &&
                              selectedProduct.size.weight && (
                                <div className="">Weight : {selectedProduct.size.weight} KG</div>
                              )}
                            {selectedProduct.type === 'furniture' && selectedProduct.size && (
                              <div className="">
                                Dimensions : {selectedProduct.size.height} x{' '}
                                {selectedProduct.size.width} x {selectedProduct.size.length}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* type */}
                        <div className="">
                          <div className="">
                            <span className="bg-neutral-300 px-2 py-1 font-bold uppercase">
                              {selectedProduct.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid min-h-[80vh] place-items-center">
            <div className="space-y-8 text-center">
              <h1 className="text-2xl font-bold">No products found</h1>
              <p className="text-lg text-neutral-500">
                You can add a product by clicking on the add button.
              </p>
              <p className="">
                <Link
                  to="/add-product"
                  className="rounded border-2 border-neutral-800 px-3 py-1.5 font-bold"
                >
                  Add
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
