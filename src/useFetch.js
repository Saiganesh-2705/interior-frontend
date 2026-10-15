import { useEffect, useState } from 'react';
import api from './api';

export default function useFetch(url, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    setLoading(true);
    api.get(url)
      .then((r) => live && setData(r.data))
      .catch(() => live && setError('Could not load this content. Check that the server is running.'))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [url]);
  return { data, loading, error, setData };
}
