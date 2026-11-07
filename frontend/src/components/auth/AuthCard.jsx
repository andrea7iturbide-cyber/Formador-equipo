import { useEffect, useId, useRef, useState } from "react"
import { ArrowRight, Check, CircleAlert, Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import { LoadingSteps } from "../ui/Feedback"

const EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SIGNUP_STEPS = ["Validando tus datos", "Protegiendo tu contraseña", "Creando tu cuenta", "Preparando tu espacio"]
const LOGIN_STEPS = ["Verificando tus datos", "Abriendo tu espacio"]

// Registro en 3 pasos: lo esencial primero y lo opcional al final.
const PASOS = [
  { titulo: "Sobre ti", campos: ["nombre", "carrera"] },
  { titulo: "Tu cuenta", campos: ["email", "password", "confirmPassword"] },
  { titulo: "Ubicación", campos: ["estado_geografico", "municipio"] },
]

// Tono de cada paso (texto blanco legible en todos): violeta de marca → turquesa profundo.
const TONOS = {
  login: ["#6957e8", "#5644d4", "#17152f"],
  0: ["#6957e8", "#5b49dd", "#4a3ac4"],
  1: ["#4a3ac4", "#3a3fae", "#1f6f8b"],
  2: ["#1f6f8b", "#0f7c78", "#0b5f5c"],
}

const VACIO = { nombre: "", carrera: "", email: "", password: "", confirmPassword: "", estado_geografico: "", municipio: "" }

function validar(campo, v) {
  const largo = (s) => [...s].length
  switch (campo) {
    case "nombre":
      return !v.nombre.trim() || largo(v.nombre.trim()) > 150 ? "Escribe un nombre de hasta 150 caracteres." : null
    case "carrera":
      return !v.carrera.trim() || largo(v.carrera.trim()) > 100 ? "Escribe una carrera de hasta 100 caracteres." : null
    case "email":
      return EMAIL_VALIDATION.test(v.email.trim()) ? null : "Ingresa un correo válido."
    case "password":
      return largo(v.password) < 8 || largo(v.password) > 128 || !v.password.trim() ? "Usa entre 8 y 128 caracteres." : null
    case "confirmPassword":
      return v.password !== v.confirmPassword ? "Las contraseñas no coinciden." : null
    default:
      return null
  }
}

/* ------------------------- Piezas del panel de color ------------------------- */

// Campo claro sobre el degradado. El autocompletado del navegador se repinta
// del color de marca para que el texto blanco no desaparezca.
function Field({ label, error, optional, hint, trailing, ...props }) {
  const id = useId()
  const msgId = `${id}-msg`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-white">
        {label} {optional && <span className="font-normal text-white/75">(opcional)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error || hint ? msgId : undefined}
          className={`min-h-12 w-full rounded-xl border bg-white/10 px-4 text-white transition outline-none placeholder:text-white/60 focus:bg-white/15 focus:ring-4 focus:ring-white/20 autofill:shadow-[inset_0_0_0_1000px_var(--tone-b)] autofill:[-webkit-text-fill-color:#fff] ${
            error ? "border-amber-200" : "border-white/40 focus:border-white"
          } ${trailing ? "pr-12" : ""}`}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center">{trailing}</div>}
      </div>
      {(error || hint) && (
        <p id={msgId} role={error ? "alert" : undefined} className={`flex items-center gap-1.5 text-xs ${error ? "font-medium text-amber-100" : "text-white/75"}`}>
          {error && <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />}
          {error || hint}
        </p>
      )}
    </div>
  )
}

function PasswordToggle({ show, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? `Ocultar ${label}` : `Mostrar ${label}`}
      className="grid size-12 cursor-pointer place-items-center text-white/70 hover:text-white"
    >
      {show ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
    </button>
  )
}

