import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '~/context/useStore'
import { toDollars } from '~/utils/currency'
import { ProductII } from '~/types/store'

export default function App() {
  const { products, DELETE_MANY } = useStore()
  const deleteIds: string[] = []

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
      <section className="mx-auto max-w-5xl px-2 py-7 max-lg:mx-5 xl:max-w-7xl">
        {Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
            {products.map((product: ProductII, i) => (
              <div
                key={product.id}
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
                        ? deleteIds.push(product.id)
                        : deleteIds.splice(deleteIds.indexOf(product.id), 1)
                    }
                  />
                </div>
                {/* body */}
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
