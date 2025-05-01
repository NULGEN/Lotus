import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import PreviousOrders from './pages/PreviousOrders';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen">
      <ErrorBoundary>
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
                <ProtectedRoute>
                  <PreviousOrders />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </PageContent>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

export default App;

