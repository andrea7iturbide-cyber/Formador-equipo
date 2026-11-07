import { Bell, BellOff } from "lucide-react"
import PageHeader from "../components/layout/PageHeader"
import { EmptyState, ErrorState, Skeleton } from "../components/ui/Feedback"
import NotificationItem from "../components/notification/NotificationItem"
import useAsync from "../hooks/useAsync"
import { obtenerNotificaciones } from "../services/api"

const GROUPS = [
  ["ia", "Recomendaciones"],
  ["invitaciones", "Invitaciones"],
  ["equipo", "Actualizaciones de equipo"],
]

export default function NotificationsPage() {
  const notifications = useAsync(obtenerNotificaciones)
  const items = notifications.data ?? []

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        icon={Bell}
        tone="turquesa"
        eyebrow="Notificaciones"
        title="Lo nuevo"
        accent="para ti"
        desc="Invitaciones, recomendaciones y actividad real de tus equipos."
      />

      {notifications.loading ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((item) => <Skeleton key={item} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : notifications.status === "error" ? (
        <ErrorState message="No pudimos cargar tus notificaciones reales." onRetry={notifications.reload} />
      ) : items.length === 0 ? (
        <EmptyState icon={BellOff} title="Sin notificaciones">
          Cuando recibas una invitación, haya una coincidencia para tus proyectos o alguien se una a tu equipo, aparecerá aquí.
        </EmptyState>
      ) : (
        <div className="space-y-8">
          {GROUPS.map(([key, label]) => {
            const list = items.filter((n) => n.grupo === key)
            if (!list.length) return null
            return (
              <section key={key} aria-labelledby={`g-${key}`}>
                <h2 id={`g-${key}`} className="eyebrow mb-2 text-ink-2">
                  {label}
                </h2>
                <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
                  {list.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
