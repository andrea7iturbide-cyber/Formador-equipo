import SkillCard from "./SkillCard"
import SectionHeading from "./SectionHeading"
import Reveal from "../ui/Reveal"

export default function SkillShowcase({ profiles }) {
  return (
    <section id="estudiantes" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Talento de todas las carreras"
        eyebrowCls="text-[#a3245a]"
        title="Cada perfil suma lo que"
        accent="a otro le falta"
        desc="Diseño, ingeniería, administración, psicología… Mira cómo se ve un perfil en Comple-team."
      />
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile, i) => (
          <Reveal as="li" key={profile.name} from="zoom" delay={i * 90}>
            <SkillCard {...profile} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-4 text-xs font-medium text-ink-2">Perfiles de ejemplo.</p>
    </section>
  )
}
