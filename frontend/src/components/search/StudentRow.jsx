import { CalendarCheck, Check, EyeOff, Sparkles } from "lucide-react"
import Avatar from "../ui/Avatar"
import { DIAS, DIAS_LABEL, FRANJAS } from "../../data/mockData"

const FRANJAS_PLURAL = { manana: "Mañanas", tarde: "Tardes", noche: "Noches" }

/** Bloques libres ("lun-tarde"…); null si la persona oculta su horario. */
function bloquesDisponibles(student) {
  if (student.visibilidad?.disponibilidad === false) return null
  return student.disponibilidad ?? []
}

/**
 * Disponibilidad legible: días con dos letras (no hay dos "M"), franjas con las
 * mismas palabras que los filtros y, si tu perfil está confirmado, los horarios en común.
 */
export function Availability({ bloques, comunes = 0, className = "" }) {
  if (!bloques) {
    return (
      <span className={`flex items-center gap-1.5 text-xs text-ink-2 ${className}`}>
        <EyeOff aria-hidden="true" className="size-3.5" /> Horario privado
      </span>
    )
  }
  if (bloques.length === 0) {
    return <span className={`block text-xs text-ink-2 ${className}`}>Aún no indica su horario</span>
  }
  const dias = new Set(bloques.map((b) => b.split("-")[0]))
  const franjas = FRANJAS.filter((f) => bloques.some((b) => b.endsWith(`-${f}`)))
  const resumen = `Disponible ${[...dias].map((d) => DIAS_LABEL[d]).join(", ")}; ${franjas.map((f) => FRANJAS_PLURAL[f].toLowerCase()).join(" y ")}`

  return (
    <span className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 ${className}`}>
      <span className="sr-only">{resumen}.</span>
      <span aria-hidden="true" className="flex gap-1">
        {DIAS.map((dia) => {
          const libre = dias.has(dia)
          return (
            <span
              key={dia}
              title={DIAS_LABEL[dia]}
              className={`grid h-6 min-w-7 place-items-center rounded-md px-1 text-xs font-semibold ${
                libre ? "bg-success-soft text-success-ink ring-1 ring-success-line" : "bg-surface-2 text-ink-2/60"
              }`}
            >
              {DIAS_LABEL[dia].slice(0, 2)}
            </span>
          )
        })}
      </span>
      <span aria-hidden="true" className="text-xs font-medium text-ink-2">
        {franjas.map((f) => FRANJAS_PLURAL[f]).join(" · ")}
      </span>
      {comunes > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success-ink ring-1 ring-success-line">
          <CalendarCheck aria-hidden="true" className="size-3.5" />
          {comunes} {comunes === 1 ? "horario" : "horarios"} en común
        </span>
      )}
    </span>
  )
}

/**
 * Fila del directorio. Las señales se distinguen por color + ícono + texto:
 * turquesa = sugerido por IA · ámbar = sabe algo que tú quieres aprender.
 */
export default function StudentRow({ student, active, aiRec, complementa = [], viewerBloques = [], invited, onSelect, index = 0 }) {
  const bloques = bloquesDisponibles(student)
  const disponible = bloques && bloques.length > 0
  const mios = new Set(viewerBloques)
  const comunes = bloques ? bloques.filter((b) => mios.has(b)).length : 0
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

          <Availability bloques={bloques} comunes={comunes} className="mt-3" />
        </span>
      </button>
    </li>
  )
}
