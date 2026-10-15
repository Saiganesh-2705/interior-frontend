import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <div key={q} className={open === i ? 'faq-item on' : 'faq-item'}>
          <h3>
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              {q}<span className="plus" aria-hidden="true" />
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                <p>{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
