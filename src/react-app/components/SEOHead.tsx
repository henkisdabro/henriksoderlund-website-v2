import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  schemaData?: object | object[];
}

const SEOHead = ({ 
  title, 
  description, 
  keywords = [],
  canonicalUrl,
  ogImage = "https://www.henriksoderlund.com/og_image.png",
  ogType = "website",
  schemaData
}: SEOHeadProps) => {
  const location = useLocation();
  
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update keywords if provided
    if (keywords.length > 0) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', keywords.join(', '));
    }
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    const fullCanonicalUrl = canonicalUrl || `https://www.henriksoderlund.com${location.pathname}`;
    
    if (canonical) {
      canonical.setAttribute('href', fullCanonicalUrl);
    } else {
      // Create canonical tag if it doesn't exist
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', fullCanonicalUrl);
      document.head.appendChild(canonical);
    }
    
    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title);
    }
    
    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description);
    }
    
    // Update Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', fullCanonicalUrl);
    }
    
    // Update Open Graph type
    const ogTypeElement = document.querySelector('meta[property="og:type"]');
    if (ogTypeElement) {
      ogTypeElement.setAttribute('content', ogType);
    }
    
    // Update Open Graph image
    const ogImageElement = document.querySelector('meta[property="og:image"]');
    if (ogImageElement && ogImage) {
      ogImageElement.setAttribute('content', ogImage);
    }
    
    // Update Twitter title
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', title);
    }
    
    // Update Twitter description
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription && description) {
      twitterDescription.setAttribute('content', description);
    }
    
    // Update Twitter URL
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', fullCanonicalUrl);
    }
    
    // Update Twitter image
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage && ogImage) {
      twitterImage.setAttribute('content', ogImage);
    }
    
    // Add or update schema data
    if (schemaData) {
      // Remove existing page-specific schema
      const existingPageSchemas = document.querySelectorAll('script[type="application/ld+json"][data-page]');
      existingPageSchemas.forEach(schema => schema.remove());
      
      // Handle both single schema and array of schemas
      const schemas = Array.isArray(schemaData) ? schemaData : [schemaData];
      
      schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-page', location.pathname);
        script.setAttribute('data-index', index.toString());
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
      });
    }
    
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, schemaData, location.pathname]);
  
  return null; // This component doesn't render anything
};

export default SEOHead;