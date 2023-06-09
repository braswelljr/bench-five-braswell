import { useEffect, useState } from 'react'
import { HiTrash, HiX } from 'react-icons/hi'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '~/context/useStore'
import { toDollars } from '~/utils/currency'
import { ProductII } from '~/types/store'

export default function App() {
  const { products, DELETE_MANY, DELETE } = useStore()
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductII | null>(null)

  // sync selected product
  useEffect(() => {
    if (selectedProduct) {
      setSelectedProduct(products.find(product => product.id === selectedProduct.id) || null)
    }
  }, [products, selectedProduct])

  // sync delete ids

  return (
    <main className="">
      {/* navigation */}
      <nav className="flex items-center justify-between border-b-2 border-neutral-800 px-6 py-4 md:px-12">
        <h1 className="text-sm font-black xsm:text-base sm:text-2xl">Product List</h1>
        <ul className="flex items-center space-x-2 max-lg:text-base max-md:text-xs sm:space-x-4">
          <Link
            to="/add-product"
            className="rounded border-2 border-neutral-800 px-3 py-1.5 font-bold max-sm:px-2 max-sm:py-1"
          >
            Add
          </Link>
          <button
            type="button"
            className="rounded-sm border-2 border-neutral-800 px-3 py-1.5 font-bold max-sm:px-2 max-sm:py-1"
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 text-xs xsm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
              {products.map((product: ProductII, i) => (
                <motion.div
                  key={product.id}
                  layoutId={product.id}
                  className="grid grid-cols-[3rem,1fr] rounded-md border-2 border-neutral-800 p-4"
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
                          ? setDeleteIds(ids => [...ids, product.id])
                          : setDeleteIds(ids => ids.filter(id => id !== product.id))
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
                <motion.div className="fixed inset-0 flex items-center justify-center">
                  <motion.button
                    className="absolute inset-0 block h-full w-full bg-neutral-900 bg-opacity-40"
                    tabIndex={-1}
                    onClick={() => setSelectedProduct(null)}
                  />
                  <motion.div
                    className="relative z-10 grid w-11/12 grid-cols-1 items-stretch rounded-md bg-white max-sm:max-w-3xl sm:w-auto md:grid-cols-[2fr,3fr]"
                    layoutId={selectedProduct.id}
                  >
                    <div className="relative min-h-[20rem] overflow-hidden bg-neutral-900">
                      <img
                        src={selectedProduct.image.url}
                        alt={selectedProduct.name}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
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
                          <div className="flex items-center justify-between">
                            <span className="bg-neutral-300 px-2 py-1 font-bold uppercase">
                              {selectedProduct.type}
                            </span>

                            <button
                              type="button"
                              className="inline-flex items-center space-x-2 bg-red-600 px-2 py-1 font-bold uppercase text-white hover:bg-red-500 focus:outline"
                              tabIndex={-1}
                              onClick={() =>
                                DELETE(selectedProduct.id).then(() => setSelectedProduct(null))
                              }
                            >
                              <HiTrash className="h-5 w-auto" />
                              <span>Delete</span>
                            </button>
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
              <h1 className="text-2xl font-extrabold max-sm:text-lg">No products found</h1>
              <p className="text-lg text-neutral-500 max-sm:text-base max-xsm:text-xs">
                You can add a product by clicking on the add button.
              </p>
              <p className="">
                <Link
                  to="/add-product"
                  className="rounded-sm border-2 border-neutral-800 bg-neutral-900 px-4 py-2 font-bold text-white"
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
