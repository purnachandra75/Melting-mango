import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SpaBody } from '../components/SideDecor';
import GiftCardArt from '../components/GiftCardArt';
import GiftCardBack from '../components/GiftCardBack';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchGiftCardOrder, fetchGiftCards } from '../lib/offersApi';
import { captureCardFaces, downloadCardPdf, printCardPages } from '../lib/giftCardPdf';

// Used only if the gift card design can't be loaded (the card then shows the default mango look).
const FALLBACK_ART = { designTheme: 'mango', occasion: '' };

function money(n, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(n) || 0);
  } catch {
    return `$${(Number(n) || 0).toFixed(2)}`;
  }
}

const DELIVERY_NOTE = {
  email: (o) =>
    o.deliveryStatus === 'scheduled'
      ? `We'll email this gift card to ${o.recipientContact} on ${o.deliverOn}.`
      : o.deliveryStatus === 'sent'
        ? `We've emailed this gift card to ${o.recipientContact}.`
        : o.deliveryStatus === 'skipped' || o.deliveryStatus === 'failed'
          ? `We couldn't email this gift card to ${o.recipientContact}. Download the PDF below and send it yourself.`
          : `We're emailing this gift card to ${o.recipientContact}.`,
  whatsapp: (o) => `Download the PDF below and share it with ${o.recipientName} on WhatsApp (${o.recipientContact}).`,
  print: () => 'Download or print the card below and hand it over as a gift.',
};

