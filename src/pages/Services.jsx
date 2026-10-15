import { Link } from 'react-router-dom';
import Img from '../components/Img.jsx';
import Reveal from '../components/Reveal.jsx';
import useFetch from '../useFetch.js';

export default function Services() {
  const { data: services, loading, error } = useFetch('/services');
  return (
    <div className="page-pad">
      <div className="wrap">
        <Reveal><h1>Services</h1>
          <p className="lead-text narrow">Choose a single room, a full home or a workplace. Every project starts with a free consultation.</p></Reveal>
        {error && <p className="error">{error}</p>}
        {loading && <p>Loading services...</p>}
        <div className="svc-list">
          {services.map((s, i) => (
            <article key={s._id} className={`svc-row ${i % 2 ? 'flip' : ''}`}>
              <Reveal y={50}><div className="zoom"><Img src={s.image} alt={s.title} /></div></Reveal>
              <Reveal delay={0.12}>
                <h2>{s.title}</h2>
                <p>{s.details}</p>
                <ul className="ticks">{s.features.map((f) => <li key={f}>{f}</li>)}</ul>
                <Link to="/contact" className="btn btn-sm">Ask about this service</Link>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
