/**
 * Backend simulado para revisar el diseño sin MySQL, FastAPI ni Ollama.
 * Solo se carga con `npm run dev:mock`. Devuelve las mismas formas que la API real
 * y guarda los cambios en memoria (se pierden al recargar la página).
 */
import { currentUser, students } from "../data/mockData"

const ME = 1
const DELAY = 350
const now = () => new Date().toISOString()
const revision = (n) => String(n).padStart(64, "a").slice(-64).replace(/[^a-f0-9]/g, "a")
const clone = (value) => JSON.parse(JSON.stringify(value))

const LUGARES = [["Nuevo León", "Monterrey"], ["Jalisco", "Guadalajara"], ["Nuevo León", "Guadalupe"], ["CDMX", "Coyoacán"]]

function perfil(student, id) {
  const [estado, municipio] = LUGARES[id % LUGARES.length]
  return {
    usuario_id: id,
    nombre: student.nombre,
    correo: student.correo,
    carrera: student.carrera,
    estado_geografico: estado,
    municipio,
    rol_sistema: "estudiante",
    datos_crudos: {
      semestre: student.semestre ?? 1,
      fortalezas: student.fortalezas ?? [],
      reforzar: student.reforzar ?? [],
      intereses: student.intereses ?? [],
      disponibilidad: student.disponibilidad ?? [],
      visibilidad: { fortalezas: true, intereses: true, disponibilidad: true, reforzar: false, correo: true },
      bio: `Estudiante de ${student.carrera}. Me gusta trabajar en equipos multidisciplinarios.`,
      consentimiento_recomendaciones: true,
      pausado: false,
    },
    atributos_dinamicos: {},
    perfil_estructurado_ia: { experiencia: [], resumen_publico: `Perfil de ${student.carrera} con interés en ${(student.intereses ?? ["proyectos"])[0]}.` },
    perfil_estado_ia: "listo",
  }
}

const db = {
  perfiles: new Map([[ME, perfil(currentUser, ME)], ...students.map((s, i) => [i + 2, perfil(s, i + 2)])]),
  eventos: new Map(),
  solicitudes: [],
  miembros: new Map(), // id_evento -> [{ id, rol }]
  nextEvento: 100,
  nextSolicitud: 500,
}

function rol(id, nombre, habilidades, indispensable = false, vacantes = 1) {
  return { id: String(id), nombre, habilidades, indispensable, vacantes }
}

function addEvento({ creador, titulo, tipo, materia, descripcion, integrantes, fechaLimite, roles, miembros = [] }) {
  const id = db.nextEvento++
  db.eventos.set(id, {
    id_evento: id,
    creador_id: creador,
    categoria_principal: tipo === "academico" ? "Academico" : tipo === "personal" ? "Personal" : "General",
    titulo,
    descripcion_libre: descripcion,
    detalles_especificos: { tipo, materia, integrantes, fechaLimite, roles },
    requisitos_ia: {
      resumen: descripcion,
      roles_buscados: roles.map((r) => r.nombre),
      habilidades_obligatorias: roles.filter((r) => r.indispensable).flatMap((r) => r.habilidades),
      habilidades_deseables: roles.filter((r) => !r.indispensable).flatMap((r) => r.habilidades),
    },
    estado_ia: "confirmado",
    requisitos_confirmados: true,
    fuente_revision: revision(id),
    estado: "Abierto",
    fecha_creacion: new Date(Date.now() - (id - 99) * 86400000 * 2).toISOString(),
  })
  db.miembros.set(id, miembros)
  return id
}

