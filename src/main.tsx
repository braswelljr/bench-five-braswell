import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddProduct from '~/pages/add-product'
import App from '~/pages/index.tsx'
import '~/styles/globals.css'
import { Toaster } from '~/components/ui/toaster'
import StoreProvider from '~/context/useStore'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
)
