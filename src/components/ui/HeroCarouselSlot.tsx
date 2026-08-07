import { useEffect, useState } from "react";

export interface HeroSlide {
  type: "video" | "image";
  src: string;
}

/**
 * One hero panel that auto-cycles through a set of room slides (video or photo), crossfading
 * between them. Several of these run side by side with staggered start indexes so the header
 * always shows a different mix of rooms moving at once, rather than one static shot.
 */
export function HeroCarouselSlot({
  slides,
  startIndex = 0,
  intervalMs = 4500,
}: {
  slides: HeroSlide[];
  startIndex?: number;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(startIndex % slides.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <div className="relative w-full h-full">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i === index ? undefined : true}
        >
          {slide.type === "video" ? (
            <video
              className="ken-burns w-full h-full object-cover"
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img className="ken-burns w-full h-full object-cover" src={slide.src} alt="" />
          )}
        </div>
      ))}
    </div>
  );
}