addEvento({
  creador: ME, titulo: "App de seguimiento de salud para estudiantes", tipo: "academico", materia: "Ingeniería de Software",
  descripcion: "Queremos crear una app que ayude a los estudiantes a registrar hábitos de sueño, alimentación y estrés durante el semestre.",
  integrantes: 5, fechaLimite: "2026-12-12",
  roles: [rol(0, "Diseño de interfaces", ["Figma", "Diseño de interfaces"], true), rol(1, "Backend", ["FastAPI", "Bases de datos"], true), rol(2, "Gestión del proyecto", ["Scrum"])],
  miembros: [{ id: 2, rol: "Diseño de interfaces" }],
})
addEvento({
  creador: 4, titulo: "Plan de negocio para cafetería sustentable", tipo: "academico", materia: "Emprendimiento",
  descripcion: "Buscamos armar un plan de negocio completo con análisis financiero, imagen de marca y estudio de mercado.",
  integrantes: 4, fechaLimite: "2026-11-28",
  roles: [rol(0, "Finanzas", ["Análisis de datos", "Excel"], true), rol(1, "Imagen de marca", ["Diseño gráfico"]), rol(2, "Investigación de mercado", ["Encuestas"])],
})
addEvento({
  creador: 5, titulo: "Robot seguidor de línea para concurso", tipo: "personal", materia: "",
  descripcion: "Participaremos en el concurso regional de robótica. Necesitamos gente de electrónica y programación de microcontroladores.",
  integrantes: 3, fechaLimite: "2027-02-20",
  roles: [rol(0, "Programación de microcontroladores", ["Arduino", "C++"], true), rol(1, "Diseño mecánico", ["SolidWorks"])],
  miembros: [{ id: 3, rol: "Programación de microcontroladores" }],
})
addEvento({
  creador: 3, titulo: "Torneo interno de videojuegos", tipo: "videojuegos", materia: "",
  descripcion: "Organizamos un torneo para el campus. Falta quien lleve redes sociales y la logística del día.",
  integrantes: 4, fechaLimite: null,
  roles: [rol(0, "Redes sociales", ["Comunicación", "Canva"]), rol(1, "Logística", ["Organización de eventos"])],
})

db.solicitudes.push(
  { id: db.nextSolicitud++, de: 4, para: ME, evento: 101, rol: "Finanzas", mensaje: "Vi que te gusta el análisis de datos, ¿te gustaría llevar las finanzas del plan?", tipo: "invitacion", estado: "pendiente", fecha: now() },
  { id: db.nextSolicitud++, de: ME, para: 6, evento: 100, rol: "Backend", mensaje: "Tu experiencia con bases de datos nos vendría muy bien.", tipo: "invitacion", estado: "pendiente", fecha: now() },
)

const nombreDe = (id) => db.perfiles.get(Number(id))?.nombre ?? `Persona ${id}`
const habilidadesDe = (id) => (db.perfiles.get(Number(id))?.datos_crudos.fortalezas ?? []).map((f) => f.nombre)

function eventoOut(evento) {
  const miembros = db.miembros.get(evento.id_evento) ?? []
  const roles = evento.detalles_especificos.roles.map((r) => {
    const ocupados = miembros.filter((m) => m.rol === r.nombre)
    return { ...r, ocupados: ocupados.length, integrantesIds: ocupados.map((m) => String(m.id)), cubiertoPor: ocupados[0] ? String(ocupados[0].id) : null }
  })
  const libres = roles.filter((r) => r.ocupados < (r.vacantes ?? 1))
  const soyIntegrante = evento.creador_id === ME || miembros.some((m) => m.id === ME)
  const cupos = Math.max(0, evento.detalles_especificos.integrantes - 1 - miembros.length)
  return {
    ...clone(evento),
    creador_nombre: nombreDe(evento.creador_id),
    detalles_especificos: { ...clone(evento.detalles_especificos), roles },
    requisitos_ia: evento.requisitos_confirmados ? clone(evento.requisitos_ia) : {},
    soy_integrante: soyIntegrante,
    cupos_disponibles: cupos,
    acepta_participacion: cupos > 0 && libres.length > 0,
    roles_disponibles: libres.map(({ id, nombre, habilidades, vacantes, ocupados }) => ({ id, nombre, habilidades, vacantes, ocupados })),
    puede_solicitar: !soyIntegrante && cupos > 0 && libres.length > 0,
    motivo_no_disponible: soyIntegrante ? "Ya formas parte de este proyecto." : cupos > 0 ? null : "El equipo ya está completo.",
  }
}

function publico(p) {
  const { usuario_id, nombre, carrera, estado_geografico, municipio, datos_crudos, atributos_dinamicos } = p
  return clone({ usuario_id, nombre, carrera, estado_geografico, municipio, correo: p.correo, datos_crudos, atributos_dinamicos })
}

