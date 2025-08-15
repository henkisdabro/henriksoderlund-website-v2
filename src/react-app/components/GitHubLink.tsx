import React from 'react';
import githubIcon from '../assets/logos/github.svg';

const GitHubLink: React.FC = () => {
  return (
    <a
      href="https://github.com/henkisdabro"
      target="_blank"
      rel="noopener noreferrer"
      className="github-link"
      aria-label="Visit Henrik's GitHub Profile"
    >
      <img 
        src={githubIcon} 
        alt="GitHub" 
        className="github-icon"
      />
    </a>
  );
};

export default GitHubLink;