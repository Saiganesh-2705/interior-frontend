import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal.jsx';

const WALLS = [['Limewash grey', '#dcddd6'], ['Warm sand', '#e3d6c0'], ['Sage', '#b8c4b1'], ['Deep teal', '#2f5a57'], ['Blush clay', '#d9b7a5'], ['Ink blue', '#2d3e55']];
const FLOORS = [['Natural oak', '#c8a77a'], ['Walnut', '#7a5a3f'], ['Grey stone', '#a9acaa'], ['White marble', '#e6e6e3']];
const SOFAS = [['Oat boucle', '#d8cfc0'], ['Forest', '#3d5a4a'], ['Charcoal', '#3c3f44'], ['Terracotta', '#b5654a'], ['Navy', '#2f4260']];
const ACCENTS = [['Brass', '#b68a3e'], ['Rust', '#a9552f'], ['Sky', '#6f9bb5'], ['Olive', '#7d8450']];

const PRESETS = [
  ['Warm minimal', [1, 0, 0, 0]],
  ['Modern luxe', [3, 3, 2, 0]],
  ['Scandinavian', [0, 0, 0, 2]],
  ['Bold and classic', [5, 1, 3, 1]]
];

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

function Swatches({ label, options, value, onPick }) {
  return (
    <fieldset className="swatches">
      <legend>{label}: <strong>{options[value][0]}</strong></legend>
      <div>
        {options.map(([name, hex], i) => (
          <button key={name} type="button" className={i === value ? 'sw on' : 'sw'} style={{ background: hex }} aria-label={name} aria-pressed={i === value} title={name} onClick={() => onPick(i)} />
        ))}
      </div>
    </fieldset>
  );
}