function Stepper({ actual }) {
  return (
    <ol className="flex items-center gap-2" aria-label={`Paso ${actual + 1} de ${PASOS.length}`}>
      {PASOS.map((paso, i) => {
        const hecho = i < actual
        const activo = i === actual
        return (
          <li key={paso.titulo} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              aria-current={activo ? "step" : undefined}
              className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-all duration-300 ${
                hecho || activo ? "bg-white text-primary" : "bg-white/20 text-white/85"
              } ${activo ? "ring-4 ring-white/30" : ""}`}
            >
              {hecho ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : i + 1}
              <span className="sr-only">{paso.titulo}</span>
            </span>
            {i < PASOS.length - 1 && (
              <span aria-hidden="true" className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25">
                <span className={`block h-full bg-white transition-all duration-500 ${hecho ? "w-full" : "w-0"}`} />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

const PILL = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
const PILL_PRIMARY = `${PILL} bg-white text-primary shadow-lg shadow-black/15 hover:-translate-y-0.5 hover:shadow-xl`
const PILL_GHOST = `${PILL} bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25`

function ServerError({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-black/20 px-4 py-3 text-sm font-medium text-white">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-200" />
      <span>
        <span className="italic">¡Ups!</span> {message}
      </span>
    </p>
  )
}

/* ------------------------------ Panel de marca ------------------------------ */

// Registro: panel oscuro. Inicio de sesión: panel claro. El cambio de tono marca el modo.
function BrandPanel({ isSignUp, onSwitch }) {
  const dark = isSignUp
  return (
    <aside
      className={`relative isolate flex flex-col justify-between overflow-hidden p-10 transition-colors duration-700 max-md:hidden lg:p-12 ${
        dark ? "bg-stage text-white" : "bg-surface text-ink"
      }`}
    >
      {/* Los resplandores toman el tono del paso actual (heredado de la tarjeta) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className={`absolute -top-24 -right-24 size-72 rounded-full bg-(--tone-b) blur-3xl transition-opacity duration-700 ${dark ? "opacity-40" : "opacity-15"}`} />
        <span className={`absolute -bottom-28 -left-20 size-72 rounded-full bg-(--tone-c) blur-3xl transition-opacity duration-700 ${dark ? "opacity-45" : "opacity-15"}`} />
        <span
          className={`absolute inset-0 bg-size-[20px_20px] ${
            dark ? "bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)]" : "bg-[radial-gradient(rgb(15_31_29/0.08)_1px,transparent_1px)]"
          }`}
        />
      </div>

      {/* key: la animación se repite al cambiar entre registro e inicio de sesión */}
      <p key={isSignUp ? "registro" : "login"} className="text-[clamp(2.25rem,4vw,3.4rem)] leading-[0.95] font-extrabold tracking-tight uppercase">
        <span className={`block animate-fade-up [animation-delay:100ms] ${dark ? "text-accent" : "text-primary"}`}>Aporta</span>
        <span className={`mt-2 flex animate-fade-up items-center gap-3 [animation-delay:350ms] ${dark ? "text-white" : "text-ink"}`}>
          <ArrowRight aria-hidden="true" className={`size-[0.8em] ${dark ? "text-accent" : "text-primary"}`} strokeWidth={3} />
          Aprende
        </span>
        <span
          className={`mt-2 block animate-fade-up bg-linear-to-r bg-clip-text text-transparent [animation-delay:600ms] ${
            dark ? "from-accent to-accent-2" : "from-primary to-ai-ink"
          }`}
        >
          Complementa
        </span>
      </p>

      <div className="mt-12 flex flex-col items-start gap-4">
        <p className={`max-w-xs text-sm ${dark ? "text-white/70" : "text-ink-2"}`}>
          {isSignUp
            ? "Encuentra compañeros de otras carreras que cubren lo que a tu equipo le falta."
            : "Tus proyectos y recomendaciones te están esperando."}
        </p>
        <p className={`text-sm font-medium ${dark ? "text-white/85" : "text-ink"}`}>{isSignUp ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}</p>
        <button
          type="button"
          onClick={onSwitch}
          className={`min-h-11 cursor-pointer rounded-full border px-7 text-sm font-semibold tracking-wide uppercase transition-colors ${
            dark ? "border-accent text-accent hover:bg-accent hover:text-stage" : "border-primary text-primary hover:bg-primary hover:text-white"
          }`}
        >
          {isSignUp ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </div>
    </aside>
  )
}

/* -------------------------------- Componente -------------------------------- */

export default function AuthCard({ initialMode = "login", onSignIn, onSignUp, loading = false, error }) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup")
  const [paso, setPaso] = useState(0)
  const [valores, setValores] = useState(VACIO)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const pasoRef = useRef(null)
  const primerRender = useRef(true)

  // Al cambiar de paso, el foco va al primer campo (teclado y lectores de pantalla).
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false
      return
    }
    pasoRef.current?.querySelector("input")?.focus()
  }, [paso, isSignUp])

  const campo = (name) => ({
    name,
    value: valores[name],
    error: errors[name],
    onChange: (event) => {
      setValores((v) => ({ ...v, [name]: event.target.value }))
      if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
    },
  })

  const validarCampos = (campos) => {
    const errs = Object.fromEntries(campos.map((c) => [c, validar(c, valores)]).filter(([, msg]) => msg))
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const cambiarModo = () => {
    setIsSignUp((s) => !s)
    setPaso(0)
    setErrors({})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isSignUp) {
      const errs = {}
      if (!EMAIL_VALIDATION.test(valores.email.trim())) errs.email = "Ingresa un correo válido."
      if (!valores.password.trim()) errs.password = "Escribe tu contraseña."
      else if ([...valores.password].length > 128) errs.password = "La contraseña admite hasta 128 caracteres."
      setErrors(errs)
      if (!Object.keys(errs).length) onSignIn?.({ email: valores.email.trim(), password: valores.password })
      return
    }
    if (!validarCampos(PASOS[paso].campos)) return
    if (paso < PASOS.length - 1) {
      setPaso(paso + 1)
      return
    }
    onSignUp?.({
      nombre: valores.nombre.trim(),
      correo: valores.email.trim(),
      carrera: valores.carrera.trim(),
      estado_geografico: valores.estado_geografico.trim() || undefined,
      municipio: valores.municipio.trim() || undefined,
      password: valores.password,
    })
  }

  const ultimo = paso === PASOS.length - 1
  const [toneA, toneB, toneC] = TONOS[isSignUp ? paso : "login"]

  return (
    <div
      className="tone-shift relative grid w-full max-w-5xl animate-scale-in overflow-hidden rounded-3xl shadow-pop ring-1 ring-black/5 md:min-h-160 md:grid-cols-[1.1fr_1fr]"
      style={{ "--tone-a": toneA, "--tone-b": toneB, "--tone-c": toneC }}
      aria-busy={loading}
    >
      {loading && (
        <div className="absolute inset-0 z-20 grid animate-fade-in place-items-center bg-surface/90 p-6 backdrop-blur-sm">
          <LoadingSteps
            title={isSignUp ? "Creando tu cuenta" : "Iniciando sesión"}
            steps={isSignUp ? SIGNUP_STEPS : LOGIN_STEPS}
            icon={isSignUp ? UserPlus : LogIn}
            interval={500}
            centered
            className="w-full max-w-xs animate-scale-in border-transparent! bg-transparent! p-0! shadow-none!"
          />
        </div>
      )}

      <section className="tone-gradient flex flex-col p-7 text-white sm:p-12">
        <form onSubmit={handleSubmit} noValidate inert={loading} className="flex flex-1 flex-col">
          {isSignUp ? (
            <>
              <Stepper actual={paso} />
              <p className="eyebrow mt-8 text-white/75">
                Paso {paso + 1} de {PASOS.length}
              </p>
              <h1 className="mt-1 text-h1 font-extrabold" aria-live="polite">
                {PASOS[paso].titulo}
              </h1>
            </>
          ) : (
            <>
              <p className="eyebrow text-white/75">Bienvenido a Comple-team</p>
              <h1 className="mt-1 text-h1 font-extrabold">Inicia sesión</h1>
            </>
          )}

          <div ref={pasoRef} key={isSignUp ? `paso-${paso}` : "login"} className="mt-8 flex animate-fade-up flex-col gap-5">
            {isSignUp && paso === 0 && (
              <>
                <Field label="Nombre completo" type="text" autoComplete="name" placeholder="Tu nombre completo" maxLength={150} {...campo("nombre")} />
                <Field label="Carrera" type="text" autoComplete="organization-title" placeholder="Ej. Ingeniería en Sistemas" maxLength={100} {...campo("carrera")} />
              </>
            )}

            {isSignUp && paso === 1 && (
              <>
                <Field label="Correo institucional" type="email" autoComplete="email" placeholder="matricula@tuescuela.edu.mx" maxLength={100} {...campo("email")} />
                <Field
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  hint="Usa entre 8 y 128 caracteres."
                  trailing={<PasswordToggle show={showPassword} onToggle={() => setShowPassword((s) => !s)} label="contraseña" />}
                  {...campo("password")}
                />
                <Field
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  trailing={<PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword((s) => !s)} label="confirmación de contraseña" />}
                  {...campo("confirmPassword")}
                />
              </>
            )}

            {isSignUp && paso === 2 && (
              <>
                <p className="-mt-3 text-sm text-white/80">Nos ayuda a sugerirte compañeros cercanos. Puedes dejarlo en blanco.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Estado" type="text" optional placeholder="Ej. Nuevo León" maxLength={50} {...campo("estado_geografico")} />
                  <Field label="Municipio" type="text" optional placeholder="Ej. Monterrey" maxLength={50} {...campo("municipio")} />
                </div>
              </>
            )}

            {!isSignUp && (
              <>
                <Field label="Correo institucional" type="email" autoComplete="email" placeholder="matricula@tuescuela.edu.mx" {...campo("email")} />
                <Field
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  trailing={<PasswordToggle show={showPassword} onToggle={() => setShowPassword((s) => !s)} label="contraseña" />}
                  {...campo("password")}
                />
                <button type="button" className="-mt-2 cursor-pointer self-start text-sm font-semibold text-white/90 underline-offset-4 hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </>
            )}

            <ServerError message={error} />
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
            {isSignUp && paso > 0 && (
              <button type="button" onClick={() => { setErrors({}); setPaso(paso - 1) }} className={PILL_GHOST}>
                Atrás
              </button>
            )}
            <button type="submit" disabled={loading} className={`${PILL_PRIMARY} ${isSignUp ? "" : "w-full"}`}>
              {!isSignUp ? "Entrar" : ultimo ? "Crear mi cuenta" : "Siguiente"}
              {isSignUp && !ultimo && <ArrowRight aria-hidden="true" className="size-4" />}
            </button>
          </div>

          {/* En móvil el panel de marca se oculta; el cambio de modo vive aquí */}
          <p className="mt-6 text-sm text-white/85 md:hidden">
            {isSignUp ? "¿Ya tienes cuenta? " : "¿Aún no tienes cuenta? "}
            <button type="button" onClick={cambiarModo} className="cursor-pointer font-semibold underline underline-offset-4">
              {isSignUp ? "Inicia sesión" : "Crea tu cuenta"}
            </button>
          </p>
        </form>
      </section>

      <BrandPanel isSignUp={isSignUp} onSwitch={cambiarModo} />
    </div>
  )
}
