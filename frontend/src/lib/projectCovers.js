/*
 * Portada ilustrativa por categoría. El backend no guarda imágenes de proyecto,
 * así que cada uno recibe una foto de su categoría, siempre la misma para el mismo id.
 * Fotos de uso libre (sin atribución obligatoria):
 *   app-reciclaje.jpg  unsplash.com/photos/8gAbl776pc0
 *   estudio.jpg        pexels.com/photo/8199761
 *   podcast.jpg        pexels.com/photo/7600887
 *   cafeteria.jpg      pexels.com/photo/31353701
 *   robot.jpg          pexels.com/photo/9242834
 *   deporte.jpg        pexels.com/photo/12430231
 *   videojuegos.jpg    pexels.com/photo/7862414
 *   feria.jpg          pexels.com/photo/39219952
 */
const COVERS = {
  academico: ["app-reciclaje.jpg", "estudio.jpg", "robot.jpg"],
  personal: ["podcast.jpg", "cafeteria.jpg"],
  deportivo: ["deporte.jpg"],
  videojuegos: ["videojuegos.jpg"],
  general: ["feria.jpg", "estudio.jpg"],
}

// Si el texto del proyecto menciona un tema, gana la foto de ese tema.
const TEMAS = [
  [/robot|arduino|electr[oó]nic|mecatr[oó]nic|drone/i, "robot.jpg"],
  [/podcast|radio|audio|entrevista/i, "podcast.jpg"],
  [/feria|congreso|hackat[oó]n/i, "feria.jpg"],
  [/videojuego|e-?sports?|torneo|gamer|gaming/i, "videojuegos.jpg"],
  [/f[uú]tbol|deport|basquet|voleibol|atletismo/i, "deporte.jpg"],
  [/caf[eé]|restaurante|negocio|emprend|tienda/i, "cafeteria.jpg"],
  [/\bapp\b|aplicaci[oó]n|software|web|plataforma|sistema/i, "app-reciclaje.jpg"],
]

function hash(text) {
  let h = 0
  for (const c of String(text)) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function projectCover(project) {
  const texto = `${project.titulo ?? ""} ${project.descripcion ?? ""}`
  const tema = TEMAS.find(([regex]) => regex.test(texto))?.[1]
  const list = COVERS[project.tipo] ?? COVERS.general
  const archivo = tema ?? list[hash(project.id) % list.length]
  return `${import.meta.env.BASE_URL}img/proyectos/${archivo}`
}
