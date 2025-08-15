import React from 'react';
import cloudflareLogo from '../assets/logos/cloudflare.svg';
import honoLogo from '../assets/logos/hono.svg';
import reactLogo from '../assets/logos/react.svg';
import viteLogo from '../assets/logos/vite.svg';
import claudeLogo from '../assets/logos/claude.svg';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <p>
        <span className="tech-stack powered-by">
          Powered by: 
        </span>
        <span className="tech-row tech-row-1">
          <span className="tech-stack">
            <img src={reactLogo} alt="React" className="tech-icon" />
            React
          </span>
          <span className="tech-stack">
            <img src={viteLogo} alt="Vite" className="tech-icon" />
            Vite
          </span>
          <span className="tech-stack">
            <img src={honoLogo} alt="Hono" className="tech-icon" />
            Hono
          </span>
        </span>
        <span className="tech-row tech-row-2">
          <span className="tech-stack">
            <img src={cloudflareLogo} alt="Cloudflare Workers" className="tech-icon" />
            Cloudflare Workers
          </span>
          <span className="tech-stack">
            <img src={claudeLogo} alt="Claude Code" className="tech-icon" />
            Claude Code
          </span>
        </span>
      </p>
    </footer>
  );
};

export default Footer;