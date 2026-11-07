import { Link } from "react-router-dom"
import { ArrowRight, CalendarDays, Users } from "lucide-react"
import Card from "../ui/Card"
import { AIPanel } from "../ui/AIBadge"
import { ComplementLevel } from "../recommendation/RecommendationCard"
import { coverage, formatDate } from "../../lib/projects"
import { projectCover } from "../../lib/projectCovers"

const TYPE_LABELS = { academico: "Académico", personal: "Personal", deportivo: "Deportivo",
  videojuegos: "Videojuegos", general: "General" }

export function TypeBadge({ tipo, bare = false }) {
  if (bare) return <>{TYPE_LABELS[tipo] ?? tipo}</>
  return (
    <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-2">
      {TYPE_LABELS[tipo] ?? tipo}
    </span>
  )
}

// Mini indicador de roles: un segmento por rol, verde si está cubierto, ámbar si falta.
export function RoleDots({ roles }) {
  const { cubiertos, total } = coverage({ roles })
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" aria-hidden="true">
        {roles.map((r) => (
          <span key={r.id} className={`h-1.5 w-5 rounded-full ${r.cubiertoPor ? "bg-success" : "bg-highlight"}`} />
        ))}
      </div>
      <span className="text-xs text-ink-2">
        {cubiertos} de {total} roles cubiertos
      </span>
    </div>
  )
}

/**
 * Tarjeta de proyecto. Si recibe `suggestion` muestra el rol que el usuario
 * cubriría y la explicación de la IA.
 */
export default function ProjectCard({ project, suggestion, className = "" }) {
  const rol = suggestion && project.roles.find((r) => r.id === suggestion.rolId)
  return (
    <Card interactive className={`group relative flex flex-col overflow-hidden ${className}`}>
      {/* Portada ilustrativa de la categoría (decorativa) */}
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        <img
          src={projectCover(project)}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-stage/45 via-transparent to-transparent" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3">
          <span className="glass rounded-full px-2.5 py-1 text-xs font-semibold text-white">
            {TYPE_LABELS[project.tipo] ?? project.tipo}
          </span>
          {suggestion && (
            <span className="rounded-full bg-surface/95 px-2.5 py-1 shadow-sm">
              <ComplementLevel nivel={suggestion.nivel} />
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
      <div>
        <h3 className="line-clamp-2 text-h3 font-semibold text-ink">{project.titulo}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-2">{project.descripcion}</p>
      </div>
      {rol && (
        <p className="flex flex-wrap items-center gap-2 text-sm text-ink-2">
          Podrías cubrir
          <span className="rounded-md bg-ink px-2 py-0.5 text-xs font-semibold text-canvas">{rol.nombre}</span>
        </p>
      )}
      <RoleDots roles={project.roles} />
      {suggestion && (
        <AIPanel title="Por qué te lo sugerimos">
          <p className="line-clamp-2">{suggestion.porQue}</p>
        </AIPanel>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-ink-2">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1" aria-label={`Capacidad: ${project.integrantes} personas`}>
            <Users aria-hidden="true" className="size-3.5" /> {project.integrantes}
          </span>
          {project.fechaLimite && (
            <span className="flex items-center gap-1">
              <CalendarDays aria-hidden="true" className="size-3.5" /> {formatDate(project.fechaLimite)}
            </span>
          )}
        </span>
        <Link
          to={`/proyectos/${project.id}`}
          className="flex min-h-9 items-center gap-1 rounded-md px-1 text-sm font-semibold text-primary after:absolute after:inset-0 hover:underline"
        >
          Ver proyecto <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      </div>
    </Card>
  )
}
