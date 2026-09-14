import { useEffect, useRef, useState } from "react";
import { available, initTracking, KEY, readChoice, saveChoice } from "./consent";
export function PrivacyControls() {
  const [choice] = useState(readChoice);
  const [visible, setVisible] = useState(!choice);
  const [analytics, setAnalytics] = useState(choice?.analytics ?? false);
  const [marketing, setMarketing] = useState(choice?.marketing ?? false);
  const [error, setError] = useState("");
  const panel = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const enabled = available.analytics || available.marketing;
  useEffect(() => {
    initTracking();
    const sync = (event: StorageEvent) => { if (event.key === KEY || event.key === null) location.reload(); };
    const expire = () => { if (choice && !readChoice()) location.reload(); };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", expire);
    const timer = window.setInterval(expire, 60_000);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("focus", expire); clearInterval(timer); };
  }, [choice]);
  function save(a: boolean, m: boolean) {
    if (!saveChoice(a, m)) setError("Nie udało się zapisać wyboru. Nie włączono dodatkowych narzędzi. Sprawdź ustawienia pamięci przeglądarki.");
  }
  if (!enabled) return null; // Do not solicit consent to nonexistent services.
  return <div className="privacy-wrapper">
    <button ref={trigger} className="privacy-button" aria-controls="privacy-panel" aria-expanded={visible}
      onClick={() => { setVisible(true); requestAnimationFrame(() => panel.current?.focus()); }}>Ustawienia prywatności</button>
    {visible && <section id="privacy-panel" ref={panel} tabIndex={-1} aria-labelledby="privacy-title" className="privacy-panel">
      <h2 id="privacy-title">Twoja prywatność</h2>
      <p>Niezbędna pamięć służy do zapamiętania wyboru. Za Twoją zgodą uruchomimy wybrane narzędzia Google. Odrzucenie nie ogranicza korzystania ze strony. Zgodę możesz wycofać w ustawieniach prywatności.</p>
      <a href="/polityka-prywatnosci">Polityka prywatności i szczegóły narzędzi</a>
      <fieldset><legend>Kategorie</legend>
        <label><input type="checkbox" checked disabled /> Niezbędne — zawsze aktywne</label>
        <label><input type="checkbox" checked={analytics} disabled={!available.analytics} onChange={e => setAnalytics(e.target.checked)} /> Analityczne — statystyki odwiedzin (Google Analytics)</label>
        <label><input type="checkbox" checked={marketing} disabled={!available.marketing} onChange={e => setMarketing(e.target.checked)} /> Marketingowe — pomiar reklam i personalizacja (Google Ads)</label>
      </fieldset>
      <div className="privacy-actions">
        <button className="privacy-button" onClick={() => save(true, true)}>Akceptuję</button>
        <button className="privacy-button" onClick={() => save(false, false)}>Odrzucam</button>
        <button className="privacy-button" onClick={() => save(analytics, marketing)}>Zapisz wybór</button>
        <button className="privacy-button" onClick={() => { setVisible(false); trigger.current?.focus(); }}>Zamknij bez zmiany</button>
      </div>
      <p role="status">{error}</p>
    </section>}
  </div>;
}
