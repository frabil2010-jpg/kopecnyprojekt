// Kopečný projekt — single-page site
const { useState, useEffect, useRef, useMemo } = React;

/* ===================== ICONS ===================== */
const Icon = {
  Arrow: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  Compass: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8l-2.5 5.5L8 16l2.5-5.5L16 8z" />
    </svg>
  ),
  Ruler: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.3 8.7L15.3 2.7a1 1 0 0 0-1.4 0L2.7 13.9a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0L21.3 10.1a1 1 0 0 0 0-1.4z" />
      <path d="M14 7l1.5 1.5M11 10l1.5 1.5M8 13l1.5 1.5M5 16l1.5 1.5" />
    </svg>
  ),
  Stamp: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6l-1 6a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v2H4v-2a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2L9 3z" />
      <path d="M4 21h16" />
    </svg>
  ),
  HardHat: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h18M3 17a9 9 0 0 1 18 0" />
      <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  ),
  FileCheck: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 15l2 2 4-4" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" /></svg>
  ),
  Check: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
};

/* ===================== SHUTTER TEXT ===================== */
function ShutterText({ text, baseDelay = 0, stagger = 0.045 }) {
  return (
    <span className="shutter">
      {text.split("").map((c, i) => {
        const d = baseDelay + i * stagger;
        const style = { "--d": `${d}s` };
        const ch = c === " " ? "\u00A0" : c;
        return (
          <span key={i} className="shutter-char">
            <span className="shutter-base" style={style}>{ch}</span>
            <span className="shutter-slice top" style={style} aria-hidden="true">{ch}</span>
            <span className="shutter-slice mid" style={style} aria-hidden="true">{ch}</span>
            <span className="shutter-slice bot" style={style} aria-hidden="true">{ch}</span>
          </span>
        );
      })}
    </span>
  );
}

