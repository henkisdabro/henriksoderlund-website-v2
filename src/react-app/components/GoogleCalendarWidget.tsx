import { useEffect, useRef, useState } from 'react';

interface GoogleCalendarWidgetProps {
  url: string;
  label: string;
  color?: string;
  className?: string;
}

const GoogleCalendarWidget = ({ url, label, color = '#039BE5', className }: GoogleCalendarWidgetProps) => {
  const scriptContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const scriptId = 'google-calendar-scheduling-script';
    const linkId = 'google-calendar-scheduling-css';
    
    setIsLoading(true);
    setHasError(false);
    isInitializedRef.current = false;

    // Clear any existing timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }

    const initializeButton = () => {
      if (!scriptContainerRef.current || isInitializedRef.current) {
        return;
      }

      // Clear the container first
      scriptContainerRef.current.innerHTML = '';

      try {
        if (window.calendar && window.calendar.schedulingButton) {
          window.calendar.schedulingButton.load({
            url: url,
            color: color,
            label: label,
            target: scriptContainerRef.current,
          });
          isInitializedRef.current = true;
          setIsLoading(false);
          setHasError(false);
        } else {
          // Retry after a short delay if API isn't ready
          initTimeoutRef.current = setTimeout(() => {
            if (window.calendar && window.calendar.schedulingButton && scriptContainerRef.current && !isInitializedRef.current) {
              window.calendar.schedulingButton.load({
                url: url,
                color: color,
                label: label,
                target: scriptContainerRef.current,
              });
              isInitializedRef.current = true;
              setIsLoading(false);
              setHasError(false);
            } else if (!window.calendar || !window.calendar.schedulingButton) {
              setHasError(true);
              setIsLoading(false);
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error initializing Google Calendar widget:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    const loadScript = () => {
      const existingScript = document.getElementById(scriptId);
      
      if (existingScript) {
        // Script already exists, just initialize
        setTimeout(initializeButton, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
      script.async = true;
      
      script.onload = () => {
        setTimeout(initializeButton, 200);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Calendar script');
        setHasError(true);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    const loadCss = () => {
      if (document.getElementById(linkId)) return;

      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
      document.head.appendChild(link);
    };

    loadCss();
    loadScript();

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [url, label, color]);

  if (hasError) {
    return (
      <div className={className}>
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <p style={{ margin: '0 0 15px 0', color: '#666' }}>
            Unable to load booking widget. Please use the direct link below:
          </p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: color,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            {label}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: '#666'
        }}>
          Loading booking widget...
        </div>
      )}
      <div ref={scriptContainerRef} style={{ opacity: isLoading ? 0 : 1 }}>
        {/* The Google Calendar button will be rendered inside this div */}
      </div>
    </div>
  );
};

// Extend Window interface to include calendar property
declare global {
  interface Window {
    calendar: {
      schedulingButton: {
        load: (options: { url: string; color: string; label: string; target: HTMLElement | null }) => void;
      };
    };
  }
}

export default GoogleCalendarWidget;
