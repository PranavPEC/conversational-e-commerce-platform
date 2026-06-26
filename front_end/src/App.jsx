import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css'

import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ProductListing from './pages/ProductListing.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';
import Navbar from './components/Navbar.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUserData } from './features/auth/authThunks.js';

function App() {

  const dispatch = useDispatch();
  const { userData, authLoading } = useSelector(state => state.auth);

  // Auth bootstrap — checks cookie on every app start
  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  const location = useLocation();

  // Navbar hidden only on login and signup pages
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  // Show nothing while auth check is in progress
  // Prevents flash between login/home
  if (authLoading) return null;

  return (
    <>
      {/* Navbar shown to everyone except on login/signup
          Navbar.jsx handles two states internally:
          - No userData → shows Login + Signup buttons
          - userData    → shows full nav with links, cart, logout */}
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ── Public routes — no auth needed ── */}
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />

        {/* / — guests see ProductListing, logged-in users see Home */}
        <Route path='/' element={<Home />} />

        {/* Products are public — backend has no checkAuth on these routes */}
        <Route path='/products' element={<ProductListing />} />
        <Route path='/product/:id' element={<ProductDetail />} />

        {/* ── Protected routes — must be logged in ── */}
        <Route path='/home' element={userData ? <Home /> : <Navigate to='/login' />} />
        <Route path='/cart' element={userData ? <Cart /> : <Navigate to='/login' />} />
        <Route path='/orders' element={userData ? <Orders /> : <Navigate to='/login' />} />

        {/* Admin — must be logged in AND role === 'admin' */}
        <Route
          path='/admin'
          element={
            userData
              ? userData.role === 'admin'
                ? <Admin />
                : <Navigate to='/home' />
              : <Navigate to='/login' />
          }
        />

        {/* Fallback */}
        <Route path='/*' element={userData ? <Home /> : <ProductListing />} />

      </Routes>
    </>
  )
}

export default App;