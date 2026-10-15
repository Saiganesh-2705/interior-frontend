import { useState } from 'react';

// Shows a tinted placeholder with the alt text if the image fails to load.
export default function Img({ src, alt, className = '', ...rest }) {
  const [bad, setBad] = useState(false);
  if (bad || !src) return <div className={`img-fallback ${className}`} role="img" aria-label={alt}><span>{alt}</span></div>;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setBad(true)} {...rest} />;
}
