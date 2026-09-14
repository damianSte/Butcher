// Framework-neutral server example (Fetch API). NOT wired into App.tsx.
// Reverse proxy MUST enforce the 16 KiB body limit, rate limit and trusted Origin.
// A real durable outbox implementation must be supplied; no fake success response.
type Dependencies = {
  origin: string;
  turnstileSecret: string;
  enqueue: (message: { email: string; message: string }) => Promise<void>;
};
export async function contact(request: Request, deps: Dependencies): Promise<Response> {
  const reply = (status: number, message: string) => Response.json({ message }, {
    status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (request.headers.get("origin") !== deps.origin) return reply(403, "Niedozwolone źródło.");
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return reply(415, "Wymagany JSON.");
  let body: unknown;
  try { body = await request.json(); } catch { return reply(400, "Nieprawidłowe dane."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply(400, "Nieprawidłowe dane.");
  const b = body as Record<string, unknown>;
  if (Object.keys(b).some(k => !["email", "message", "token"].includes(k))) return reply(400, "Nieznane pole.");
  if (typeof b.email !== "string" || typeof b.message !== "string" || typeof b.token !== "string") return reply(400, "Uzupełnij pola.");
  const email = b.email.trim();
  const message = b.message.normalize("NFC").trim();
  // A pragmatic format check; do not reject names/punctuation in the message.
  if (email.length > 254 || /[\r\n]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      message.length < 10 || message.length > 4000 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(message) ||
      b.token.length < 1 || b.token.length > 2048) return reply(400, "Sprawdź e-mail i treść (10–4000 znaków).");
  if (!deps.turnstileSecret) return reply(503, "Formularz chwilowo niedostępny.");
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: new URLSearchParams({ secret: deps.turnstileSecret, response: b.token }),
      signal: AbortSignal.timeout(5000) });
    if (!response.ok) return reply(503, "Weryfikacja chwilowo niedostępna.");
    const result = await response.json();
    if (result.success !== true || result.hostname !== new URL(deps.origin).hostname || result.action !== "contact")
      return reply(400, "Ponów weryfikację antyspamową.");
    // Persist first, then respond. Send as plain text; fixed recipient and subject.
    // Bind SQL parameters; never concatenate values into queries or SMTP headers.
    await deps.enqueue({ email, message });
    return reply(202, "Przyjęliśmy wiadomość do obsługi.");
  } catch { return reply(503, "Nie udało się przyjąć wiadomości. Spróbuj ponownie."); }
}
