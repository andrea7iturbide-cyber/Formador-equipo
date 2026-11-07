import { Check, CircleDashed, HelpCircle, Sparkles } from "lucide-react"

/**
 * Por qué la IA sugiere a esta persona para tu proyecto. Solo muestra la
 * explicación pública del backend (fortalezas, faltantes y desconocidos).
 */
export default function AIInsight({ rec, project }) {
  const { strengths = [], gaps = [], unknowns = [] } = rec.explanation ?? {}
  const suficiente = rec.evidence_group !== "insufficient_evidence"

  return (
    <section
      aria-label="Explicación de la IA"
      className="relative animate-scale-in overflow-hidden rounded-2xl bg-linear-to-br from-accent via-primary to-primary-hover p-px shadow-card"
    >
      <div className="rounded-[calc(1rem-1px)] bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-accent to-primary text-white">
              <Sparkles aria-hidden="true" className="size-4" />
            </span>
            Por qué la IA lo sugiere
          </p>
          <span className={`rounded-full px-2.5 py-1 text-label font-semibold ${suficiente ? "bg-ai-soft text-ai-ink" : "bg-surface-2 text-ink-2"}`}>
            {suficiente ? "Basado en hechos confirmados" : "Evidencia insuficiente"}
          </span>
        </div>
        {project && <p className="mt-1 text-xs text-ink-2">Para «{project.titulo}»</p>}

        <ul className="mt-4 space-y-2 text-sm">
          {strengths.map((fact) => (
            <li key={fact} className="flex gap-2 text-ink">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ai-ink" strokeWidth={3} />
              <span><span className="sr-only">Fortaleza: </span>{fact}</span>
            </li>
          ))}
          {gaps.map((fact) => (
            <li key={fact} className="flex gap-2 text-warn-ink">
              <CircleDashed aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span><span className="sr-only">Pendiente: </span>{fact}</span>
            </li>
          ))}
          {unknowns.map((fact) => (
            <li key={fact} className="flex gap-2 text-ink-2">
              <HelpCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span><span className="sr-only">Sin datos: </span>{fact}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-2">La IA sugiere; tú decides a quién invitar.</p>
      </div>
    </section>
  )
}
