import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Img from '../components/Img.jsx';
import HeroMedia from '../components/HeroMedia.jsx';
import Marquee from '../components/Marquee.jsx';
import Counter from '../components/Counter.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import Reveal, { RevealGroup, item } from '../components/Reveal.jsx';
import Faq from '../components/Faq.jsx';
import Reel from '../components/Reel.jsx';
import useFetch from '../useFetch.js';

const u = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Sample figures - replace with your studio's real numbers.
const STATS = [[1200, '+', 'Rooms designed'], [40, '', 'Designers and craftspeople'], [12, '', 'Years in practice'], [96, '%', 'Projects handed over on schedule']];
const MATERIALS = ['Teak', 'Travertine', 'Brushed brass', 'Belgian linen', 'Fluted oak', 'Terrazzo', 'Honed marble', 'Boucle', 'Rattan', 'Lime plaster'];
const STEPS = [
  ['Consultation', 'We visit, measure and listen to how you use each room, and agree a budget range.'],
  ['Concept', 'Layout options, mood boards and 3D views. You choose a direction before we detail it.'],
  ['Detailing', 'Working drawings, material samples and a fixed-scope quotation.'],
  ['Build', 'Our site team handles carpentry, electrical and finishing, with weekly photo reports.'],
  ['Handover', 'Final styling, snag fixes and a care guide for every surface we installed.']
];
const FAQ = [
  ['How much does an interior project cost?', 'It depends on size, finish level and what is included. Use the cost estimator for an instant range, then book a free consultation for a fixed-scope quote.'],
  ['How long does a project take?', 'Most single rooms take 4 to 8 weeks after design sign-off. A full 2 or 3 BHK home usually takes 12 to 20 weeks.'],
  ['Do you handle execution as well as design?', 'Yes. Our own carpenters, electricians and site supervisors build what we design, with one point of contact and weekly photo updates.'],
  ['Can I see the design before I commit?', 'Yes. You will see layout options and 3D views, and you can try colours and finishes yourself in the room designer before work begins.'],
  ['Do you work outside Chennai?', 'We work across Tamil Nadu. For other cities, contact us and we will confirm what is possible.']
];

