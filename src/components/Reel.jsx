import { useRef, useState } from 'react';
import Reveal from './Reveal.jsx';

// Shows only when client/public/videos/studio-reel.mp4 exists, so visitors never see a broken player.
export default function Reel() {
  const ref = useRef(null);
  const [ok, setOk] = useState(false);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  return (
    <section className="section reel" style={{ display: ok ? 'block' : 'none' }}>
      <div className="wrap">
        <Reveal><h2>Walk through a finished home</h2></Reveal>
        <Reveal delay={0.1} className="reel-box">
          <video ref={ref} loop playsInline preload="metadata" poster="/videos/studio-reel-poster.jpg" onLoadedMetadata={() => setOk(true)} onEnded={() => setPlaying(false)}>
            <source src="/videos/studio-reel.mp4" type="video/mp4" />
          </video>
          <button className={playing ? 'reel-btn playing' : 'reel-btn'} onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
            <span />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
