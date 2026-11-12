import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Language = "pl" | "en" | "de";

type Photo = { src: string; alt: string; thumbnail?: string };

type CloudinaryResource = {
  public_id: string;
  format: string;
  version?: number;
  created_at?: string;
  context?: { custom?: { alt?: string } };
};

async function loadCloudinaryPhotos(signal: AbortSignal): Promise<Photo[]> {
  const base = "https://res.cloudinary.com/flzzazlc/image";
  const list = await fetch(`${base}/list/butcher-gallery.json`, { signal });
  if (!list.ok) throw new Error("Cloudinary gallery request failed");

  const { resources }: { resources?: CloudinaryResource[] } = await list.json();
  if (!Array.isArray(resources))
    throw new Error("Invalid Cloudinary gallery response");

  const upload = `${base}/upload`;
  return resources
    .filter(
      ({ public_id, format }) =>
        typeof public_id === "string" &&
        public_id.length > 0 &&
        /^(jpe?g|png|webp|avif)$/i.test(format),
    )
    .sort((first, second) =>
      (second.created_at ?? "").localeCompare(first.created_at ?? ""),
    )
    .map(({ public_id, format, version, context }) => {
      const id = public_id.split("/").map(encodeURIComponent).join("/");
      const path = `${Number.isInteger(version) ? `v${version}/` : ""}${id}.${format}`;
      return {
        src: `${upload}/f_auto,q_auto,c_limit,w_1600/${path}`,
        thumbnail: `${upload}/f_auto,q_auto,c_limit,w_640/${path}`,
        alt: context?.custom?.alt ?? "",
      };
    });
}

const PAGE_SIZE = 9;

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
    previousPage: "Poprzedni zestaw zdjęć",
    nextPage: "Następny zestaw zdjęć",
    page: "Strona",
    loading: "Ładowanie zdjęć…",
    empty: "W galerii nie ma jeszcze zdjęć.",
    error: "Nie udało się pobrać zdjęć. Odśwież stronę i spróbuj ponownie.",
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
    previousPage: "Previous set of photos",
    nextPage: "Next set of photos",
    page: "Page",
    loading: "Loading photos…",
    empty: "There are no photos in the gallery yet.",
    error: "Photos could not be loaded. Refresh the page and try again.",
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
    previousPage: "Vorherige Fotoseite",
    nextPage: "Nächste Fotoseite",
    page: "Seite",
    loading: "Fotos werden geladen…",
    empty: "Die Galerie enthält noch keine Fotos.",
    error:
      "Die Fotos konnten nicht geladen werden. Bitte laden Sie die Seite neu.",
  },
};

export function Gallery({ language }: { language: Language }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [page, setPage] = useState(0);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const copy = COPY[language];
  const pageCount = Math.max(1, Math.ceil(photos.length / PAGE_SIZE));
  const firstPhoto = page * PAGE_SIZE;

  useEffect(() => {
    const controller = new AbortController();

    void loadCloudinaryPhotos(controller.signal)
      .then((photos) => {
        if (controller.signal.aborted) return;
        setPhotos(photos);
        setStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const changePage = (direction: number) =>
    setPage((current) =>
      Math.min(pageCount - 1, Math.max(0, current + direction)),
    );

  const closePhoto = () => {
    if (activePhoto !== null) setPage(Math.floor(activePhoto / PAGE_SIZE));
    setActivePhoto(null);
  };

  const movePhoto = (direction: number) =>
    setActivePhoto((current) =>
      current === null
        ? null
        : (current + direction + photos.length) % photos.length,
    );

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
  });

  const photoOpen = activePhoto !== null;
  useEffect(() => {
    if (!photoOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => handleKeyDown(event);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [photoOpen]);

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

        {status !== "ready" || photos.length === 0 ? (
          <p role="status" className="py-12 text-center text-sm text-[#5F5148]">
            {status === "loading"
              ? copy.loading
              : status === "error"
                ? copy.error
                : copy.empty}
          </p>
        ) : null}

        <div
          aria-busy={status === "loading"}
          className="grid touch-pan-y grid-cols-3 gap-2 sm:gap-4 lg:gap-5"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            swipeStart.current =
              event.touches.length === 1
                ? { x: touch.clientX, y: touch.clientY }
                : null;
          }}
          onTouchCancel={() => {
            swipeStart.current = null;
          }}
          onTouchEnd={(event) => {
            const start = swipeStart.current;
            swipeStart.current = null;
            if (!start) return;

            const touch = event.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
              changePage(dx < 0 ? 1 : -1);
            }
          }}
        >
          {photos
            .slice(firstPhoto, firstPhoto + PAGE_SIZE)
            .map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActivePhoto(firstPhoto + index)}
                className="group relative aspect-[4/3] w-full overflow-hidden bg-[#E5DCCE] text-left"
                aria-label={`${copy.counter} ${firstPhoto + index + 1}${photo.alt ? `: ${photo.alt}` : ""}`}
              >
                <img
                  src={photo.thumbnail ?? photo.src}
                  alt={photo.alt}
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025] group-hover:brightness-90"
                />
              </button>
            ))}
        </div>

        {pageCount > 1 && (
          <div className="mt-7 flex items-center justify-center gap-5 text-[#7B2026]">
            <button
              type="button"
              onClick={() => changePage(-1)}
              disabled={page === 0}
              aria-label={copy.previousPage}
              className="grid h-11 w-11 place-items-center border border-current hover:bg-[#EFE7DC] disabled:opacity-40"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <p
              aria-live="polite"
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
            >
              {copy.page} {page + 1} / {pageCount}
            </p>
            <button
              type="button"
              onClick={() => changePage(1)}
              disabled={page === pageCount - 1}
              aria-label={copy.nextPage}
              className="grid h-11 w-11 place-items-center border border-current hover:bg-[#EFE7DC] disabled:opacity-40"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      {activePhoto !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#120D0B]/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${copy.counter} ${activePhoto + 1}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePhoto();
          }}
        >
          <button
            type="button"
            onClick={closePhoto}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center border border-white/40 text-white transition-colors hover:border-white sm:right-7 sm:top-7"
            aria-label={copy.close}
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={() => movePhoto(-1)}
            className="absolute left-3 z-10 grid h-11 w-11 place-items-center border border-white/40 bg-black/20 text-white transition-colors hover:border-white sm:left-7"
            aria-label={copy.previous}
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={photos[activePhoto].src}
            alt={photos[activePhoto].alt}
            className="max-h-[86vh] max-w-[92vw] object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={() => movePhoto(1)}
            className="absolute right-3 z-10 grid h-11 w-11 place-items-center border border-white/40 bg-black/20 text-white transition-colors hover:border-white sm:right-7"
            aria-label={copy.next}
          >
            <ChevronRight size={22} />
          </button>

          <p className="absolute bottom-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 sm:bottom-7">
            {activePhoto + 1} / {photos.length}
          </p>
        </div>
      )}
    </main>
  );
}
