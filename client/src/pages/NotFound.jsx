import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="section text-center">
      <h1 className="text-4xl font-extrabold text-white">404</h1>
      <p className="mt-3 text-gray-300">Page not found.</p>
      <Link to="/" className="mt-6 inline-block btn-primary">Go home</Link>
    </div>
  );
}