/* ===================== HERO ===================== */
function Hero() {
  return (
    <section className="hero" id="home" data-screen-label="00 Hero">
      <div className="hero-logo-wrap">
        <div className="hero-logo-glow" aria-hidden="true"></div>
        <img src="assets/logo-full-white.png" alt="Kopečný projekt" className="hero-logo" />
      </div>

      <div className="hero-meta">
        <div className="hero-services" aria-label="Služby">
          <span className="chip blue"><span className="dot"></span>Projekce</span>
          <span className="chip blue"><span className="dot"></span>Stavební dozory</span>
          <span className="chip yellow"><span className="dot"></span>Inženýring</span>
        </div>
        <div className="hero-tag mono">
          Autorizovaný inženýr<br />pro pozemní stavby
        </div>
      </div>

      <div className="hero-claim-block">
        <p className="hero-claim">
          Komplexní stavební služby od&nbsp;jednoho autorizovaného inženýra — projekt, dozor i&nbsp;povolení pod&nbsp;jednou střechou.
        </p>
        <div className="hero-cta-row">
          <a href="#kontakt" className="btn btn-primary">
            Chci nezávaznou nabídku
            <span className="btn-arrow"><Icon.Arrow /></span>
          </a>
          <a href="#sluzby" className="btn btn-secondary btn-light">
            Prohlédnout služby
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===================== KONTAKT ===================== */
const initialForm = { name: "", email: "", phone: "", gdpr: false, hp: "" };

function Kontakt() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vyplňte prosím své jméno";
    if (!form.email.trim()) e.email = "Vyplňte e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Neplatný formát e-mailu";
    if (!form.phone.trim()) e.phone = "Vyplňte telefon";
    else if (form.phone.replace(/\D/g, "").length < 9) e.phone = "Neplatné telefonní číslo";
    if (!form.gdpr) e.gdpr = "Souhlas je povinný";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (form.hp) return; // honeypot
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSubmitted(true);
    }
  };

  const copyToClipboard = (val, key) => {
    navigator.clipboard?.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <section id="kontakt" className="panel kontakt-section" data-screen-label="02 Kontakt">
      <div className="container">
        <div className="section-num-divider">
          <span className="divider-num">02 · KONTAKT</span>
          <span className="line" aria-hidden="true"></span>
          <span className="divider-num">Po–Pá 8:00–17:00</span>
        </div>

        {/* Header */}
        <div className="kontakt-header reveal">
          <div>
            <span className="kontakt-eyebrow mono">
              <span className="pulse" aria-hidden="true"></span>
              Právě teď přijímám zakázky
            </span>
            <h2 className="h2 kontakt-title">
              Pojďme si o&nbsp;<span className="hl">projektu</span><br />promluvit.
            </h2>
          </div>
          <p className="lead kontakt-lead">
            Tři pole, jeden odhad, žádný spam.<br />
            Ozvu se vám <strong>do&nbsp;24&nbsp;hodin</strong>.
          </p>
        </div>

        {/* Big tap-to-act bubbles */}
        <div className="kontakt-quick">
          <a href="tel:+420773058225" className="quick-bubble reveal slide-l" style={{ "--reveal-delay": "0s" }}>
            <span className="qb-icon"><Icon.Phone size={22} /></span>
            <span className="qb-body">
              <span className="qb-label">Zavolejte rovnou</span>
              <span className="qb-value">+420 773 058 225</span>
            </span>
            <span className="qb-arrow"><Icon.Arrow /></span>
            <button
              type="button"
              className="qb-copy"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard("+420773058225", "tel"); }}
              title="Kopírovat"
              aria-label="Kopírovat telefon"
            >
              {copied === "tel" ? "✓" : "⧉"}
            </button>
          </a>
          <a href="mailto:info@kopecnyprojekt.cz" className="quick-bubble reveal slide-r" style={{ "--reveal-delay": "0.08s" }}>
            <span className="qb-icon"><Icon.Mail size={22} /></span>
            <span className="qb-body">
              <span className="qb-label">Napište e-mail</span>
              <span className="qb-value">info@kopecnyprojekt.cz</span>
            </span>
            <span className="qb-arrow"><Icon.Arrow /></span>
            <button
              type="button"
              className="qb-copy"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard("info@kopecnyprojekt.cz", "email"); }}
              title="Kopírovat"
              aria-label="Kopírovat e-mail"
            >
              {copied === "email" ? "✓" : "⧉"}
            </button>
          </a>
        </div>

        <div className="kontakt-or" aria-hidden="true">
          <span className="line"></span>
          <span className="or-text mono">nebo odešlete poptávku</span>
          <span className="line"></span>
        </div>

        {/* FORM */}
        <div className="kontakt-form-wrap reveal" style={{ "--reveal-delay": "0.15s" }}>
          <div className="form-card-v2">
            {!submitted ? (
              <form onSubmit={submit} noValidate className="form-grid-v2">
                <div className="form-card-v2-head">
                  <div>
                    <div className="form-title">Nezávazná poptávka</div>
                    <div className="form-sub">Stačí tři pole. Odpovím vám do&nbsp;24&nbsp;hodin.</div>
                  </div>
                  <div className="form-step mono">
                    <span className="step-dot active"></span>
                    <span className="step-dot"></span>
                    <span>Krok&nbsp;1&nbsp;/&nbsp;2</span>
                  </div>
                </div>

                <div className="form-fields">
                  <Field
                    id="name" label="Jméno a příjmení"
                    value={form.name} error={errors.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    autoComplete="name"
                  />
                  <Field
                    id="email" label="E-mail" type="email"
                    value={form.email} error={errors.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    autoComplete="email"
                  />
                  <Field
                    id="phone" label="Telefon" type="tel"
                    value={form.phone} error={errors.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    autoComplete="tel"
                  />
                </div>

                {/* honeypot */}
                <input
                  className="honeypot" tabIndex="-1" autoComplete="off" aria-hidden="true"
                  name="website" value={form.hp}
                  onChange={(e) => setForm({ ...form, hp: e.target.value })}
                />

                <label className="gdpr">
                  <input
                    type="checkbox" checked={form.gdpr}
                    onChange={(e) => setForm({ ...form, gdpr: e.target.checked })}
                  />
                  <span className="box"><Icon.Check size={12} /></span>
                  <span>
                    Souhlasím se&nbsp;zpracováním osobních údajů pro&nbsp;účely vyřízení poptávky dle&nbsp;<a href="#">zásad GDPR</a>.
                  </span>
                </label>
                {errors.gdpr && <span className="err-msg mono">{errors.gdpr}</span>}

                <button type="submit" className="btn btn-primary form-submit-v2">
                  Odeslat poptávku
                  <span className="btn-arrow"><Icon.Arrow /></span>
                </button>
              </form>
            ) : (
              <div className="form-success-v2">
                <div className="success-icon">
                  <Icon.Check size={28} />
                </div>
                <div className="success-title">Děkuji, poptávka dorazila.</div>
                <div className="success-sub">Ozvu se vám telefonicky nebo e-mailem do&nbsp;24&nbsp;hodin, obvykle dříve.</div>
                <button onClick={() => { setForm(initialForm); setSubmitted(false); }} className="btn btn-secondary btn-light" style={{ marginTop: "1.5rem" }}>
                  Odeslat další
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Business meta strip */}
        <div className="kontakt-meta">
          <MetaItem label="Sídlo">Brněnská 602, 664 82&nbsp;Říčany u&nbsp;Brna</MetaItem>
          <MetaItem label="IČO" copyable value="03519392" onCopy={() => copyToClipboard("03519392", "ico")} copied={copied === "ico"}>03519392</MetaItem>
          <MetaItem label="DIČ">CZ7908183866</MetaItem>
          <MetaItem label="Provozní doba">Po–Pá 8:00–17:00 · po&nbsp;domluvě i&nbsp;mimo</MetaItem>
          <MetaItem label="Působnost">Brno a&nbsp;Jihomoravský kraj · ČR po&nbsp;domluvě</MetaItem>
        </div>
      </div>
    </section>
  );
}

function MetaItem({ label, children, copyable, onCopy, copied, value }) {
  return (
    <div className={"meta-item" + (copyable ? " is-copyable" : "")} onClick={copyable ? onCopy : undefined} role={copyable ? "button" : undefined} tabIndex={copyable ? 0 : undefined}>
      <span className="meta-label mono">{label}</span>
      <span className="meta-value">{children}</span>
      {copyable && <span className="meta-copy mono">{copied ? "✓ zkopírováno" : "klikněte pro kopírování"}</span>}
    </div>
  );
}

function InfoRow({ label, value, muted, href, copy, onCopy, copyKey, copied }) {
  return (
    <div className="info-row">
      <span className="label">{label}</span>
      {href
        ? <a href={href} className="value">{value}{muted && <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 8, fontSize: "0.85em" }}>· {muted}</span>}</a>
        : <span className="value">{value}{muted && <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 8, fontSize: "0.85em" }}>· {muted}</span>}</span>}
      {copy
        ? <button type="button" className="copy" onClick={() => onCopy(value, copyKey)}>
            {copied === copyKey ? "Zkopírováno" : "Kopírovat"}
          </button>
        : <span></span>}
    </div>
  );
}

