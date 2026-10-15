import { useEffect, useState } from 'react';

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=80`;
const SLIDES = [
  u('1618221195710-dd6b41faaea6'),
  u('1616486338812-3dadae4b4ace'),
  u('1556909114-f6e7ad7d3136'),
  u('1600210492486-724fe5c67fb0')
];

/**
 * Layers, bottom to top:
 * 1. Ken Burns photo slideshow (always works)
 * 2. Optional full-bleed film: drop your own file at client/public/videos/hero.mp4 and it fades in over the photos
 * 3. Ambient light loop (generated, ships with the project) blended on top like sunlight moving through a window
 */
export default function HeroMedia() {
  const [i, setI] = useState(0);
  const [film, setFilm] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero-media" aria-hidden="true">
      {SLIDES.map((s, k) => <div key={s} className={k === i ? 'slide on' : 'slide'} style={{ backgroundImage: `url(${s})` }} />)}
      <video className={film ? 'film on' : 'film'} autoPlay muted loop playsInline preload="auto" onCanPlay={() => setFilm(true)}>
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <video className="ambient" autoPlay muted loop playsInline preload="auto">
        <source src="/videos/ambient-light.mp4" type="video/mp4" />
      </video>
      <div className="shade" />
    </div>
  );
}
