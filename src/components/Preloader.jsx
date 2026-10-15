import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Brand intro, shown once per browser session.
export default function Preloader() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('luxe_intro'));
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => { sessionStorage.setItem('luxe_intro', '1'); setShow(false); }, 2100);
    return () => clearTimeout(t);
  }, [show]);
  const word = 'Luxe Interiors'.split('');
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="preloader" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} role="status" aria-label="Loading Luxe Interiors">
          <div className="pre-word" aria-hidden="true">
            {word.map((c, i) => (
              <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                {c === ' ' ? '\u00A0' : c}
              </motion.span>
            ))}
          </div>
          <motion.div className="pre-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }} />
          <button className="pre-skip" onClick={() => { sessionStorage.setItem('luxe_intro', '1'); setShow(false); }}>Skip intro</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
