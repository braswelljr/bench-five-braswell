import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'
import Dashboard from '~/pages/dashboard/index.tsx'
import App from '~/pages/index.tsx'
import NotFound from '~/pages/not-found.tsx'
import '~/styles/globals.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="dashboard" element={<Dashboard />} />
        {/* ... etc. */}
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<NotFound />} />
  </React.StrictMode>
)
