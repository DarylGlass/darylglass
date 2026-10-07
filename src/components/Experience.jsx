import { skills } from '../content/site.js'

export default function Experience() {
  return (
    <ul className="experience-list w-full">
      {skills.map((skill) => (
        <li key={skill.title} className="py-10 grid gap-10 grid-cols-12 w-full">
          <h2 className="col-span-6 text-2xl display-font">{skill.title}</h2>
          <p className="col-span-6">{skill.body}</p>
        </li>
      ))}
    </ul>
  )
}
