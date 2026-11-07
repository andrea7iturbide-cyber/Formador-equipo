import { useCallback } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check, Crown, EyeOff, Mail, Plus, Search } from "lucide-react"
import Card from "../components/ui/Card"
import TeamCoverageChart from "../components/team/TeamCoverageChart"
import { EmptyState, ErrorState, Skeleton } from "../components/ui/Feedback"
import useAsync from "../hooks/useAsync"
import { obtenerEquipo } from "../services/api"
import { coverage } from "../lib/projects"
import { getSessionUser } from "../lib/session"
import { projectCover } from "../lib/projectCovers"

// Avatares con degradado, uno por integrante (mismo lenguaje que la portada)
const AVATAR_TONOS = [
  "from-primary to-[#4a3ac4] text-white",
  "from-[#0b7a76] to-[#155e8a] text-white",
  "from-highlight to-[#f08a3e] text-stage",
  "from-[#d9407a] to-[#8a4bd8] text-white",
]
const iniciales = (nombre = "") => nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase()

function GradientAvatar({ nombre, index, size = "size-14 text-lg", ring = "" }) {
  return (
    <span role="img" aria-label={nombre} className={`grid shrink-0 place-items-center rounded-2xl bg-linear-to-br font-extrabold shadow-md ${size} ${ring} ${AVATAR_TONOS[index % AVATAR_TONOS.length]}`}>
      {iniciales(nombre)}
    </span>
  )
}

