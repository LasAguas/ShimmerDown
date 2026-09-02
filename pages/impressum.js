// ---------------------------------------------------------------------------
// /impressum — the German Impressum (§ 5 DDG) and the privacy notice the
// footer sign-up links to.
//
// ⚠️ NOT LEGAL ADVICE. The studio is run by a freelancer (no UG/GmbH/GbR),
// so there is no Handelsregister entry and no separate "Vertreten durch" —
// the freelancer is both operator and legally responsible party. The tax
// number below is a Finanzamt Steuernummer (slash format), not a USt-IdNr;
// either satisfies § 5 DDG. Still needs a lawyer's eye before the site goes
// live, and the privacy section has to keep matching what the site actually
// does with data. See TODO.md item 4 / item 16.
//
// The legally-required parts are in German on purpose — that is the convention
// for a German Impressum even on an otherwise English site.
// ---------------------------------------------------------------------------
import Layout from "../components/Layout";
import s from "../styles/impressum.module.css";

const META = {
  title: "Impressum & Privacy",
  description: "Impressum und Datenschutzerklärung — Shimmer Down Studios.",
};

const IMPRESSUM = [
  {
    heading: "Angaben gemäß § 5 DDG",
    lines: [
      "Barney Jack Walsinghan Riley",
      "Mehringdamm 97",
      "10965 Berlin",
      "Deutschland",
    ],
  },
  {
    heading: "Kontakt",
    lines: ["Telefon: 0176 56942822", "E-Mail: shimmerdownstudio@gmail.com"],
  },
  {
    heading: "Steuernummer",
    lines: ["DE 14/494/00849"],
  },
  {
    heading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    lines: ["Barney Jack Walsinghan Riley", "Mehringdamm 97", "10965 Berlin"],
  },
  {
    heading: "EU-Streitschlichtung",
    lines: [
      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
    ],
  },
];

// Written to match what the site actually does today. If the site gains
// analytics, a pixel, an embedded map or a contact form, this has to change
// with it — see TODO.md item 16.
const PRIVACY = [
  {
    heading: "Newsletter",
    lines: [
      "Wenn Sie sich für unseren Newsletter anmelden, speichern wir Ihre E-Mail-Adresse sowie — sofern angegeben — Ihren Namen und Ihre Stadt, um Ihnen die angeforderten E-Mails zu senden. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.",
      "Die Verarbeitung erfolgt über Las Aguas Productions als Auftragsverarbeiter. Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie uns unter shimmerdownstudio@gmail.com schreiben.",
    ],
  },
  {
    heading: "Videos (YouTube)",
    lines: [
      "Videos auf dieser Website werden erst geladen, wenn Sie aktiv auf den Abspielen-Knopf klicken. Vorher wird keine Verbindung zu YouTube hergestellt, die Cookies setzt. Nach dem Klick gelten die Datenschutzbestimmungen von Google Ireland Limited.",
    ],
  },
  {
    heading: "Shop",
    lines: [
      "Bestellungen im Shop werden über Las Aguas Productions und Stripe abgewickelt. Zahlungs-, E-Mail- und Lieferdaten werden dort erhoben; wir speichern keine Zahlungsdaten auf dieser Website.",
    ],
  },
  {
    heading: "Reichweitenmessung",
    lines: [
      "Diese Website nutzt eine selbst betriebene, datensparsame Analyse (eine Supabase Edge Function auf Servern in der EU), um Seitenaufrufe, Klicks auf Links und Käufe im Shop auszuwerten. Es werden keine Cookies oder Skripte von Drittanbietern eingebunden und keine Daten an Werbenetzwerke weitergegeben.",
      "Ohne Einwilligung erfasst: die aufgerufene Seite, geklickte Links, die grobe Herkunft (Land/Stadt, aus der IP-Adresse abgeleitet — die IP-Adresse selbst wird dabei nicht gespeichert), Gerätetyp und Browser (aus dem User-Agent abgeleitet, die vollständige Zeichenfolge wird nicht gespeichert) sowie UTM-Parameter aus der Aufruf-URL. Rechtsgrundlage ist unser berechtigtes Interesse an der Reichweitenmessung, Art. 6 Abs. 1 lit. f DSGVO.",
      "Nur mit Ihrer Einwilligung über den Cookie-Hinweis erfasst: wiederkehrende Besuche, Scrolltiefe und Verweildauer auf der Seite. Rechtsgrundlage ist Ihre Einwilligung, Art. 6 Abs. 1 lit. a DSGVO. Sie können diese jederzeit widerrufen, indem Sie die entsprechenden Cookies in Ihrem Browser löschen.",
      "Die Verarbeitung erfolgt über Las Aguas Productions als Auftragsverarbeiter.",
    ],
  },
  {
    heading: "Ihre Rechte",
    lines: [
      "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dafür an shimmerdownstudio@gmail.com. Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.",
    ],
  },
];

function Block({ heading, lines }) {
  return (
    <section className={s.block}>
      <h3 className={s.blockHead}>{heading}</h3>
      {lines.map((line, i) => (
        <p key={i} className={s.line}>
          {line}
        </p>
      ))}
    </section>
  );
}

export default function Impressum() {
  return (
    <Layout {...META} path="/impressum" field="legal">
      <div className={s.page}>
        <div className="shell">
          <div className="sectionHead">
            <h2>Impressum</h2>
          </div>

          <div className={s.cols}>
            {IMPRESSUM.map((block) => (
              <Block key={block.heading} {...block} />
            ))}
          </div>

          <div className={s.sectionGap}>
            <div className="sectionHead">
              <h2>Datenschutz</h2>
            </div>
            <div className={s.cols}>
              {PRIVACY.map((block) => (
                <Block key={block.heading} {...block} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
