import { useRef, useState } from "react"
import { BookOpen, Check, ChevronLeft, ChevronRight, Heart, Plus, Rocket, Trophy } from "lucide-react"
import Button from "../ui/Button"
import Reveal from "../ui/Reveal"

const TIPOS = {
  academico: { label: "Académico", Icon: BookOpen },
  personal: { label: "Personal", Icon: Heart },
  deportivo: { label: "Concurso", Icon: Trophy },
  emprendimiento: { label: "Emprendimiento", Icon: Rocket },
}

const ETAPAS = ["Idea publicada", "Sumando integrantes", "Equipo completo"]

/*
 * Proyectos ilustrativos: la lista real solo se entrega a usuarios con sesión.
 * Fotos de uso libre (sin atribución obligatoria):
 *   app-reciclaje.jpg  unsplash.com/photos/8gAbl776pc0
 *   robot.jpg          pexels.com/photo/9242834
 *   podcast.jpg        pexels.com/photo/7600887
 *   cafeteria.jpg      pexels.com/photo/31353701
 *   feria.jpg          pexels.com/photo/39219952
 */
const PROYECTOS = [
  {
    foto: "feria.jpg",
    alt: "Dos estudiantes organizando ideas con notas adhesivas",
    tipo: "emprendimiento",
    titulo: "Feria de emprendimiento del campus",
    descripcion: "Organizamos una feria para que los proyectos de todas las carreras encuentren mentores e inversión.",
    cubiertos: ["Logística", "Patrocinios"],
    buscan: ["Diseño gráfico", "Redes sociales"],
  },
  {
    foto: "robot.jpg",
    alt: "Estudiantes ensamblando un robot en un laboratorio",
    tipo: "deportivo",
    titulo: "Robot para el concurso regional",
    descripcion: "Un robot seguidor de línea para competir en primavera. Mecatrónica y sistemas trabajando juntos.",
    cubiertos: ["Electrónica", "Programación en C++", "Diseño mecánico"],
    buscan: [],
  },
  {
    foto: "app-reciclaje.jpg",
    alt: "Estudiantes revisando un proyecto en una laptop",
    tipo: "academico",
    titulo: "EcoRuta: reciclaje en el campus",
    descripcion: "Una app que indica dónde reciclar cada residuo y premia a los grupos que más separan.",
    cubiertos: ["Desarrollo móvil", "Diseño de interfaces"],
    buscan: ["Comunicación"],
  },
  {
    foto: "podcast.jpg",
    alt: "Dos estudiantes grabando un podcast",
    tipo: "personal",
    titulo: "Podcast de bienestar universitario",
    descripcion: "Episodios cortos sobre estrés, sueño y hábitos, con invitados de distintas facultades.",
    cubiertos: ["Contenido"],
    buscan: ["Edición de audio", "Guion"],
  },
  {
    foto: "cafeteria.jpg",
    alt: "Dos jóvenes atendiendo su cafetería",
    tipo: "academico",
    titulo: "Cafetería sustentable",
    descripcion: "Plan de negocio con estudio de mercado, finanzas y una marca que se note en el campus.",
    cubiertos: ["Finanzas", "Investigación de mercado", "Imagen de marca"],
    buscan: [],
  },
]

// Posición (en anchos de tarjeta) y escala según la distancia a la tarjeta central.
const LAYOUT = [
  { x: 0, scale: 1 },
  { x: 0.94, scale: 0.78 },
  { x: 1.69, scale: 0.62 },
  { x: 2.3, scale: 0.5 },
]

const fotoUrl = (archivo) => `${import.meta.env.BASE_URL}img/proyectos/${archivo}`
const equipo = ({ cubiertos, buscan }) => ({ actuales: cubiertos.length + 1, total: cubiertos.length + buscan.length + 1 }) // + quien publicó
const etapaDe = ({ cubiertos, buscan }) => (buscan.length === 0 ? 2 : cubiertos.length > 1 ? 1 : 0)
const BRILLO = ["", "brightness-80", "brightness-[0.65]", "brightness-50"]

