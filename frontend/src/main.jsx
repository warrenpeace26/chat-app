import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, } from 'react-router-dom'
import { AuthProvider } from './context/authContext.js'
import { ChatProvider } from './context/chatContext.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <ChatProvider>
        <App />
    </ChatProvider>    
  </AuthProvider>
  </BrowserRouter>,
)
