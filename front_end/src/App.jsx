import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css'

import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ProductListing from './pages/ProductListing.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';       // Step 13
import Admin from './pages/Admin.jsx';         // Step 14
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
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  if (authLoading) return null;

  return (
    <>
      {userData && !hideNavbar && <Navbar />}
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={userData ? <Home /> : <Navigate to='/login' />} />
        <Route path='/products' element={userData ? <ProductListing /> : <Navigate to='/login' />} />
        <Route path='/product/:id' element={userData ? <ProductDetail /> : <Navigate to='/login' />} />
        <Route path='/cart' element={userData ? <Cart /> : <Navigate to='/login' />} />

        {/* Step 13 — Order history */}
        <Route path='/orders' element={userData ? <Orders /> : <Navigate to='/login' />} />

        {/* Step 14 — Admin dashboard
            Double guard: must be logged in AND role must be admin
            Regular users who manually type /admin get redirected to /home */}
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

        <Route path='/*' element={userData ? <Home /> : <Navigate to='/login' />} />
      </Routes>
    </>
  )
}

export default App;
