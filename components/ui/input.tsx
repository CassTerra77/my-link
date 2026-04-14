import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-lg border-2 border-black bg-white px-4 py-2 text-base text-black shadow-neo transition-all outline-none placeholder:text-muted-foreground focus-visible:shadow-neo-hover focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
