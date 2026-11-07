import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, SearchX, Send, Sparkles, Users, X } from "lucide-react"
import Avatar from "../components/ui/Avatar"
import Button from "../components/ui/Button"
import PublicProfile from "../components/profile/PublicProfile"
import InviteModal from "../components/invite/InviteModal"
import StudentRow from "../components/search/StudentRow"
import AIInsight from "../components/search/AIInsight"
import { EmptyState, ErrorState, Skeleton } from "../components/ui/Feedback"
import useAuthenticatedProfile from "../hooks/useAuthenticatedProfile"
import { obtenerCandidatos, obtenerEstudiantes, obtenerProyectos } from "../services/api"
import { availableRoles as usableRoles, confirmedComparison } from "../lib/contracts"
import { FRANJAS, FRANJAS_LABEL } from "../data/mockData"

function getUsuarioActual() {
  try {
    return JSON.parse(sessionStorage.getItem("usuario") || "{}")
  } catch (error) {
    console.error("No se pudo leer el usuario de la sesión:", error)
    return {}
  }
}

// Chip de filtro: estado visible por color, ícono y aria-pressed.
function FilterChip({ active, onClick, children, tone = "primary", count }) {
  const on = tone === "ai" ? "bg-ai-ink text-white ring-ai-ink" : tone === "highlight" ? "bg-highlight text-stage ring-highlight" : "bg-primary text-white ring-primary"
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm font-medium ring-1 transition-all duration-200 active:scale-95 ${
        active ? `${on} shadow-sm` : "bg-surface text-ink ring-line hover:ring-primary/40"
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`rounded-full px-1.5 text-xs font-semibold ${active ? "bg-white/25" : "bg-surface-2 text-ink-2"}`}>{count}</span>
      )}
    </button>
  )
}

const selectCls = "min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"

