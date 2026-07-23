import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchUserData, initializeTheme } from './redux/reduxActions'
import AppRouter from './route/AppRouter.jsx'
import './App.css'

function App() {
  const { authLoading } = useSelector(state => state.auth)

  useEffect(() => {
    fetchUserData()
    initializeTheme()

    const handlePageShow = (event) => {
      if (event.persisted) fetchUserData()
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  if (authLoading) return null

  return <AppRouter />
}

export default App