function solicitudOut(s) {
  const recibida = s.para === ME
  const otro = recibida ? s.de : s.para
  return {
    id: s.id, tipo: recibida ? "recibida" : "enviada", deId: s.de, paraId: s.para, projectId: s.evento,
    mensaje: s.mensaje, rol: s.rol, tipoSolicitud: s.tipo, estado: s.estado, fecha: s.fecha,
    remitente: recibida ? { id: otro, nombre: nombreDe(otro) } : null,
    destinatario: recibida ? null : { id: otro, nombre: nombreDe(otro) },
    proyecto: { id: s.evento, titulo: db.eventos.get(s.evento)?.titulo ?? "Proyecto" },
  }
}

function explicacion(habilidades, requeridas) {
  const tiene = requeridas.filter((h) => habilidades.some((x) => x.toLowerCase() === h.toLowerCase()))
  const faltan = requeridas.filter((h) => !tiene.includes(h))
  return {
    eligibility: tiene.length ? "eligible" : "needs_review",
    evidence_group: tiene.length ? "sufficient_evidence" : "insufficient_evidence",
    evidence_coverage: { known: tiene.length, unknown: faltan.length, not_applicable: 0 },
    explanation: {
      strengths: tiene.length ? [`Declara ${tiene.join(", ")}, que el proyecto necesita.`] : [],
      gaps: faltan.slice(0, 1).map((h) => `Aún no confirma experiencia en ${h}.`),
      unknowns: tiene.length ? [] : ["No hay suficiente información confirmada para comparar."],
    },
    policy_version: "mock-1",
  }
}

const requeridasDe = (evento) => evento.detalles_especificos.roles.flatMap((r) => r.habilidades)

function equiposOut() {
  return [...db.eventos.values()]
    .filter((e) => e.creador_id === ME || (db.miembros.get(e.id_evento) ?? []).some((m) => m.id === ME))
    .map((e) => {
      const ids = [e.creador_id, ...(db.miembros.get(e.id_evento) ?? []).map((m) => m.id)]
      const miembros = ids.map((id) => {
        const p = db.perfiles.get(id)
        return { id, nombre: p.nombre, carrera: p.carrera, correo: p.correo, semestre: p.datos_crudos.semestre,
          fortalezas: p.datos_crudos.fortalezas, rol: id === e.creador_id ? "Creador" : db.miembros.get(e.id_evento).find((m) => m.id === id).rol }
      })
      const habilidades = ids.flatMap(habilidadesDe).map((h) => h.toLowerCase())
      const requeridas = requeridasDe(e)
      const cubiertas = requeridas.filter((h) => habilidades.includes(h.toLowerCase()))
      return {
        cobertura_habilidades: { cubiertas, por_acreditar: requeridas.filter((h) => !cubiertas.includes(h)), total: requeridas.length, estado: "conocida" },
        id: String(e.id_evento), projectId: String(e.id_evento), nombre: e.titulo,
        rol: e.creador_id === ME ? "Creador" : "Participante", miembros, proyecto: eventoOut(e),
      }
    })
}

function fail(status, detail) {
  const error = new Error(detail)
  error.status = status
  throw error
}

function evento(id) {
  return db.eventos.get(Number(id)) ?? fail(404, "Evento no encontrado")
}

