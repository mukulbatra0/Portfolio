import { useEffect } from 'react';
import { updateMetaTags } from '../utils/seo';

export const useSEO = (currentSection) => {
  useEffect(() => {
    if (currentSection) {
      updateMetaTags(currentSection);
    }
  }, [currentSection]);
};

export default useSEO;