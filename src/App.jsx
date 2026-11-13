import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import OrderFab from './components/OrderFab';
import Preloader from './components/Preloader';
import { useCart } from './context/CartContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Story from './pages/Story';
import Visit from './pages/Visit';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a frame so the target section exists after a route change.
    const id = requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }));
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);
  return null;
}

function Toast() {
  const { toast } = useCart();
  return toast ? (
    <div className="toast" role="status" aria-live="polite">
      {toast}
    </div>
  ) : null;
}

export default function App() {
  return (
    <>
      <Preloader />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/story" element={<Story />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <OrderFab />
      <CartDrawer />
      <Toast />
    </>
  );
}
