import { useRef } from 'react'
import { ExternalLinkIcon } from './common/Icons.jsx'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MAX_PROJECTS, projects } from '../content/site.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function framesFor(project) {
  const frames = Array.isArray(project.images) ? project.images.slice(0, 3) : []
  while (frames.length < 3) {
    frames.push({
      src: '',
      alt: `${project.title}, image ${frames.length + 1}`,
    })
  }
  return frames
}

function pinMetrics(count) {
  const viewport = window.innerHeight
  const firstHold = viewport * 0.35
  const perItem = viewport * (window.innerWidth < 1024 ? 0.5 : 0.8)
  const total = firstHold + Math.max(count - 1, 0) * perItem
  return { firstHold, perItem, total }
}

function indexForScroll(scrolled, count, firstHold, perItem) {
  if (scrolled < firstHold) return 0
  return 1 + Math.min(Math.floor((scrolled - firstHold) / perItem), count - 2)
}

export default function Portfolio() {
  const stackRef = useRef(null)
  const items = projects.slice(0, MAX_PROJECTS)

  useGSAP(
    () => {
      const stack = stackRef.current
      const section = stack?.closest('section')
      const articles = stack ? gsap.utils.toArray('.portfolio-article', stack) : []
      if (!stack || !section || articles.length < 2) return undefined

      const motion = gsap.matchMedia()

      motion.add('(prefers-reduced-motion: no-preference)', () => {
        let currentIndex = 0

        const lockSection = () => {
          section.classList.add('portfolio-pin-locked')
          gsap.set(section, {
            height: window.innerHeight,
            maxHeight: window.innerHeight,
            overflow: 'hidden',
            boxSizing: 'border-box',
          })
        }

        lockSection()
        gsap.set(articles, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          autoAlpha: 0,
          y: 48,
        })
        gsap.set(articles[0], { autoAlpha: 1, y: 0, zIndex: 1 })
        articles.forEach((article, index) => {
          article.setAttribute('aria-hidden', index === 0 ? 'false' : 'true')
        })

        const showArticle = (index, direction = 1) => {
          if (index === currentIndex || !articles[index]) return

          const previous = articles[currentIndex]
          const next = articles[index]
          const travel = direction >= 0 ? 1 : -1
          currentIndex = index

          articles.forEach((article, articleIndex) => {
            article.setAttribute('aria-hidden', articleIndex === index ? 'false' : 'true')
          })

          gsap.killTweensOf([previous, next])
          gsap.set(next, { zIndex: 2 })
          gsap.set(previous, { zIndex: 1 })
          gsap.to(previous, {
            autoAlpha: 0,
            y: -100 * travel,
            duration: 0.75,
            ease: 'power3.inOut',
            overwrite: 'auto',
          })
          gsap.fromTo(
            next,
            { autoAlpha: 0, y: 100 * travel },
            { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.inOut', overwrite: 'auto' },
          )
        }

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${pinMetrics(articles.length).total}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -2,
          onRefreshInit: lockSection,
          onUpdate: (self) => {
            const { firstHold, perItem, total } = pinMetrics(articles.length)
            const scrolled = self.progress * total
            showArticle(indexForScroll(scrolled, articles.length, firstHold, perItem), self.direction)
          },
        })

        return () => {
          trigger.kill(true)
          section.classList.remove('portfolio-pin-locked')
          gsap.set(section, { clearProps: 'height,maxHeight,overflow,boxSizing,transform' })
          gsap.set(articles, { clearProps: 'position,top,left,width,opacity,visibility,transform,zIndex' })
          articles.forEach((article) => article.removeAttribute('aria-hidden'))
        }
      })

      return () => motion.revert()
    },
    { scope: stackRef },
  )

  return (
    <div ref={stackRef} className="portfolio-stack">
      {items.map((project, index) => (
        <article key={project.title} className="portfolio-article relative">
          {project.url ? (
            <a
              href={project.url}
              className="url-btn"
              target="_blank"
              rel="noreferrer"
              aria-label={project.url.replace(/^https?:\/\//, '')}
            >
              <ExternalLinkIcon className="w-[50px] h-[50px]" strokeWidth="1.5" />
            </a>
          ) : null}
          <h2 className="flex gap-2"><span className="text-lg text-acid">{index + 1}/{MAX_PROJECTS}</span><span className="text-3xl lg:text-5xl display-font">{project.title}</span></h2>
          <div className="grid grid-cols-12 gap-10 mt-20 mb-5">
          <table className="quick-look col-span-6 max-w-3xl text-xs lg:text-sm bg-paper/10">
            <caption className="sr-only">Quick look at {project.title}</caption>
            <tbody>
              <tr>
                <th scope="row">Tech</th>
                <td>{project.stack.join(', ')}</td>
              </tr>
              <tr>
                <th scope="row">Client</th>
                <td>{project.client}</td>
              </tr>
              <tr>
                <th scope="row">CMS</th>
                <td>{project.cms || '-'}</td>
              </tr>
              <tr>
                <th scope="row">Role</th>
                <td>{project.involvement.join(', ')}</td>
              </tr>
            </tbody>
          </table>
          <p className="col-span-6 max-w-2xl text-lg leading-snug">{project.summary}</p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {framesFor(project).map((image) => (
              <li key={image.alt} className="aspect-[4/3] border border-ink bg-paper">
                {image.src ? (
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-end p-3 text-xs uppercase tracking-wide">{image.alt}</div>
                )}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
