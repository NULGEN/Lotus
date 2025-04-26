import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Navigate import edildi
import { useDispatch, useSelector } from 'react-redux'; // useSelector eklendi
import { verifyToken } from './store/actions/authActions';
import Header from './layout/Header';
import Footer from './layout/Footer';
import PageContent from './layout/PageContent';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import CartPage from './pages/CartPage';
import OrderAddressPage from './pages/OrderAddressPage';
import OrderPaymentPage from './pages/OrderPaymentPage';
import ProtectedRoute from './components/ProtectedRoute';
import PreviousOrders from './pages/PreviousOrders';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // user'ı redux state'den çekiyoruz

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:gender/:category/:id" element={<ShopPage />} />
          <Route path="/shop/:gender/:category/:categoryId/:productName/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/order/address" 
            element={
              <ProtectedRoute>
                <OrderAddressPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order/payment" 
            element={
              <ProtectedRoute>
                <OrderPaymentPage />
              </ProtectedRoute>
            } 
          />

         
          <Route 
            path="/orders" 
            element={
              user ? <Pnpm reviousOrders /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </PageContent>
      <Footer />
    </div>
  );
}

export default App;
