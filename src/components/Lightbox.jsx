import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Img from './Img.jsx';

export default function Lightbox({ images, index, onClose, onChange }) {
  const open = index !== null;
  useEffect(() => {
    if (!open) return;
    const k = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, index, images.length, onClose, onChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <button className="lb-close" onClick={onClose}>Close</button>
          <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); onChange((index - 1 + images.length) % images.length); }} aria-label="Previous image">&lsaquo;</button>
          <AnimatePresence mode="wait">
            <motion.div key={index} className="lb-img" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
              <Img src={images[index].src} alt={images[index].alt} />
              <p>{images[index].alt} ({index + 1} of {images.length})</p>
            </motion.div>
          </AnimatePresence>
          <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); onChange((index + 1) % images.length); }} aria-label="Next image">&rsaquo;</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
