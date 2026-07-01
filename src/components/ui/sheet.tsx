"use client"

import * as React from "react"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Side = "top" | "right" | "bottom" | "left"

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("Sheet components must be used within a Sheet")
  return context
}

interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Sheet({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const { onOpenChange } = useSheet()
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      onClick?: (...args: unknown[]) => unknown
    }>
    return React.cloneElement(child, {
      onClick: (...args: unknown[]) => {
        child.props.onClick?.(...args)
        onOpenChange(true)
      },
    })
  }
  return (
    <button ref={ref} onClick={() => onOpenChange(true)} type="button" {...props}>
      {children}
    </button>
  )
})
SheetTrigger.displayName = "SheetTrigger"

interface SheetContentProps {
  className?: string
  children?: React.ReactNode
  side?: Side
  showCloseButton?: boolean
}

const sideStyles: Record<Side, string> = {
  top: "inset-x-0 top-0 border-b rounded-b-xl",
  right: "inset-y-0 right-0 border-l rounded-l-xl",
  bottom: "inset-x-0 bottom-0 border-t rounded-t-xl",
  left: "inset-y-0 left-0 border-r rounded-r-xl",
}

const sideVariants: Record<Side, { initial: Record<string, string | number>; animate: Record<string, string | number>; exit: Record<string, string | number> }> = {
  top: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  bottom: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  left: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
}

const sizeStyles: Record<Side, string> = {
  top: "h-1/3",
  right: "w-full max-w-md",
  bottom: "h-1/3",
  left: "w-full max-w-md",
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  (
    {
      className,
      children,
      side = "right",
      showCloseButton = true,
    },
    ref
  ) => {
    const { open, onOpenChange } = useSheet()

    return (
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/80"
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              ref={ref}
              initial={sideVariants[side].initial}
              animate={sideVariants[side].animate}
              exit={sideVariants[side].exit}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={cn(
                "fixed flex flex-col bg-background p-6 shadow-lg",
                sideStyles[side],
                sizeStyles[side],
                className
              )}
            >
              {children}
              {showCloseButton && (
                <button
                  onClick={() => onOpenChange(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)

const SheetTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
