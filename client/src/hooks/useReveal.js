import { useEffect, useRef, useState } from 'react';

const defaultOptions = {};

export function useReveal(options = defaultOptions) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}
