import { sections } from '../content/site.js'

export default function SiteHeader() {
  return (
    <header className="site-nav-container fixed bottom-[-1rem] left-[5%] bg-acid pt-5 pb-10 z-30 flex">
      <nav className="site-nav flex flex-col flex-wrap justify-end text-ink text-lg lg:text-2xl" aria-label="Sections">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            data-nav={section.id}
            className={section.id === 'landing' ? 'is-active' : undefined}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
