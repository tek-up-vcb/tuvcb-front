import * as React from "react"
import { cn } from "@/lib/utils"

type AppCardProps = React.ComponentProps<"div"> & {
  as?: React.ElementType
}

export function AppCard({ className, as: Comp = "div", ...props }: AppCardProps) {
  return (
    <Comp
      className={cn(
        "bg-card text-card-foreground rounded-xl border shadow-soft transition-shadow", 
        "hover:shadow-elevated", 
        className
      )}
      {...props}
    />
  )}

export default AppCard
