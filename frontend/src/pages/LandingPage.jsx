import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Check, Compass, Cpu, Lightbulb, ListChecks, PenLine, Puzzle, ServerCog, ShieldCheck, Sprout, UsersRound, X } from "lucide-react"
import Navbar from "../components/layout/Navbar"
import Hero from "../components/landing/Hero"
import SkillShowcase from "../components/landing/SkillShowcase"
import FeaturedProjects from "../components/landing/FeaturedProjects"
import SectionHeading from "../components/landing/SectionHeading"
import Avatar from "../components/ui/Avatar"
import Reveal from "../components/ui/Reveal"
import SkillChip from "../components/ui/SkillChip"
import { Logo } from "../components/layout/AppLayout"
import { mockProfiles } from "../data/mockProfiles"

// Cada paso con su color: la página "avanza" en color mientras se explica el proceso.
const PASOS = [
  { Icon: PenLine, title: "Describe tus habilidades", text: "Escribe con tus palabras en qué eres bueno, qué quieres reforzar y cuándo puedes reunirte.",
    bubble: "bg-primary text-white shadow-primary/35", num: "text-primary" },
  { Icon: Cpu, title: "La IA organiza tu perfil", text: "Convierte tu texto en un perfil claro. Tú lo revisas y corriges antes de guardarlo.",
    bubble: "bg-accent text-stage shadow-accent/40", num: "text-ai-ink" },
  { Icon: Compass, title: "Recibe recomendaciones", text: "Te sugerimos personas y proyectos que complementan lo que sabes, con el porqué.",
    bubble: "bg-highlight text-stage shadow-highlight/45", num: "text-highlight-ink" },
  { Icon: UsersRound, title: "Forma tu equipo", text: "Invita, acepta y ve qué roles ya están cubiertos y cuáles faltan.",
    bubble: "bg-success text-stage shadow-success/35", num: "text-success-ink" },
]

// Promesas verificables del producto (no cifras inventadas)
const PILARES = [
  { Icon: ListChecks, value: "4 pasos", text: "para pasar de una idea a un equipo completo" },
  { Icon: ShieldCheck, value: "Tú confirmas", text: "la IA sugiere; nada se guarda sin tu revisión" },
  { Icon: ServerCog, value: "IA propia", text: "tu perfil se analiza en el servidor de la aplicación" },
]

