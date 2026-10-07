# Daryl Glass

Personal site scaffold. Vite, React, Tailwind, GSAP, and Lenis — same local flow as Simplr and Bakebiz.

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` writes `dist/` and prerenders `dist/index.html`, so the production HTML already contains the page copy and schema.

Edit copy, projects, and contact details in `src/content/site.js`. The portfolio list renders at most five projects. Drop image files in `public/` and set each `images[].src`, for example `src: '/work/project-one-1.jpg'`.

The contact form posts to `/api/contact`. Until `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set, it stays closed and the email address on the page is the fallback. See `.env.example`.
