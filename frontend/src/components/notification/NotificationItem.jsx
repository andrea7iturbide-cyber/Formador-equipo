import { Link } from "react-router-dom"
import { Cpu, Mail, Users } from "lucide-react"

// Color por tipo, coherente con toda la app: IA turquesa, invitaciones ámbar (acción), equipo verde.
const GRUPOS = {
  ia: { Icon: Cpu, cls: "bg-linear-to-br from-accent to-[#0f7c78] text-stage", bar: "bg-accent" },
  invitaciones: { Icon: Mail, cls: "bg-linear-to-br from-highlight to-[#f08a3e] text-stage", bar: "bg-highlight" },
  equipo: { Icon: Users, cls: "bg-linear-to-br from-success to-[#0f9f6e] text-stage", bar: "bg-success" },
}

export default function NotificationItem({ notification }) {
  const { grupo, texto, fecha, accion } = notification
  const { Icon, cls, bar } = GRUPOS[grupo]
  return (
    <li className="relative flex animate-fade-up items-start gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-4 pl-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-pop">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl shadow-md ${cls}`}>
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{texto}</p>
        {fecha && <p className="mt-0.5 text-xs text-ink-2">{new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(fecha))}</p>}
        <Link
          to={accion.to}
          className="mt-2 inline-flex min-h-9 items-center rounded-full bg-stage px-4 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          {accion.label}
        </Link>
      </div>
    </li>
  )
}
