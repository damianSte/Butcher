import "./security/original.css";
import { PrivacyControls } from "./security/PrivacyControls";
import "./security/security.css";
import { useEffect, useState } from "react";

import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Phone,
  UsersRound,
  X,
} from "lucide-react";

import contentPL from "./content.pl.json";
import contentEN from "./content.en.json";
import contentDE from "./content.de.json";
import { Gallery } from "./Gallery";

type Language = "pl" | "en" | "de";
const CONTENT = { pl: contentPL, en: contentEN, de: contentDE };

function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-[#D8CDBF] ${className}`} />;
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7B2026]">
      <span className="h-px w-9 bg-[#7B2026]" />
      <span>{children}</span>
    </div>
  );
}

export default function App() {
  const getPageFromPath = () =>
    window.location.pathname.replace(/\/+$/, "") === "/galeria"
      ? "gallery"
      : "home";

  const [page, setPage] = useState<"home" | "gallery">(getPageFromPath);
  const [language, setLanguage] = useState<Language>("pl");
  const content = CONTENT[language];
  const bullMark = content.images.bullMark;
  const fullLogo = content.images.fullLogo;
  const NAV_LINKS = content.nav.links;
  const BRAND_VALUES = content.brandValues;
  const MENU_DATA = content.menu.categories;
  const GODZINY = content.reservation.availableTimes;

  const guestLabel = (count: number) => {
    const { one, few, many } = content.reservation.guestLabels;
    if (count === 1) return one;
    if (count < 5) return few;
    return many;
  };

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(1);

  const [data, setData] = useState("");
  const [godzina, setGodzina] = useState("");
  const [goscie, setGoscie] = useState("2");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath());
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* REVEAL ANIMATIONS */
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -36px",
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [page]);

  const scrollTo = (id: string) => {
    if (page === "gallery") {
      window.history.pushState({}, "", `/#${id}`);
      setPage("home");
      setMobileOpen(false);

      window.setTimeout(() => {
        const element = document.getElementById(id);
        if (!element) return;

        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 76,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      }, 0);
      return;
    }

    const element = document.getElementById(id);

    if (!element) return;

    const navbarOffset = 76;

    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - navbarOffset,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });

    setMobileOpen(false);
  };

  const openGallery = () => {
    if (page !== "gallery") {
      window.history.pushState({}, "", "/galeria");
      setPage("gallery");
    }

    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const galleryLabel =
    language === "pl" ? "Galeria" : language === "en" ? "Gallery" : "Galerie";
  const normalizedNavLinks = NAV_LINKS.map((link, index) =>
    index === 2 ? { ...link, id: "ogien" } : link,
  );
  const navigationLinks = [
    ...normalizedNavLinks,
    { id: "__gallery", label: galleryLabel },
  ];
  const weekHours = content.footer.weekHours;

  const uniformHours = weekHours.every(
    (day) => day.hours === weekHours[0].hours,
  )
    ? weekHours[0].hours
    : null;

  const activeCategoryData = MENU_DATA[activeCategoryIndex] ?? MENU_DATA[0];

  const activeItems = activeCategoryData?.items ?? [];
  const activeNote = activeCategoryData?.note;
  const activeAddons = activeCategoryData?.addons;
  const activeAddonsTitle = activeCategoryData?.addonsTitle;

  const legalLinks = {
    pl: {
      privacy: "Polityka prywatności",
      cookies: "Polityka cookies",
      settings: "Ustawienia cookies",
    },
    en: {
      privacy: "Privacy policy",
      cookies: "Cookie policy",
      settings: "Cookie settings",
    },
    de: {
      privacy: "Datenschutzerklärung",
      cookies: "Cookie-Richtlinie",
      settings: "Cookie-Einstellungen",
    },
  }[language];

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent("open-cookie-settings"));
  };

  return (
    <div className="min-h-screen cursor-default select-none overflow-x-hidden bg-[#F8F4ED] font-sans text-[#251B17] selection:bg-[#7B2026] selection:text-white [&_input]:select-auto [&_textarea]:select-auto">
      <a className="skip-link" href="#main">
        {content.meta.skipLinkLabel}
      </a>

      {/* NAVIGATION */}
      <header
        className={`fixed inset-x-0 top-0 z-50 translate-y-0 border-b transition-all duration-300 ${
          scrolled
            ? "border-[#D8CDBF] bg-[#FBF8F2] shadow-[0_8px_28px_rgba(69,45,31,0.06)]"
            : "border-[#E8DED1] bg-[#FBF8F2]"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            onClick={() => scrollTo("hero")}
            className="group flex items-center gap-3"
            aria-label={content.brand.homeAriaLabel}
          >
            <img
              src={bullMark}
              alt={content.brand.logoMarkAlt}
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            />

            <div className="hidden sm:block">
              <p className="font-serif text-[18px] leading-none tracking-[0.08em] text-[#251B17]">
                {content.brand.name}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#6F6259]">
                {content.brand.tagline}
              </p>
            </div>
          </button>

          <nav
            aria-label={
              language === "pl"
                ? "Nawigacja główna"
                : language === "en"
                  ? "Main navigation"
                  : "Hauptnavigation"
            }
            className="hidden items-center gap-9 lg:flex"
          >
            {navigationLinks.map(({ label, id }) => (
              <button
                key={id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  id === "__gallery" ? openGallery() : scrollTo(id)
                }
                aria-current={
                  id === "__gallery" && page === "gallery" ? "page" : undefined
                }
                className="relative select-none text-[11px] font-medium uppercase tracking-[0.16em] text-[#5F5148] outline-none transition-colors duration-300 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-[#7B2026] after:transition-all after:duration-300 hover:text-[#251B17] hover:after:w-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#7B2026]"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* RESERVATION BUTTON */}
            <button
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.currentTarget.blur();
                scrollTo("rezerwacje");
              }}
              className="select-none border border-[#7B2026] bg-[#7B2026] px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-white outline-none transition-colors duration-300 hover:bg-[#5F171C] sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.17em] lg:px-6"
            >
              {content.nav.reservationCta}
            </button>

            {/* LANGUAGE SWITCHER */}
            <div className="flex items-center gap-1 border-l border-[#D8CDBF] pl-2">
              {(
                [
                  ["pl", "🇵🇱", "Polski"],
                  ["en", "🇬🇧", "English"],
                  ["de", "🇩🇪", "Deutsch"],
                ] as const
              ).map(([code, flag, label]) => (
                <button
                  key={code}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setLanguage(code)}
                  aria-label={label}
                  aria-pressed={language === code}
                  title={label}
                  className={`grid h-8 min-w-[42px] select-none place-items-center border bg-transparent px-2 text-[15px] outline-none transition-all sm:h-9 sm:min-w-[46px] sm:text-[17px] ${
                    language === code
                      ? "border-[#7B2026] text-[#7B2026]"
                      : "border-[#B9A898] opacity-55 hover:border-[#7B2026] hover:opacity-100"
                  }`}
                >
                  <span aria-hidden="true">{flag}</span>
                </button>
              ))}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => {
                setMobileOpen((open) => !open);
              }}
              className="grid h-10 w-10 shrink-0 place-items-center border border-[#D8CDBF] text-[#251B17] lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={
                mobileOpen
                  ? content.nav.closeMenuLabel
                  : content.nav.openMenuLabel
              }
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        id="mobile-navigation"
        role="navigation"
        aria-label={
          language === "pl"
            ? "Nawigacja mobilna"
            : language === "en"
              ? "Mobile navigation"
              : "Mobile Navigation"
        }
        hidden={!mobileOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setMobileOpen(false);

            document
              .querySelector<HTMLButtonElement>(
                '[aria-controls="mobile-navigation"]',
              )
              ?.focus();
          }
        }}
        className={`fixed inset-0 z-40 flex flex-col bg-[#F8F4ED] px-6 pb-8 pt-28 transition-all duration-400 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="my-auto border-t border-[#D8CDBF]">
          {navigationLinks.map(({ label, id }, index) => (
            <button
              key={id}
              onClick={() =>
                id === "__gallery" ? openGallery() : scrollTo(id)
              }
              className="group flex w-full items-center justify-between border-b border-[#D8CDBF] py-6 text-left"
            >
              <span className="font-serif text-[clamp(32px,9vw,46px)] text-[#251B17]">
                {label}
              </span>

              <span className="text-[10px] font-medium tracking-[0.18em] text-[#7F6F63]">
                0{index + 1}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo("rezerwacje")}
          className="mt-8 flex items-center justify-between bg-[#7B2026] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
        >
          {content.nav.mobileMenuCta}
          <ArrowUpRight size={16} />
        </button>
      </div>

      {page === "gallery" ? (
        <Gallery language={language} />
      ) : (
        <main id="main" tabIndex={-1}>
          {/* HERO */}
          <section id="hero" className="pt-[76px]">
            <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-start gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,47fr)_minmax(0,53fr)] lg:gap-16 lg:px-12">
              {/* LEFT */}
              <div className="flex min-w-0 bg-[#F8F4ED] pb-8 pt-16 sm:pt-20 lg:py-16">
                <div
                  className="my-auto w-full min-w-0 max-w-[640px] [container-type:inline-size]"
                  data-reveal
                >
                  <SectionEyebrow>{content.hero.eyebrow}</SectionEyebrow>

                  <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#75675E]">
                    {content.hero.kicker}
                  </p>

                  <h1 className="select-none font-serif text-[clamp(64px,12.5vw,120px)] font-[900] leading-[0.78] tracking-[-0.045em] text-black">
                    {content.hero.title}
                  </h1>

                  <h2 className="mt-10 max-w-xl font-serif text-[clamp(30px,3.3vw,52px)] font-normal leading-[1.04] tracking-[-0.025em] text-[#342720]">
                    {content.hero.subtitle}{" "}
                    <em className="text-[#7B2026]">
                      {content.hero.subtitleEmphasis}
                    </em>
                  </h2>

                  <p className="mt-7 max-w-md text-sm font-normal leading-7 text-[#5F5148] sm:text-[15px]">
                    {content.hero.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => scrollTo("rezerwacje")}
                      className="bg-[#7B2026] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#5F171C]"
                    >
                      {content.hero.ctaPrimary}
                    </button>

                    <button
                      onClick={() => scrollTo("menu")}
                      className="border border-[#AFA092] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#251B17] transition-colors hover:border-[#251B17]"
                    >
                      {content.hero.ctaSecondary}
                    </button>
                  </div>

                  <button
                    onClick={() => scrollTo("nasza-historia")}
                    className="mt-14 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#6F6259] transition-colors hover:text-[#251B17]"
                  >
                    {content.hero.scrollCta}
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="relative aspect-[4/5] w-full min-w-0 self-start justify-self-center overflow-hidden bg-[#D9CEC0] sm:w-[92%] lg:w-[85%] lg:justify-self-end">
                <img
                  src={content.hero.image.src}
                  width={1500}
                  height={1800}
                  fetchPriority="high"
                  alt={content.hero.image.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] hover:scale-[1.025]"
                />

                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/42 to-transparent" />

                <div className="absolute bottom-6 left-6 border-l border-white/50 pl-6 text-white sm:bottom-8 sm:left-8 sm:pl-8">
                  <p className="text-[10px] font-medium uppercase tracking-[0.20em] text-white/85">
                    {content.hero.imageCaptionEyebrow}
                  </p>

                  <p className="mt-1 font-serif text-xl">
                    {content.hero.imageCaption}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BRAND STRIP */}
          <div className="border-y border-[#D8CDBF] bg-[#EFE7DC]">
            <div className="mx-auto flex h-[44px] max-w-[1320px] flex-wrap items-center justify-center gap-x-9 gap-y-1 px-5 sm:px-8 lg:px-12">
              {BRAND_VALUES.map((item, index) => (
                <div key={item} className="flex items-center gap-9">
                  <span className="text-[10px] font-medium uppercase tracking-[0.20em] text-[#5F5148]">
                    {item}
                  </span>

                  {index !== BRAND_VALUES.length - 1 && (
                    <span className="hidden h-1 w-1 rotate-45 bg-[#9D7C65] sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* STORY */}

          <section
            id="nasza-historia"
            className="bg-[#FFFDFC] py-16 sm:py-20 lg:py-24"
          >
            <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
              <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
                <div className="relative" data-reveal>
                  <div className="aspect-[4/5] overflow-hidden bg-[#E5DCCE]">
                    <img
                      src={content.story.image.src}
                      width={1500}
                      height={1200}
                      loading="lazy"
                      decoding="async"
                      alt={content.story.image.alt}
                      className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.025]"
                    />
                  </div>

                  <div className="absolute -bottom-8 -right-2 hidden w-[230px] bg-[#F3ECE2] p-6 lg:block">
                    <p className="font-serif text-2xl leading-tight text-[#251B17]">
                      {content.story.imageBadge.title}
                    </p>

                    <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#6F6259]">
                      {content.story.imageBadge.subtitle}
                    </p>
                  </div>
                </div>

                <div data-reveal="delay-1">
                  <SectionEyebrow>{content.story.eyebrow}</SectionEyebrow>

                  <h2 className="max-w-[760px] font-serif text-[clamp(44px,6vw,82px)] font-normal leading-[0.98] tracking-[-0.035em] text-[#251B17]">
                    {content.story.title}{" "}
                    <em className="text-[#7B2026]">
                      {content.story.titleEmphasis}
                    </em>
                  </h2>

                  <p className="mt-8 max-w-xl text-[clamp(18px,2vw,24px)] font-normal leading-[1.58] text-[#4F423A]">
                    {content.story.lead}
                  </p>

                  <Divider className="my-9 max-w-xl" />

                  <div className="grid max-w-xl gap-7 sm:grid-cols-2">
                    {content.story.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm font-normal leading-7 text-[#5F5148]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-[#D8CDBF] py-6">
                    {content.story.stats.map(({ value, label }) => (
                      <div
                        key={value}
                        className="border-r border-[#D8CDBF] px-4 first:pl-0 last:border-r-0"
                      >
                        <p className="font-serif text-3xl text-[#7B2026] sm:text-4xl">
                          {value}
                        </p>

                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.17em] text-[#6F6259]">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* IMAGE + QUOTE */}
          <section className="bg-[#F1E9DE] py-5 sm:py-8">
            <div className="mx-auto grid max-w-[1320px] gap-4 px-5 sm:px-8 lg:grid-cols-[1.35fr_.65fr] lg:px-12">
              <div
                className="relative min-h-[400px] overflow-hidden lg:min-h-[560px]"
                data-reveal
              >
                <img
                  src={content.quoteSection.image.src}
                  width={1500}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  alt={content.quoteSection.image.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 to-transparent" />

                <p className="absolute bottom-6 left-6 text-[10px] font-medium uppercase tracking-[0.20em] text-white/90 sm:bottom-8 sm:left-8">
                  {content.quoteSection.imageCaption}
                </p>
              </div>

              <div
                className="flex min-h-[360px] flex-col justify-between bg-[#7B2026] p-8 text-white sm:p-10 lg:min-h-[560px]"
                data-reveal="delay-1"
              >
                <img
                  src={bullMark}
                  alt={content.quoteSection.logoAlt}
                  className="h-16 w-auto self-start object-contain brightness-0 invert"
                />

                <div>
                  <p className="font-serif text-[clamp(34px,4.5vw,58px)] leading-[1.02]">
                    {content.quoteSection.quote}
                  </p>

                  <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.20em] text-white/75">
                    {content.quoteSection.quoteAttribution}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* MENU */}
          <section id="menu" className="bg-[#F8F4ED] py-10 sm:py-12 lg:py-14">
            <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
              <div
                className="mb-7 grid gap-5 lg:mb-8 lg:grid-cols-[1fr_auto] lg:items-end"
                data-reveal
              >
                <div>
                  <SectionEyebrow>{content.menu.eyebrow}</SectionEyebrow>

                  <h2 className="font-serif text-[clamp(48px,7vw,90px)] font-normal leading-[0.95] tracking-[-0.04em] text-[#251B17]">
                    {content.menu.title}
                  </h2>
                </div>

                <p className="max-w-sm text-sm font-normal leading-7 text-[#5F5148]">
                  {content.menu.description}
                </p>
              </div>

              <div
                className="mb-6 flex max-w-full gap-7 overflow-x-auto border-b border-[#CFC2B4] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                data-reveal="delay-1"
              >
                {MENU_DATA.map(({ category }, categoryIndex) => {
                  const active = activeCategoryIndex === categoryIndex;

                  return (
                    <button
                      key={category}
                      aria-pressed={active}
                      onClick={() => setActiveCategoryIndex(categoryIndex)}
                      className={`relative shrink-0 pb-3 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                        active
                          ? "text-[#7B2026] after:w-full after:bg-[#7B2026]"
                          : "text-[#8A7A6E] after:w-0 after:bg-[#7B2026] hover:text-[#251B17] hover:after:w-full"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC MENU CONTENT */}
              <div className="flex flex-col">
                {/* NOTE */}
                {activeNote && (
                  <p className="mb-4 max-w-2xl text-[12px] font-normal leading-[1.5] text-[#5F5148] sm:text-[13px]">
                    {activeNote}
                  </p>
                )}

                {/* MENU ITEMS */}
                <div className="border-t border-[#CFC2B4]">
                  {activeItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="menu-row group grid cursor-default grid-cols-[auto_1fr_auto] gap-3 border-b border-[#CFC2B4] py-3 sm:gap-5 sm:py-4"
                    >
                      <span className="pt-0.5 text-[9px] font-medium tabular-nums tracking-[0.14em] text-[#7F6F63]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3 className="font-serif text-[20px] leading-[1.05] text-[#251B17] sm:text-[24px]">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="mt-1 max-w-2xl text-[12px] font-normal leading-[1.45] text-[#5F5148] sm:text-[13px]">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="whitespace-nowrap font-serif text-[18px] leading-none text-[#7B2026] sm:text-[20px]">
                          {item.price}

                          <span className="ml-1 text-[10px] text-[#9A7970]">
                            {content.menu.currency}
                          </span>
                        </span>

                        <ArrowUpRight
                          className="menu-arrow mt-0.5 hidden text-[#7B2026] opacity-0 transition-all sm:block"
                          size={13}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADDONS */}
                {activeAddons && activeAddons.length > 0 && (
                  <div className="mt-5">
                    {activeAddonsTitle && (
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.20em] text-[#6F6259]">
                        {activeAddonsTitle}
                      </p>
                    )}

                    <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                      {activeAddons.map((addon) => (
                        <div
                          key={addon.name}
                          className="flex items-baseline justify-between gap-4 border-b border-[#E3D9CB] py-1.5"
                        >
                          <span className="text-[12px] font-normal text-[#5F5148] sm:text-[13px]">
                            {addon.name}
                          </span>

                          <span className="whitespace-nowrap font-serif text-[15px] text-[#7B2026]">
                            {addon.price}

                            <span className="ml-1 text-[9px] text-[#9A7970]">
                              {content.menu.currency}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DOWNLOAD BUTTON */}
                {/* <div className="flex justify-center pt-8">
                  <button className="group flex items-center gap-3 border-b border-[#7B2026] pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7B2026] transition-colors hover:text-[#4E1216]">
                    {content.menu.downloadCta}
                    <ArrowUpRight size={13} />
                  </button>
                </div> */}
              </div>
            </div>
          </section>

          {/* GRILL */}
          <section
            id="ogien"
            className="relative min-h-[72vh] overflow-hidden bg-[#241B17]"
          >
            <img
              src={content.fire.image.src}
              width={2200}
              height={1400}
              loading="lazy"
              decoding="async"
              alt={content.fire.image.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,25,20,.90)_0%,rgba(35,25,20,.72)_48%,rgba(35,25,20,.22)_82%,rgba(35,25,20,.30)_100%)]" />

            <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-[1320px] items-center px-5 py-16 sm:px-8 lg:px-12">
              <div className="max-w-2xl" data-reveal>
                <div className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[#F2E6D8]">
                  <span className="h-px w-9 bg-[#E7D8C8]/70" />
                  {content.fire.eyebrow}
                </div>

                <h2 className="font-serif text-[clamp(48px,7vw,94px)] font-normal leading-[0.94] tracking-[-0.04em] text-white">
                  {content.fire.title}
                </h2>

                <p className="mt-7 max-w-lg text-[15px] font-normal leading-7 text-white/82 sm:text-base">
                  {content.fire.description}
                </p>

                {/* <button
                  onClick={() => scrollTo("menu")}
                  className="mt-9 border border-[#F6EFE6] bg-[#F6EFE6] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#251B17] transition-colors hover:bg-white"
                >
                  {content.fire.cta}
                </button> */}
              </div>
            </div>
          </section>

          {/* RESERVATION */}
          <section
            id="rezerwacje"
            className="bg-[#EFE7DC] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
          >
            <div className="mx-auto max-w-[1100px]">
              <div className="mx-auto mb-12 max-w-2xl text-center" data-reveal>
                <SectionEyebrow>{content.reservation.eyebrow}</SectionEyebrow>

                <h2 className="font-serif text-[clamp(48px,7vw,86px)] font-normal leading-[0.95] tracking-[-0.04em] text-[#251B17]">
                  {content.reservation.title}
                </h2>

                <p className="mx-auto mt-5 max-w-md text-sm font-normal leading-7 text-[#5F5148]">
                  {content.reservation.description}
                </p>
              </div>

              <div
                className="border border-[#CFC2B4] bg-[#FFFDFC] p-5 sm:p-7"
                data-reveal="delay-1"
              >
                <div className="grid w-full min-w-0 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                  <label className="block w-full min-w-0">
                    <span className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.17em] text-[#6F6259]">
                      <CalendarDays size={13} />
                      {content.reservation.dateLabel}
                    </span>

                    <input
                      type="date"
                      value={data}
                      onChange={(event) => setData(event.target.value)}
                      className="block h-[52px] w-full min-w-0 max-w-full border border-[#D8CDBF] bg-white px-4 text-sm text-[#251B17] outline-none transition-colors focus:border-[#7B2026]"
                    />
                  </label>

                  <label className="block w-full min-w-0">
                    <span className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.17em] text-[#6F6259]">
                      <Clock3 size={13} />
                      {content.reservation.timeLabel}
                    </span>

                    <select
                      value={godzina}
                      onChange={(event) => setGodzina(event.target.value)}
                      className="block h-[52px] w-full min-w-0 max-w-full cursor-pointer appearance-none border border-[#D8CDBF] bg-white px-4 text-sm text-[#251B17] outline-none transition-colors focus:border-[#7B2026]"
                    >
                      <option value="">
                        {content.reservation.timePlaceholder}
                      </option>

                      {GODZINY.map((time, index) => (
                        <option key={`${time}-${index}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block w-full min-w-0">
                    <span className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.17em] text-[#6F6259]">
                      <UsersRound size={13} />
                      {content.reservation.guestsLabel}
                    </span>

                    <select
                      value={goscie}
                      onChange={(event) => setGoscie(event.target.value)}
                      className="block h-[52px] w-full min-w-0 max-w-full cursor-pointer appearance-none border border-[#D8CDBF] bg-white px-4 text-sm text-[#251B17] outline-none transition-colors focus:border-[#7B2026]"
                    >
                      {Array.from(
                        {
                          length: content.reservation.maxGuestsOption,
                        },
                        (_, i) => i + 1,
                      ).map((count) => (
                        <option key={count} value={count}>
                          {count} {guestLabel(count)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button className="flex h-[52px] w-full min-w-0 items-center justify-center gap-3 bg-[#7B2026] px-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#5F171C] md:w-auto">
                    {content.reservation.submitCta}
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              <p className="mt-6 text-center text-[10px] font-medium tracking-[0.10em] text-[#6F6259]">
                {content.reservation.groupNote}
              </p>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#D8CDBF] bg-[#FBF8F2] text-[#251B17]">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
            {/* LOGO + DESCRIPTION */}
            <div>
              <img
                src={fullLogo}
                alt={content.footer.logoAlt}
                className="h-16 w-auto object-contain object-left sm:h-20"
              />

              <p className="mt-6 max-w-sm text-sm font-normal leading-7 text-[#5F5148]">
                {content.footer.description}
              </p>
            </div>

            {/* CONTACT */}
            <div className="lg:border-l lg:border-[#D8CDBF] lg:pl-10">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.20em] text-[#6F6259]">
                {content.footer.contactTitle}
              </p>

              <div className="space-y-3 text-sm text-[#5F5148]">
                {/* ADDRESS / GOOGLE MAPS */}
                <a
                  href={content.footer.address.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 transition-colors hover:text-[#7B2026]"
                >
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-[#9D7C65] transition-colors group-hover:text-[#7B2026]"
                  />

                  <span className="border-b border-transparent transition-colors group-hover:border-[#7B2026]">
                    {content.footer.address.display}
                  </span>
                </a>

                {/* PHONE */}
                <a
                  href={content.footer.phone.href}
                  className="flex items-center gap-3 transition-colors hover:text-[#7B2026]"
                >
                  <Phone size={15} className="shrink-0 text-[#9D7C65]" />

                  {content.footer.phone.display}
                </a>

                {/* EMAIL */}
                <a
                  href={content.footer.email.href}
                  className="flex items-center gap-3 transition-colors hover:text-[#7B2026]"
                >
                  <Mail size={15} className="shrink-0 text-[#9D7C65]" />

                  {content.footer.email.display}
                </a>
              </div>
            </div>

            {/* OPENING HOURS */}
            <div className="lg:border-l lg:border-[#D8CDBF] lg:pl-10">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.20em] text-[#6F6259]">
                {content.footer.hoursTitle}
              </p>

              {uniformHours ? (
                <div className="flex items-baseline justify-between gap-4 border-b border-[#E3D9CB] py-2 text-sm text-[#5F5148]">
                  <span>
                    {language === "pl"
                      ? "Codziennie"
                      : language === "en"
                        ? "Daily"
                        : "Täglich"}
                  </span>

                  <span className="font-serif text-base text-[#251B17]">
                    {uniformHours}
                  </span>
                </div>
              ) : (
                weekHours.map(({ day, hours }) => (
                  <div
                    key={day}
                    className="flex items-baseline justify-between gap-4 border-b border-[#E3D9CB] py-2 text-sm text-[#5F5148]"
                  >
                    <span>{day}</span>

                    <span className="font-serif text-base text-[#251B17]">
                      {hours}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FOOTER BOTTOM */}
          <div className="mt-16 flex flex-col gap-5 border-t border-[#D8CDBF] pt-6 text-[10px] font-medium uppercase tracking-[0.15em] text-[#6F6259] sm:flex-row sm:items-start sm:justify-between">
            <p>{content.footer.copyright}</p>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {content.footer.socialLinks.map(({ label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#7B2026]"
                  >
                    {label}
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 text-[#8A7A6E] sm:justify-end">
                <a
                  href="/polityka-prywatnosci"
                  className="transition-colors hover:text-[#7B2026]"
                >
                  {legalLinks.privacy}
                </a>

                <a
                  href="/polityka-cookies"
                  className="transition-colors hover:text-[#7B2026]"
                >
                  {legalLinks.cookies}
                </a>

                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="text-left uppercase tracking-[0.15em] transition-colors hover:text-[#7B2026]"
                >
                  {legalLinks.settings}
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyControls />
    </div>
  );
}
