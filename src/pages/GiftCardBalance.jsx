import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SpaBody } from '../components/SideDecor';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchGiftCardBalance } from '../lib/offersApi';

function money(n, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(n) || 0);
  } catch {
    return `$${(Number(n) || 0).toFixed(2)}`;
  }
}

function dateLabel(iso) {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
}

const STATUS_TEXT = {
  active: 'Active',
  used: 'No balance left',
  expired: 'Expired',
  void: 'Cancelled',
};

/** Opened by the QR code on a gift card: card number, expiry date and the balance left. */
export default function GiftCardBalance() {
  usePageTitle('Gift card balance', 'Check the balance and expiry date of your Melting Mango gift card.');
  const code = new URLSearchParams(useLocation().search).get('c') || '';
  const [state, setState] = useState({ status: 'loading', card: null, error: '' });

  useEffect(() => {
    if (!code) {
      setState({ status: 'error', card: null, error: 'This page needs a gift card number.' });
      return undefined;
    }
    const ctrl = new AbortController();
    setState({ status: 'loading', card: null, error: '' });
    fetchGiftCardBalance(code, ctrl.signal)
      .then((card) => setState({ status: 'ok', card, error: '' }))
      .catch((err) => {
        if (!ctrl.signal.aborted) setState({ status: 'error', card: null, error: err.message || "We couldn't look up this gift card." });
      });
    return () => ctrl.abort();
  }, [code]);

  const c = state.card;
  const until = c ? dateLabel(c.expiresAt) : '';
  return (
    <SpaBody compact>
      <section className="section section--cream gbuy-page">
        <div className="container">
          <div className="gbal">
            <h1 className="gbal__title">Gift card balance</h1>
            {state.status === 'loading' ? <p className="offers-note" role="status">Checking your card&hellip;</p> : null}
            {state.status === 'error' ? <p className="offers-empty-text" role="alert">{state.error}</p> : null}
            {c ? (
              <dl className="gbal__card">
                <div>
                  <dt>Available balance</dt>
                  <dd className="gbal__amount">{money(c.balance, c.currency)}</dd>
                </div>
                <div>
                  <dt>Card number</dt>
                  <dd className="gbal__code">{c.code}</dd>
                </div>
                <div>
                  <dt>{until ? 'Valid until' : 'Validity'}</dt>
                  <dd>{until || 'No expiry'}</dd>
                </div>
                <div>
                  <dt>Original value</dt>
                  <dd>{money(c.value, c.currency)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={`gbal__status gbal__status--${c.status}`}>{STATUS_TEXT[c.status] || c.status}</span>
                  </dd>
                </div>
              </dl>
            ) : null}
            <Link to="/offers#gift-cards" className="gtile__buy">Gift cards</Link>
          </div>
        </div>
      </section>
    </SpaBody>
  );
}
