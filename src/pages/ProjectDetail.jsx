import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Img from '../components/Img.jsx';
import Parallax from '../components/Parallax.jsx';
import Lightbox from '../components/Lightbox.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import Reveal from '../components/Reveal.jsx';
import useFetch from '../useFetch.js';

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: p, loading, error } = useFetch(`/projects/${id}`, null);
  const [open, setOpen] = useState(null);

  if (loading) return <div className="wrap page-pad"><p>Loading project...</p></div>;
  if (error || !p) return <div className="wrap page-pad"><h1>Project not found</h1><Link to="/portfolio" className="text-link">Back to portfolio</Link></div>;

  const images = [p.cover, ...(p.gallery || [])].filter(Boolean).map((src, i) => ({ src, alt: i === 0 ? p.title : `${p.title}, view ${i + 1}` }));

  return (
    <div className="page-pad">
      <div className="wrap">
        <Link to="/portfolio" className="text-link">Back to portfolio</Link>
        <Reveal><h1>{p.title}</h1></Reveal>
        <dl className="facts">
          <div><dt>Type</dt><dd>{p.category}</dd></div>
          <div><dt>Style</dt><dd>{p.style}</dd></div>
          <div><dt>Location</dt><dd>{p.location}</dd></div>
          <div><dt>Area</dt><dd>{p.areaSqft} sq ft</dd></div>
          <div><dt>Completed</dt><dd>{p.year}</dd></div>
        </dl>
        <Parallax src={p.cover} alt={p.title} className="detail-parallax" range={7} />
        <Reveal className="detail-text">
          <p className="lead-text">{p.summary}</p>
          <p>{p.description}</p>
        </Reveal>

        {images.length > 1 && (
          <>
            <Reveal><h2>Gallery</h2></Reveal>
            <div className="gallery">
              {images.slice(1).map((im, i) => (
                <Reveal key={im.src} delay={i * 0.08}>
                  <button className="gal-btn zoom" onClick={() => setOpen(i + 1)} aria-label={`Open ${im.alt}`}><Img src={im.src} alt={im.alt} /></button>
                </Reveal>
              ))}
            </div>
          </>
        )}

        <Reveal className="detail-ba">
          <h2>Before and after</h2>
          <BeforeAfter after={p.cover} alt={p.title} />
          <p className="note">Sample comparison. Upload a real before photo to show the transformation of this project.</p>
        </Reveal>

        <Reveal className="detail-cta">
          <h2>Planning something similar?</h2>
          <Link to="/contact" className="btn">Book a free consultation</Link>
        </Reveal>
      </div>
      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onChange={setOpen} />
    </div>
  );
}