// Indicador con nombre explícito: "Roles" y "Habilidades" ya no se confunden
function Metric({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className="min-w-0 flex-1">
      <p className="flex items-baseline justify-between gap-2">
        <span className="eyebrow text-ink-2">{label}</span>
        <span className="text-sm font-semibold text-ink">
          {total ? `${value} de ${total}` : "—"}
        </span>
      </p>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${label}: ${value} de ${total}`}>
        <div className={`h-full rounded-full bg-linear-to-r ${color} transition-[width] duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SectionTitle({ id, eyebrow, eyebrowCls, title, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className={`eyebrow ${eyebrowCls}`}>{eyebrow}</p>
        <h2 id={id} className="mt-1 text-h2 font-extrabold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function TeamPage() {
  const { id } = useParams()
  const loadTeam = useCallback(() => obtenerEquipo(id), [id])
  const teamQuery = useAsync(loadTeam)
  const team = teamQuery.data

  if (teamQuery.loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-10 sm:px-8" aria-busy="true">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (teamQuery.status === "error") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <ErrorState message="No pudimos cargar los datos reales del equipo." onRetry={teamQuery.reload} />
      </div>
    )
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <EmptyState title="No encontramos este equipo">
          <Link to="/equipos" className="font-semibold text-primary hover:underline">Ver mis equipos</Link>
        </EmptyState>
      </div>
    )
  }

  const project = team.proyecto
  const members = team.miembros
  const { cubiertos, total } = coverage(project)
  const usuario = getSessionUser()
  const cobertura = team.cobertura_habilidades ?? {}
  const habilidadesCubiertas = new Set((cobertura.cubiertas ?? []).map((h) => h.toLowerCase()))
  const rolesLibres = project.roles.filter((r) => !r.cubiertoPor)
  const completo = total > 0 && cubiertos === total

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <Link to="/equipos" className="mb-4 inline-flex min-h-9 items-center gap-1 text-sm font-medium text-ink-2 hover:text-ink">
        <ArrowLeft aria-hidden="true" className="size-4" /> Mis equipos
      </Link>

      {/* ------------------------------ Encabezado ------------------------------ */}
      <Card className="mb-10 animate-fade-up overflow-hidden">
        <div className="relative isolate">
          <img src={projectCover(project)} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-stage/95 via-stage/60 to-stage/20" />
          <div className="flex min-h-56 flex-col justify-end gap-4 p-5 text-white sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  completo ? "bg-success text-stage" : "bg-highlight text-stage"
                }`}
              >
                {completo ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : <Plus aria-hidden="true" className="size-3.5" strokeWidth={3} />}
                {completo ? "Equipo completo" : "Equipo en formación"}
              </span>
              <span className="text-xs font-medium text-white/80">Tu rol: {team.rol}</span>
            </div>
            <h1 className="text-h1 font-extrabold text-balance">{team.nombre}</h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3" aria-hidden="true">
                  {members.map((m, i) => (
                    <GradientAvatar key={m.id} nombre={m.nombre} index={i} size="size-10 text-sm" ring="ring-2 ring-stage" />
                  ))}
                </div>
                <span className="text-sm text-white/85">
                  {members.length} {members.length === 1 ? "integrante" : "integrantes"}
                </span>
              </div>
              <Link
                to={`/proyectos/${project.id}`}
                className="glass inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors hover:bg-white/25"
              >
                Ver proyecto <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:gap-8 sm:p-7">
          <Metric label="Roles cubiertos" value={cubiertos} total={total} color="from-primary to-accent-2" />
          <Metric label="Habilidades cubiertas" value={(cobertura.cubiertas ?? []).length} total={cobertura.total ?? 0} color="from-success to-accent" />
        </div>
      </Card>

      {/* ------------------------------- Cobertura ------------------------------- */}
      <section aria-labelledby="coverage-title" className="mb-12 animate-fade-up [animation-delay:80ms]">
        <SectionTitle id="coverage-title" eyebrow="Habilidades" eyebrowCls="text-success-ink" title="Cobertura del equipo" />
        <Card className="p-5 sm:p-7">
          <TeamCoverageChart coverage={team.cobertura_habilidades} />
        </Card>
      </section>

      {/* ------------------------------ Integrantes ------------------------------ */}
      <section aria-labelledby="members-title" className="animate-fade-up [animation-delay:160ms]">
        <SectionTitle id="members-title" eyebrow={`${members.length} ${members.length === 1 ? "persona" : "personas"}`} eyebrowCls="text-primary" title="Integrantes" />
        {members.length === 0 ? (
          <EmptyState title="Aún no hay participantes registrados" />
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {members.map((member, i) => {
              const esTu = String(member.id) === String(usuario.id_usuario)
              const esCreador = member.rol === "Creador"
              return (
                <li key={member.id}>
                  <Card className="group flex h-full flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop">
                    <div className="flex items-center gap-3.5">
                      <GradientAvatar nombre={member.nombre} index={i} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate text-h3 font-semibold">
                          <span className="truncate">{member.nombre}</span>
                          {esTu && <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-ink-2">Tú</span>}
                        </p>
                        <p className="truncate text-sm text-ink-2">{member.carrera}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold ${
                        esCreador ? "bg-primary text-white" : "bg-success-soft text-success-ink ring-1 ring-success-line"
                      }`}
                    >
                      {esCreador ? <Crown aria-hidden="true" className="size-3.5" /> : <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}
                      {esCreador ? "Creador del proyecto" : member.rol}
                    </span>

                    {member.fortalezas.length > 0 && (
                      <div>
                        <p className="eyebrow mb-2 text-ink-2">Habilidades</p>
                        <ul className="flex flex-wrap gap-1.5">
                          {member.fortalezas.map((fortaleza) => {
                            const cubre = habilidadesCubiertas.has(fortaleza.nombre.toLowerCase())
                            return (
                              <li
                                key={fortaleza.nombre}
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                                  cubre ? "bg-success-soft font-semibold text-success-ink ring-1 ring-success-line" : "bg-surface-2 text-ink"
                                }`}
                              >
                                {cubre && <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}
                                {fortaleza.nombre}
                                {cubre && <span className="sr-only"> (cubre una necesidad del proyecto)</span>}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto border-t border-line pt-3">
                      {member.correo ? (
                        <a href={`mailto:${member.correo}`} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                          <Mail aria-hidden="true" className="size-4" />
                          <span className="truncate">{member.correo}</span>
                        </a>
                      ) : (
                        <p className="flex items-center gap-2 text-sm text-ink-2">
                          <EyeOff aria-hidden="true" className="size-4" /> No comparte su correo
                        </p>
                      )}
                    </div>
                  </Card>
                </li>
              )
            })}

            {/* Lugares libres: el equipo que se está formando, no solo el que ya existe */}
            {rolesLibres.map((rol) => (
              <li key={`libre-${rol.id}`}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border-2 border-dashed border-highlight/70 bg-highlight-soft/60 p-5">
                  <div className="flex items-center gap-3.5">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-dashed border-highlight bg-surface text-highlight-ink">
                      <Plus aria-hidden="true" className="size-6" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-h3 font-semibold text-ink">{rol.nombre}</p>
                      <p className="text-sm font-medium text-highlight-ink">Lugar libre · falta alguien</p>
                    </div>
                  </div>
                  {rol.habilidades.length > 0 && (
                    <div>
                      <p className="eyebrow mb-2 text-ink-2">Buscan a alguien con</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {rol.habilidades.map((h) => (
                          <li key={h} className="rounded-lg bg-surface px-2.5 py-1 text-xs font-medium text-ink ring-1 ring-highlight/40">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Link
                    to={`/estudiantes?q=${encodeURIComponent(rol.habilidades[0] ?? rol.nombre)}`}
                    className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-full bg-stage px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary"
                  >
                    <Search aria-hidden="true" className="size-4 text-highlight" /> Buscar integrante
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