function Quotes() {
  const { data } = useFetch('/testimonials');
  const [i, setI] = useState(0);
  useEffect(() => {
    if (data.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % data.length), 7000);
    return () => clearInterval(t);
  }, [data.length]);
  if (!data.length) return null;
  const r = data[i % data.length];
  return (
    <div className="quote-stage">
      <AnimatePresence mode="wait">
        <motion.blockquote key={r._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.5 }}>
          <p>{r.quote}</p>
          <footer><strong>{r.name}</strong>{r.place}<span className="stars" aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating)}</span></footer>
        </motion.blockquote>
      </AnimatePresence>
      <div className="dots" role="tablist" aria-label="Choose a review">
        {data.map((d, k) => <button key={d._id} role="tab" aria-selected={k === i} aria-label={`Review from ${d.name}`} className={k === i ? 'dot-b on' : 'dot-b'} onClick={() => setI(k)} />)}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: projects } = useFetch('/projects?featured=true');
  const { data: services } = useFetch('/services');
  const headline = 'Rooms that feel like you, finished properly.'.split(' ');

  return (
    <>
      <section className="hero2">
        <HeroMedia />
        <div className="wrap hero2-in">
          <h1 aria-label="Rooms that feel like you, finished properly.">
            {headline.map((w, i) => (
              <span key={i} className="word" aria-hidden="true">
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.5 + i * 0.09, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{w}&nbsp;</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero2-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }}>
            We design and build interiors for homes, kitchens and workplaces, from the first sketch to the last cushion.
          </motion.p>
          <motion.div className="row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.7 }}>
            <Link to="/contact" className="btn btn-light">Book a free consultation</Link>
            <Link to="/visualizer" className="btn btn-outline-light">Design your room</Link>
          </motion.div>
          <motion.div className="glass float" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
            <strong>Free 3D design</strong>
            <span>See your room before we build it</span>
          </motion.div>
          <div className="scroll-cue" aria-hidden="true"><span /></div>
        </div>
      </section>

      <Marquee items={MATERIALS} />

      <section className="section">
        <div className="wrap">
          <RevealGroup className="stats" gap={0.1}>
            {STATS.map(([n, s, l]) => (
              <motion.div key={l} variants={item} className="stat-big"><strong><Counter to={n} suffix={s} /></strong><span>{l}</span></motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section tone">
        <div className="wrap">
          <Reveal className="sec-head"><h2>What we design</h2><Link to="/services" className="text-link">All services</Link></Reveal>
          <RevealGroup className="svc-grid">
            {services.slice(0, 3).map((s) => (
              <motion.div variants={item} key={s._id}>
                <Link to="/services" className="svc-card">
                  <div className="zoom"><Img src={s.image} alt={s.title} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                </Link>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Reveal>
            <h2>See the difference before you decide</h2>
            <p className="lead-text">Drag the slider to compare a room before and after our work. Every project starts with a clear picture of the finished result.</p>
            <Link to="/portfolio" className="btn btn-ghost">View our portfolio</Link>
          </Reveal>
          <Reveal delay={0.15}><BeforeAfter after={u('1618221195710-dd6b41faaea6', 1200)} alt="Lakeview living room" /></Reveal>
        </div>
      </section>

      <section className="section tone">
        <div className="wrap">
          <Reveal className="sec-head"><h2>Recent projects</h2><Link to="/portfolio" className="text-link">View portfolio</Link></Reveal>
          <RevealGroup className="feat-grid" gap={0.15}>
            {projects.slice(0, 4).map((p, i) => (
              <motion.div variants={item} key={p._id} className={i === 0 ? 'feat big' : 'feat'}>
                <Link to={`/portfolio/${p._id}`}>
                  <Img src={p.cover} alt={p.title} />
                  <div className="feat-cap"><h3>{p.title}</h3><p>{p.category} in {p.location}, {p.areaSqft} sq ft</p></div>
                </Link>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section tools">
        <div className="wrap">
          <Reveal><h2>Plan it yourself, then talk to us</h2></Reveal>
          <RevealGroup className="tool-grid">
            <motion.div variants={item}>
              <Link to="/visualizer" className="tool">
                <h3>Room designer</h3>
                <p>Try wall colours, floors and sofas in a live room, switch to evening light and send us the look you like.</p>
                <span className="text-link">Open the room designer</span>
              </Link>
            </motion.div>
            <motion.div variants={item}>
              <Link to="/estimator" className="tool">
                <h3>Cost estimator</h3>
                <p>Choose the room, size and finish level and get an instant budget range and timeline.</p>
                <span className="text-link">Estimate your budget</span>
              </Link>
            </motion.div>
          </RevealGroup>
        </div>
      </section>

      <Reel />

      <section className="section">
        <div className="wrap">
          <Reveal><h2>How a project runs</h2></Reveal>
          <RevealGroup as="ol" className="steps" gap={0.14}>
            {STEPS.map(([t, d], i) => (
              <motion.li variants={item} key={t}><span className="step-n">{i + 1}</span><h3>{t}</h3><p>{d}</p></motion.li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section tone">
        <div className="wrap"><Reveal><h2>What clients say</h2></Reveal><Quotes /></div>
      </section>

      <section className="section">
        <div className="wrap split faq-split">
          <Reveal><h2>Questions we hear most</h2><p className="lead-text">Cannot find your answer? Ask Aria in the chat, or call the studio.</p></Reveal>
          <Reveal delay={0.1}><Faq items={FAQ} /></Reveal>
        </div>
      </section>

      <section className="cta">
        <div className="wrap cta-in">
          <Reveal><h2>Tell us about your space</h2><p>Share the rooms, your budget range and your timeline. A designer will call you within one working day.</p>
            <Link to="/contact" className="btn btn-light">Book a free consultation</Link></Reveal>
        </div>
      </section>
    </>
  );
}