/** Where Stripe sends the buyer after paying. Confirms the payment and shows the card number(s) + PIN. */
export default function GiftCardThanks() {
  usePageTitle('Gift card purchased', 'Your Melting Mango gift card.');
  const params = new URLSearchParams(useLocation().search);
  const orderId = params.get('order') || '';
  const sessionId = params.get('session_id') || '';

  const [state, setState] = useState({ status: 'loading', order: null, error: '' });
  const [program, setProgram] = useState(null);
  const [programReady, setProgramReady] = useState(false);
  const [busy, setBusy] = useState('');
  const [fileError, setFileError] = useState('');
  const facesRef = useRef({});

  useEffect(() => {
    if (!orderId || !sessionId) {
      setState({ status: 'error', order: null, error: 'This page needs a valid order link.' });
      return undefined;
    }
    let cancelled = false;
    let timer;
    let tries = 0;
    const load = () => {
      fetchGiftCardOrder(orderId, sessionId)
        .then((order) => {
          if (cancelled) return;
          if (order.paid) {
            setState({ status: 'paid', order, error: '' });
          } else if (order.status === 'cancelled') {
            setState({ status: 'error', order, error: 'This payment was cancelled. You have not been charged.' });
          } else if (tries < 6) {
            tries += 1;
            setState({ status: 'waiting', order, error: '' });
            timer = setTimeout(load, 2500);
          } else {
            setState({ status: 'error', order, error: "We haven't received the payment yet. If you were charged, contact us and we'll sort it out." });
          }
        })
        .catch((err) => {
          if (!cancelled) setState({ status: 'error', order: null, error: err.message || "We couldn't load your order." });
        });
    };
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, sessionId]);

  const programId = state.order?.programId;
  useEffect(() => {
    if (!programId) return undefined;
    const ctrl = new AbortController();
    fetchGiftCards(ctrl.signal)
      .then((cards) => setProgram(cards.find((c) => c.id === programId) || null))
      .catch(() => {})
      .finally(() => {
        if (!ctrl.signal.aborted) setProgramReady(true);
      });
    return () => ctrl.abort();
  }, [programId]);

  /** Turn the on-screen front + back of every card into a PDF download or a print job. */
  const makeFile = async (mode) => {
    const order = state.order;
    if (!order || busy) return;
    setBusy(mode);
    setFileError('');
    try {
      const groups = order.cards.map((c) => {
        const wrap = facesRef.current[c.id];
        return [
          wrap.querySelector('[data-face="front"] .gcard'),
          wrap.querySelector('[data-face="back"] .gcard'),
        ];
      });
      const pages = await captureCardFaces(groups);
      if (mode === 'download') {
        downloadCardPdf(pages, `melting-mango-gift-card-${order.id.slice(0, 8)}.pdf`);
      } else {
        printCardPages(pages);
      }
    } catch (err) {
      console.error('[gift card pdf]', err);
      setFileError("We couldn't prepare the PDF. Please try again, or take a screenshot of the card.");
    } finally {
      setBusy('');
    }
  };

  let body;
  if (state.status === 'loading' || state.status === 'waiting') {
    body = <p className="offers-note" role="status">Confirming your payment&hellip;</p>;
  } else if (state.status === 'error') {
    body = (
      <div className="gbuy__missing">
        <p className="offers-empty-text" role="alert">{state.error}</p>
        <Link to="/offers#gift-cards" className="gtile__buy">Back to gift cards</Link>
      </div>
    );
  } else {
    const o = state.order;
    const note = (DELIVERY_NOTE[o.deliveryMethod] || DELIVERY_NOTE.email)(o);
    body = (
      <div className="gthanks">
        <header className="gthanks__head">
          <span className="gthanks__tick" aria-hidden="true">{'\u2713'}</span>
          <h1>Thank you, {o.senderName}!</h1>
          <p className="gthanks__meta">
            Payment of <strong>{money(o.total, o.currency)}</strong> received &mdash; {o.quantity > 1 ? `${o.quantity} gift cards are` : 'your gift card is'} ready for {o.recipientName}.
          </p>
        </header>

        <p className="gthanks__note" role="status">{note} The PIN is kept off the card for safety, so it is shown below and sent in a separate PDF to the recipient. Show the card number and PIN at the counter to use the balance.</p>

        <div className="gthanks__list">
          {o.cards.map((c) => (
            <article key={c.id} className="gthanks__faces" ref={(el) => { facesRef.current[c.id] = el; }}>
              <div className="gthanks__face" data-face="front">
                <GiftCardArt card={program || FALLBACK_ART} value={{ amount: c.value, bonusAmount: 0 }} code={c.code} />
              </div>
              <div className="gthanks__face" data-face="back">
                <GiftCardBack code={c.code} value={c.value} currency={o.currency} expiresAt={c.expiresAt} />
              </div>
            </article>
          ))}
        </div>

        {o.cards.some((c) => c.pin) ? (
          <div className="gthanks__pins" aria-label="Gift card PINs">
            <h2 className="gthanks__pins-title">PIN for each card</h2>
            <p className="gthanks__pins-note">Keep these private. They are not on the card.</p>
            <dl>
              {o.cards.filter((c) => c.pin).map((c) => (
                <div key={c.id}>
                  <dt>{c.code}</dt>
                  <dd>{c.pin}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {fileError ? <p className="gbuy__notice gbuy__notice--error" role="alert">{fileError}</p> : null}

        <div className="gthanks__actions">
          <button type="button" className="gbuy__btn gbuy__btn--primary" style={{ width: 'auto' }} disabled={!programReady || busy} onClick={() => makeFile('download')}>
            {busy === 'download' ? 'Preparing PDF\u2026' : 'Download PDF'}
          </button>
          <button type="button" className="gbuy__btn gbuy__btn--ghost" style={{ width: 'auto' }} disabled={!programReady || busy} onClick={() => makeFile('print')}>
            {busy === 'print' ? 'Preparing\u2026' : 'Print'}
          </button>
          <Link to="/offers#gift-cards" className="gtile__buy">Buy another</Link>
        </div>
      </div>
    );
  }

  return (
    <SpaBody compact>
      <section className="section section--cream gbuy-page">
        <div className="container">{body}</div>
      </section>
    </SpaBody>
  );
}
