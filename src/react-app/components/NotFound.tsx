
export default function NotFound() {
  return (
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
  );
}