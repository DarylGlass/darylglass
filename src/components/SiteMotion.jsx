import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { sections } from '../content/site.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const YEAR_START = 1979
const YEAR_END = 2050
// Portion of each section handoff before the incoming title starts forming.
const INCOMING_DELAY = 0.5

function delayedProgress(progress) {
  return gsap.utils.clamp(0, 1, (progress - INCOMING_DELAY) / (1 - INCOMING_DELAY))
}

function paint(el, year, alpha) {
  const nextYear = Math.round(year * 10) / 10
  el.style.setProperty('--year', String(nextYear))
  el.style.fontVariationSettings = `"YEAR" ${nextYear}`
  el.style.opacity = String(alpha)
  el.style.visibility = alpha < 0.02 ? 'hidden' : 'visible'
}

function setActiveNav(id) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.nav === id)
  })
}

function sectionProgress(id) {
  const el = document.getElementById(id)
  if (!el) return 0
  const top = el.getBoundingClientRect().top
  const start = window.innerHeight * 0.85
  const end = window.innerHeight * 0.2
  return gsap.utils.clamp(0, 1, (start - top) / (start - end))
}

export default function SiteMotion() {
  useGSAP(() => {
    const titles = gsap.utils.toArray('[data-display-title]')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const showSettled = (index) => {
      titles.forEach((el, titleIndex) => {
        paint(el, YEAR_START, titleIndex === index ? 1 : 0)
      })
      setActiveNav(sections[index].id)
    }

    const render = () => {
      const states = sections.map((_, index) => ({
        year: index === 0 ? YEAR_START : YEAR_END,
        alpha: index === 0 ? 1 : 0,
      }))
      let current = 0

      sections.forEach((section, index) => {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          current = index
        }
        if (index === 0) return

        const progress = sectionProgress(section.id)
        if (progress <= 0) return

        const enter = delayedProgress(progress)
        states[index - 1] = {
          year: gsap.utils.interpolate(YEAR_START, YEAR_END, progress),
          alpha: 1 - progress,
        }
        states[index] = {
          year: gsap.utils.interpolate(YEAR_END, YEAR_START, enter),
          alpha: enter,
        }
      })

      states.forEach((state, index) => {
        if (!titles[index]) return
        paint(titles[index], state.year, state.alpha)
      })
      setActiveNav(sections[current].id)
    }

    if (reduce) {
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: `#${section.id}`,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) showSettled(index)
          },
        })
      })
      showSettled(0)
      return undefined
    }

    let lenis
    const onAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return
      event.preventDefault()
      lenis?.scrollTo(target)
    }

    lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: false,
    })
    lenis.on('scroll', () => {
      ScrollTrigger.update()
      render()
    })

    const onTick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    document.addEventListener('click', onAnchorClick)

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: render,
    })
    render()
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  })

  return null
}