const PERFILES = [
  {
    Icon: Lightbulb,
    title: "Tienes una idea",
    text: "Publica tu proyecto, define los roles que te faltan y recibe sugerencias de quién puede cubrirlos.",
    tile: "bg-highlight text-stage shadow-highlight/40",
  },
  {
    Icon: Puzzle,
    title: "Sabes hacer algo",
    text: "Describe tus habilidades y descubre proyectos donde lo que sabes es justo lo que el equipo necesita.",
    tile: "bg-primary text-white shadow-primary/35",
  },
  {
    Icon: Sprout,
    title: "Quieres aprender",
    text: "Indica qué te gustaría reforzar y súmate a equipos donde aprendas junto a estudiantes de otras carreras.",
    tile: "bg-accent text-stage shadow-accent/40",
  },
]

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-y border-line bg-surface py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading center eyebrow="Cómo funciona" title="De tu perfil a tu equipo en" accent="cuatro pasos" desc="La IA trabaja en segundo plano; tú siempre decides." />
        {/* Línea de tiempo: sin tarjetas, conectada por un degradado con los colores de cada paso */}
        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden="true" className="absolute top-8 right-[12%] left-[12%] h-1 rounded-full bg-linear-to-r from-primary via-accent to-success opacity-60 max-lg:hidden" />
          {PASOS.map(({ Icon, title, text, bubble, num }, i) => (
            <Reveal as="li" key={title} delay={i * 120} className="group relative flex flex-col items-center text-center">
              <span className={`relative grid size-16 place-items-center rounded-2xl shadow-lg ring-8 ring-surface transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6 ${bubble}`}>
                <Icon aria-hidden="true" className="size-7" />
              </span>
              <span aria-hidden="true" className={`eyebrow mt-5 ${num}`}>PASO 0{i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-ink">
                <span className="sr-only">Paso {i + 1}: </span>
                {title}
              </h3>
              <p className="mt-2 max-w-60 text-body text-ink-2">{text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Comparison() {
  const complementario = [
    ["Mariana", "Análisis de datos"],
    ["Ana", "Diseño de interfaces"],
    ["Diego", "Backend"],
    ["Camila", "Investigación de usuarios"],
  ]
  return (
    <section id="por-que" className="scroll-mt-20 overflow-x-clip bg-surface py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Por qué complementar"
          eyebrowCls="text-success-ink"
          title="No juntamos"
          accent="gente parecida"
          desc="Un buen equipo no es el que tiene a los cuatro mejores programadores, sino el que cubre todo lo que el proyecto necesita."
        />
        <div className="relative mt-12 grid items-stretch gap-6 md:grid-cols-2 md:gap-12">
          {/* "VS" entre ambos lados */}
          <span aria-hidden="true" className="absolute top-1/2 left-1/2 z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-stage text-xs font-extrabold text-white shadow-lg max-md:hidden">
            VS
          </span>

          <Reveal from="left" className="rounded-3xl border-2 border-dashed border-line p-7">
            <p className="flex items-center gap-2 font-semibold text-ink-2">
              <X aria-hidden="true" className="size-5" /> Equipo de gente parecida
            </p>
            <p className="mt-1 text-sm text-ink-2">Todos saben lo mismo; nadie cubre el diseño ni la investigación.</p>
            <ul className="mt-6 space-y-2.5 opacity-80 grayscale">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="size-9 rounded-full bg-surface-2 ring-1 ring-line" aria-hidden="true" />
                  <SkillChip>Python</SkillChip>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-6 text-warn-ink">Sin cubrir</p>
            <p className="mt-2 flex flex-wrap gap-1.5">
              <SkillChip variant="needed">Diseño</SkillChip>
              <SkillChip variant="needed">Backend</SkillChip>
              <SkillChip variant="needed">Investigación</SkillChip>
            </p>
          </Reveal>

          <Reveal from="right" delay={150} className="rounded-3xl bg-linear-to-br from-success-soft to-ai-soft p-7 ring-1 ring-success-line">
            <p className="flex items-center gap-2 font-semibold text-success-ink">
              <Check aria-hidden="true" className="size-5" strokeWidth={3} /> Equipo complementario
            </p>
            <p className="mt-1 text-sm text-ink-2">Cada integrante aporta algo distinto. Todos los roles quedan cubiertos.</p>
            <ul className="mt-6 space-y-2.5">
              {complementario.map(([n, h], i) => (
                <li key={n} className="flex animate-fade-up items-center gap-3" style={{ animationDelay: `${300 + i * 120}ms` }}>
                  <Avatar name={n} size="md" ring />
                  <SkillChip variant="match">{h}</SkillChip>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-semibold text-success-ink">4 de 4 roles cubiertos</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-success/20" aria-hidden="true">
              <div className="h-full w-full rounded-full bg-linear-to-r from-success to-accent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ForWhom() {
  return (
    <section id="para-quien" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Para quién es"
        eyebrowCls="text-highlight-ink"
        title="Hay un equipo que"
        accent="te necesita"
        desc="Llegues con una idea, con una habilidad o con ganas de aprender."
      />
      {/* Tres columnas sin cajas: el color de cada ícono las distingue */}
      <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
        {PERFILES.map(({ Icon, title, text, tile }, i) => (
          <Reveal as="li" key={title} delay={i * 120} className="group md:px-8 md:first:pl-0 md:last:pr-0">
            <span className={`grid size-14 place-items-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6 ${tile}`}>
              <Icon aria-hidden="true" className="size-7" />
            </span>
            <h3 className="mt-6 text-xl font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-body text-ink-2">{text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function FinalCTA({ onGetStarted }) {
  return (
    <section className="px-3 pb-6 sm:px-5">
      <Reveal
        from="zoom"
        className="relative isolate overflow-hidden rounded-4xl bg-linear-to-br from-stage via-[#2b2266] to-primary-hover px-6 py-20 text-center text-white shadow-[0_40px_120px_-40px_rgb(105_87_232/0.6)] sm:rounded-[2.5rem]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute -top-24 -left-16 size-80 rounded-full bg-accent/30 blur-3xl" />
          <span className="absolute -right-16 -bottom-28 size-96 rounded-full bg-highlight/25 blur-3xl" />
          <span className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] bg-size-[22px_22px]" />
        </div>

        <div className="flex justify-center -space-x-3" aria-hidden="true">
          {mockProfiles.slice(0, 5).map((p) => (
            <Avatar key={p.name} name={p.name} size="lg" className="ring-4 ring-stage" />
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-white/75">Diseño, ingeniería, negocios, psicología: tu equipo puede tener de todo.</p>

        <h2 className="text-display mx-auto mt-6 max-w-2xl font-extrabold text-balance">
          Tu próximo equipo <span className="font-serif text-[1.12em] font-normal text-accent italic">te está esperando</span>
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="group inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-full bg-white py-2 pr-2 pl-7 text-base font-semibold text-stage shadow-xl shadow-black/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.97]"
          >
            Crear mi perfil gratis
            <span className="grid size-10 place-items-center rounded-full bg-highlight transition-transform duration-200 group-hover:translate-x-1">
              <ArrowRight aria-hidden="true" className="size-5" />
            </span>
          </button>
          <Link to="/auth" className="text-sm font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline">
            Ya tengo cuenta
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/70">Solo lo esencial. Lo demás lo completas cuando quieras.</p>
      </Reveal>
    </section>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const getStarted = () => navigate("/registro")

  return (
    <div className="min-h-dvh bg-canvas">
      <Navbar onGetStarted={getStarted} />
      <main>
        <Hero onGetStarted={getStarted} />
        <HowItWorks />
        <SkillShowcase profiles={mockProfiles} />
        <FeaturedProjects onGetStarted={getStarted} />
        <div className="h-16" aria-hidden="true" />
        <Comparison />

        <section aria-label="Lo que garantiza Comple-team" className="relative isolate overflow-hidden bg-linear-to-br from-primary via-[#5a48dc] to-[#3d2fb0] py-16 text-white">
          <span aria-hidden="true" className="absolute -top-20 right-[15%] -z-10 size-72 rounded-full bg-accent/30 blur-3xl" />
          <span aria-hidden="true" className="absolute -bottom-24 left-[10%] -z-10 size-72 rounded-full bg-highlight/25 blur-3xl" />
          <dl className="mx-auto grid max-w-5xl gap-10 px-4 text-center sm:grid-cols-3 sm:px-8">
            {PILARES.map(({ Icon, value, text }, i) => (
              <Reveal key={value} from="zoom" delay={i * 150} className="flex flex-col items-center">
                <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <dt className="text-h1 font-extrabold">{value}</dt>
                <dd className="mt-1 max-w-56 text-sm text-white">{text}</dd>
              </Reveal>
            ))}
          </dl>
        </section>

        <ForWhom />
        <FinalCTA onGetStarted={getStarted} />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-ink-2 sm:flex-row sm:px-8">
          <Logo to="/" />
          <p>Proyecto universitario · Los datos se procesan en el servidor configurado para esta aplicación.</p>
        </div>
      </footer>
    </div>
  )
}
