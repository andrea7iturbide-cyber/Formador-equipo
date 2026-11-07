// Cada área tiene su color: la vitrina se lee como personas distintas, no como una tabla.
// El texto del avatar es blanco u oscuro según el contraste de su degradado.
const AREAS = {
  tecnologia: {
    label: "Tecnología",
    avatar: "from-primary to-[#4a3ac4] text-white",
    tint: "bg-primary-soft text-primary-hover",
    hover: "hover:border-primary/50 hover:shadow-primary/20",
  },
  creatividad: {
    label: "Creatividad",
    avatar: "from-[#d9407a] to-[#8a4bd8] text-white",
    tint: "bg-[#fdeaf2] text-[#a3245a]",
    hover: "hover:border-[#d9407a]/45 hover:shadow-[#d9407a]/20",
  },
  negocios: {
    label: "Negocios",
    avatar: "from-highlight to-[#f08a3e] text-stage",
    tint: "bg-highlight-soft text-highlight-ink",
    hover: "hover:border-highlight hover:shadow-highlight/30",
  },
  personas: {
    label: "Personas",
    avatar: "from-[#0b7a76] to-[#155e8a] text-white",
    tint: "bg-ai-soft text-ai-ink",
    hover: "hover:border-ai-line hover:shadow-accent/25",
  },
}

function areaDe(carrera = "") {
  if (/dise|comunic|arte|arquitect/i.test(carrera)) return AREAS.creatividad
  if (/admin|negoc|mercad|econom|contad/i.test(carrera)) return AREAS.negocios
  if (/psico|salud|medic|enfermer|educa|derecho/i.test(carrera)) return AREAS.personas
  return AREAS.tecnologia
}

const iniciales = (name) => name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()

export default function SkillCard({ name, role, skills }) {
  const area = areaDe(role)
  return (
    <article
      className={`group flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-pop ${area.hover}`}
    >
      <div className="flex items-center gap-3.5">
        <span
          role="img"
          aria-label={name}
          className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br text-lg font-extrabold shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${area.avatar}`}
        >
          {iniciales(name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-ink">{name}</h3>
          <p className="truncate text-sm text-ink-2">{role}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-label font-semibold ${area.tint}`}>{area.label}</span>
      </div>
      <div>
        <p className="eyebrow mb-2 text-ink-2">Aporta a un equipo</p>
        <ul className="flex flex-wrap gap-1.5" aria-label={`Fortalezas de ${name}`}>
          {skills.map((skill) => (
            <li key={skill} className={`rounded-lg px-2.5 py-1 text-xs font-medium ${area.tint}`}>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
