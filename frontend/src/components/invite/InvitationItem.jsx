import { useState } from "react"
import { Check, Clock, Eye, X } from "lucide-react"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import Modal from "../ui/Modal"
import PublicProfile from "../profile/PublicProfile"
import { obtenerPerfilUsuario } from "../../services/api"

const ESTADOS = {
  pendiente: { label: "Pendiente", cls: "border-warn-line bg-warn-soft text-warn-ink", Icon: Clock },
  aceptada: { label: "Aceptada", cls: "border-success-line bg-success-soft text-success-ink", Icon: Check },
  rechazada: { label: "Rechazada", cls: "border-line bg-surface-2 text-ink-2", Icon: X },
  expirada: { label: "Expirada", cls: "border-line bg-surface-2 text-ink-2 border-dashed", Icon: Clock },
}

export function StatusBadge({ estado }) {
  const { label, cls, Icon } = ESTADOS[estado]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      <Icon aria-hidden="true" className="size-3" strokeWidth={2.5} />
      {label}
    </span>
  )
}

/**
 * Invitación recibida o enviada. Las recibidas pendientes muestran
 * acciones rápidas para aceptar o rechazar.
 */
export default function InvitationItem({ invitation, person, project, onRespond, busy = false, compact = false }) {
  const { tipo, estado, rol, mensaje } = invitation
  const [profile, setProfile] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState("")
  const recibida = tipo === "recibida"
  const solicitudUnirse = invitation.tipoSolicitud === "unirse"
  const canRespond = recibida && estado === "pendiente" && onRespond
  const nombrePersona = person?.nombre || "Usuario"
  const tituloProyecto = project?.titulo || invitation.proyecto?.titulo || "proyecto"

  const showProfile = async () => {
    if (!person?.id) return
    setProfileOpen(true)
    setProfileError("")
    if (profile) return
    setProfileLoading(true)
    try {
      setProfile(await obtenerPerfilUsuario(person.id))
    } catch (error) {
      setProfileError(error.message || "No pudimos cargar este perfil.")
    } finally {
      setProfileLoading(false)
    }
  }

  return (
    <li
      className={`relative flex animate-fade-up flex-col gap-3 overflow-hidden rounded-2xl border bg-surface p-5 pl-6 shadow-card transition-all duration-300 ${
        canRespond ? "border-highlight/60 hover:shadow-pop" : "border-line"
      }`}
    >
      {/* Ámbar = te buscan y espera tu respuesta */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${canRespond ? "bg-linear-to-b from-highlight to-[#f08a3e]" : "bg-line"}`} />
      <div className="flex items-start gap-3">
        <Avatar name={nombrePersona} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink">
            {solicitudUnirse && recibida ? (
              <>
                <span className="font-semibold">{nombrePersona}</span> solicita unirse a{" "}
                <span className="font-semibold">{tituloProyecto}</span>
              </>
            ) : solicitudUnirse ? (
              <>
                Solicitaste unirte a <span className="font-semibold">{tituloProyecto}</span>
              </>
            ) : recibida ? (
              <>
                <span className="font-semibold">{nombrePersona}</span> te invitó a{" "}
                <span className="font-semibold">{tituloProyecto}</span>
              </>
            ) : (
              <>
                Invitaste a <span className="font-semibold">{nombrePersona}</span> a{" "}
                <span className="font-semibold">{tituloProyecto}</span>
              </>
            )}
          </p>
          {rol && (
            <p className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${canRespond ? "bg-highlight-soft text-highlight-ink" : "bg-surface-2 text-ink-2"}`}>
              Rol: {rol}
            </p>
          )}
        </div>
        {!canRespond && <StatusBadge estado={estado} />}
      </div>
      {person?.id && (
        <Button
          size="sm"
          variant="secondary"
          className="self-start"
          onClick={showProfile}
          aria-label={`Ver perfil de ${nombrePersona}`}
        >
          <Eye aria-hidden="true" className="size-4" /> Ver perfil
        </Button>
      )}
      {mensaje && !compact && (
        <p className="rounded-xl rounded-tl-sm border-l-4 border-primary/60 bg-primary-soft p-3 text-sm text-ink italic">“{mensaje}”</p>
      )}
      {canRespond && (
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" disabled={busy} onClick={() => onRespond("aceptada")}>
            <Check aria-hidden="true" className="size-4" /> Aceptar
          </Button>
          <Button size="sm" variant="secondary" className="flex-1" disabled={busy} onClick={() => onRespond("rechazada")}>
            Rechazar
          </Button>
        </div>
      )}
      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title={`Perfil de ${nombrePersona}`}
        description="Información visible según las preferencias de privacidad de esta persona."
        size="lg"
      >
        {profileLoading && <p className="py-8 text-center text-sm text-ink-2">Cargando perfil…</p>}
        {!profileLoading && profileError && (
          <p className="rounded-lg border border-dashed border-line p-4 text-sm text-ink-2" role="alert">
            {profileError}
          </p>
        )}
        {!profileLoading && !profileError && profile && <PublicProfile student={profile} />}
      </Modal>
    </li>
  )
}
