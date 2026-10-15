import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Img from '../components/Img.jsx';
import Reveal from '../components/Reveal.jsx';
import useFetch from '../useFetch.js';

const CATS = ['All', 'Living room', 'Bedroom', 'Kitchen', 'Office', 'Full home'];

function Card({ p }) {
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
  };
  const leave = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
      <Link to={`/portfolio/${p._id}`} className="port-card tilt" onMouseMove={move} onMouseLeave={leave}>
        <div className="zoom"><Img src={p.cover} alt={p.title} /><span className="view">View project</span></div>
        <h3>{p.title}</h3>
        <p>{p.style}, {p.category} in {p.location}</p>
      </Link>
    </motion.div>
  );
}

export default function Portfolio() {
  const { data: projects, loading, error } = useFetch('/projects');
  const [cat, setCat] = useState('All');
  const shown = useMemo(() => (cat === 'All' ? projects : projects.filter((p) => p.category === cat)), [projects, cat]);

  return (
    <div className="page-pad">
      <div className="wrap">
        <Reveal><h1>Portfolio</h1></Reveal>
        <div className="chips" role="group" aria-label="Filter projects">
          {CATS.map((c) => <button key={c} className={c === cat ? 'chip on' : 'chip'} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        {error && <p className="error">{error}</p>}
        {loading && <p>Loading projects...</p>}
        {!loading && !shown.length && <p>No projects in this category yet. Try another filter.</p>}
        <motion.div layout className="port-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => <Card key={p._id} p={p} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
