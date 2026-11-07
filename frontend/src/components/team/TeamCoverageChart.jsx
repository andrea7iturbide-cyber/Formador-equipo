import { useId } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check, CircleDashed } from "lucide-react"

/**
 * Gráfico de cobertura de habilidades del equipo: anillo cubiertas vs.
 * faltantes y, al lado, el detalle de cada habilidad. Cada habilidad que
 * falta lleva a Personas con esa búsqueda ya escrita.
 * - coverage: requisitos y declaraciones confirmadas calculados por el backend.
 */
export default function TeamCoverageChart({ coverage }) {
  // Los id de React traen caracteres que no siempre son válidos dentro de url(#…)
  const gradId = `cov-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const { cubiertas = [], por_acreditar: faltantes = [], total = 0, estado = "desconocida" } = coverage ?? {}
  const unknown = estado !== "conocida" || total === 0
  const r = 42
  const c = 2 * Math.PI * r
  const frac = total ? cubiertas.length / total : 0
  const gap = total && faltantes.length && cubiertas.length ? 4 : 0

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
      <figure className="relative grid size-40 shrink-0 place-items-center">
        <svg viewBox="0 0 100 100" className="size-40 -rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--success)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="11" className="stroke-highlight/30" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="11"
            strokeLinecap="round"
            stroke={`url(#${gradId})`}
            strokeDasharray={`${Math.max(c * frac - gap, 0)} ${c}`}
            className="transition-[stroke-dasharray] duration-700 ease-out"
          />
        </svg>
        <figcaption className="absolute text-center">
          <span className="block text-h1 font-extrabold">{total ? `${cubiertas.length}/${total}` : "—"}</span>
          <span className="text-xs font-medium text-ink-2">{unknown ? "Desconocida" : "habilidades"}</span>
        </figcaption>
        <span className="sr-only">
          {unknown ? "No se puede determinar la cobertura completa." : `${cubiertas.length} de ${total} habilidades cubiertas`}
        </span>
      </figure>

      <div className="grid w-full flex-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-success-soft p-4 ring-1 ring-success-line">
          <p className="mb-3 flex items-center gap-2 font-semibold text-success-ink">
            <span className="grid size-6 place-items-center rounded-full bg-success text-stage">
              <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
            </span>
            Ya cubren ({cubiertas.length})
          </p>
          {cubiertas.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {cubiertas.map((h) => (
                <li key={h} className="rounded-lg bg-surface px-2.5 py-1 text-xs font-semibold text-success-ink ring-1 ring-success-line">
                  {h}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-2">Aún no hay habilidades confirmadas en el equipo.</p>
          )}
        </div>

        <div className="rounded-2xl bg-highlight-soft p-4 ring-1 ring-highlight/50">
          <p className="mb-3 flex items-center gap-2 font-semibold text-highlight-ink">
            <span className="grid size-6 place-items-center rounded-full bg-highlight text-stage">
              <CircleDashed aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
            </span>
            Le falta al equipo ({faltantes.length})
          </p>
          {faltantes.length ? (
            <ul className="flex flex-col gap-1.5">
              {faltantes.map((h) => (
                <li key={h}>
                  <Link
                    to={`/estudiantes?q=${encodeURIComponent(h)}`}
                    className="group flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm ring-1 ring-highlight/40 transition-all hover:-translate-y-0.5 hover:shadow-card hover:ring-highlight"
                  >
                    <span className="font-semibold text-ink">{h}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-highlight-ink">
                      Buscar quién sabe <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-2">{unknown ? "Cobertura desconocida: faltan requisitos confirmados o perfiles con habilidades visibles y confirmadas." : "Las habilidades requeridas tienen evidencia confirmada en el equipo."}</p>
          )}
        </div>
      </div>
      {unknown && total > 0 && <p className="text-xs text-ink-2">La información no visible o sin confirmar impide verificar toda la cobertura.</p>}
    </div>
  )
}
