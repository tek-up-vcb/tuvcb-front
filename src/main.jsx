import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from 'virtual:generated-pages-react'
import './index.css'

const router = createBrowserRouter(routes)

export default function App() {
  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
