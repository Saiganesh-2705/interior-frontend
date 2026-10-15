import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api, { errMsg } from '../api';
import Reveal from '../components/Reveal.jsx';

// Indicative per-sq-ft rates in rupees. Edit to match your studio's pricing.
const TYPES = { 'Living room': 1800, 'Bedroom': 2000, 'Modular kitchen': 3500, 'Full home': 1600, 'Office or retail': 1400 };
const FINISH = { Essential: [1, 'Durable laminates and standard fittings'], Signature: [1.45, 'Veneers, designer hardware and layered lighting'], Luxe: [2.1, 'Natural stone, solid wood and custom pieces'] };
const EXTRAS = [['Made-to-measure wardrobes', 250], ['False ceiling and lighting plan', 180], ['Smart-home wiring', 150], ['Furniture and decor', 400]];

const money = (n) => (n >= 100000 ? `Rs ${(n / 100000).toFixed(1)} lakh` : `Rs ${Math.round(n / 1000) * 1000}`);

function Animated({ value }) {
  const [v, setV] = useState(value);
  useEffect(() => {
    let raf; const from = v; const t0 = performance.now();
    const tick = (t) => { const p = Math.min((t - t0) / 500, 1); setV(from + (value - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{money(v)}</>;
}

export default function Estimator() {
  const [type, setType] = useState('Living room');
  const [area, setArea] = useState(450);
  const [finish, setFinish] = useState('Signature');
  const [extras, setExtras] = useState([]);
  const [lead, setLead] = useState({ name: '', phone: '' });
  const [state, setState] = useState({ busy: false, ok: '', err: '' });

  const { low, high, weeks } = useMemo(() => {
    const extra = extras.reduce((s, i) => s + EXTRAS[i][1], 0);
    const base = area * (TYPES[type] * FINISH[finish][0] + extra);
    const w = Math.round(3 + area / (type === 'Full home' ? 130 : 90));
    return { low: base * 0.9, high: base * 1.15, weeks: [Math.max(4, w), Math.max(6, w + 3)] };
  }, [type, area, finish, extras]);

  const toggle = (i) => setExtras(extras.includes(i) ? extras.filter((x) => x !== i) : [...extras, i]);
  const summary = `Estimate: ${type}, ${area} sq ft, ${finish} finish${extras.length ? `, with ${extras.map((i) => EXTRAS[i][0]).join(', ')}` : ''}. Range ${money(low)} to ${money(high)}.`;

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, ok: '', err: '' });
    try {
      const { data } = await api.post('/enquiries', { ...lead, projectType: type, budget: `${money(low)} - ${money(high)}`, message: summary, source: 'estimator' });
      setState({ busy: false, ok: data.message, err: '' });
    } catch (x) { setState({ busy: false, ok: '', err: errMsg(x) }); }
  };

  return (
    <div className="page-pad">
      <div className="wrap">
        <Reveal><h1>Cost estimator</h1><p className="lead-text narrow">Get a quick budget range and timeline. Your free consultation will turn this into a fixed-scope quote.</p></Reveal>
        <div className="est">
          <div className="form">
            <label>What are we designing?
              <select value={type} onChange={(e) => setType(e.target.value)}>{Object.keys(TYPES).map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label>Carpet area: <strong>{area} sq ft</strong>
              <input type="range" min="100" max="5000" step="50" value={area} onChange={(e) => setArea(+e.target.value)} />
            </label>
            <fieldset className="opts">
              <legend>Finish level</legend>
              {Object.entries(FINISH).map(([k, [, d]]) => (
                <label key={k} className={finish === k ? 'opt on' : 'opt'}>
                  <input type="radio" name="finish" checked={finish === k} onChange={() => setFinish(k)} />
                  <span><strong>{k}</strong><small>{d}</small></span>
                </label>
              ))}
            </fieldset>
            <fieldset className="opts">
              <legend>Add-ons</legend>
              {EXTRAS.map(([n], i) => (
                <label key={n} className={extras.includes(i) ? 'opt on' : 'opt'}>
                  <input type="checkbox" checked={extras.includes(i)} onChange={() => toggle(i)} /><span><strong>{n}</strong></span>
                </label>
              ))}
            </fieldset>
          </div>

          <motion.aside className="est-result" layout>
            <p>Estimated budget</p>
            <div className="est-num"><Animated value={low} /> <span>to</span> <Animated value={high} /></div>
            <p className="est-time">Typical timeline: {weeks[0]} to {weeks[1]} weeks after design sign-off</p>
            <div className="est-bar" aria-hidden="true"><motion.i animate={{ width: `${Math.min(100, (area / 5000) * 100 + 8)}%` }} /></div>
            <p className="note">Indicative only. Final cost depends on site conditions, materials and design choices.</p>
            {state.ok ? <p className="success" role="status">{state.ok}</p> : (
              <form onSubmit={submit} className="est-form">
                <strong>Get this estimate checked by a designer</strong>
                <input required placeholder="Your name" aria-label="Your name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                <input required type="tel" placeholder="Phone number" aria-label="Phone number" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                {state.err && <p className="error" role="alert">{state.err}</p>}
                <button className="btn btn-light" disabled={state.busy}>{state.busy ? 'Sending...' : 'Request a call'}</button>
              </form>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
