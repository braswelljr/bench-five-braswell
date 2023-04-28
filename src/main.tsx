import React, { Fragment } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'
import AddProduct from '~/pages/add-product'
import App from '~/pages/index.tsx'
import NotFound from '~/pages/not-found.tsx'
import '~/styles/globals.css'
import { Toaster } from '~/components/ui/toaster'
import StoreProvider from '~/context/useStore'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Fragment>
      <Route path="/" element={<App />} />
      <Route path="/add-product" element={<AddProduct />} />
    </Fragment>
  )
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <Toaster />
      <RouterProvider router={router} fallbackElement={<NotFound />} />
    </StoreProvider>
  </React.StrictMode>
)
