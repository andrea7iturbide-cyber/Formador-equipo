/**
 * Encabezado de las pantallas internas con el mismo lenguaje de la portada:
 * ícono con degradado, etiqueta de color y título con una frase en cursiva serif.
 * Cada pantalla usa un tono de la paleta para que la app no se sienta igual en todas partes.
 */
const TONOS = {
  violeta: { tile: "from-primary to-[#4a3ac4] text-white shadow-primary/35", eyebrow: "text-primary" },
  turquesa: { tile: "from-accent to-[#0f7c78] text-stage shadow-accent/40", eyebrow: "text-ai-ink" },
  ambar: { tile: "from-highlight to-[#f08a3e] text-stage shadow-highlight/45", eyebrow: "text-highlight-ink" },
  verde: { tile: "from-success to-[#0f9f6e] text-stage shadow-success/35", eyebrow: "text-success-ink" },
}

export default function PageHeader({ icon: Icon, tone = "violeta", eyebrow, title, accent, desc, actions, className = "" }) {
  const t = TONOS[tone]
  return (
    <header className={`mb-8 flex animate-fade-up flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="flex min-w-0 items-start gap-4">
        {Icon && (
          <span aria-hidden="true" className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br shadow-lg max-sm:hidden ${t.tile}`}>
            <Icon className="size-7" />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && <p className={`eyebrow ${t.eyebrow}`}>{eyebrow}</p>}
          <h1 className="text-h1 mt-1 font-extrabold text-balance text-ink">
            {title} {accent && <span className="font-serif text-[1.12em] font-normal italic">{accent}</span>}
          </h1>
          {desc && <p className="mt-1 text-ink-2">{desc}</p>}
        </div>
      </div>
      {actions}
    </header>
  )
}
