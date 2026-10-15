import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Img from './Img.jsx';

export default function Parallax({ src, alt, className = '', range = 9 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`]);
  return (
    <div ref={ref} className={`parallax ${className}`}>
      <motion.div style={{ y, scale: 1.2 }} className="parallax-in"><Img src={src} alt={alt} /></motion.div>
    </div>
  );
}
