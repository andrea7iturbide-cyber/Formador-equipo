import { useEffect, useState } from "react"
import { Check, CircleAlert, Cpu, RotateCw, Sparkles } from "lucide-react"
import Button from "./Button"

export function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`shimmer animate-shimmer rounded-lg ${className}`} />
}

// Esqueleto de una tarjeta de recomendación compacta
export function CardSkeleton({ className = "" }) {
  return (
    <div className={`space-y-4 rounded-2xl border border-line bg-surface p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-11 w-full" />
    </div>
  )
}

// Orbe animado: anillo de luz que gira alrededor de un núcleo que late.
export function LoadingOrb({ icon: Icon = Cpu, className = "" }) {
  return (
    <span aria-hidden="true" className={`relative grid size-14 shrink-0 place-items-center ${className}`}>
      <span className="absolute inset-0 animate-ping rounded-full bg-accent/15 [animation-duration:2s]" />
      <span className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent_10%,var(--accent),var(--accent-2),transparent_80%)] mask-[radial-gradient(farthest-side,transparent_calc(100%-3px),black_calc(100%-3px))] [animation-duration:1.4s]" />
      <span className="grid size-10 animate-pulse place-items-center rounded-full bg-linear-to-br from-primary to-accent-2 text-white shadow-lg shadow-accent/30">
        <Icon className="size-5" />
      </span>
    </span>
  )
}

function ThinkingDots() {
  return (
    <span aria-hidden="true" className="ml-1 inline-flex gap-0.5 align-middle">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="size-1 animate-dot rounded-full bg-current" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  )
}

/**
 * Carga con pasos: los pasos avanzan solos cada `interval` ms y el último
 * queda activo hasta que llegue la respuesta (nunca se marca como terminado antes).
 * - centered: orbe arriba y texto centrado (para paneles superpuestos).
 */
export function LoadingSteps({ title, steps = [], icon, interval = 1400, centered = false, className = "" }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (steps.length < 2) return undefined
    const timer = setInterval(() => setCurrent((s) => Math.min(s + 1, steps.length - 1)), interval)
    return () => clearInterval(timer)
  }, [steps.length, interval])

  return (
    <div role="status" className={`relative rounded-2xl border border-ai-line bg-surface p-5 shadow-card ${className}`}>
      <div className={centered ? "flex flex-col items-center gap-4 text-center" : "flex items-start gap-4"}>
        <LoadingOrb icon={icon} />
        <div className={centered ? "flex flex-col items-center" : "min-w-0 flex-1 pt-1"}>
          <p className="font-semibold text-ink">
            {title}
            <ThinkingDots />
          </p>
          {steps.length > 0 && (
            <ol className={`mt-3 space-y-2 text-sm ${centered ? "text-left" : ""}`}>
              {steps.map((step, i) => {
                const done = i < current
                const active = i === current
                return (
                  <li
                    key={step}
                    className={`flex items-center gap-2 ${done ? "text-success-ink" : active ? "font-medium text-ink" : "text-ink-2/70"}`}
                  >
                    <span className="grid size-5 shrink-0 place-items-center">
                      {done ? (
                        <Check aria-hidden="true" className="size-4 animate-pop" strokeWidth={3} />
                      ) : active ? (
                        <span className="size-2.5 animate-pulse rounded-full bg-accent ring-4 ring-accent/20" />
                      ) : (
                        <span className="size-2 rounded-full border border-current" />
                      )}
                    </span>
                    {step}
                    <span className="sr-only">{done ? "(listo)" : active ? "(en curso)" : "(pendiente)"}</span>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </div>
      <div aria-hidden="true" className="mt-5 h-1 overflow-hidden rounded-full bg-ai-soft">
        <div className="h-full w-1/3 animate-indeterminate rounded-full bg-linear-to-r from-accent via-primary to-accent-2" />
      </div>
    </div>
  )
}

// Estado de carga cuando la IA está trabajando
export function AILoading({ text = "La IA está analizando", steps, className = "" }) {
  return <LoadingSteps title={text.replace(/…$/, "")} steps={steps} icon={Sparkles} className={className} />
}

export function EmptyState({ icon: Icon, title, children, actions, className = "" }) {
  return (
    <div className={`flex animate-fade-up flex-col items-center rounded-2xl border border-dashed border-line px-6 py-10 text-center ${className}`}>
      {Icon && (
        <span className="mb-4 grid size-12 animate-bounce-in place-items-center rounded-full bg-primary-soft text-primary">
          <Icon aria-hidden="true" className="size-6" />
        </span>
      )}
      <h3 className="text-h3 font-semibold text-ink">{title}</h3>
      {children && <p className="mt-1 max-w-md text-sm text-ink-2">{children}</p>}
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  )
}

export function ErrorState({ message = "Algo salió mal al cargar esta sección.", onRetry, className = "" }) {
  return (
    <div role="alert" className={`flex flex-wrap items-center gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 ${className}`}>
      <CircleAlert aria-hidden="true" className="size-5 shrink-0 text-danger" />
      <p className="flex-1 text-sm text-ink">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw aria-hidden="true" className="size-4" /> Reintentar
        </Button>
      )}
    </div>
  )
}
