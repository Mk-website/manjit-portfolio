import { useCallback, useEffect, useRef, useState } from 'react';

export function useApiData(request, fallback) {
  const fallbackRef = useRef(fallback);
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const retry = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await request();
      setData(response.data?.data ?? fallbackRef.current);
    } catch {
      setError('This section could not load from the portfolio API.');
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => { retry(); }, [retry]);
  return { data, loading, error, retry };
}
