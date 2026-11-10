type Language = "pl" | "en" | "de";
export type LegalKind = "privacy" | "cookies";

type Section = { title: string; body: string[] };
type Doc = { title: string; updated: string; sections: Section[] };

// TODO before launch: replace with the full legal name of the data controller
// (company / sole-proprietor name and tax ID), exactly as in the business register.
const CONTROLLER_NAME = "Butcher Restaurant";

type Contact = { address: string; email: string };

function buildDocs(c: Contact): Record<Language, Record<LegalKind, Doc>> {
  const controller = `${CONTROLLER_NAME}, ${c.address}, e-mail: ${c.email}`;

  return {
    pl: {
      privacy: {
        title: "Polityka prywatności",
        updated: "Ostatnia aktualizacja: 10 listopada 2026",
        sections: [
          {
            title: "1. Administrator danych",
            body: [`Administratorem danych osobowych jest ${controller}.`],
          },
          {
            title: "2. Jakie dane przetwarzamy i po co",
            body: [
              "Strona ma charakter informacyjny: nie ma kont użytkowników, formularzy kontaktowych ani newslettera.",
              "Serwer, na którym działa strona, może zapisywać standardowe dane techniczne (adres IP, data i godzina, adres żądanego zasobu, typ przeglądarki). Przetwarzamy je w celu zapewnienia bezpieczeństwa i prawidłowego działania strony (art. 6 ust. 1 lit. f RODO) i przechowujemy przez okres niezbędny do tego celu.",
            ],
          },
          {
            title: "3. Rezerwacje stolika",
            body: [
              "Rezerwacji można dokonać w oknie systemu DISH, które ładuje się dopiero po kliknięciu przycisku rezerwacji. Dane podane w tym oknie (np. imię, telefon, e-mail, termin) przetwarza w celu obsługi rezerwacji restauracja oraz dostawca systemu rezerwacji, zgodnie z jego polityką prywatności (art. 6 ust. 1 lit. b RODO). Dane przechowujemy przez czas niezbędny do realizacji rezerwacji oraz, jeśli to konieczne, do dochodzenia lub obrony roszczeń.",
            ],
          },
          {
            title: "4. Zasoby i serwisy zewnętrzne",
            body: [
              "Czcionki i skrypty strony są hostowane na naszym serwerze. W wersjach angielskiej i niemieckiej niektóre zdjęcia są pobierane z serwisu Unsplash, co wiąże się z przekazaniem Twojego adresu IP temu serwisowi.",
              "Linki do Google Maps, Instagrama, Facebooka i innych serwisów prowadzą poza naszą stronę; serwisy te stosują własne polityki prywatności.",
            ],
          },
          {
            title: "5. Pliki cookies",
            body: ["Szczegóły znajdziesz w Polityce cookies."],
          },
          {
            title: "6. Twoje prawa",
            body: [
              "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie oraz przenoszenia danych (gdy ma zastosowanie).",
              `W sprawach dotyczących danych napisz na: ${c.email}. Masz też prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych.`,
            ],
          },
        ],
      },
      cookies: {
        title: "Polityka cookies",
        updated: "Ostatnia aktualizacja: 10 listopada 2026",
        sections: [
          {
            title: "Czego używamy",
            body: [
              "Ta strona nie ustawia własnych plików cookies i nie korzysta z narzędzi analitycznych ani marketingowych.",
            ],
          },
          {
            title: "Zgody na przyszłość",
            body: [
              "Jeżeli w przyszłości włączymy narzędzia analityczne lub marketingowe, uruchomimy je dopiero po uzyskaniu Twojej zgody. Wybór zapiszemy w pamięci przeglądarki (localStorage) na 180 dni; zgodę będzie można zmienić w „Ustawieniach cookies” w stopce.",
            ],
          },
          {
            title: "Okno rezerwacji DISH",
            body: [
              "Okno rezerwacji to osobny serwis zewnętrzny, który może używać własnych plików cookies lub podobnych technologii. Ładuje się dopiero po kliknięciu przycisku rezerwacji.",
            ],
          },
          {
            title: "Zarządzanie cookies",
            body: [
              "Pliki cookies możesz w każdej chwili usunąć lub zablokować w ustawieniach swojej przeglądarki.",
            ],
          },
        ],
      },
    },
    en: {
      privacy: {
        title: "Privacy policy",
        updated: "Last updated: 10 November 2026",
        sections: [
          {
            title: "1. Data controller",
            body: [`The controller of personal data is ${controller}.`],
          },
          {
            title: "2. What data we process and why",
            body: [
              "This website is informational: there are no user accounts, contact forms or newsletters.",
              "The server hosting the website may record standard technical data (IP address, date and time, requested resource, browser type). We process it to keep the website secure and working properly (Art. 6(1)(f) GDPR) and keep it only as long as necessary for that purpose.",
            ],
          },
          {
            title: "3. Table reservations",
            body: [
              "You can book a table in the DISH reservation window, which loads only after you click the reservation button. The data you enter there (e.g. name, phone, e-mail, date) is processed by the restaurant and by the reservation system provider, in line with its privacy policy, to handle your booking (Art. 6(1)(b) GDPR). We keep it for as long as needed to fulfil the booking and, where necessary, to establish or defend legal claims.",
            ],
          },
          {
            title: "4. External resources and services",
            body: [
              "Fonts and scripts are hosted on our own server. In the English and German versions some photos are loaded from Unsplash, which means your IP address is transmitted to that service.",
              "Links to Google Maps, Instagram, Facebook and other services lead away from our website; those services have their own privacy policies.",
            ],
          },
          {
            title: "5. Cookies",
            body: ["See our Cookie policy for details."],
          },
          {
            title: "6. Your rights",
            body: [
              "You have the right to access your data, have it rectified or erased, restrict processing, object to processing based on legitimate interests, and (where applicable) data portability.",
              `For data protection matters, write to: ${c.email}. You also have the right to lodge a complaint with your data protection supervisory authority (in Poland: the President of the Personal Data Protection Office, UODO).`,
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie policy",
        updated: "Last updated: 10 November 2026",
        sections: [
          {
            title: "What we use",
            body: [
              "This website sets no cookies of its own and uses no analytics or marketing tools.",
            ],
          },
          {
            title: "Future consent",
            body: [
              "If we enable analytics or marketing tools in the future, they will start only after you consent. Your choice will be stored in your browser (localStorage) for 180 days and can be changed under “Cookie settings” in the footer.",
            ],
          },
          {
            title: "DISH reservation window",
            body: [
              "The reservation window is a separate third-party service that may use its own cookies or similar technologies. It loads only after you click the reservation button.",
            ],
          },
          {
            title: "Managing cookies",
            body: [
              "You can delete or block cookies at any time in your browser settings.",
            ],
          },
        ],
      },
    },
    de: {
      privacy: {
        title: "Datenschutzerklärung",
        updated: "Zuletzt aktualisiert: 10. November 2026",
        sections: [
          {
            title: "1. Verantwortlicher",
            body: [
              `Verantwortlicher für die Verarbeitung personenbezogener Daten ist ${controller}.`,
            ],
          },
          {
            title: "2. Welche Daten wir verarbeiten und warum",
            body: [
              "Diese Website dient der Information: Es gibt keine Benutzerkonten, Kontaktformulare oder Newsletter.",
              "Der Server, auf dem die Website läuft, kann technische Standarddaten speichern (IP-Adresse, Datum und Uhrzeit, angeforderte Ressource, Browsertyp). Wir verarbeiten sie, um die Sicherheit und den ordnungsgemäßen Betrieb der Website zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO), und speichern sie nur so lange, wie es dafür erforderlich ist.",
            ],
          },
          {
            title: "3. Tischreservierung",
            body: [
              "Eine Reservierung ist im DISH-Reservierungsfenster möglich, das erst nach einem Klick auf die Reservierungsschaltfläche geladen wird. Die dort eingegebenen Daten (z. B. Name, Telefon, E-Mail, Termin) werden zur Abwicklung der Reservierung vom Restaurant und vom Anbieter des Reservierungssystems gemäß dessen Datenschutzerklärung verarbeitet (Art. 6 Abs. 1 lit. b DSGVO). Wir speichern sie so lange, wie es für die Durchführung der Reservierung und gegebenenfalls zur Geltendmachung oder Abwehr von Rechtsansprüchen erforderlich ist.",
            ],
          },
          {
            title: "4. Externe Ressourcen und Dienste",
            body: [
              "Schriften und Skripte werden auf unserem eigenen Server bereitgestellt. In der englischen und deutschen Version werden einige Fotos von Unsplash geladen; dabei wird Ihre IP-Adresse an diesen Dienst übermittelt.",
              "Links zu Google Maps, Instagram, Facebook und anderen Diensten führen von unserer Website weg; diese Dienste haben eigene Datenschutzerklärungen.",
            ],
          },
          {
            title: "5. Cookies",
            body: ["Einzelheiten finden Sie in der Cookie-Richtlinie."],
          },
          {
            title: "6. Ihre Rechte",
            body: [
              "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch gegen eine auf berechtigten Interessen beruhende Verarbeitung sowie (soweit anwendbar) Datenübertragbarkeit.",
              `Bei Datenschutzfragen schreiben Sie an: ${c.email}. Sie haben außerdem das Recht, bei einer Datenschutzaufsichtsbehörde Beschwerde einzulegen (in Polen: Präsident der Datenschutzbehörde UODO).`,
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie-Richtlinie",
        updated: "Zuletzt aktualisiert: 10. November 2026",
        sections: [
          {
            title: "Was wir verwenden",
            body: [
              "Diese Website setzt keine eigenen Cookies und nutzt keine Analyse- oder Marketing-Tools.",
            ],
          },
          {
            title: "Künftige Einwilligung",
            body: [
              "Sollten wir künftig Analyse- oder Marketing-Tools einsetzen, starten sie erst nach Ihrer Einwilligung. Ihre Auswahl wird 180 Tage im Browser (localStorage) gespeichert und kann über „Cookie-Einstellungen“ in der Fußzeile geändert werden.",
            ],
          },
          {
            title: "DISH-Reservierungsfenster",
            body: [
              "Das Reservierungsfenster ist ein separater externer Dienst, der eigene Cookies oder ähnliche Technologien verwenden kann. Es wird erst nach einem Klick auf die Reservierungsschaltfläche geladen.",
            ],
          },
          {
            title: "Cookies verwalten",
            body: [
              "Sie können Cookies jederzeit in den Einstellungen Ihres Browsers löschen oder blockieren.",
            ],
          },
        ],
      },
    },
  };
}

export function LegalPage({
  language,
  kind,
  contact,
  onNavigate,
}: {
  language: Language;
  kind: LegalKind;
  contact: Contact;
  onNavigate: (kind: LegalKind) => void;
}) {
  const docs = buildDocs(contact)[language];
  const doc = docs[kind];
  const other: LegalKind = kind === "privacy" ? "cookies" : "privacy";
  const otherPath =
    other === "privacy" ? "/polityka-prywatnosci" : "/polityka-cookies";

  return (
    <main id="main" tabIndex={-1} className="pt-[76px]">
      <div className="mx-auto w-full max-w-[820px] px-5 py-16 sm:px-8 sm:py-24">
        <h1 className="font-serif text-[clamp(36px,6vw,60px)] font-normal leading-[1] tracking-[-0.03em] text-[#251B17]">
          {doc.title}
        </h1>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#6F6259]">
          {doc.updated}
        </p>

        <div className="mt-12 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-[#251B17]">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-[15px] leading-7 text-[#5F5148]"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-[#D8CDBF] pt-6 text-sm">
          <a
            href={otherPath}
            onClick={(event) => {
              if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              onNavigate(other);
            }}
            className="text-[#7B2026] underline underline-offset-4"
          >
            {docs[other].title}
          </a>
        </p>
      </div>
    </main>
  );
}
