import React, { useEffect, useRef } from 'react';

interface GoogleCalendarWidgetProps {
  url: string;
  label: string;
  color?: string;
  className?: string;
}

const GoogleCalendarWidget: React.FC<GoogleCalendarWidgetProps> = ({ url, label, color = '#039BE5', className }) => {
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = 'google-calendar-scheduling-script';
    const linkId = 'google-calendar-scheduling-css';

    // Function to load script
    const loadScript = () => {
      if (document.getElementById(scriptId)) return; // Script already loaded

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
      script.async = true;
      script.onload = () => {
        // Once the main script is loaded, initialize the button
        if (window.calendar && window.calendar.schedulingButton) {
          window.calendar.schedulingButton.load({
            url: url,
            color: color,
            label: label,
            target: scriptContainerRef.current, // Use the ref as the target
          });
        }
      };
      document.head.appendChild(script);
    };

    // Function to load CSS
    const loadCss = () => {
      if (document.getElementById(linkId)) return; // CSS already loaded

      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
      document.head.appendChild(link);
    };

    loadCss();
    loadScript();

    // Cleanup function
    return () => {
      // No need to remove the script/link if they are global and might be used elsewhere
      // However, if this component is the *only* place they are used,
      // and to prevent potential issues on unmount/remount, we can remove them.
      // For now, let's assume they are safe to remain, or that the Google script handles re-initialization.
      // If issues arise, more aggressive cleanup (removing script/link elements) might be needed.
    };
  }, [url, label, color]); // Re-run effect if these props change

  return (
    <div ref={scriptContainerRef} className={className}>
      {/* The Google Calendar button will be rendered inside this div */}
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
