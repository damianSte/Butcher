import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import gallery1 from "./assets/gallery/gallery-1.jpg";
import gallery2 from "./assets/gallery/gallery-2.jpg";
import gallery3 from "./assets/gallery/gallery-3.jpg";
import gallery4 from "./assets/gallery/gallery-4.jpg";
import gallery5 from "./assets/gallery/gallery-5.jpg";
import gallery6 from "./assets/gallery/gallery-6.jpg";
import gallery7 from "./assets/gallery/gallery-7.jpg";
import gallery8 from "./assets/gallery/gallery-8.jpg";
import gallery9 from "./assets/gallery/gallery-9.jpg";

type Language = "pl" | "en" | "de";

const PHOTOS = [
  { src: gallery1, alt: "Deser czekoladowy z lodami" },
  { src: gallery2, alt: "Tatar wołowy z żółtkiem i piklami" },
  { src: gallery3, alt: "Sezonowana wołowina z kością" },
  { src: gallery4, alt: "Sezonowane steki z kością" },
  { src: gallery5, alt: "Grillowany stek z sosami" },
  { src: gallery6, alt: "Grillowany stek z sosami" },
  { src: gallery7, alt: "Grillowany stek z sosami" },
  { src: gallery8, alt: "Grillowany stek z sosami" },
  { src: gallery9, alt: "Krojony stek z kością i sosami" },
];

const COPY = {
  pl: {
    eyebrow: "Galeria",
    title: "Smak uchwycony w kadrze.",
    description:
      "Zajrzyj do naszej kuchni i zobacz dania, które przygotowujemy każdego dnia.",
    close: "Zamknij zdjęcie",
    previous: "Poprzednie zdjęcie",
    next: "Następne zdjęcie",
    counter: "Zdjęcie",
  },
  en: {
    eyebrow: "Gallery",
    title: "Flavour captured in a frame.",
    description:
      "Step into our kitchen and discover the dishes we prepare every day.",
    close: "Close photo",
    previous: "Previous photo",
    next: "Next photo",
    counter: "Photo",
  },
  de: {
    eyebrow: "Galerie",
    title: "Geschmack im Bild festgehalten.",
    description:
      "Werfen Sie einen Blick in unsere Küche und entdecken Sie unsere Gerichte.",
    close: "Foto schließen",
    previous: "Vorheriges Foto",
    next: "Nächstes Foto",
    counter: "Foto",
  },
};

export function Gallery({ language }: { language: Language }) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const copy = COPY[language];

  const showPrevious = () =>
    setActivePhoto((current) =>
      current === null ? null : (current - 1 + PHOTOS.length) % PHOTOS.length,
    );

  const showNext = () =>
    setActivePhoto((current) =>
      current === null ? null : (current + 1) % PHOTOS.length,
    );

  useEffect(() => {
    if (activePhoto === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePhoto(null);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="min-h-screen bg-[#F8F4ED] pt-[76px]"
    >
      <section className="mx-auto max-w-[1320px] px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pb-28">
        <div className="mb-12 max-w-3xl sm:mb-16" data-reveal>
          <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7B2026]">
            <span className="h-px w-9 bg-[#7B2026]" />
            <span>{copy.eyebrow}</span>
          </div>

          <h1 className="font-serif text-[clamp(50px,8vw,100px)] font-normal leading-[0.92] tracking-[-0.04em] text-[#251B17]">
            {copy.title}
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-7 text-[#5F5148] sm:text-[15px]">
            {copy.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {PHOTOS.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActivePhoto(index)}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-[#E5DCCE] text-left"
              aria-label={`${copy.counter} ${index + 1}: ${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025] group-hover:brightness-90"
              />
            </button>
          ))}
        </div>
      </section>

      {activePhoto !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#120D0B]/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${copy.counter} ${activePhoto + 1}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActivePhoto(null);
          }}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center border border-white/40 text-white transition-colors hover:border-white sm:right-7 sm:top-7"
            aria-label={copy.close}
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-3 z-10 grid h-11 w-11 place-items-center border border-white/40 bg-black/20 text-white transition-colors hover:border-white sm:left-7"
            aria-label={copy.previous}
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={PHOTOS[activePhoto].src}
            alt={PHOTOS[activePhoto].alt}
            className="max-h-[86vh] max-w-[92vw] object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={showNext}
            className="absolute right-3 z-10 grid h-11 w-11 place-items-center border border-white/40 bg-black/20 text-white transition-colors hover:border-white sm:right-7"
            aria-label={copy.next}
          >
            <ChevronRight size={22} />
          </button>

          <p className="absolute bottom-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 sm:bottom-7">
            {activePhoto + 1} / {PHOTOS.length}
          </p>
        </div>
      )}
    </main>
  );
}
