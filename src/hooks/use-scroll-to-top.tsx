import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use setTimeout to ensure the DOM has updated before scrolling
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    // Small delay to ensure smooth transition
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
}; 