function Field({ id, label, value, onChange, error, type = "text", autoComplete }) {
  return (
    <div className={"field" + (error ? " error" : "")}>
      <input
        id={id} type={type} value={value} placeholder=" "
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
      <label htmlFor={id}>{label}</label>
      {error && <span className="err-msg">{error}</span>}
    </div>
  );
}

/* ===================== SLUŽBY ===================== */
const services = [
  {
    num: "01",
    icon: <Icon.Compass />,
    title: "Projekce",
    desc: "Kompletní projektová dokumentace pro všechny stupně — od studie přes DSP po prováděcí dokumentaci a dokumentaci skutečného provedení.",
    items: ["Architektonická studie", "Dokumentace pro stavební povolení (DSP)", "Prováděcí dokumentace (DPS)", "Dokumentace skutečného provedení"],
  },
  {
    num: "02",
    icon: <Icon.HardHat />,
    title: "Stavební dozory",
    desc: "Technický dozor investora — kontrola kvality, soulad s projektem, hlídání termínů a rozpočtu. Vaše oči a uši na stavbě.",
    items: ["Technický dozor investora (TDI)", "Kontrolní dny a zápisy", "Kontrola fakturace a soupisu prací", "Reklamace a vady"],
  },
  {
    num: "03",
    icon: <Icon.Stamp />,
    title: "Inženýring",
    desc: "Vyřízení stavebního povolení od&nbsp;A do&nbsp;Z — jednání s úřady, zajištění vyjádření dotčených orgánů, koordinace celého procesu.",
    items: ["Územní řízení a souhlasy", "Stavební povolení", "Koordinace dotčených orgánů", "Kolaudační řízení"],
  },
];

