import { Link } from 'react-router-dom';

interface NavigationProps {
  showResumeButton?: boolean;
  excludePage?: string;
}

export default function Navigation({ showResumeButton = false, excludePage }: NavigationProps) {
  const handleResumeRequest = () => {
    // Placeholder for resume request functionality
    alert('Resume request functionality will be implemented later');
  };

  return (
    <div className="navigation-section">
      {showResumeButton && (
        <div className="centered-navigation">
          <button 
            onClick={handleResumeRequest}
            className="resume-button"
            type="button"
          >
            Request Resume
          </button>
        </div>
      )}
      
      <div className="centered-navigation">
        {excludePage !== 'home' && <Link to="/" className="nav-button">🏠 Home</Link>}
        {excludePage !== 'skills' && <Link to="/skills" className="nav-button">🛠️ Skills</Link>}
        {excludePage !== 'work-experience' && <Link to="/work-experience" className="nav-button">💼 Work Experience</Link>}
        {excludePage !== 'education' && <Link to="/education" className="nav-button">🎓 Education</Link>}
        {excludePage !== 'consultation' && <Link to="/consultation" className="nav-button">💬 Consultation</Link>}
      </div>
    </div>
  );
}