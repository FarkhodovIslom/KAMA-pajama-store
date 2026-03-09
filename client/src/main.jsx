
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './hooks/useCart'
import { CategoriesProvider } from './hooks/useCategories'
import { AuthProvider } from './hooks/useAuth'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoriesProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CategoriesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
