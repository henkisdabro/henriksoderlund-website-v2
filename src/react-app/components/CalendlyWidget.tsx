import { useEffect } from 'react';

interface CalendlyWidgetProps {
  url: string;
  className?: string;
}

const CalendlyWidget = ({ url, className = '' }: CalendlyWidgetProps) => {
  useEffect(() => {
    // Load Calendly script if not already loaded (matches official implementation)
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div 
      className={`calendly-inline-widget ${className}`}
      data-url={url}
    />
  );
};


export default CalendlyWidget;