export default function Visualizer() {
  const nav = useNavigate();
  const [sel, setSel] = useState({ wall: 0, floor: 0, sofa: 0, accent: 0 });
  const [evening, setEvening] = useState(false);
  const set = (k) => (i) => setSel({ ...sel, [k]: i });
  const wall = WALLS[sel.wall][1], floor = FLOORS[sel.floor][1], sofa = SOFAS[sel.sofa][1], accent = ACCENTS[sel.accent][1];

  const planks = Array.from({ length: 13 }, (_, i) => {
    const x1 = 170 + (i * 460) / 12;
    return <line key={i} x1={x1} y1="320" x2={400 + (x1 - 400) * 1.739} y2="500" stroke="rgba(0,0,0,.09)" strokeWidth="1.2" />;
  });

  const summary = `Room designer look: ${WALLS[sel.wall][0]} walls, ${FLOORS[sel.floor][0]} floor, ${SOFAS[sel.sofa][0]} sofa, ${ACCENTS[sel.accent][0]} accents. I would like a quote for this look.`;

  return (
    <div className="page-pad">
      <div className="wrap">
        <Reveal><h1>Room designer</h1><p className="lead-text narrow">Try colours and finishes in a living room and see how they work together. When you like a look, send it to our design team.</p></Reveal>

        <div className="vz">
          <motion.div className="vz-stage" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
            <svg viewBox="0 0 800 500" role="img" aria-label={`Living room with ${WALLS[sel.wall][0]} walls, ${FLOORS[sel.floor][0]} floor, ${SOFAS[sel.sofa][0]} sofa and ${ACCENTS[sel.accent][0]} accents`}>
              <defs>
                <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6fbff" /><stop offset="1" stopColor="#cfe3ef" /></linearGradient>
                <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.95" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
              </defs>
              {/* room shell */}
              <polygon points="0,0 800,0 630,70 170,70" fill="#f4f4f1" />
              <rect x="170" y="70" width="460" height="250" fill={wall} />
              <polygon points="0,0 170,70 170,320 0,500" fill={shade(wall, -16)} />
              <polygon points="800,0 630,70 630,320 800,500" fill={shade(wall, -28)} />
              <polygon points="170,320 630,320 800,500 0,500" fill={floor} />
              {planks}
              <polygon points="170,316 630,316 630,324 170,324" fill="rgba(0,0,0,.12)" />
              {/* window */}
              <rect x="255" y="105" width="130" height="140" fill="#fff" />
              <rect x="263" y="113" width="114" height="124" fill="url(#glass)" />
              <line x1="320" y1="113" x2="320" y2="237" stroke="#fff" strokeWidth="5" /><line x1="263" y1="175" x2="377" y2="175" stroke="#fff" strokeWidth="5" />
              {/* wall art */}
              <rect x="470" y="115" width="100" height="120" fill="#fff" />
              <rect x="478" y="123" width="84" height="104" fill={accent} />
              <circle cx="520" cy="165" r="22" fill="rgba(255,255,255,.75)" />
              <rect x="492" y="198" width="56" height="8" fill="rgba(255,255,255,.55)" />
              {/* rug */}
              <polygon points="235,388 565,388 640,478 160,478" fill={shade(accent, 40)} />
              <polygon points="260,398 540,398 600,468 200,468" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="3" />
              {/* sofa */}
              <rect x="250" y="248" width="300" height="76" rx="14" fill={shade(sofa, -14)} />
              <rect x="236" y="288" width="328" height="58" rx="12" fill={sofa} />
              <rect x="226" y="268" width="40" height="86" rx="14" fill={shade(sofa, -8)} />
              <rect x="534" y="268" width="40" height="86" rx="14" fill={shade(sofa, -8)} />
              <rect x="278" y="292" width="118" height="44" rx="8" fill={shade(sofa, 10)} />
              <rect x="404" y="292" width="118" height="44" rx="8" fill={shade(sofa, 10)} />
              <rect x="285" y="268" width="56" height="42" rx="8" fill={accent} />
              <rect x="460" y="268" width="56" height="42" rx="8" fill={shade(accent, -30)} />
              <rect x="250" y="346" width="10" height="14" fill="#2b2b2b" /><rect x="540" y="346" width="10" height="14" fill="#2b2b2b" />
              {/* coffee table */}
              <rect x="335" y="398" width="130" height="18" rx="3" fill="#5b4333" />
              <rect x="345" y="416" width="8" height="20" fill="#3d2d22" /><rect x="447" y="416" width="8" height="20" fill="#3d2d22" />
              <circle cx="400" cy="394" r="9" fill={accent} />
              {/* plant */}
              <rect x="86" y="388" width="44" height="52" rx="6" fill="#d9d4cb" />
              <ellipse cx="108" cy="362" rx="14" ry="38" fill="#4d7a56" transform="rotate(-22 108 362)" />
              <ellipse cx="108" cy="356" rx="13" ry="40" fill="#5e8e66" />
              <ellipse cx="108" cy="362" rx="14" ry="38" fill="#43704c" transform="rotate(24 108 362)" />
              {/* floor lamp */}
              <rect x="619" y="190" width="5" height="240" fill="#2b2b2b" />
              <ellipse cx="621" cy="434" rx="22" ry="6" fill="#2b2b2b" />
              <polygon points="596,186 646,186 636,150 606,150" fill={shade(accent, 50)} />
              {/* evening mode */}
              <rect x="0" y="0" width="800" height="500" fill="#0b1830" className="vz-night" style={{ opacity: evening ? 0.5 : 0 }} />
              <circle cx="621" cy="168" r="170" fill="url(#glow)" className="vz-night" style={{ opacity: evening ? 1 : 0, mixBlendMode: 'screen' }} />
              <circle cx="621" cy="168" r="10" fill="#fff7e0" className="vz-night" style={{ opacity: evening ? 1 : 0 }} />
            </svg>
            <button className="vz-time" onClick={() => setEvening(!evening)} aria-pressed={evening}>{evening ? 'Switch to daylight' : 'Switch to evening light'}</button>
          </motion.div>

          <div className="vz-panel">
            <div className="presets" role="group" aria-label="Style presets">
              <p>Start from a style</p>
              {PRESETS.map(([n, v]) => (
                <button key={n} className="chip" onClick={() => setSel({ wall: v[0], floor: v[1], sofa: v[2], accent: v[3] })}>{n}</button>
              ))}
            </div>
            <Swatches label="Walls" options={WALLS} value={sel.wall} onPick={set('wall')} />
            <Swatches label="Floor" options={FLOORS} value={sel.floor} onPick={set('floor')} />
            <Swatches label="Sofa" options={SOFAS} value={sel.sofa} onPick={set('sofa')} />
            <Swatches label="Accents" options={ACCENTS} value={sel.accent} onPick={set('accent')} />
            <div className="row">
              <button className="btn" onClick={() => nav('/contact', { state: { message: summary, projectType: 'Living room' } })}>Send this look to the studio</button>
              <Link to="/estimator" className="text-link">Estimate the cost</Link>
            </div>
            <p className="note">This is a simplified preview for exploring colour. Your designer will refine it with real samples and 3D views.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
