import * as React from "react";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    // Remover decorative dos props que vão para o DOM
    const { decorative: _, ...domProps } = props;
    
    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...domProps}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };