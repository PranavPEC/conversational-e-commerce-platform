import { createRoot } from 'react-dom/client'
import "@fontsource/plus-jakarta-sans";
import './index.css'
import "./i18n/i18n.js"
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import store from './redux/reduxStore.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
)