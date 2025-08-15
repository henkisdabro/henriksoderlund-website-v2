import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

const NavigationBox = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 1024);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const location = useLocation();

  const pages = [
    { path: '/', name: 'Home', emoji: '🏠' },
    { path: '/expertise', name: 'Expertise', emoji: '🛠️' },
    { path: '/work-experience', name: 'Work Experience', emoji: '💼' },
    { path: '/education', name: 'Education', emoji: '🎓' },
    { path: '/consultancy', name: 'Consultancy', emoji: '💬' }
  ];

  useEffect(() => {
    const scanHeadings = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingItems: HeadingItem[] = [];

      headingElements.forEach((heading, index) => {
        const text = heading.textContent || '';
        const level = parseInt(heading.tagName.charAt(1));
        
        // Skip H1 and H3 headings, and headings with specific text content, to create a cleaner navigation experience.
        if (text === 'Pages' || text === 'On This Page' || text === 'Navigation' || level === 1 || level === 3) {
          return;
        }
        
        // Create an ID if it doesn't exist
        let id = heading.id;
        if (!id) {
          id = `heading-${index}`;
          heading.id = id;
        }

        headingItems.push({ id, text, level });
      });

      setHeadings(headingItems);
    };

    // Handle responsive collapse state
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Scan headings after component mounts and when route changes
    const timeout = setTimeout(scanHeadings, 100);
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close menu on mobile after navigation
    if (window.innerWidth <= 1024) {
      setIsCollapsed(true);
    }
  };


  return (
    <div className={`navigation-box ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-box-header">
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {!isCollapsed && (
        <div className="nav-box-content">
          {/* Page Navigation */}
          <div className="nav-section">
            <h5>Pages</h5>
            <ul className="nav-list">
              {pages.map(page => (
                <li key={page.path} className={location.pathname === page.path ? 'active' : ''}>
                  <Link 
                    to={page.path}
                    onClick={() => {
                      if (window.innerWidth <= 1024) {
                        setIsCollapsed(true);
                      }
                    }}
                  >
                    {page.emoji} {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider - Hide on homepage */}
          {headings.length > 0 && location.pathname !== '/' && <div className="nav-divider"></div>}

          {/* Current Page Headings - Hide on homepage */}
          {headings.length > 0 && location.pathname !== '/' && (
            <div className="nav-section">
              <h5>On This Page</h5>
              <ul className="nav-list headings-list">
                {headings.map(heading => (
                  <li 
                    key={heading.id} 
                    className={`heading-level-${heading.level}`}
                    onClick={() => scrollToHeading(heading.id)}
                  >
                    <button type="button" className="heading-link">
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationBox;