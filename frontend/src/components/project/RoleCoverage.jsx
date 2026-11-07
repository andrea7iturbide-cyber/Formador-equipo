import { Check, CircleCheck, Hand, Send, Sparkles, Star } from "lucide-react"
import Avatar from "../ui/Avatar"
import { firstName } from "../../lib/projects"

/**
 * Mapa de cobertura de roles. Un rol abierto se presenta como oportunidad
 * (tarjeta blanca con acento ámbar), no como alerta; los cubiertos quedan
 * compactos en verde para que lo abierto resalte.
 * - invitedByRole: { [rolId]: nombre } invitaciones enviadas aún sin respuesta
 * - viewerSkills: habilidades confirmadas de quien mira (para "Tú lo tienes")
 * - onApply(rolId): si existe, cada rol abierto ofrece "Me interesa este rol"
 * - appliedRolId: rol al que ya enviaste solicitud
 */
export default function RoleCoverage({ roles, invitedByRole = {}, highlightRolId, viewerSkills = [], onApply, appliedRolId }) {
  const tengo = new Set(viewerSkills.map((s) => s.toLowerCase()))

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {roles.map((r, i) => {
        const member = r.cubiertoPor
          ? { id: String(r.cubiertoPor), nombre: `Integrante ${r.cubiertoPor}`, carrera: "" }
          : null
        const invited = invitedByRole[r.id]
        const vacantes = r.vacantes ?? 1
        const ocupados = r.ocupados ?? r.integrantesIds?.length ?? (r.cubiertoPor ? 1 : 0)
        const libres = Math.max(0, vacantes - ocupados)
        const coincide = r.habilidades.filter((h) => tengo.has(h.toLowerCase()))
        const aplicado = appliedRolId != null && String(appliedRolId) === String(r.id)

        if (member) {
          return (
            <li
              key={r.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="flex animate-fade-up items-center gap-3 self-start rounded-2xl bg-success-soft p-4 ring-1 ring-success-line"
            >
              <Avatar name={member.nombre} size="md" ring />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{r.nombre}</p>
                <p className="truncate text-sm text-ink-2">{member.nombre}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-stage">
                <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> Cubierto
              </span>
            </li>
          )
        }

        return (
          <li
            key={r.id}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`group relative flex animate-fade-up flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-5 pl-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop ${
              highlightRolId === r.id || aplicado ? "ring-2 ring-primary ring-offset-2 ring-offset-canvas" : ""
            }`}
          >
            {/* Acento lateral: ámbar = rol abierto (oportunidad) */}
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-highlight to-[#f08a3e]" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {r.indispensable && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-label font-semibold text-white">
                    <Star aria-hidden="true" className="size-3 fill-current" /> Prioritario
                  </span>
                )}
                <p className="text-lg leading-snug font-semibold text-ink">{r.nombre}</p>
              </div>
              <span className="shrink-0 rounded-full bg-highlight-soft px-2.5 py-1 text-xs font-semibold text-highlight-ink ring-1 ring-highlight/50">
                Pendiente
              </span>
            </div>

            <p className="-mt-2 text-sm">
              <span className="font-semibold text-ink">{libres === 1 ? "1 lugar libre" : `${libres} lugares libres`}</span>
              <span className="text-ink-2"> · {ocupados} de {vacantes} vacantes ocupadas</span>
            </p>

            {r.habilidades.length > 0 && (
              <div>
                <p className="eyebrow mb-2 text-ink-2">Buscan a alguien con</p>
                <ul className="flex flex-wrap gap-1.5">
                  {r.habilidades.map((h) => {
                    const mia = tengo.has(h.toLowerCase())
                    return (
                      <li
                        key={h}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                          mia ? "bg-success-soft text-success-ink ring-1 ring-success-line" : "bg-surface-2 text-ink"
                        }`}
                      >
                        {mia && <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}
                        {h}
                        {mia && <span className="sr-only"> (tú lo tienes)</span>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {coincide.length > 0 && (
              <p className="flex items-center gap-2 rounded-xl bg-ai-soft px-3 py-2 text-sm font-semibold text-ai-ink">
                <Sparkles aria-hidden="true" className="size-4 shrink-0" />
                Encajas: tienes {coincide.length} de {r.habilidades.length} habilidades
              </p>
            )}

            {invited && (
              <p className="flex items-center gap-1.5 text-sm text-ink-2">
                <Send aria-hidden="true" className="size-3.5" /> Invitaste a {firstName(invited)}
              </p>
            )}

            {onApply && (
              <div className="mt-auto pt-1">
                {aplicado ? (
                  <p className="flex animate-pop items-center gap-1.5 text-sm font-semibold text-success-ink">
                    <CircleCheck aria-hidden="true" className="size-4" /> Solicitud enviada
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => onApply(r.id)}
                    className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-stage px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary active:scale-[0.97]"
                  >
                    <Hand aria-hidden="true" className="size-4 text-highlight" /> Me interesa este rol
                  </button>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
