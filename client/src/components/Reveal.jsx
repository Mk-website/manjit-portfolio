import { useReveal } from '../hooks/useReveal.js';

export default function Reveal({ as: Component = 'div', children, className = '', stagger = false, ...props }) {
  const { ref, visible } = useReveal();
  const classes = `reveal ${visible ? 'is-visible' : ''} ${stagger ? 'reveal-stagger' : ''} ${className}`.trim();

  return <Component ref={ref} className={classes} {...props}>{children}</Component>;
}
