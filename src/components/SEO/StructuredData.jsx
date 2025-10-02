import { useEffect } from 'react';

const StructuredData = ({ data, id }) => {
  useEffect(() => {
    // Remove existing structured data script if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = typeof data === 'string' ? data : JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  return null; // This component doesn't render anything
};

export default StructuredData;