import { Link } from "react-router-dom"
import { ArrowRight, Compass, Lightbulb, Plus, UserPen, UsersRound } from "lucide-react"

// Camino del alumno: cada tarjeta lleva a la pantalla donde se hace esa acción.
const PASOS = [
  { Icon: UserPen, titulo: "Completa tu perfil", texto: "Mejores recomendaciones para ti", to: "/perfil" },
  { Icon: Lightbulb, titulo: "Publica una idea", texto: "La IA propone los roles que faltan", to: "/proyectos/nuevo" },
  { Icon: UsersRound, titulo: "Únete a un equipo", texto: "Aporta lo que sabes y aprende", to: "/proyectos" },
]

/*
 * Banner de bienvenida del Inicio. Foto de uso libre (Unsplash, sin atribución obligatoria):
 *   unsplash.com/photos/8gAbl776pc0
 */
export default function WelcomeHero({ saludo, nombre }) {
  return (
    <section aria-labelledby="bienvenida" className="relative isolate mb-10 animate-fade-up overflow-hidden rounded-3xl bg-stage text-white shadow-pop">
      <img
        src={`${import.meta.env.BASE_URL}img/inicio-colaboracion.jpg`}
        alt=""
        width={1600}
        height={900}
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[center_30%]"
      />
      {/* Capa de marca: más densa del lado del texto para que siempre se lea */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-stage/95 via-primary-hover/80 to-ai-ink/45" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-stage/30 to-transparent" />

      <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
        <div className="max-w-xl">
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <Compass aria-hidden="true" className="size-3.5" /> Tu espacio en Comple-team
          </span>
          <h1 id="bienvenida" className="text-display mt-5 font-extrabold">
            {saludo}, {nombre}
          </h1>
          <p className="mt-3 text-lg text-white/90">
            Conecta tus habilidades. <span className="font-serif text-[1.15em] italic">Completa tu equipo.</span>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/proyectos/nuevo"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-primary shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]"
            >
              <Plus aria-hidden="true" className="size-4" /> Crear proyecto
            </Link>
            <Link
              to="/proyectos"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold ring-1 ring-white/50 transition-colors hover:bg-white/10"
            >
              Explorar proyectos
            </Link>
          </div>
        </div>

        <ul className="grid gap-3 max-lg:hidden lg:w-88" aria-label="Tus siguientes pasos">
          {PASOS.map(({ Icon, titulo, texto, to }, i) => (
            <li key={titulo} className="animate-fade-up" style={{ animationDelay: `${150 + i * 120}ms` }}>
              <Link
                to={to}
                className="group glass flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 hover:-translate-x-1 hover:bg-white/20"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{titulo}</span>
                  <span className="block text-sm text-white/80">{texto}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 opacity-60 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
