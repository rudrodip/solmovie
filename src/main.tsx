import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme/theme-provider'
import RootLayout from './root.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RootLayout>
        <App />
      </RootLayout>
    </ThemeProvider>
  </React.StrictMode>,
)
