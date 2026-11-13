# Melting Mango

A marketing site for **Melting Mango**, a small-batch artisan ice cream creamery with parlours in Hyderabad, Bengaluru and Mumbai.

The site is a React single-page app: guests can browse flavours, build a custom scoop, join the rewards club, read the brand story, and enquire about visits or private events. Orders are stored in the browser and checked out as a pickup simulation.

## Pages

| Route | What’s on it |
| --- | --- |
| `/` | Home — hero, menu board, scoop builder, rewards, gallery and reviews |
| `/menu` | Full flavour menu with search and availability filters |
| `/story` | Brand history, milestones and values |
| `/visit` | Parlour locations, hours, and a private-events enquiry form |

## Getting started

You need [Node.js](https://nodejs.org/) 18 or later.

```bash
npm install
npm run dev
```

This starts the Vite development server at [http://localhost:5173](http://localhost:5173) and opens it in your browser.

### Other scripts

| Command | Purpose |
| --- | --- |
| `npm run build` | Create an optimised production build in `dist/` |
| `npm run preview` | Serve the production build locally to check it |

## Deploy

The `dist/` folder is a static site. You can host it on any static host:

- **[Vercel](https://vercel.com/)** or **[Netlify](https://www.netlify.com/)**: import the GitHub repository (`purnachandra75/Melting-mango`). The Vite defaults (build command `npm run build`, output directory `dist`) work as-is.
- **GitHub Pages**: set the Vite `base` in `vite.config.js` to your repository name if the site is not served from the domain root, then deploy the `dist` folder.
- Any other static host: upload the contents of `dist/`.

After you have a public URL, replace the Open Graph image paths in `index.html` with absolute URLs (for example `https://your-domain.com/images/og-image.jpg`) so link previews resolve correctly.

## Project structure

```
public/            favicon, apple-touch icon, and optimised photographs
src/
  components/      shared UI (navigation, cart, scoop illustration, preloader)
  components/landing/  home-page sections (hero, gallery, scoop builder, rewards)
  context/         shopping-bag state, persisted in localStorage
  data/            flavour menu, rewards copy, and image paths
  hooks/           page titles and accessible dialog behaviour
  pages/           route-level screens
  styles/          design tokens and page styles
```

Photographs in `public/images` are served as compressed WebP (with a JPEG Open Graph image for wider social-preview support). Menu prices and copy live in `src/data/flavors.js`.

## Licence

The site’s code is written for Melting Mango. Product photography is via [Unsplash](https://unsplash.com/).
