import React, { useEffect, useRef, useState } from 'react';
import {
  advanceChatOrder,
  buildOrderPayload,
  createEmptySession,
  STEPS,
} from '../lib/chatOrderFlow';
import { createOrder } from '../lib/restaurantApi';
import { loyaltyPlacedText, runChatLoyaltyEffect } from '../lib/chatLoyalty';
import { earnPointsLabel } from '../lib/loyalty';

function Icon({ children, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const IconMessage = ({ size = 22 }) => (
  <Icon size={size}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>
);
const IconX = ({ size = 16 }) => (
  <Icon size={size}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>
);
const IconVolume = ({ size = 16 }) => (
  <Icon size={size}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></Icon>
);
const IconVolumeOff = ({ size = 16 }) => (
  <Icon size={size}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></Icon>
);
const IconMic = ({ size = 16 }) => (
  <Icon size={size}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></Icon>
);
const IconMicOff = ({ size = 16 }) => (
  <Icon size={size}><line x1="2" y1="2" x2="22" y2="22" /><path d="M18.89 13.23A7 7 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 3" /><path d="M12 19v3" /><path d="M9 9V5a3 3 0 0 1 5.12-2.12" /><path d="M12 15a3 3 0 0 1-3-3" /></Icon>
);
const IconSend = ({ size = 16 }) => (
  <Icon size={size}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></Icon>
);
const IconSpinner = ({ size = 16 }) => (
  <svg className="chat-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </svg>
);

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const clean = String(text || '')
    .replace(/[•*]/g, '')
    .replace(/\n+/g, '. ')
    .slice(0, 400);
  if (!clean) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(clean);
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

function useSpeechInput(onResult) {
  const recogRef = useRef(null);
  const [listening, setListening] = useState(false);
  const supported =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const stop = () => {
    try {
      recogRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  };

  const start = () => {
    if (!supported) return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new Ctor();
    recog.lang = 'en-IN';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recogRef.current = recog;
    setListening(true);
    recog.start();
  };

  useEffect(() => () => stop(), []);

  return { supported: Boolean(supported), listening, start, stop };
}

export default function OrderChatWidget({ dishes = [], menuConfig = null, restaurantName = 'Melting Mango', onOrderPlaced, onError }) {
  const shopName = String(restaurantName || '').trim() || 'Melting Mango';
  const showVeg = !menuConfig || menuConfig.showVegType !== false;
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(createEmptySession);
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      text: 'Hi — I’m the Melting Mango scoop assistant. Ask for the menu, or tell me what you’d like. You can type or tap the mic.',
      actions: [
        { id: 'menu', label: 'Show menu' },
        { id: 'order', label: 'Start order' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [voiceOut, setVoiceOut] = useState(true);
  const voiceOutRef = useRef(true);
  const toggleVoice = () => {
    const next = !voiceOutRef.current;
    voiceOutRef.current = next;
    setVoiceOut(next);
    if (!next && typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  };
  const closeChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    setOpen(false);
  };
  const listRef = useRef(null);

  const pushAssistant = (text, actions = [], listStyle, token) => {
    setMessages((prev) => [...prev, { role: 'assistant', text, actions, listStyle, token }]);
    if (voiceOutRef.current) speak(text);
  };

  const handleTurn = async (rawText, shownText) => {
    const text = String(rawText || '').trim();
    if (!text || busy) return;

    setMessages((prev) => [...prev, { role: 'user', text: shownText || text }]);
    setInput('');
    setBusy(true);

    try {
      let mapped = text;
      if (text === 'order' || /^start order$/i.test(text)) mapped = 'order';
      else if (text === 'menu' || /^show menu$/i.test(text)) mapped = 'menu';
      else if (/^(dish|cat|protein|style|qty|spice|type|size):/i.test(text)) mapped = text;
      else if (text === 'more:no' || /^checkout$/i.test(text)) mapped = 'checkout';
      else if (text === 'confirm:yes' || /^place order$/i.test(text)) mapped = 'place order';
      else if (text === 'cancel' || /^cancel$/i.test(text)) mapped = 'cancel';
      else if (text === 'book') mapped = 'yes';

      const result = advanceChatOrder(session, mapped, dishes, menuConfig, shopName);
      setSession(result.session);

      if (result.loyaltyEffect) {
        const next = await runChatLoyaltyEffect(result);
        setSession(next.session);
        pushAssistant(next.reply, next.actions || []);
      } else if (result.readyToSubmit) {
        pushAssistant(result.reply, []);
        const payload = buildOrderPayload(result.session);
        let order;
        try {
          order = await createOrder(payload);
        } catch (orderErr) {
          if (orderErr?.status === 401 && payload.redeemPoints) {
            setSession({ ...result.session, loyalty: null });
            throw new Error('Your points check expired, so the order was not placed. Tap Retry to place it without points');
          }
          throw orderErr;
        }
        const code = order.code || order.orderId || '';
        const done = createEmptySession();
        done.step = STEPS.COMPLETE;
        setSession(done);
        const token = order.tokenLabel || '';
        const kind = order.orderType || payload.orderType || '';
        const confirm = [
          code ? `Order placed · ${code}.` : 'Order placed.',
          token ? `Your ${kind ? kind.toLowerCase() : 'pickup'} token is ${token}. Show it at the counter when you collect your order.` : '',
          !token && kind === 'Delivery' ? 'We’ll call you if we need anything for the delivery.' : '',
          loyaltyPlacedText(order, result.session),
        ].filter(Boolean).join(' ');
        pushAssistant(confirm, [
          { id: 'order', label: 'Order again' },
          { id: 'menu', label: 'Show menu' },
        ], undefined, token || undefined);
        onOrderPlaced?.(confirm);
      } else {
        pushAssistant(result.reply, result.actions || [], result.listStyle);
      }
    } catch (err) {
      const message = err.message || 'Could not place order';
      pushAssistant(`${message}. You can try again or say Cancel.`, [
        { id: 'confirm:yes', label: 'Retry place order' },
        { id: 'cancel', label: 'Cancel' },
      ]);
      onError?.(message);
    } finally {
      setBusy(false);
    }
  };

  const speech = useSpeechInput((transcript) => {
    void handleTurn(transcript);
  });

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  return (
    <>
      {!open && (
        <button
          type="button"
          className="chat-fab"
          onClick={() => setOpen(true)}
          aria-label="Open order chat"
        >
          <IconMessage />
          <span>Order chat</span>
        </button>
      )}

      {open && (
        <section className="chat-panel" aria-label="Order chat">
          <header className="chat-head">
            <div>
              <strong>{shopName}</strong>
              <span>Chat &amp; voice orders</span>
            </div>
            <div className="chat-head-actions">
              <button
                type="button"
                className={voiceOut ? 'is-on' : ''}
                onClick={toggleVoice}
                aria-label={voiceOut ? 'Mute replies' : 'Speak replies'}
                title={voiceOut ? 'Mute replies' : 'Unmute replies'}
              >
                {voiceOut ? <IconVolume /> : <IconVolumeOff />}
              </button>
              <button type="button" onClick={closeChat} aria-label="Close chat">
                <IconX />
              </button>
            </div>
          </header>

          <div className="chat-messages" ref={listRef}>
            {messages.map((msg, i) => (
              <div key={`${msg.role}-${i}`} className={`chat-bubble ${msg.role}`}>
                {msg.token ? (
                  <div className="chat-token" aria-label={`Token ${msg.token}`}>
                    <small>Your token</small>
                    <strong>{msg.token}</strong>
                  </div>
                ) : null}
                <p>{msg.text}</p>
                {msg.actions?.length > 0 && (
                  <div className={msg.listStyle === 'dishes' ? 'chat-dish-list' : 'chat-actions'}>
                    {msg.actions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        disabled={busy}
                        onClick={() => void handleTurn(action.id, action.label)}
                      >
                        {action.image ? (
                          <img src={action.image} alt="" className="chat-dish-thumb" />
                        ) : null}
                        <span className="chat-dish-name">
                          {action.label}
                          {showVeg && action.veg === true ? <span className="chat-veg">Veg</span> : null}
                        </span>
                        {action.price != null && action.price !== '' ? (
                          <span className="chat-dish-price">
                            ${action.price}
                            {earnPointsLabel(action.price, menuConfig) ? (
                              <span className="chat-dish-earn">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432z" />
                                  <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                                </svg>
                                {earnPointsLabel(action.price, menuConfig)}
                              </span>
                            ) : null}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              void handleTurn(input);
            }}
          >
            <button
              type="button"
              className={`chat-mic${speech.listening ? ' is-live' : ''}`}
              disabled={!speech.supported || busy}
              onClick={() => (speech.listening ? speech.stop() : speech.start())}
              aria-label={speech.listening ? 'Stop listening' : 'Speak your order'}
              title={speech.supported ? 'Voice input' : 'Voice not supported in this browser'}
            >
              {speech.listening ? <IconMicOff /> : <IconMic />}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={speech.listening ? 'Listening…' : 'Type a flavour or message…'}
              disabled={busy}
              aria-label="Chat message"
            />
            <button type="submit" className="chat-send" disabled={busy || !input.trim()} aria-label="Send">
              {busy ? <IconSpinner /> : <IconSend />}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
