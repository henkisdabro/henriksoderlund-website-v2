import { useEffect, useRef } from 'react';

interface CalendlyWidgetProps {
  url: string;
  height?: string;
  className?: string;
}

const CalendlyWidget = ({ url, height = '700px', className = '' }: CalendlyWidgetProps) => {
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
      style={{ 
        minWidth: '320px', 
        height: height
      }}
    />
  );
};


export default CalendlyWidget;