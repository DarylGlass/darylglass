import { sections } from '../content/site.js'

export default function DisplayTitle() {
  return (
    <div className="display-stack" aria-hidden="true">
      {sections.map((section, index) => (
        <h1
          key={section.id}
          data-display-title={section.id}
          className={index === 0 ? 'display-title is-current' : 'display-title'}
        >
          {section.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      ))}
    </div>
  )
}
