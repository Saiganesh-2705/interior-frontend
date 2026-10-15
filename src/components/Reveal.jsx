import { motion } from 'framer-motion';

// Fade and rise into view once. Use `stagger` on a parent via <RevealGroup>.
export default function Reveal({ children, delay = 0, y = 32, as = 'div', className = '', ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} {...rest}>
      {children}
    </M>
  );
}

export const item = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

export function RevealGroup({ children, className = '', gap = 0.12, as = 'div' }) {
  const M = motion[as] || motion.div;
  return (
    <M className={className} variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      initial="hidden" whileInView="show" viewport={{ once: true, margin: '-70px' }}>
      {children}
    </M>
  );
}
