import { useEffect } from 'react';

const DEFAULT_TITLE = 'Melting Mango · Artisan Ice Cream';
const DEFAULT_DESCRIPTION =
  'Melting Mango — small-batch, slow-churned artisan ice cream made every morning with ripe fruit, real cream and nothing artificial. Parlours in Hyderabad, Bengaluru and Mumbai.';

/**
 * Sets the document title and meta description for the current page,
 * and restores the site defaults when the page unmounts.
 */
export function usePageTitle(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content');

    document.title = title ? `${title} · Melting Mango` : DEFAULT_TITLE;
    if (meta && description) meta.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const prevOgTitle = ogTitle?.getAttribute('content');
    const prevOgDesc = ogDesc?.getAttribute('content');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    if (ogDesc && description) ogDesc.setAttribute('content', description);

    return () => {
      document.title = prevTitle || DEFAULT_TITLE;
      if (meta && prevDescription) meta.setAttribute('content', prevDescription);
      if (ogTitle && prevOgTitle) ogTitle.setAttribute('content', prevOgTitle);
      if (ogDesc && prevOgDesc) ogDesc.setAttribute('content', prevOgDesc);
    };
  }, [title, description]);
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION };
