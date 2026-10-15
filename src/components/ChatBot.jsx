import { useEffect, useRef, useState } from 'react';
import api, { errMsg } from '../api';

const QUICK = ['What services do you offer?', 'How much does a kitchen cost?', 'How long does a project take?', 'Suggest a colour scheme'];
const GREETING = { role: 'assistant', content: "Hi, I'm Aria from Luxe Interiors. Ask me about services, budgets or timelines, or request a callback from a designer." };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([GREETING]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [lead, setLead] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', projectType: '' });
  const [leadMsg, setLeadMsg] = useState('');
  const [chips, setChips] = useState(QUICK);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs, busy, lead, open]);

  const send = async (content) => {
    const value = (content ?? text).trim();
    if (!value || busy) return;
    if (/^request a callback$/i.test(value)) { setChips([]); setLead(true); return; }
    setChips([]);
    const next = [...msgs, { role: 'user', content: value }];
    setMsgs(next);
    setText('');
    setBusy(true);
    try {
      const started = Date.now();
      const { data } = await api.post('/chat', { messages: next });
      // short pause so the reply feels like someone typing, not an instant dump
      await wait(Math.max(0, Math.min(1400, 350 + data.reply.length * 8) - (Date.now() - started)));
      setMsgs([...next, { role: 'assistant', content: data.reply }]);
      setChips(data.suggestions || []);
      if (data.lead) setLead(true);
    } catch (e) {
      setMsgs([...next, { role: 'assistant', content: e?.response?.data?.reply || 'I could not connect just now. Please try again, or use the Contact page.' }]);
    } finally {
      setBusy(false);
    }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setLeadMsg('');
    try {
      const transcript = msgs.filter((m) => m.role === 'user').map((m) => m.content).join(' | ').slice(0, 800);
      await api.post('/enquiries', { ...form, source: 'chatbot', message: transcript ? `Chat topics: ${transcript}` : '' });
      setMsgs([...msgs, { role: 'assistant', content: `Thanks ${form.name.split(' ')[0]}! A designer will call you on ${form.phone} within one working day.` }]);
      setLead(false);
      setChips(['What happens next?', 'How much does it cost?']);
      setForm({ name: '', phone: '', projectType: '' });
    } catch (err) {
      setLeadMsg(errMsg(err));
    }
  };

  return (
    <div className="chat">
      {open && (
        <section className="chat-panel" role="dialog" aria-label="Chat with Aria">
          <header className="chat-head">
            <div><strong>Aria</strong><span>Luxe Interiors assistant</span></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">Close</button>
          </header>

          <div className="chat-body" aria-live="polite">
            {msgs.map((m, i) => <p key={i} className={`bubble ${m.role}`}>{m.content}</p>)}
            {busy && <p className="bubble assistant typing" aria-label="Aria is typing"><i /><i /><i /></p>}
            {!busy && !lead && chips.length > 0 && (
              <div className="quick">
                {chips.map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}
              </div>
            )}
            {lead && (
              <form className="lead" onSubmit={submitLead}>
                <label>Your name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
                <label>Phone number<input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></label>
                <label>What are we designing?
                  <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
                    <option value="">Choose one</option>
                    <option>Living room</option><option>Bedroom</option><option>Kitchen</option><option>Full home</option><option>Office or retail</option>
                  </select>
                </label>
                {leadMsg && <p className="error">{leadMsg}</p>}
                <div className="row">
                  <button className="btn btn-sm" type="submit">Request callback</button>
                  <button type="button" className="link-btn" onClick={() => setLead(false)}>Cancel</button>
                </div>
              </form>
            )}
            <div ref={end} />
          </div>

          <footer className="chat-foot">
            {!lead && <button className="link-btn" onClick={() => setLead(true)}>Request a callback</button>}
            <form onSubmit={(e) => { e.preventDefault(); send(); }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message" aria-label="Your message" maxLength={500} autoFocus />
              <button className="btn btn-sm" type="submit" disabled={busy || !text.trim()}>Send</button>
            </form>
          </footer>
        </section>
      )}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? 'Hide chat' : 'Chat with us'}
      </button>
    </div>
  );
}
