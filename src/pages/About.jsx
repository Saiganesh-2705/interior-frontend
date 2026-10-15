import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Parallax from '../components/Parallax.jsx';
import Reveal, { RevealGroup, item } from '../components/Reveal.jsx';
import Counter from '../components/Counter.jsx';

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;
const VALUES = [
  ['Plan before we spend', 'Every drawing, material and budget line is agreed in writing before work starts.'],
  ['One team, start to finish', 'The designers who draw your home are the ones who visit the site each week.'],
  ['Built to be lived in', 'We pick finishes by how they wear and clean, not only by how they photograph.']
];
const TEAM = [['Anita Rao', 'Principal designer'], ['Vikram Shah', 'Head of execution'], ['Divya Menon', 'Kitchen and storage designer']];
// Sample history - replace with your studio's real milestones.
const TIMELINE = [['2013', 'Two designers open a studio in Chennai'], ['2016', 'Own carpentry and electrical team formed'], ['2020', 'First full villa project delivered'], ['2024', 'Team of 40 working across Tamil Nadu']];

export default function About() {
  return (
    <div className="page-pad">
      <section className="wrap split">
        <Reveal>
          <h1>A design studio that also builds</h1>
          <p className="lead-text">Luxe Interiors started as a two-person design practice in Chennai. Clients kept asking who could build what we drew, so we hired our own carpenters, electricians and site supervisors.</p>
          <p>Today we are a team of 40 designers and craftspeople working across Tamil Nadu. Having design and execution under one roof means fewer handovers, clearer budgets and a finished home that matches the drawings.</p>
        </Reveal>
        <Reveal delay={0.15}><Parallax src={u('1600210492486-724fe5c67fb0')} alt="Interior finished by the Luxe team" className="about-img" /></Reveal>
      </section>

      <section className="section">
        <div className="wrap">
          <RevealGroup className="stats">
            {[[1200, '+', 'Rooms designed'], [40, '', 'Designers and craftspeople'], [12, '', 'Years in practice'], [96, '%', 'Handed over on schedule']].map(([n, s, l]) => (
              <motion.div key={l} variants={item} className="stat-big"><strong><Counter to={n} suffix={s} /></strong><span>{l}</span></motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section tone">
        <div className="wrap">
          <Reveal><h2>How we work</h2></Reveal>
          <RevealGroup className="values">
            {VALUES.map(([t, d]) => <motion.div variants={item} key={t}><h3>{t}</h3><p>{d}</p></motion.div>)}
          </RevealGroup>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal><h2>Our story so far</h2></Reveal>
          <ol className="timeline">
            {TIMELINE.map(([y, t], i) => (
              <Reveal as="li" key={y} delay={i * 0.08}><span className="tl-year">{y}</span><span>{t}</span></Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tone">
        <div className="wrap">
          <Reveal><h2>Leadership</h2></Reveal>
          <RevealGroup className="team">
            {TEAM.map(([n, r]) => (
              <motion.div variants={item} key={n} className="member"><div className="avatar" aria-hidden="true">{n.split(' ').map((x) => x[0]).join('')}</div><h3>{n}</h3><p>{r}</p></motion.div>
            ))}
          </RevealGroup>
          <p className="note">Replace these names and the timeline with your own in client/src/pages/About.jsx.</p>
        </div>
      </section>

      <section className="cta">
        <div className="wrap cta-in"><Reveal><h2>See how we would approach your home</h2><Link to="/contact" className="btn btn-light">Book a free consultation</Link></Reveal></div>
      </section>
    </div>
  );
}
