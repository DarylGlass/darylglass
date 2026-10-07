import ContactForm from './components/ContactForm.jsx'
import DisplayTitle from './components/DisplayTitle.jsx'
import Experience from './components/Experience.jsx'
import Portfolio from './components/Portfolio.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import SiteMotion from './components/SiteMotion.jsx'
import { LinkedInIcon } from './components/common/Icons.jsx'
import { profile, sections } from './content/site.js'

const sectionTitle = Object.fromEntries(sections.map((section) => [section.id, section.title]))

export default function App() {
  const year = new Date().getFullYear()

  return (
    <>
      <a
        href="#landing"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteMotion />
      <DisplayTitle />
      <SiteHeader />
      <main>
        <section id="landing" className="section grid grid-cols-12">
          <div className="col-span-6 col-start-6 relative flex items-center">
            <a
              href="#"
              className="url-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="w-[50px] h-[50px]" strokeWidth="1.5" />
            </a>
            <div className="max-w-[80%]">
              <h1 className="sr-only">{sectionTitle.landing}</h1>
              <h2 className="lg:max-w-[80%] text-3xl lg:text-5xl display-font">{profile.role}</h2>
              <p className="mt-10">{profile.intro}</p>
            </div>
          </div>
        </section>

        <section id="experience" className="section grid grid-cols-12">
          <div className="col-span-6 col-start-6">
            <h1 className="sr-only">{sectionTitle.experience}</h1>
            <Experience />
          </div>
        </section>

        <section id="portfolio" className="section grid grid-cols-12">
          <div className="col-span-6 col-start-6">
            <h1 className="sr-only">{sectionTitle.portfolio}</h1>
            <Portfolio />
          </div>
        </section>

        <section id="contact" className="section grid grid-cols-12 relative">
          <div className="col-span-6 col-start-6 relative">
            <a
              href="#"
              className="url-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="w-[50px] h-[50px]" strokeWidth="1.5" />
            </a>
            <h1 className="sr-only">{sectionTitle.contact}</h1>
            <div className="grid gap-10">
              <address className="text-lg leading-snug not-italic">
                <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
                  {profile.email}
                </a>
                {profile.phone ? (
                  <>
                    <br />
                    <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="underline underline-offset-4">
                      {profile.phone}
                    </a>
                  </>
                ) : null}
                {profile.location ? (
                  <>
                    <br />
                    {profile.location}
                  </>
                ) : null}
              </address>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="p-10 text-sm text-right">
        <p>
          © {year} {profile.name}
        </p>
      </footer>
    </>
  )
}