function Sluzby() {
  return (
    <section id="sluzby" className="panel" data-screen-label="03 Služby">
      <div className="container">
        <div className="section-num-divider">
          <span className="divider-num">03 · SLUŽBY</span>
          <span className="line" aria-hidden="true"></span>
          <span className="divider-num">3 obory pod jednou střechou</span>
        </div>
        <div className="section-head reveal">
          <div>
            <h2 className="h2">Co&nbsp;pro&nbsp;vás<br />udělám.</h2>
          </div>
          <div className="head-meta" style={{ maxWidth: "32ch" }}>
            <p className="lead" style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", textTransform: "none", letterSpacing: 0 }}>
              Všechny tři obory zvládnu sám — bez prostředníků, s jasnou zodpovědností.
            </p>
          </div>
        </div>

        <div className="sluzby-grid">
          {services.map((s, i) => (
            <div key={s.num} className={"card lift service-card reveal " + (i === 0 ? "slide-l " : i === 2 ? "slide-r " : "") + (i === 1 ? "v-accent" : "")} style={{ "--reveal-delay": `${i * 0.1}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="svc-icon">{s.icon}</div>
                <span className="svc-num">{s.num}</span>
              </div>
              <div>
                <h3 className="h3">{s.title}</h3>
                <p className="svc-desc" style={{ marginTop: "0.75rem" }} dangerouslySetInnerHTML={{ __html: s.desc }} />
              </div>
              <ul className="svc-list">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="sluzby-cta reveal">
          <div>
            <h3>Pro&nbsp;vypracování cenové nabídky mě&nbsp;kontaktujte.</h3>
            <p className="sub">Každá zakázka je jiná. Nabídku připravím individuálně po&nbsp;krátkém telefonátu.</p>
          </div>
          <a href="#kontakt" className="btn btn-primary">
            Nezávazná poptávka
            <span className="btn-arrow"><Icon.Arrow /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===================== REALIZACE ===================== */
const realizace = [
  { cls: "r-43-l", title: "Rodinný dům", type: "DSP + DPS", loc: "Bílovice nad Svitavou", year: "2024", ratio: "4:3" },
  { cls: "r-34",   title: "Rekonstrukce vily", type: "Inženýring", loc: "Brno-Žabovřesky", year: "2024", ratio: "3:4" },
  { cls: "r-sm",   title: "Bytový dům", type: "TDI", loc: "Brno-Líšeň", year: "2023", ratio: "4:3" },
  { cls: "r-sm",   title: "Průmyslová hala", type: "DSP", loc: "Modřice", year: "2023", ratio: "16:9" },
  { cls: "r-wide", title: "Obecní úřad — přístavba", type: "Projekce + inženýring", loc: "Říčany u Brna", year: "2023", ratio: "16:9" },
  { cls: "r-tall", title: "Pasivní rodinný dům", type: "DPS", loc: "Šlapanice", year: "2022", ratio: "3:4" },
  { cls: "r-43",   title: "Rekonstrukce statku", type: "DSP", loc: "Tišnov", year: "2022", ratio: "4:3" },
];

function Realizace({ onOpen }) {
  return (
    <section id="realizace" className="panel" data-screen-label="04 Realizace">
      <div className="container">
        <div className="section-num-divider">
          <span className="divider-num">04 · REALIZACE</span>
          <span className="line" aria-hidden="true"></span>
          <span className="divider-num">Výběr z&nbsp;práce 2022–2024</span>
        </div>
        <div className="section-head reveal">
          <div>
            <h2 className="h2">Vybrané<br />realizace.</h2>
          </div>
          <div className="head-meta" style={{ maxWidth: "34ch" }}>
            <p className="lead" style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", textTransform: "none", letterSpacing: 0 }}>
              Rodinné domy, rekonstrukce, bytové, průmyslové i&nbsp;občanské stavby. Klikněte na&nbsp;projekt pro&nbsp;detail.
            </p>
          </div>
        </div>

        <div className="realizace-grid">
          {realizace.map((r, i) => (
            <div
              key={i}
              className={"realizace-cell reveal " + (i % 2 === 0 ? "slide-l " : "slide-r ") + r.cls}
              style={{ "--reveal-delay": `${i * 0.06}s` }}
              onClick={() => onOpen(r)}
              role="button" tabIndex="0"
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(r)}
            >
              <div className="img" aria-hidden="true"></div>
              <span className="placeholder-label">{r.ratio} · foto klienta</span>
              <div className="meta">
                <div>
                  <div className="title">{r.title}</div>
                  <div className="loc">{r.type} · {r.loc}</div>
                </div>
                <span className="year">{r.year}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mono reveal" style={{ marginTop: "2rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textAlign: "center" }}>
          Galerie se průběžně doplňuje · Reálné fotografie dodá klient
        </p>
      </div>
    </section>
  );
}

/* ===================== HODNOCENÍ ===================== */
const recenze = [
  { text: "Jan připravil projekt našeho rodinného domu a&nbsp;dovedl nás celou cestou až k&nbsp;povolení. Vždy dostupný, vždy s&nbsp;jasným vysvětlením. Vřele doporučuji.", name: "Petr K.", loc: "Bílovice nad Svitavou", initials: "PK", muted: true },
  { text: "Stavební dozor nad&nbsp;naší rekonstrukcí byl perfektní. Odhalil několik problémů, které by&nbsp;nás přišly draho, a&nbsp;ušetřil nám statisíce.", name: "Lenka N.", loc: "Brno-Žabovřesky", initials: "LN" },
  { text: "Inženýring pro&nbsp;halu jsme řešili poprvé. Jan vyřídil úplně všechno — od&nbsp;hasičů po&nbsp;kolaudaci. Můžu se&nbsp;věnovat svému byznysu.", name: "Tomáš H.", loc: "Modřice", initials: "TH" },
  { text: "Komunikace na&nbsp;jedničku, projekt přesně podle&nbsp;našich představ. Doporučujeme i&nbsp;dál v&nbsp;rodině.", name: "Markéta D.", loc: "Šlapanice", initials: "MD" },
];

function Hodnoceni() {
  return (
    <section id="hodnoceni" className="panel" data-screen-label="05 Hodnocení">
      <div className="container">
        <div className="section-num-divider">
          <span className="divider-num">05 · HODNOCENÍ</span>
          <span className="line" aria-hidden="true"></span>
          <span className="divider-num">Slova klientů</span>
        </div>
        <div className="section-head reveal">
          <div>
            <h2 className="h2">Co&nbsp;o&nbsp;mé práci<br />říkají klienti.</h2>
          </div>
          <div className="head-meta" style={{ display: "flex", alignItems: "flex-end" }}>
            <div className="recenze-summary" style={{ width: 220 }}>
              <span className="big">4,9</span>
              <span style={{ display: "inline-flex", gap: 3, color: "var(--text)" }}>
                {[0,1,2,3,4].map(i => <span key={i} style={{ width: 14, height: 14, display: "inline-flex" }}><Icon.Star /></span>)}
              </span>
              <span className="small">průměrné hodnocení · 23 recenzí</span>
            </div>
          </div>
        </div>

        <div className="recenze-wrap">
          <div className="recenze-col">
            <ReviewCard r={recenze[0]} index={0} />
            <ReviewCard r={recenze[2]} index={2} />
          </div>
          <div className="recenze-col offset">
            <ReviewCard r={recenze[1]} index={1} />
            <ReviewCard r={recenze[3]} index={3} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ r, index }) {
  return (
    <div className={"card lift recenze-card reveal " + (index % 2 === 0 ? "slide-l " : "slide-r ") + (r.muted ? " muted" : "")} style={{ "--reveal-delay": `${index * 0.08}s` }}>
      <div className="stars" aria-label="5 z 5 hvězd">
        {[0,1,2,3,4].map(i => <Icon.Star key={i} />)}
      </div>
      <p className="quote" dangerouslySetInnerHTML={{ __html: "„" + r.text + "“" }} />
      <div className="meta">
        <div className="avatar">{r.initials}</div>
        <div>
          <div className="name">{r.name}</div>
          <div className="loc">{r.loc}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== FOOTER ===================== */
function Footer() {
  return (
    <footer data-screen-label="Patička">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-block">
              <span className="footer-mark"><img src="assets/logo-icon.png" alt="" /></span>
              <span className="footer-est"><span className="dot"></span>Est. 2014 · Brno</span>
            </div>
            <h2 className="footer-brand-lg">Kopečný<br />projekt<span className="dot-accent">.</span></h2>
            <p className="footer-claim">Projekce · Stavební dozory · Inženýring pod&nbsp;jednou střechou. Brno a&nbsp;okolí, případně celá ČR.</p>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul className="footer-list">
              <li><a href="tel:+420773058225">+420 773 058 225</a></li>
              <li><a href="mailto:info@kopecnyprojekt.cz">info@kopecnyprojekt.cz</a></li>
              <li style={{ color: "rgba(255,255,255,0.55)" }}>Brněnská 602<br />664 82 Říčany u Brna</li>
            </ul>
          </div>
          <div>
            <h4>Navigace</h4>
            <ul className="footer-list">
              <li><a href="#kontakt">02 — Kontakt</a></li>
              <li><a href="#sluzby">03 — Služby</a></li>
              <li><a href="#realizace">04 — Realizace</a></li>
              <li><a href="#hodnoceni">05 — Hodnocení</a></li>
              <li style={{ marginTop: "0.5rem" }}><a href="#" style={{ color: "rgba(255,255,255,0.55)" }}>GDPR · Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <span>© 2026 Ing. Jan Kopečný · IČO: 03519392 · DIČ: CZ7908183866 · Brněnská 602, 664 82 Říčany u Brna</span>
          <span>Orgán dozoru: Česká obchodní inspekce (www.coi.cz)</span>
        </div>
      </div>
    </footer>
  );
}

/* ===================== NAV ===================== */
const navItems = [
  { href: "#kontakt", num: "02", label: "Kontakt" },
  { href: "#sluzby", num: "03", label: "Služby" },
  { href: "#realizace", num: "04", label: "Realizace" },
  { href: "#hodnoceni", num: "05", label: "Hodnocení" },
];

function Nav() {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const ids = ["home", "kontakt", "sluzby", "realizace", "hodnoceni"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTop = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="nav-shell">
        <a href="#home" className="brand brand-logo-only" onClick={scrollTop} aria-label="Kopečný projekt — domů">
          <span className="brand-mark">
            <img src="assets/logo-icon.png" alt="Kopečný projekt" />
          </span>
        </a>
        <nav className="nav" aria-label="Hlavní">
          {navItems.map((n) => (
            <a
              key={n.href} href={n.href}
              className={active === n.href.slice(1) ? "is-active" : ""}
            >
              <span className="nav-num">{n.num}</span>
              <span>{n.label}</span>
            </a>
          ))}
          <a href="#kontakt" className="nav-cta">
            Poptat <Icon.Arrow size={14} />
          </a>
        </nav>
        <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="bars"><span></span><span></span></span>
          Menu
        </button>
      </div>
      <div className={"mobile-menu" + (mobileOpen ? " open" : "")}>
        {navItems.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)}>
            {n.label}
            <span className="nav-num">{n.num}</span>
          </a>
        ))}
      </div>
    </>
  );
}

/* ===================== APP ===================== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FACC15",
  "primary": "#1B3A6B",
  "heroHeavy": false,
  "showGlow": true,
  "denseLayout": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [lightbox, setLightbox] = useState(null);
  const [toast, setToast] = useState("");

  // Apply tweak values to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--primary", t.primary);
  }, [t.accent, t.primary]);

  // Hero heavy variant
  useEffect(() => {
    document.body.classList.toggle("hero-heavy", !!t.heroHeavy);
    document.body.classList.toggle("no-glow", !t.showGlow);
    document.body.classList.toggle("dense", !!t.denseLayout);
  }, [t.heroHeavy, t.showGlow, t.denseLayout]);

  // Scroll reveal — additive (defaults to visible; JS adds .pre to hide pre-paint)
  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    // Mark all as pre-hidden first
    reveals.forEach((el) => el.classList.add("pre"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("pre");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => obs.observe(el));
    // Safety: clear any still-pre after 3s (e.g., observer didn't fire)
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal.pre").forEach((el) => el.classList.remove("pre"));
    }, 3000);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);

  // Toast on clipboard
  useEffect(() => {
    const handler = (ev) => {
      if (ev.target.classList?.contains("copy")) {
        setToast("Zkopírováno do schránky");
        setTimeout(() => setToast(""), 1800);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Kontakt />
        <Sluzby />
        <Realizace onOpen={setLightbox} />
        <Hodnoceni />
      </main>
      <Footer />
      {/* Lightbox */}
      <div className={"lightbox" + (lightbox ? " open" : "")} onClick={() => setLightbox(null)}>
        {lightbox && (
          <div className="lb-content" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setLightbox(null)}><Icon.Close /></button>
            <div className="lb-img">
              <span style={{ position: "absolute", top: "1rem", left: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--primary)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", padding: "0.35rem 0.6rem", borderRadius: "9999px" }}>
                Reálnou fotografii dodá klient
              </span>
            </div>
            <div className="lb-info">
              <span className="lb-meta">{lightbox.type} · {lightbox.year}</span>
              <span className="lb-title">{lightbox.title}</span>
              <span style={{ color: "var(--muted)" }}>{lightbox.loc} · {lightbox.ratio}</span>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={"toast" + (toast ? " show" : "")}>
        <span className="check"><Icon.Check size={12} /></span>
        {toast}
      </div>

      {/* Tweaks panel */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="Brand colors">
          <window.TweakColor
            label="Accent"
            value={t.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#FACC15", "#F97316", "#10B981", "#6366F1"]}
          />
          <window.TweakColor
            label="Primary"
            value={t.primary}
            onChange={(v) => setTweak("primary", v)}
            options={["#1B3A6B", "#0F172A", "#1F2937", "#7C2D12"]}
          />
        </window.TweakSection>
        <window.TweakSection title="Layout">
          <window.TweakToggle
            label="Hero radial glow"
            value={t.showGlow}
            onChange={(v) => setTweak("showGlow", v)}
          />
          <window.TweakToggle
            label="Compact density"
            value={t.denseLayout}
            onChange={(v) => setTweak("denseLayout", v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
