import Reveal from "../ui/Reveal"

/**
 * Título de sección de la portada: etiqueta de color, título grande con una
 * frase en cursiva serif (mismo lenguaje que el título principal) y descripción.
 */
export default function SectionHeading({ eyebrow, eyebrowCls = "text-primary", title, accent, desc, center = false, dark = false }) {
  return (
    <Reveal className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className={`eyebrow ${eyebrowCls}`}>{eyebrow}</p>}
      <h2 className={`text-h1 mt-3 font-extrabold text-balance ${dark ? "text-white" : "text-ink"}`}>
        {title} {accent && <span className="font-serif text-[1.12em] font-normal italic">{accent}</span>}
      </h2>
      {desc && <p className={`mt-4 text-lg ${center ? "mx-auto" : ""} max-w-xl ${dark ? "text-white/75" : "text-ink-2"}`}>{desc}</p>}
    </Reveal>
  )
}
