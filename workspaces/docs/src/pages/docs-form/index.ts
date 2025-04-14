import { useEffect } from 'react';

export default function DocsForm() {
  useEffect(() => {
    window.location.href = '/usetheform'; // Redirect to the home page
  }, []);

  return null
}
