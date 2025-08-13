import React from 'react';
import cloudflareLogo from '../assets/Cloudflare.svg';
import honoLogo from '../assets/hono.svg';
import viteLogo from '/vite.svg';
import claudeLogo from '../assets/claude.svg';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <p>
        <span className="tech-stack">
          Powered by: 
        </span>
        <span className="tech-stack">
          <img src={viteLogo} alt="Vite" className="tech-icon" />
          Vite
        </span>
        {' '}
        <span className="tech-stack">
          <img src={honoLogo} alt="Hono" className="tech-icon" />
          Hono
        </span>
        {' '}
        <span className="tech-stack">
          <img src={cloudflareLogo} alt="Cloudflare Workers" className="tech-icon" />
          Cloudflare Workers
        </span>
        {' '}
        <span className="tech-stack">
          <img src={claudeLogo} alt="Claude Code" className="tech-icon" />
          Claude Code
        </span>
      </p>
    </footer>
  );
};

export default Footer;