function Stage({ active, onSelect }) {
  const startX = useRef(null)

  return (
    <div
      className="relative mx-auto h-[calc(var(--card)*1.75)] touch-pan-y [--card:14rem] sm:[--card:17rem] lg:[--card:19rem]"
      onPointerDown={(event) => (startX.current = event.clientX)}
      onPointerUp={(event) => {
        const dx = event.clientX - (startX.current ?? event.clientX)
        startX.current = null
        if (Math.abs(dx) > 40) onSelect(active + (dx < 0 ? 1 : -1))
      }}
    >
      {/* Piso pulido: línea de horizonte luminosa y retícula tenue en perspectiva */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[calc(var(--card)*1.3+0.375rem)] bottom-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
        <div className="absolute top-0 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-[50%] bg-accent/15 blur-3xl" />
        <div className="absolute inset-0 perspective-[500px]">
          <div className="absolute -inset-x-1/2 top-0 h-[200%] origin-top transform-[rotateX(68deg)] bg-[linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-size-[56px_56px] mask-[linear-gradient(to_bottom,black,transparent_55%)]" />
        </div>
      </div>

      {PROYECTOS.map((proyecto, i) => {
        const offset = i - active
        const distance = Math.abs(offset)
        const { x, scale } = LAYOUT[Math.min(distance, LAYOUT.length - 1)]
        const isActive = distance === 0
        const { label, Icon } = TIPOS[proyecto.tipo]
        const { actuales, total } = equipo(proyecto)
        const foto = fotoUrl(proyecto.foto)

        return (
          <div
            key={proyecto.titulo}
            className={`absolute top-[calc(var(--card)*1.3)] left-1/2 h-[calc(var(--card)*1.3)] w-(--card) origin-bottom transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isActive ? "" : `grayscale hover:grayscale-0 ${BRILLO[Math.min(distance, 3)]}`
            } ${distance > 2 ? "max-sm:opacity-0" : ""} ${distance > 3 ? "pointer-events-none opacity-0" : ""}`}
            style={{
              // Todas se apoyan en la misma línea de piso; escalan desde la base
              transform: `translate(calc(-50% + var(--card) * ${Math.sign(offset) * x}), -100%) scale(${scale})`,
              zIndex: 10 - distance,
            }}
          >
          {/* Reflejo: la misma foto invertida que se desvanece sobre el piso */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full mt-3 h-full overflow-hidden rounded-3xl mask-[linear-gradient(to_bottom,rgb(0_0_0/0.32),transparent_42%)]">
            <img src={foto} alt="" draggable={false} className="size-full -scale-y-100 object-cover blur-[1px] select-none" />
          </div>
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-label={isActive ? `${proyecto.titulo} (proyecto actual)` : `Ver ${proyecto.titulo}`}
            aria-current={isActive || undefined}
            tabIndex={isActive ? -1 : 0}
            className={`relative size-full cursor-pointer overflow-hidden rounded-3xl bg-white/5 transition-shadow duration-500 ${
              isActive
                ? "cursor-default shadow-[0_0_0_1px_rgb(54_207_201/0.55),0_0_48px_-6px_rgb(54_207_201/0.4),0_30px_90px_-30px_rgb(105_87_232/0.75)]"
                : "shadow-2xl shadow-black/40"
            }`}
          >
            <img
              src={foto}
              alt={proyecto.alt}
              width={960}
              height={640}
              loading={distance > 1 ? "lazy" : "eager"}
              decoding="async"
              draggable={false}
              className="size-full object-cover select-none"
            />
            {/* Cristal: reflejo diagonal fijo y destello que cruza la tarjeta activa */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent" />
            {isActive && (
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/4 animate-sheen bg-linear-to-r from-transparent via-white/35 to-transparent" />
            )}
            <span
              className={`absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-linear-to-b from-black/60 to-transparent p-4 pb-16 text-left text-white transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            >
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                <Icon className="size-3.5" /> {label}
              </span>
              <span className="pt-1 text-xs font-medium whitespace-nowrap text-white/90">
                {actuales}/{total} integrantes
              </span>
            </span>
          </button>
          </div>
        )
      })}
    </div>
  )
}

function NavButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-12 cursor-pointer place-items-center rounded-full bg-white text-stage shadow-lg shadow-black/30 transition-[transform,opacity] duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
}

function Growth({ etapa }) {
  return (
    <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Crecimiento del proyecto">
      {ETAPAS.map((nombre, i) => {
        const done = i <= etapa
        return (
          <li key={nombre} aria-current={i === etapa ? "step" : undefined} className="flex flex-col gap-2">
            <span className={`h-1 rounded-full transition-colors duration-500 ${done ? "bg-accent" : "bg-white/15"}`} />
            <span className={`text-xs font-medium ${i === etapa ? "text-white" : done ? "text-white/70" : "text-white/45"}`}>{nombre}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default function FeaturedProjects({ onGetStarted }) {
  const [active, setActive] = useState(Math.floor(PROYECTOS.length / 2))
  const select = (i) => setActive(Math.max(0, Math.min(PROYECTOS.length - 1, i)))
  const proyecto = PROYECTOS[active]

  return (
    // Panel flotante (no franja de borde a borde): el cambio a oscuro se lee como un escenario dentro de la página.
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="scroll-mt-20 px-3 sm:px-5">
      <div className="relative isolate overflow-hidden rounded-4xl bg-stage pt-14 pb-16 text-white shadow-[0_40px_120px_-40px_rgb(105_87_232/0.55)] sm:rounded-[2.5rem] sm:pt-16 sm:pb-20">
      {/* Luz que entra desde la sección clara: une ambas zonas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10">
        <span className="absolute inset-x-[15%] top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent" />
        <span className="absolute top-0 left-1/2 h-48 w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/35 blur-3xl" />
        <span className="absolute top-0 left-[60%] h-40 w-[30%] -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <Reveal className="mx-auto max-w-2xl px-4 text-center">
        <p className="eyebrow text-accent">Proyectos que crecen</p>
        <h2 id="proyectos-titulo" className="text-h1 mt-4 font-extrabold">
          De una idea <span className="font-serif text-[1.15em] font-normal italic">a un equipo completo</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">
          Alguien publica una idea. Comple-team encuentra a quien le falta.
        </p>
      </Reveal>

      <div
        className="mt-12"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos de ejemplo"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") select(active + 1)
          if (event.key === "ArrowLeft") select(active - 1)
        }}
      >
        <Stage active={active} onSelect={select} />

        <div className="relative z-20 -mt-6 flex justify-center gap-3">
          <NavButton onClick={() => select(active - 1)} disabled={active === 0} label="Proyecto anterior">
            <ChevronLeft className="size-5" />
          </NavButton>
          <NavButton onClick={() => select(active + 1)} disabled={active === PROYECTOS.length - 1} label="Proyecto siguiente">
            <ChevronRight className="size-5" />
          </NavButton>
        </div>

        <div className="mx-auto mt-10 max-w-xl px-4 text-center" aria-live="polite">
          <div key={proyecto.titulo} className="animate-fade-up">
            <h3 className="text-h2 font-extrabold">{proyecto.titulo}</h3>
            <p className="mt-2 text-white/70">{proyecto.descripcion}</p>

            <Growth etapa={etapaDe(proyecto)} />

            <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Roles del equipo">
              {proyecto.cubiertos.map((rol) => (
                <li key={rol} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-sm text-white/85">
                  <Check aria-hidden="true" className="size-3.5 text-accent" strokeWidth={3} /> {rol}
                  <span className="sr-only">(cubierto)</span>
                </li>
              ))}
              {proyecto.buscan.map((rol) => (
                <li key={rol} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-highlight/80 bg-highlight/15 px-3 py-1.5 text-sm font-semibold text-highlight">
                  <Plus aria-hidden="true" className="size-3.5" strokeWidth={3} /> {rol}
                  <span className="sr-only">(buscan a alguien)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-4 px-4 text-center">
        <p className="text-sm text-white/65">
          ¿Sabes hacer algo que un equipo necesita? Crea tu perfil y te mostramos dónde encajas.
        </p>
        <Button size="lg" onClick={onGetStarted} className="bg-white! text-stage! hover:bg-white/90!">
          Crear mi perfil
        </Button>
        <p className="text-xs text-white/45">Proyectos de ejemplo con fines ilustrativos.</p>
      </div>
      </div>
    </section>
  )
}
