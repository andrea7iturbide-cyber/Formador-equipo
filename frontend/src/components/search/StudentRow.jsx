import { Check, Sparkles } from "lucide-react"
import Avatar from "../ui/Avatar"
import { DIAS, DIAS_LABEL } from "../../data/mockData"

/** Días con al menos un bloque libre; null si la persona oculta su horario. */
function diasDisponibles(student) {
  if (student.visibilidad?.disponibilidad === false) return null
  return new Set((student.disponibilidad ?? []).map((bloque) => bloque.split("-")[0]))
}

// Semana compacta: un punto por día, relleno si hay al menos un bloque libre.
export function WeekDots({ dias, className = "" }) {
  if (!dias) return <span className={`text-xs text-ink-2 ${className}`}>Horario privado</span>
  return (
    <span className={`flex items-center gap-1 ${className}`} aria-label={`Disponible ${dias.size} de ${DIAS.length} días`}>
      {DIAS.map((dia) => (
        <span key={dia} aria-hidden="true" title={DIAS_LABEL[dia]} className="flex flex-col items-center gap-0.5">
          <span className={`size-1.5 rounded-full ${dias.has(dia) ? "bg-success" : "bg-line"}`} />
          <span className="text-label leading-none font-semibold text-ink-2">{DIAS_LABEL[dia][0]}</span>
        </span>
      ))}
    </span>
  )
}

/**
 * Fila del directorio. Las señales se distinguen por color + ícono + texto:
 * turquesa = sugerido por IA · ámbar = sabe algo que tú quieres aprender.
 */
export default function StudentRow({ student, active, aiRec, complementa = [], invited, onSelect, index = 0 }) {
  const dias = diasDisponibles(student)
  const disponible = dias && dias.size > 0
  const aprender = new Set(complementa.map((s) => s.toLowerCase()))
  const skills = student.fortalezas ?? []

  return (
    <li className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={`group relative flex w-full cursor-pointer items-start gap-4 px-4 py-4 text-left transition-colors duration-200 sm:px-5 ${
          active ? "bg-primary-soft" : "hover:bg-surface-2/70"
        }`}
      >
        {/* Barra de selección */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-3 left-0 w-1 rounded-r-full bg-primary transition-transform duration-300 ${active ? "scale-y-100" : "scale-y-0"}`}
        />

        <span className="relative shrink-0">
          <Avatar name={student.nombre} size="lg" className="transition-transform duration-300 group-hover:scale-105" />
          {disponible && (
            <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-surface bg-success" title="Tiene horarios disponibles">
              <span className="sr-only">Tiene horarios disponibles</span>
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-semibold text-ink">{student.nombre}</span>
            {aiRec && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ai-soft px-2 py-0.5 text-label font-semibold text-ai-ink ring-1 ring-ai-line">
                <Sparkles aria-hidden="true" className="size-3" /> Sugerido por IA
              </span>
            )}
            {invited && (
              <span className="inline-flex animate-pop items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-label font-semibold text-success-ink">
                <Check aria-hidden="true" className="size-3" strokeWidth={3} /> Invitado
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-sm text-ink-2">
            {student.carrera || "Carrera no especificada"}
            {student.semestre ? ` · ${student.semestre}.º semestre` : ""}
          </span>

          {skills.length > 0 ? (
            <span className="mt-2.5 flex flex-wrap gap-1.5">
              {skills.slice(0, 3).map((skill) => {
                const destaca = aprender.has(skill.nombre.toLowerCase())
                return (
                  <span
                    key={skill.nombre}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                      destaca ? "bg-highlight-soft text-highlight-ink ring-1 ring-highlight/60" : "bg-surface-2 text-ink"
                    }`}
                  >
                    {destaca && <span className="sr-only">Quieres aprender esto: </span>}
                    {skill.nombre}
                  </span>
                )
              })}
              {skills.length > 3 && <span className="self-center text-xs font-medium text-ink-2">+{skills.length - 3}</span>}
            </span>
          ) : (
            <span className="mt-2 block text-xs text-ink-2">Aún no agrega fortalezas.</span>
          )}
        </span>

        <WeekDots dias={dias} className="mt-1 shrink-0 max-sm:hidden" />
      </button>
    </li>
  )
}
