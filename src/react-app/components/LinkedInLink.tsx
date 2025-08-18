import linkedinIcon from '../assets/logos/linkedin.svg';

const LinkedInLink = () => {
  return (
    <a
      href="https://www.linkedin.com/in/henriksoderlund/"
      target="_blank"
      rel="noopener noreferrer"
      className="linkedin-link"
      aria-label="Visit Henrik's LinkedIn Profile"
    >
      <img 
        src={linkedinIcon} 
        alt="LinkedIn" 
        className="linkedin-icon"
      />
    </a>
  );
};

export default LinkedInLink;