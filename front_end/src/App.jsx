import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchUserData, initializeTheme } from './redux/reduxActions'
import AppRouter from './route/AppRouter.jsx'
import RealtimeListener from './components/RealtimeListener.jsx'
import { prefetchShoppingFlow } from './route/lazyPages.js'
import './App.css'

function App() {
  const { authLoading, userData } = useSelector(state => state.auth)

  useEffect(() => {
    fetchUserData()
    initializeTheme()

    const handlePageShow = (event) => {
      if (event.persisted) fetchUserData()
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    if (!authLoading) {
      prefetchShoppingFlow(Boolean(userData))
    }
  }, [authLoading, userData])

  if (authLoading) return null

  return (
    <>
      <AppRouter />
      <RealtimeListener />
    </>
  )
}

export default App