import {
  MAX_PROJECTS,
  pageDescription,
  pageTitle,
  profile,
  projects,
  skills,
} from '../content/site.js'

export function siteOrigin(env = {}) {
  const raw = env.VITE_SITE_URL || 'https://darylglass.com'
  return String(raw).replace(/\/$/, '')
}

export function isIndexable(env = {}) {
  if (env.VERCEL_ENV === 'preview') return false
  if (env.VITE_ALLOW_INDEXING === 'false') return false
  return true
}

export function robotsContent(env = {}) {
  if (!isIndexable(env)) return 'noindex, nofollow'
  return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
}

function listedProjects() {
  return projects.slice(0, MAX_PROJECTS)
}

export function buildSchema(env = {}) {
  const origin = siteOrigin(env)
  const url = `${origin}/`
  const personId = `${origin}/#person`
  const websiteId = `${origin}/#website`

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    jobTitle: profile.role,
    description: profile.intro,
    url,
    email: `mailto:${profile.email}`,
    knowsAbout: [
      ...skills.map((skill) => skill.title),
      'React',
      'Next.js',
      'WordPress',
      'WooCommerce',
      'GSAP',
      'Tailwind CSS',
      'PHP',
      'Laravel',
    ],
    knowsLanguage: ['en'],
    hasOccupation: {
      '@type': 'Occupation',
      name: profile.role,
    },
  }

  if (profile.location) {
    person.homeLocation = {
      '@type': 'Place',
      name: profile.location,
    }
  }

  if (profile.sameAs.length) {
    person.sameAs = profile.sameAs
  }

  const graph = [
    person,
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url,
      name: profile.name,
      description: pageDescription,
      inLanguage: 'en',
      publisher: { '@id': personId },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${origin}/#profile`,
      url,
      name: pageTitle,
      description: pageDescription,
      inLanguage: 'en',
      isPartOf: { '@id': websiteId },
      mainEntity: { '@id': personId },
      about: { '@id': personId },
    },
    {
      '@type': 'ItemList',
      '@id': `${origin}/#portfolio`,
      name: 'Portfolio',
      numberOfItems: listedProjects().length,
      itemListElement: listedProjects().map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          keywords: project.stack.join(', '),
          creator: { '@id': personId },
          ...(project.url ? { url: project.url } : {}),
        },
      })),
    },
    {
      '@type': 'ContactPoint',
      '@id': `${origin}/#contact`,
      contactType: 'client enquiries',
      email: profile.email,
      url: `${origin}/#contact`,
      availableLanguage: ['English'],
    },
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function robotsTxt(env = {}) {
  const origin = siteOrigin(env)
  if (!isIndexable(env)) {
    return 'User-agent: *\nDisallow: /\n'
  }
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
}

export function sitemapXml(env = {}) {
  const origin = siteOrigin(env)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
  </url>
</urlset>
`
}

export function llmsTxt(env = {}) {
  const origin = siteOrigin(env)
  const skillLines = skills.map((skill) => `- ${skill.title}: ${skill.body}`).join('\n')
  const projectLines = listedProjects()
    .map((project) => {
      const link = project.url ? ` (${project.url})` : ''
      return `- ${project.title}${link}: ${project.summary} Stack: ${project.stack.join(', ')}.`
    })
    .join('\n')

  return `# ${profile.name}

> ${profile.role}. ${pageDescription}

## About
${profile.intro}

## Skills
${skillLines}

## Portfolio
${projectLines}

## Contact
- Email: ${profile.email}
- Page: ${origin}/#contact

## Canonical
${origin}/
`
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

export function seoTags(env = {}) {
  const origin = siteOrigin(env)
  const url = `${origin}/`
  const title = escapeAttr(pageTitle)
  const description = escapeAttr(pageDescription)
  const schema = JSON.stringify(buildSchema(env)).replace(/</g, '\\u003c')
  const robots = escapeAttr(robotsContent(env))

  return [
    `<meta name="description" content="${description}" />`,
    `<meta name="author" content="${escapeAttr(profile.name)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:site_name" content="${escapeAttr(profile.name)}" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<script type="application/ld+json">${schema}</script>`,
  ].join('\n    ')
}
