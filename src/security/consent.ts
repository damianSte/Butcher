// Enable only after the vendor inventory, privacy notice and CSP are updated.
export const CONFIG = { analyticsId: "", marketingId: "", version: "2026-09-12.1" };
export const KEY = "butcher.privacy.v1";
const TTL = 180 * 24 * 60 * 60 * 1000; // Policy choice, not a statutory period.
export type Choice = { analytics: boolean; marketing: boolean; version: string; savedAt: number };
type TagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
const w = window as TagWindow;
let started = false;
export const available = { analytics: /^G-[A-Z0-9]+$/.test(CONFIG.analyticsId), marketing: /^AW-\d+$/.test(CONFIG.marketingId) };
export function readChoice(): Choice | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null");
    return c && c.version === CONFIG.version && typeof c.analytics === "boolean" &&
      typeof c.marketing === "boolean" && Number.isFinite(c.savedAt) &&
      c.savedAt <= Date.now() && Date.now() - c.savedAt < TTL ? c : null;
  } catch { return null; }
}
function flags(c: Choice | null) {
  return { analytics_storage: c?.analytics && available.analytics ? "granted" : "denied",
    ad_storage: c?.marketing && available.marketing ? "granted" : "denied",
    ad_user_data: c?.marketing && available.marketing ? "granted" : "denied",
    ad_personalization: c?.marketing && available.marketing ? "granted" : "denied" };
}
export function initTracking() {
  if (started) return;
  started = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer!.push(arguments); };
  w.gtag("consent", "default", flags(null));
  const c = readChoice();
  if (!c || !(c.analytics && available.analytics || c.marketing && available.marketing)) return;
  w.gtag("consent", "update", flags(c));
  w.gtag("set", "ads_data_redaction", true);
  w.gtag("set", "url_passthrough", false);
  w.gtag("js", new Date());
  // No query strings, form contents, user_id or contact details in measurement.
  const page = { page_location: location.origin + location.pathname,
    page_referrer: "", page_title: "Butcher", cookie_domain: "none", cookie_path: "/" };
  if (c.analytics && available.analytics) w.gtag("config", CONFIG.analyticsId, {
    ...page, allow_google_signals: false, allow_ad_personalization_signals: false });
  if (c.marketing && available.marketing) w.gtag("config", CONFIG.marketingId, page);
  const id = c.analytics && available.analytics ? CONFIG.analyticsId : CONFIG.marketingId;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.append(script);
}
function clearMeasurementCookies() {
  // Covers only the host-only root-path cookies deliberately configured above.
  // Legacy, other-domain, HttpOnly and third-party cookies require a separate inventory.
  document.cookie.split(";").forEach(part => {
    const name = part.split("=")[0].trim();
    if (/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_gcl_)/.test(name)) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
    }
  });
}
export function saveChoice(analytics: boolean, marketing: boolean): boolean {
  const c: Choice = { analytics: analytics && available.analytics,
    marketing: marketing && available.marketing, version: CONFIG.version, savedAt: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { return false; }
  // Disable GA immediately; update consent before navigating, as required by Google.
  (w as unknown as Record<string, unknown>)[`ga-disable-${CONFIG.analyticsId}`] = true;
  w.gtag?.("consent", "update", flags(c));
  if (!c.analytics || !c.marketing) clearMeasurementCookies();
  // A fresh document removes timers and event handlers installed by loaded vendors.
  // A request already sent cannot be recalled; updates may emit a final consent ping.
  location.reload();
  return true;
}
