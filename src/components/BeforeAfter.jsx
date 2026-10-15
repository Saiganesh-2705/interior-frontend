import { useState } from 'react';
import Img from './Img.jsx';

// Drag (or use arrow keys on the slider) to compare. If `before` is omitted,
// the same photo is shown desaturated as a stand-in - replace with real "before" photos.
export default function BeforeAfter({ before, after, alt }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba" style={{ '--pos': `${pos}%` }}>
      <Img src={after} alt={`${alt}, after`} className="ba-img" />
      <div className="ba-before">
        <Img src={before || after} alt={`${alt}, before`} className={`ba-img ${before ? '' : 'ba-sample'}`} />
      </div>
      <span className="ba-tag l">Before</span>
      <span className="ba-tag r">After</span>
      <div className="ba-handle" aria-hidden="true"><span /></div>
      <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label={`Compare before and after: ${alt}`} />
    </div>
  );
}
