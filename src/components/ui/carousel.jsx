import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

export const Carousel = React.forwardRef(
  (
    {
      orientation = "horizontal",
      opts,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    React.useEffect(() => {
      if (!api) return

      const onSelect = () => {
        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())
      }

      onSelect()
      api.on("select", onSelect)

      return () => {
        api.off("select", onSelect)
      }
    }, [api])

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api])

    return (
      <CarouselContext.Provider
        value={{ scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
      >
        <div className={cn("relative", className)} ref={ref} {...props}>
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex">{children}</div>
          </div>

          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollPrev}
              onClick={scrollPrev}
              className="m-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollNext}
              onClick={scrollNext}
              className="m-2"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CarouselContext.Provider>
    )
  }
)

Carousel.displayName = "Carousel"
