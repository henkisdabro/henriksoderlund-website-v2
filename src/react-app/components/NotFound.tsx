import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found-container">
        <div className="ascii-art">
          <pre>{`
        ┌─────────────────────────────────┐
        │                                 │
        │    ██  ██   ██████   ██  ██     │
        │    ██  ██  ██    ██  ██  ██     │
        │    ██████  ██    ██  ██████     │
        │        ██  ██    ██      ██     │
        │        ██   ██████       ██     │
        │                                 │
        │         Page Not Found          │
        │                                 │
        └─────────────────────────────────┘
          `}</pre>
        </div>

        <div className="error-message">
          <h1>Oops! Page not found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>

        <div className="navigation-links">
          <h3>Where would you like to go?</h3>
          <div className="link-grid">
            <Link to="/" className="nav-link">
              <span className="link-icon">🏠</span>
              <span className="link-text">Home</span>
            </Link>
            <Link to="/expertise" className="nav-link">
              <span className="link-icon">⚡</span>
              <span className="link-text">Expertise</span>
            </Link>
            <Link to="/work-experience" className="nav-link">
              <span className="link-icon">💼</span>
              <span className="link-text">Experience</span>
            </Link>
            <Link to="/consultancy" className="nav-link">
              <span className="link-icon">🤝</span>
              <span className="link-text">Consultancy</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}