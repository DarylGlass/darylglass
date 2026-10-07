/**
 * Site copy. Change this file to update the page, schema, and llms.txt.
 * Portfolio renders at most MAX_PROJECTS items.
 */

export const MAX_PROJECTS = 5

export const profile = {
  name: 'Daryl Glass',
  role: 'Freelance Web Engineer',
  email: 'hello@darylglass.com',
  phone: '',
  location: '',
  sameAs: [],
  intro:
    'Creative and detail-oriented web developer with over 20 years of experience specialising in pixel-perfect websites, bespoke WordPress themes and custom plugin development. I combine deep technical expertise with a strong graphic design background, delivering visually refined, high-performing websites tailored to client needs. I’m known for clean, maintainable code and a critical eye for design, usability, and performance.',
}

export const pageTitle = 'Daryl Glass — Freelance Web Engineer'

export const pageDescription =
  'Freelance web engineer with 20+ years building pixel-perfect websites, bespoke WordPress themes, and custom plugins.'

export const sections = [
  {
    id: 'landing',
    label: 'Howzit',
    title: 'Daryl Glass',
    lines: ['Daryl', 'Glass'],
  },
  {
    id: 'experience',
    label: 'Experience',
    title: 'Experience',
    lines: ['Exper', 'ience'],
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    title: 'Portfolio',
    lines: ['Port', 'folio'],
  },
  {
    id: 'contact',
    label: 'Contact',
    title: 'Get in Touch',
    lines: ['Get in', 'Touch'],
  },
]

export const skills = [
  {
    title: 'Front-End Development',
    body: 'Vite, HTML, CSS, JavaScript, jQuery, GSAP, Sass, Bootstrap, Tailwind',
  },
  {
    title: 'Frameworks & Libraries',
    body: 'Next.js, React',
  },
  {
    title: 'Back-End Development',
    body: 'PHP, SQL, Node.js, Laravel',
  },
  {
    title: 'CMS & E-Commerce',
    body: 'WordPress, WooCommerce',
  },
  {
    title: 'Dev Tools & Environments',
    body: 'Cursor, Visual Studio Code, GIT, WP Local, FileZilla, phpMyAdmin, Supabase, Figma',
  },
  {
    title: 'Design Tools',
    body: 'Photoshop, Illustrator, Lightroom, Premiere Pro, Affinity (basic)',
  },
  {
    title: 'Other Strengths',
    body: 'Custom theme development, plugin development, performance optimization, responsive design, accessibility, SEO best practices',
  },
]

export const projects = [
  {
    title: 'BakeBiz.co.za',
    client: 'BakeBiz',
    url: 'https://www.bakebiz.co.za',
    cms: 'Custom',
    involvement: ['Design', 'Development'],
    stack: ['React', 'Tailwind', 'GSAP', 'Supabase'],
    summary:
      'Replace this with a short description of the work, the problem, and the result.',
    images: [
      { src: '', alt: 'Project one, image 1' },
      { src: '', alt: 'Project one, image 2' },
      { src: '', alt: 'Project one, image 3' },
    ],
  },
  {
    title: 'Project two',
    client: 'Client name',
    url: '',
    cms: '-',
    involvement: ['Development'],
    stack: ['WooCommerce', 'WordPress', 'JavaScript'],
    summary:
      'Replace this with a short description of the work, the problem, and the result.',
    images: [
      { src: '', alt: 'Project two, image 1' },
      { src: '', alt: 'Project two, image 2' },
      { src: '', alt: 'Project two, image 3' },
    ],
  },
  {
    title: 'Project three',
    client: 'Client name',
    url: '',
    cms: '-',
    involvement: ['Front-end development'],
    stack: ['React', 'Vite', 'Tailwind'],
    summary:
      'Replace this with a short description of the work, the problem, and the result.',
    images: [
      { src: '', alt: 'Project three, image 1' },
      { src: '', alt: 'Project three, image 2' },
      { src: '', alt: 'Project three, image 3' },
    ],
  },
]
