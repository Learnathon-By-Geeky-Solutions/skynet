import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { RequestProvider } from "./context/RequestContext.jsx";  // Import the context

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RequestProvider>
        <App />
      </RequestProvider>
    </BrowserRouter>
  </StrictMode>,
)
