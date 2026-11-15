import { useEffect } from 'react';
import { connectLiveMenu } from './lib/restaurantApi';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import OrderFab from './components/OrderFab';
import OrderChatWidget from './components/OrderChatWidget';
import { useLiveMenu } from './hooks/useLiveMenu';
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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = requestAnimationFrame(() =>
      document.querySelector(hash)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    );
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
  const { notify } = useCart();
  const { dishes, menuConfig, restaurantName } = useLiveMenu();
  useEffect(() => {
    connectLiveMenu().catch(() => {});
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
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
      <OrderChatWidget
        dishes={dishes}
        menuConfig={menuConfig}
        restaurantName={restaurantName}
        onOrderPlaced={(msg) => notify(msg)}
        onError={(msg) => notify(msg)}
      />
      <CartDrawer />
      <Toast />
    </>
  );
}