export default function StudentsPage() {
  const usuario = getUsuarioActual()
  // Un enlace como /estudiantes?q=FastAPI llega con la búsqueda ya escrita
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "")
  const [students, setStudents] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [studentsError, setStudentsError] = useState(false)
  const [studentsAttempt, setStudentsAttempt] = useState(0)
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState(false)
  const [projectId, setProjectId] = useState("")
  const [roleId, setRoleId] = useState("")
  const [inviteOpen, setInviteOpen] = useState(false)
  // Descubrimiento
  const [candidatos, setCandidatos] = useState({ projectId: "", recs: new Map(), status: "idle" })
  const [vista, setVista] = useState("todos") // todos | ia | complementa
  const [franjas, setFranjas] = useState(() => new Set())
  const [carrera, setCarrera] = useState("")
  const [invitados, setInvitados] = useState(() => new Set())
  const detalleRef = useRef(null)

  const viewer = confirmedComparison(useAuthenticatedProfile())
  const quieroAprender = useMemo(() => viewer?.reforzar ?? [], [viewer])

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setLoadingStudents(true)
      obtenerEstudiantes({ q: query, excludeId: usuario.id_usuario })
        .then((results) => {
          if (!active) return
          setStudents(results)
          setSelectedId((previous) =>
            results.some((student) => student.id === previous) ? previous : results[0]?.id ?? null,
          )
          setStudentsError(false)
        })
        .catch((error) => {
          console.error("No se pudieron cargar los perfiles:", error)
          if (active) setStudentsError(true)
        })
        .finally(() => active && setLoadingStudents(false))
    }, 200)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, usuario.id_usuario, studentsAttempt])

  useEffect(() => {
    let active = true
    obtenerProyectos()
      .then((allProjects) => {
        if (!active) return
        const ownProjects = allProjects.filter(
          (project) => String(project.creadorId) === String(usuario.id_usuario),
        )
        setProjects(ownProjects)
        setProjectId((current) =>
          ownProjects.some((project) => project.id === current) ? current : ownProjects[0]?.id ?? "",
        )
        setProjectsError(false)
      })
      .catch((error) => {
        console.error("No se pudieron cargar tus eventos:", error)
        if (active) setProjectsError(true)
      })
      .finally(() => active && setLoadingProjects(false))
    return () => {
      active = false
    }
  }, [usuario.id_usuario])

  // Candidatos sugeridos por la IA para el proyecto elegido. Si no hay acceso o falla, la búsqueda sigue normal.
  useEffect(() => {
    if (!projectId) return
    let active = true
    obtenerCandidatos(projectId).then(
      (recs) => active && setCandidatos({ projectId, status: "ready", recs: new Map(recs.map((rec) => [String(rec.candidate_id), rec])) }),
      () => active && setCandidatos({ projectId, status: "unavailable", recs: new Map() }),
    )
    return () => {
      active = false
    }
  }, [projectId])

  const recs = candidatos.projectId === projectId ? candidatos.recs : new Map()
  const aiStatus = !projectId ? "idle" : candidatos.projectId === projectId ? candidatos.status : "loading"

  const complementaDe = (student) => {
    const aprender = new Set(quieroAprender.map((s) => s.toLowerCase()))
    return (student.fortalezas ?? []).map((f) => f.nombre).filter((n) => aprender.has(n.toLowerCase()))
  }

  const carreras = useMemo(() => {
    const counts = new Map()
    students.forEach((s) => s.carrera && counts.set(s.carrera, (counts.get(s.carrera) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([nombre]) => nombre)
  }, [students])

  const visibles = students
    .filter((s) => vista !== "ia" || recs.has(s.id))
    .filter((s) => vista !== "complementa" || complementaDe(s).length > 0)
    .filter((s) => !carrera || s.carrera === carrera)
    .filter((s) => franjas.size === 0 || (s.disponibilidad ?? []).some((b) => franjas.has(b.split("-")[1])))
    // Sugeridos por la IA primero, sin alterar el orden relativo del resto
    .sort((a, b) => Number(recs.has(b.id)) - Number(recs.has(a.id)))

  const totalIA = students.filter((s) => recs.has(s.id)).length
  const totalComplementa = quieroAprender.length ? students.filter((s) => complementaDe(s).length > 0).length : 0
  const hayFiltros = vista !== "todos" || carrera || franjas.size > 0
  const limpiar = () => {
    setVista("todos")
    setCarrera("")
    setFranjas(new Set())
  }
  const toggleFranja = (f) =>
    setFranjas((prev) => {
      const next = new Set(prev)
      if (next.has(f)) next.delete(f)
      else next.add(f)
      return next
    })

  const selectedStudent = students.find((student) => student.id === selectedId)
  const selectedProject = projects.find((project) => project.id === projectId)
  const availableRoles = useMemo(() => {
    if (!selectedProject) return []
    return usableRoles(selectedProject)
  }, [selectedProject])
  const selectedRole = availableRoles.find((role) => role.id === roleId) ?? availableRoles[0]
  const selectedRec = selectedStudent ? recs.get(selectedStudent.id) : null

  const seleccionar = (id) => {
    setSelectedId(id)
    // En pantallas pequeñas el detalle queda debajo: lo traemos a la vista.
    if (window.matchMedia?.("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => detalleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
      {/* ---------------------------- Encabezado ---------------------------- */}
      <header className="relative isolate mb-6 animate-fade-up overflow-hidden rounded-3xl bg-stage px-6 py-10 text-white sm:px-10 sm:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute -top-20 right-[10%] size-72 rounded-full bg-primary/50 blur-3xl" />
          <span className="absolute -bottom-24 left-[30%] size-64 rounded-full bg-accent/25 blur-3xl" />
          <span className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] bg-size-[22px_22px]" />
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">Comunidad</p>
            <h1 className="text-h1 mt-3 font-extrabold">
              Estudiantes
            </h1>
            <p className="mt-3 text-white/75">Busca por nombre, carrera o habilidad. La IA resalta a quien cubre lo que a tu proyecto le falta.</p>

            <label className="group mt-7 flex min-h-14 items-center gap-3 rounded-2xl bg-white px-4 text-ink shadow-lg shadow-black/20 ring-4 ring-transparent transition focus-within:ring-primary/40">
              <Search aria-hidden="true" className="size-5 shrink-0 text-ink-2 transition-colors group-focus-within:text-primary" />
              <span className="sr-only">Buscar estudiantes</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nombre, carrera o habilidad confirmada visible"
                className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-ink-2"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda" className="grid size-8 cursor-pointer place-items-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink">
                  <X aria-hidden="true" className="size-4" />
                </button>
              )}
            </label>

            {projects.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-white/70">Buscando para</span>
                <select
                  aria-label="Proyecto para el que buscas integrantes"
                  value={projectId}
                  onChange={(event) => {
                    setProjectId(event.target.value)
                    setRoleId("")
                  }}
                  className="min-h-9 max-w-full cursor-pointer rounded-full bg-white/10 px-3 font-semibold text-white ring-1 ring-white/25 [&>option]:text-ink"
                >
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.titulo}</option>)}
                </select>
                <span role="status" className="inline-flex items-center gap-1.5 text-accent">
                  <Sparkles aria-hidden="true" className={`size-4 ${aiStatus === "loading" ? "animate-pulse" : ""}`} />
                  {aiStatus === "loading"
                    ? "La IA está analizando…"
                    : aiStatus === "ready"
                      ? `${totalIA} ${totalIA === 1 ? "sugerencia" : "sugerencias"} de la IA`
                      : "Sugerencias de IA no disponibles"}
                </span>
              </div>
            )}
          </div>

          {/* Constelación de personas: invita a descubrir */}
          <div aria-hidden="true" className="relative h-44 w-64 max-lg:hidden">
            {students.slice(0, 5).map((s, i) => {
              const pos = ["top-0 left-6", "top-4 right-2", "top-20 left-0", "bottom-0 left-24", "top-16 right-16"][i]
              return (
                <span key={s.id} className={`absolute animate-float ${pos}`} style={{ animationDelay: `${i * -1.6}s` }}>
                  <Avatar name={s.nombre} size={i === 4 ? "xl" : "lg"} className="shadow-xl ring-4 ring-white/10" />
                </span>
              )
            })}
          </div>
        </div>
      </header>

      {/* ------------------------------ Filtros ------------------------------ */}
      <div className="mb-6 flex animate-fade-up flex-wrap items-center gap-2 [animation-delay:80ms]" role="group" aria-label="Filtros">
        <FilterChip active={vista === "todos"} onClick={() => setVista("todos")}>Todos</FilterChip>
        {aiStatus === "ready" && (
          <FilterChip tone="ai" active={vista === "ia"} onClick={() => setVista(vista === "ia" ? "todos" : "ia")} count={totalIA}>
            <Sparkles aria-hidden="true" className="size-3.5" /> Sugeridos por IA
          </FilterChip>
        )}
        {totalComplementa > 0 && (
          <FilterChip tone="highlight" active={vista === "complementa"} onClick={() => setVista(vista === "complementa" ? "todos" : "complementa")} count={totalComplementa}>
            Saben lo que quieres aprender
          </FilterChip>
        )}
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-line max-sm:hidden" />
        {FRANJAS.map((f) => (
          <FilterChip key={f} active={franjas.has(f)} onClick={() => toggleFranja(f)}>
            {FRANJAS_LABEL[f]}
          </FilterChip>
        ))}
        {carreras.length > 1 && (
          <select aria-label="Filtrar por carrera" value={carrera} onChange={(e) => setCarrera(e.target.value)} className="min-h-9 cursor-pointer rounded-full bg-surface px-3 text-sm text-ink ring-1 ring-line">
            <option value="">Todas las carreras</option>
            {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {hayFiltros && (
          <button type="button" onClick={limpiar} className="ml-1 cursor-pointer text-sm font-semibold text-primary hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* --------------------------- Resultados + detalle --------------------------- */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section aria-label="Directorio de estudiantes" className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-semibold">Estudiantes</h2>
            {!loadingStudents && !studentsError && (
              <span className="text-sm text-ink-2" role="status">
                {visibles.length} {visibles.length === 1 ? "perfil" : "perfiles"}
              </span>
            )}
          </div>

          {loadingStudents ? (
            <div className="divide-y divide-line" aria-busy="true">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4 p-5">
                  <Skeleton className="size-14 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                    <div className="flex gap-1.5 pt-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : studentsError ? (
            <div className="p-5">
              <ErrorState
                message="No pudimos cargar los perfiles. Comprueba la conexión e inténtalo de nuevo."
                onRetry={() => setStudentsAttempt((attempt) => attempt + 1)}
              />
            </div>
          ) : visibles.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={SearchX}
                title={hayFiltros ? "Nadie coincide con esos filtros… todavía" : "No encontramos estudiantes"}
                actions={hayFiltros && <Button variant="secondary" onClick={limpiar}>Limpiar filtros</Button>}
              >
                {hayFiltros ? "Prueba quitando un filtro: el mejor compañero a veces está en otra carrera." : "Prueba con otro nombre, carrera o habilidad confirmada visible."}
              </EmptyState>
            </div>
          ) : (
            <ul key={`${vista}-${carrera}-${[...franjas].join()}`} className="divide-y divide-line">
              {visibles.map((student, i) => (
                <StudentRow
                  key={student.id}
                  index={i}
                  student={student}
                  active={student.id === selectedId}
                  aiRec={recs.get(student.id)}
                  complementa={quieroAprender}
                  viewerBloques={viewer?.disponibilidad ?? []}
                  invited={invitados.has(student.id)}
                  onSelect={() => seleccionar(student.id)}
                />
              ))}
            </ul>
          )}
        </section>

        <section ref={detalleRef} className="scroll-mt-20 space-y-4 lg:sticky lg:top-6" aria-label="Perfil seleccionado">
          {selectedStudent ? (
            <div key={selectedStudent.id} className="animate-fade-up space-y-4">
              {selectedRec && <AIInsight rec={selectedRec} project={selectedProject} />}
              <PublicProfile student={selectedStudent} viewer={viewer ?? undefined} />
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <label className="block text-sm font-semibold" htmlFor="invite-project">
                    Invitar a uno de tus eventos
                  </label>
                  {projectsError ? (
                    <p role="alert" className="text-sm text-danger">No pudimos cargar tus eventos.</p>
                  ) : loadingProjects ? (
                    <Skeleton className="h-11 w-full" />
                  ) : projects.length === 0 ? (
                    <div>
                      <p className="text-sm text-ink-2">Primero crea un evento para poder enviar una invitación.</p>
                      <Button variant="secondary" as={Link} to="/proyectos/nuevo" className="mt-2">
                        Crear evento
                      </Button>
                    </div>
                  ) : (
                    <>
                      <select
                        id="invite-project"
                        value={projectId}
                        onChange={(event) => {
                          setProjectId(event.target.value)
                          setRoleId("")
                        }}
                        className={selectCls}
                      >
                        {projects.map((project) => <option key={project.id} value={project.id}>{project.titulo}</option>)}
                      </select>
                      {availableRoles.length > 0 && (
                        <select
                          aria-label="Rol propuesto"
                          value={selectedRole?.id ?? ""}
                          onChange={(event) => setRoleId(event.target.value)}
                          className={selectCls}
                        >
                          {availableRoles.map((role) => <option key={role.id} value={role.id}>{role.nombre}</option>)}
                        </select>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setInviteOpen(true)}
                    disabled={loadingProjects || !selectedRole || projectsError}
                  >
                    <Send aria-hidden="true" className="size-4" /> {invitados.has(selectedStudent.id) ? "Invitar de nuevo" : "Invitar"}
                  </Button>
                  {selectedProject && !selectedRole && <p role="status" className="text-sm text-ink-2">{selectedProject.motivo_no_disponible || "No hay vacantes utilizables."}</p>}
                  <Button variant="secondary" as={Link} to={`/perfil/${selectedStudent.id}`}>
                    Ver perfil completo
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState icon={Users} title="Selecciona un perfil">
              Elige una persona del directorio para ver su perfil completo.
            </EmptyState>
          )}
        </section>
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        student={selectedStudent}
        project={selectedProject}
        rol={selectedRole ?? { id: "participante", nombre: "Participante" }}
        onSent={(student) => setInvitados((prev) => new Set(prev).add(student.id))}
      />
    </div>
  )
}
