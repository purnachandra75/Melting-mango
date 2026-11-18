import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { RewardsProvider } from './context/RewardsContext';
import './styles/index.css';
import './styles/landing.css';
import './styles/hero.css';
import './styles/copy.css';
import './styles/yellow.css';
import './styles/ref2.css';
import './styles/side-decor.css';
import './styles/footer.css';
import './styles/chat.css';
import './styles/offers.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <RewardsProvider>
          <App />
        </RewardsProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
