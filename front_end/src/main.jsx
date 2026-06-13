import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './context/userContext.jsx'
import { Provider } from "react-redux";
import { store } from "./app/store.js";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
  <UserContext>
    <App />
    </UserContext>
    </BrowserRouter>
    </Provider>
  ,
)
