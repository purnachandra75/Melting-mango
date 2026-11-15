/**
 * Must match Restaurant Admin → Settings → Website Connection.
 */
export const SITE_SLUG = 'melting-mango';

/** Local restaurant server. Override with VITE_RESTAURANT_API_URL when deploying. */
export const RESTAURANT_API_URL =
  import.meta.env.VITE_RESTAURANT_API_URL || 'http://127.0.0.1:4000';