function route(method, path, query, body) {
  let m
  const usuario = () => {
    const p = db.perfiles.get(ME)
    return { id_usuario: ME, nombre: p.nombre, correo: p.correo, carrera: p.carrera }
  }

  /* Autenticación: cualquier correo y contraseña sirven */
  if (method === "POST" && path === "/auth/login") return { mensaje: "Inicio de sesión exitoso", access_token: "mock-token", token_type: "bearer", usuario: usuario() }
  if (method === "POST" && path === "/auth/registro") {
    Object.assign(db.perfiles.get(ME), { nombre: body.nombre, correo: body.correo, carrera: body.carrera })
    return { mensaje: "Usuario registrado exitosamente", access_token: "mock-token", token_type: "bearer", usuario: usuario() }
  }
  if (!sessionStorage.getItem("access_token")) fail(401, "Inicia sesión para continuar.")
  if (path === "/auth/me") return usuario()

  /* Perfil */
  if (method === "POST" && path === "/perfil/interpretar") {
    const separar = (texto = "") => texto.split(/[,\n;]+/).map((t) => t.trim()).filter(Boolean).slice(0, 8)
    return { fortalezas: separar(body.fortalezas).map((nombre) => ({ nombre, nivel: null })), reforzar: separar(body.reforzar),
      intereses: separar(body.intereses), experiencia: [], resumen_publico: "Estudiante con perfil versátil y ganas de colaborar.",
      estado: "pendiente_revision", origen: "ia_sin_confirmar" }
  }
  if (method === "POST" && path === "/perfil/confirmar") {
    const p = db.perfiles.get(ME)
    const { nombre, carrera, experiencia, resumen_publico, ...datos } = body
    Object.assign(p, { nombre, carrera: carrera ?? p.carrera, perfil_estado_ia: "listo",
      datos_crudos: { ...p.datos_crudos, ...datos }, perfil_estructurado_ia: { experiencia, resumen_publico } })
    return clone(p)
  }
  if (path === "/perfil/embedding/reintentar") return clone(db.perfiles.get(ME))
  if (path === "/perfil/estudiantes/") {
    const q = (query.get("q") ?? "").toLowerCase()
    const carrera = (query.get("carrera") ?? "").toLowerCase()
    const habilidad = (query.get("habilidad") ?? "").toLowerCase()
    return [...db.perfiles.values()]
      .filter((p) => String(p.usuario_id) !== query.get("exclude_id"))
      .filter((p) => !q || `${p.nombre} ${p.carrera} ${habilidadesDe(p.usuario_id).join(" ")}`.toLowerCase().includes(q))
      .filter((p) => !carrera || p.carrera.toLowerCase().includes(carrera))
      .filter((p) => !habilidad || habilidadesDe(p.usuario_id).some((h) => h.toLowerCase().includes(habilidad)))
      .map(publico)
  }
  if ((m = path.match(/^\/perfil\/publico\/(\d+)$/))) return publico(db.perfiles.get(Number(m[1])) ?? fail(404, "Perfil no encontrado"))
  if ((m = path.match(/^\/perfil\/(\d+)$/))) {
    const p = db.perfiles.get(Number(m[1])) ?? fail(404, "Perfil no encontrado")
    if (method === "PUT") {
      if (body.nombre) p.nombre = body.nombre
      if (body.carrera) p.carrera = body.carrera
      p.datos_crudos = { ...p.datos_crudos, ...(body.datos_crudos ?? {}) }
    }
    return clone(p)
  }

  /* Eventos */
  if (method === "POST" && path === "/eventos/interpretar") {
    const texto = body.descripcion_libre
    return { origen: "ia_sin_confirmar", requisitos: { categoria: body.categoria_principal, titulo_normalizado: body.detalles_especificos?.titulo ?? "",
      resumen: texto.slice(0, 200), habilidades_obligatorias: ["Trabajo en equipo"], habilidades_deseables: ["Comunicación"],
      roles_buscados: ["Diseño", "Desarrollo"], intereses_relacionados: [], restricciones_explicitas: [] } }
  }
  if (path === "/eventos/" && method === "GET") return [...db.eventos.values()].reverse().map(eventoOut)
  if (path === "/eventos/" && method === "POST") {
    const d = body.detalles_especificos
    const id = addEvento({ creador: ME, titulo: body.titulo, tipo: d.tipo, materia: d.materia, descripcion: body.descripcion_libre,
      integrantes: d.integrantes, fechaLimite: d.fechaLimite, roles: d.roles.map((r, i) => ({ ...r, id: String(r.id ?? i) })) })
    db.eventos.get(id).fecha_creacion = now()
    db.eventos.get(id).requisitos_confirmados = body.confirmado_por_creador
    return eventoOut(db.eventos.get(id))
  }
  if ((m = path.match(/^\/eventos\/(\d+)\/solicitudes$/))) {
    const e = evento(m[1])
    db.solicitudes.push({ id: db.nextSolicitud++, de: ME, para: e.creador_id, evento: e.id_evento, rol: body.rol_esperado,
      mensaje: body.mensaje_explicacion, tipo: "unirse", estado: "pendiente", fecha: now() })
    return { id: db.nextSolicitud - 1, estado: "pendiente" }
  }
  if ((m = path.match(/^\/eventos\/(\d+)\/(confirmar|embedding\/reintentar)$/))) {
    const e = evento(m[1])
    if (m[2] === "confirmar") Object.assign(e, { requisitos_confirmados: true, requisitos_ia: { ...e.requisitos_ia, ...body.requirements } })
    return eventoOut(e)
  }
  if ((m = path.match(/^\/eventos\/(\d+)$/))) {
    const e = evento(m[1])
    if (method === "PUT") Object.assign(e, { categoria_principal: body.categoria_principal, descripcion_libre: body.descripcion_libre,
      detalles_especificos: body.detalles_especificos, fuente_revision: revision(Date.now()) })
    return eventoOut(e)
  }

  /* Recomendaciones */
  if (/^\/recomendaciones\/usuarios\/\d+\/proyectos$/.test(path)) {
    const mias = habilidadesDe(ME)
    return [...db.eventos.values()].filter((e) => e.creador_id !== ME).slice(0, Number(query.get("top_n") ?? 10))
      .map((e) => ({ event_id: e.id_evento, ...explicacion(mias, requeridasDe(e)) }))
  }
  if ((m = path.match(/^\/recomendaciones\/eventos\/(\d+)\/candidatos$/))) {
    const e = evento(m[1])
    // Solo quien cubre al menos una habilidad requerida, como haría el backend real
    return [...db.perfiles.keys()].filter((id) => id !== ME && id !== e.creador_id)
      .map((id) => ({ event_id: e.id_evento, candidate_id: id, ...explicacion(habilidadesDe(id), requeridasDe(e)) }))
      .filter((rec) => rec.eligibility === "eligible").slice(0, 5)
  }

  /* Invitaciones, notificaciones y equipos */
  if (path === "/invitaciones/" && method === "POST") {
    db.solicitudes.push({ id: db.nextSolicitud++, de: ME, para: body.id_destinatario, evento: body.id_evento, rol: body.rol_esperado,
      mensaje: body.mensaje_explicacion, tipo: "invitacion", estado: "pendiente", fecha: now() })
    return { id: db.nextSolicitud - 1, estado: "pendiente" }
  }
  if ((m = path.match(/^\/invitaciones\/(\d+)$/)) && method === "PATCH") {
    const s = db.solicitudes.find((x) => x.id === Number(m[1])) ?? fail(404, "Invitación no encontrada")
    s.estado = String(body.estado).toLowerCase()
    if (s.estado === "aceptada") db.miembros.get(s.evento).push({ id: s.tipo === "unirse" ? s.de : s.para, rol: s.rol })
    return { id: s.id, estado: s.estado }
  }
  if (/^\/invitaciones\/\d+$/.test(path)) return db.solicitudes.filter((s) => s.de === ME || s.para === ME).map(solicitudOut)
  if (/^\/notificaciones\/\d+$/.test(path)) {
    return [
      ...db.solicitudes.filter((s) => s.para === ME && s.estado === "pendiente").map((s) => ({ id: `invitacion-${s.id}`, grupo: "invitaciones",
        texto: `${nombreDe(s.de)} te invitó a «${db.eventos.get(s.evento).titulo}» como ${s.rol}.`, fecha: s.fecha, accion: { label: "Responder", to: "/invitaciones" } })),
      { id: "equipo-1", grupo: "equipo", texto: `${nombreDe(2)} se unió al equipo «${db.eventos.get(100).titulo}».`, fecha: now(),
        accion: { label: "Ver proyecto", to: "/proyectos/100" } },
      { id: "recomendacion-100-6", grupo: "ia", texto: `Candidato recomendado para «${db.eventos.get(100).titulo}»: declara Bases de datos.`, fecha: null,
        accion: { label: "Ver proyecto", to: "/proyectos/100" } },
    ]
  }
  if (/^\/equipos\/\d+$/.test(path)) return equiposOut()

  fail(404, `Ruta simulada no disponible: ${method} ${path}`)
}

export async function mockRequest(path, { method = "GET", body } = {}) {
  await new Promise((resolve) => setTimeout(resolve, DELAY))
  const url = new URL(path, "http://mock")
  return clone(route(method, url.pathname, url.searchParams, body ? clone(body) : undefined))
}
