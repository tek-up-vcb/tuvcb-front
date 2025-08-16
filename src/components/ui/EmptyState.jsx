import { cn } from "@/lib/utils"

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn("text-center py-12 px-4", className)}>
      {Icon && <Icon className="mx-auto h-12 w-12 text-muted-foreground/70" />}
      {title && <h3 className="mt-3 text-sm font-semibold">{title}</h3>}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
