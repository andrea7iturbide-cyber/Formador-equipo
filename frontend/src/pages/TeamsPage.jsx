import { Link } from "react-router-dom"
import { Inbox, Plus, Users, UsersRound } from "lucide-react"
import PageHeader from "../components/layout/PageHeader"
import Button from "../components/ui/Button"
import { EmptyState, ErrorState, Skeleton } from "../components/ui/Feedback"
import TeamSummaryCard from "../components/team/TeamSummaryCard"
import useAsync from "../hooks/useAsync"
import { obtenerEquipos } from "../services/api"

export default function TeamsPage() {
  const { status, data, reload } = useAsync(obtenerEquipos)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        icon={UsersRound}
        tone="verde"
        eyebrow="Tu colaboración"
        title="Mis equipos"
        desc="Quién aporta qué en cada equipo y qué falta por cubrir."
        actions={
          <Button variant="secondary" as={Link} to="/invitaciones">
            <Inbox aria-hidden="true" className="size-4" /> Invitaciones
          </Button>
        }
      />

      {status === "loading" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : status === "error" ? (
        <ErrorState message="No pudimos cargar tus equipos." onRetry={reload} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aún no estás en un equipo"
          actions={
            <>
              <Button as={Link} to="/proyectos">
                Explorar proyectos
              </Button>
              <Button variant="secondary" as={Link} to="/proyectos/nuevo">
                <Plus aria-hidden="true" className="size-4" /> Crear proyecto
              </Button>
            </>
          }
        >
          Únete a un proyecto o crea el tuyo; te ayudaremos a encontrar a quién le falta.
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.map((t, i) => (
            <li key={t.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <TeamSummaryCard team={t} project={t.proyecto} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
