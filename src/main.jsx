import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from 'virtual:generated-pages-react'

const router = createBrowserRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App
