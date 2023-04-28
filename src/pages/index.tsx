import { Link } from 'react-router-dom'
import { useStore } from '~/context/useStore'
import { toDollars } from '~/utils/currency'
import { ProductII } from '~/types/store'

export default function App() {
  const { products } = useStore()

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
          >
            Mass Delete
          </button>
        </ul>
      </nav>
      {/* body */}
      <section className="mx-auto max-w-5xl px-2 py-7 max-lg:mx-5 xl:max-w-7xl">
        {Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
            {products.map((product: ProductII) => (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center rounded-md border-2 border-neutral-800 p-4"
              >
                <div className="">
                  <div className="line-clamp-1">{product.id}</div>
                  <div className="">{product.name}</div>
                  <div className="">{toDollars(product.price)}</div>
                  {product.type === 'dvd' && product.size && product.size.size && (
                    <div className="">{product.size.size}</div>
                  )}
                  {product.type === 'book' && product.size && product.size.weight && (
                    <div className="">{product.size.weight}</div>
                  )}
                  {product.type === 'furniture' && product.size && (
                    <div className="">
                      {product.size.height} x {product.size.width} x {product.size.length}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
