import { Link } from "react-router-dom"
import { ArrowRight, Check, Plus, Sparkles } from "lucide-react"
import Button from "../ui/Button"
import { LocalProcessing } from "../ui/AIBadge"

const img = (archivo) => `${import.meta.env.BASE_URL}img/${archivo}`

// Chip flotante sobre el collage: cuenta la historia del producto sin leer párrafos.
function FloatChip({ className = "", children, delay = 0 }) {
  return (
    <span
      className={`absolute z-10 inline-flex animate-float items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </span>
  )
}

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Fondo con color: violeta (marca), turquesa (IA) y un toque ámbar (acción) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -inset-y-8 -z-10">
        <span className="absolute -top-28 -left-20 size-104 animate-blob rounded-full bg-accent/40 blur-3xl will-change-transform" />
        <span className="absolute top-10 -right-28 size-120 animate-blob rounded-full bg-primary/35 blur-3xl will-change-transform [animation-delay:-5s]" />
        <span className="absolute -bottom-32 left-[38%] size-80 animate-blob rounded-full bg-highlight/35 blur-3xl will-change-transform [animation-delay:-9s]" />
        <span className="absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-24 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
        <div>
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-surface/80 px-3 py-1 text-xs font-semibold text-primary shadow-sm ring-1 ring-primary/15">
            <span className="size-2 rounded-full bg-highlight" aria-hidden="true" /> Para estudiantes de todas las carreras
          </p>
          <h1 className="text-display mt-5 animate-fade-up font-extrabold text-balance text-ink [animation-delay:100ms]">
            Forma equipos donde cada quien aporta <span className="text-gradient">algo distinto</span>.
          </h1>
          <p className="mt-5 max-w-xl animate-fade-up text-lg text-ink-2 [animation-delay:200ms]">
            Cuéntanos qué sabes hacer y qué quieres aprender. Te recomendamos compañeros de cualquier carrera que complementan tus fortalezas y te
            explicamos por qué.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]">
            <Button size="lg" onClick={onGetStarted} className="group pr-3">
              Crear mi perfil
              <span className="grid size-7 place-items-center rounded-full bg-highlight text-stage transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            </Button>
            <Button size="lg" variant="secondary" as={Link} to="/auth">
              Ya tengo cuenta
            </Button>
          </div>
          <LocalProcessing className="mt-6 animate-fade-in [animation-delay:450ms]" />
        </div>

        {/* Collage: personas reales colaborando + los roles que se completan */}
        <div
          role="img"
          aria-label="Estudiantes de distintas carreras colaborando: diseño y backend ya están cubiertos y el equipo busca a alguien de marketing"
          className="relative mx-auto h-88 w-full max-w-md animate-scale-in [animation-delay:200ms] sm:h-112"
        >
          <div aria-hidden="true" className="absolute inset-8 -z-10 rounded-[3rem] bg-linear-to-br from-primary/40 via-accent/30 to-highlight/40 blur-2xl" />
          <img
            src={img("inicio-colaboracion.jpg")}
            alt=""
            fetchPriority="high"
            className="absolute top-6 right-0 h-[72%] w-[72%] rounded-3xl object-cover object-[60%_30%] shadow-pop ring-4 ring-surface"
          />
          <img
            src={img("proyectos/estudio.jpg")}
            alt=""
            loading="lazy"
            className="absolute bottom-0 left-0 h-[46%] w-[48%] -rotate-3 rounded-3xl object-cover shadow-pop ring-4 ring-surface"
          />
          <img
            src={img("proyectos/robot.jpg")}
            alt=""
            loading="lazy"
            className="absolute top-0 left-4 h-[30%] w-[30%] rotate-3 rounded-2xl object-cover shadow-pop ring-4 ring-surface max-sm:hidden"
          />

          <FloatChip className="top-[38%] -left-2 bg-surface text-ink ring-1 ring-line" delay={0}>
            <span className="grid size-5 place-items-center rounded-full bg-accent text-stage"><Check aria-hidden="true" className="size-3" strokeWidth={3} /></span>
            Diseño cubierto
          </FloatChip>
          <FloatChip className="top-2 right-4 bg-primary text-white" delay={-2.5}>
            <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> Backend
          </FloatChip>
          <FloatChip className="right-2 bottom-[20%] bg-highlight text-stage" delay={-5}>
            <Plus aria-hidden="true" className="size-3.5" strokeWidth={3} /> Te buscan: Marketing
          </FloatChip>
          <FloatChip className="bottom-2 left-[52%] bg-stage text-white" delay={-1.5}>
            <Sparkles aria-hidden="true" className="size-3.5 text-accent" /> Sugerido por IA
          </FloatChip>
        </div>
      </div>
    </section>
  )
}
