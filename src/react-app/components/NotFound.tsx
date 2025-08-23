
import SEOHead from './SEOHead';

export default function NotFound() {
  return (
    <>
      <SEOHead 
        title="Page Not Found | Henrik Söderlund"
        description="The page you're looking for doesn't exist. Return to Henrik Söderlund's homepage to explore AI consulting, technology leadership, and professional expertise."
        keywords={['404', 'Not Found', 'Henrik Söderlund', 'Page Not Found']}
      />
      <div className="container">
      <div className="not-found-container">
        <div className="ascii-art">
          <pre>{`┌─────────────────────────────────┐
│                                 │
│     ██  ██   ████   ██  ██      │
│     ██  ██  ██  ██  ██  ██      │
│     ██████  ██  ██  ██████      │
│         ██  ██  ██      ██      │
│         ██   ████       ██      │
│                                 │
│         Page Not Found          │
│                                 │
└─────────────────────────────────┘`}</pre>
        </div>

        <div className="error-message">
          <h1>Oops! Page not found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>

      </div>
      </div>
    </>
  );
}