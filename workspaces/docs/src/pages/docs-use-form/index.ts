import { useEffect } from 'react';

export default function DocsUseForm() {
  useEffect(() => {
    window.location.href = '/usetheform'; // Redirect to the home page
  }, []);

  return null
}
