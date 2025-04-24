import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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

function App() {
  const dispatch = useDispatch();

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
        </Routes>
      </PageContent>
      <Footer />
    </div>
  );
}

export default App;