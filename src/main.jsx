import { createRoot } from "react-dom/client";
import { useMemo, useState } from "react";
import { competitors, checklist, offers, outreachTargets, software, studio } from "./data";
import "./styles.css";

const navItems = [
  ["overview", "Overview", "▦"],
  ["outreach", "Outreach", "↗"],
  ["competitors", "Competitors", "◒"],
  ["offers", "Offers", "✦"],
  ["operations", "Operations", "▤"],
];

function Arrow({ diagonal = false }) {
  return <span className={diagonal ? "arrow diagonal" : "arrow"} aria-hidden="true">→</span>;
}

function Mark() {
  return (
    <div className="mark" aria-hidden="true">
      <span className="mark-orbit orbit-one" />
      <span className="mark-orbit orbit-two" />
      <span className="mark-needle" />
      <span className="mark-dot" />
    </div>
  );
}

function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <Mark />
        <div className="brand-name">Fired Arts</div>
        <div className="brand-subtitle">Regional Growth HQ</div>
      </div>

      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map(([id, label, icon]) => (
          <button key={id} className={`nav-item ${active === id ? "active" : ""}`} onClick={() => setActive(id)}>
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
            {active === id && <span className="nav-active-line" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-spacer" />
      <div className="location-sketch" aria-hidden="true">
        <div className="indiana-outline">♧</div>
        <div className="location-dot" />
        <div className="location-text">Kokomo, Indiana</div>
        <div className="location-motto">Calm. Creative.<br />All ways welcome.</div>
      </div>
      <div className="bowl-sketch" aria-hidden="true"><span /><span /><span /></div>
    </aside>
  );
}

function TopBar({ active, onBuild }) {
  const title = navItems.find(([id]) => id === active)?.[1] || "Overview";
  return (
    <header className="topbar">
      <div className="breadcrumb"><span>Fired Arts</span><span className="slash">/</span><strong>{title}</strong></div>
      <div className="topbar-actions">
        <span className="date-stamp">Research system · 12 Aug 2026</span>
        <button className="primary-button" onClick={onBuild}>Build an offer <Arrow /></button>
      </div>
    </header>
  );
}

function SectionTitle({ eyebrow, title, text, action, onAction }) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action && <button className="text-button" onClick={onAction}>{action} <Arrow /></button>}
    </div>
  );
}

function MetricStrip() {
  const metrics = [
    ["Outreach targets", studio.stats.outreach, "Across the working database", "blue"],
    ["PYOP radius", `${studio.stats.radius}`, "Studios / locations tracked", "red"],
    ["Ready to approach", studio.stats.ready, "Contact paths verified", "green"],
    ["Pickup loop", "1 wk", "Ready · held 60 days", "yellow"],
  ];
  return (
    <div className="metric-strip">
      {metrics.map(([label, value, note, tone]) => (
        <div className="metric" key={label}>
          <div className={`metric-icon ${tone}`}><span /></div>
          <div className="metric-label">{label}</div>
          <div className="metric-value">{value}</div>
          <div className="metric-note">{note}</div>
        </div>
      ))}
    </div>
  );
}

function RangeTabs({ range, setRange }) {
  return (
    <div className="range-tabs" role="tablist" aria-label="Planning horizon">
      {["Now", "30 days", "Regional"].map((item) => (
        <button key={item} role="tab" aria-selected={range === item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>
      ))}
    </div>
  );
}

function OfferRows({ onSelect }) {
  return (
    <div className="offer-rows">
      {offers.slice(0, 4).map((offer) => (
        <button className="offer-row" key={offer.id} onClick={() => onSelect(offer)}>
          <span className={`offer-swatch ${offer.accent}`}><span /></span>
          <span className="offer-row-copy"><strong>{offer.title}</strong><small>{offer.category}</small></span>
          <Arrow />
        </button>
      ))}
    </div>
  );
}

function OutreachMini({ onOpen }) {
  return (
    <div className="mini-table">
      <div className="mini-table-head"><span>Organization</span><span>Offer lane</span><span>Status</span></div>
      {outreachTargets.slice(0, 4).map((row) => (
        <button className="mini-row" key={row.name} onClick={() => onOpen(row)}>
          <span><strong>{row.name}</strong><small>{row.place}</small></span>
          <span>{row.offer}</span>
          <span className={row.status === "Ready to approach" ? "status ready" : "status verify"}>{row.status}<Arrow /></span>
        </button>
      ))}
      <button className="table-footer" onClick={() => onOpen({ segment: "all" })}>View all outreach targets <Arrow /></button>
    </div>
  );
}

function RadiusMap() {
  return (
    <div className="radius-map">
      <div className="map-paper">
        <span className="map-road road-one" /><span className="map-road road-two" /><span className="map-road road-three" />
        <span className="map-circle circle-one" /><span className="map-circle circle-two" /><span className="map-circle circle-three" />
        <span className="map-center"><i />Kokomo, IN</span>
        <span className="map-label l10">10</span><span className="map-label l20">20</span><span className="map-label l30">30</span><span className="map-label l40">40</span>
      </div>
      <div className="radius-scale"><span>40</span><small>MI</small></div>
    </div>
  );
}

function Timeline() {
  const steps = [
    ["Verify contacts", "This week", "blue"],
    ["Pilot mobile kits", "Next 2 weeks", "red"],
    ["Launch pickup coupon", "Next 30 days", "green"],
    ["Choose booking stack", "Next 30 days", "yellow"],
  ];
  return (
    <div className="timeline">
      <div className="timeline-line" />
      {steps.map(([label, time, tone], index) => (
        <div className="timeline-step" key={label}>
          <span className={`timeline-dot ${tone}`} />
          <span className="step-number">0{index + 1}</span>
          <strong>{label}</strong>
          <small>▣ &nbsp;{time}</small>
        </div>
      ))}
      <Arrow />
    </div>
  );
}

function Overview({ range, setRange, onBuild, onOffer, onTarget, setActive }) {
  const rangeCopy = {
    Now: ["This week: turn research into first conversations.", "Prioritize verification, pickup retention, and the first mobile kit."],
    "30 days": ["30 days: make the system repeatable.", "Package the offers, publish the booking path, and test one regional partner."],
    Regional: ["Regional: make the drive worth it.", "Use all-inclusive pricing, downtown partnerships, and destination programming to pull from the radius."],
  };
  return (
    <>
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="hero-rule" />
          <h1>{rangeCopy[range][0]}</h1>
          <p>{rangeCopy[range][1]}</p>
          <RangeTabs range={range} setRange={setRange} />
        </div>
        <button className="featured-offer" onClick={() => onOffer(offers[0])}>
          <img src="/glaze-still-life.png" alt="Cobalt glaze and terracotta pottery on handmade paper" />
          <span className="featured-overlay" />
          <span className="featured-copy"><strong>Fired Arts<br />To Go</strong><small>Remove the distance barrier <Arrow /></small></span>
          <span className="featured-mark">↗</span>
        </button>
      </section>

      <MetricStrip />

      <section className="split-grid">
        <div className="panel outreach-panel">
          <SectionTitle eyebrow="Outreach targets" title="Start with the planners." action="Open outreach" onAction={() => setActive("outreach")} />
          <OutreachMini onOpen={onTarget} />
        </div>
        <div className="panel radius-panel">
          <SectionTitle eyebrow="PYOP radius" title="Make the drive worth it." />
          <RadiusMap />
          <div className="radius-note"><strong>15 studios or locations tracked</strong><span>40-mile outreach core · 50-mile PYOP scan</span></div>
        </div>
        <div className="panel offers-panel">
          <SectionTitle eyebrow="Offer lanes" title="Build the next reason to visit." action="See all offers" onAction={() => setActive("offers")} />
          <OfferRows onSelect={onOffer} />
        </div>
      </section>

      <section className="bottom-band">
        <div className="competitor-line">
          <div className="band-heading"><span>Competitive landscape</span><button onClick={() => setActive("competitors")}>View notes <Arrow /></button></div>
          <div className="competitor-words">{competitors.slice(0, 4).map((item) => <span key={item.name}>{item.name}</span>)}</div>
        </div>
        <Timeline />
      </section>
    </>
  );
}

function SearchBar({ value, onChange, placeholder = "Search the working set" }) {
  return <label className="search-bar"><span>⌕</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><kbd>/</kbd></label>;
}

function FilterBar({ options, value, onChange }) {
  return <div className="filter-bar">{options.map((option) => <button className={value === option ? "active" : ""} key={option} onClick={() => onChange(option)}>{option}</button>)}</div>;
}

function OutreachView({ onTarget }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Ready to approach", "Verify first", "New lead", "New segment"];
  const filtered = outreachTargets.filter((item) => (filter === "All" || item.status === filter) && `${item.name} ${item.segment} ${item.place} ${item.offer}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="view-content">
      <SectionTitle eyebrow="Regional contact database" title="Target the planners before they book the default." text="A 40-mile outreach system for schools, daycares, homeschool groups, scouts, churches, chambers, senior activities, and regional team-building buyers." />
      <div className="view-toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search organizations, segments, offers" /><FilterBar options={filters} value={filter} onChange={setFilter} /></div>
      <div className="data-table outreach-table">
        <div className="data-head"><span>Organization</span><span>Segment</span><span>Place</span><span>First offer</span><span>Status</span></div>
        {filtered.map((row) => <button className="data-row" key={row.name} onClick={() => onTarget(row)}><span><strong>{row.name}</strong><small>Priority {row.priority}/5</small></span><span>{row.segment}</span><span>{row.place}</span><span>{row.offer}</span><span className={`status ${row.status.includes("Ready") ? "ready" : row.status.includes("Verify") ? "verify" : "new"}`}>{row.status}<Arrow /></span></button>)}
      </div>
      <div className="view-footer"><span>Showing {filtered.length} working targets · database total {studio.stats.outreach}</span><span>27 rows still need verification</span></div>
    </div>
  );
}

function CompetitorsView() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Direct", "Indirect", "Creative", "Partner", "Regional"];
  const filtered = competitors.filter((item) => filter === "All" || item.level === filter);
  return (
    <div className="view-content">
      <SectionTitle eyebrow="Competitive landscape" title="Win on connection, not competition." text="Track the venues competing for discretionary time, birthday budgets, adult nights, and creative-outing attention." />
      <FilterBar options={filters} value={filter} onChange={setFilter} />
      <div className="competitor-table data-table">
        <div className="data-head"><span>Venue</span><span>Category</span><span>Audience</span><span>They win on</span><span>Fired Arts can own</span></div>
        {filtered.map((item) => <div className="data-row static" key={item.name}><span><strong>{item.name}</strong><small>{item.distance} · {item.level}</small></span><span>{item.type}</span><span>{item.audience}</span><span>{item.strength}</span><span>{item.response}</span></div>)}
      </div>
      <div className="insight-strip"><strong>Monitor three dimensions</strong><span>Birthday price + hassle</span><span>Date-night appeal</span><span>Weather dependency</span></div>
    </div>
  );
}

function OffersView({ onOffer }) {
  return (
    <div className="view-content">
      <SectionTitle eyebrow="Offer architecture" title="Create reasons to return beyond birthdays." text="Every offer is designed to support a different growth lever: distance, daytime capacity, repeat behavior, or partner reach." />
      <div className="offer-library">
        {offers.map((offer) => <button className="offer-card" key={offer.id} onClick={() => onOffer(offer)}><span className={`offer-card-top ${offer.accent}`}><span>{offer.status}</span><Arrow /></span><span className="offer-card-title">{offer.title}</span><span className="offer-card-category">{offer.category}</span><p>{offer.description}</p><span className="offer-card-next"><small>First move</small><strong>{offer.firstStep}</strong></span></button>)}
      </div>
    </div>
  );
}

function OperationsView({ completed, toggleAction }) {
  return (
    <div className="view-content">
      <SectionTitle eyebrow="Operations & systems" title="The promise is only as strong as the handoff." text="Make the one-week pickup, group booking, mobile logistics, and regional growth engine feel effortless behind the scenes." />
      <div className="operations-grid">
        <section className="operation-block baseline-block"><div className="block-heading"><span>Current baseline</span><small>Use in website copy</small></div>{studio.baseline.map(([label, value, note]) => <div className="baseline-row" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</section>
        <section className="operation-block pickup-block"><div className="block-heading"><span>Pickup loop</span><small>Retention opportunity</small></div><div className="pickup-steps"><div><span>01</span><strong>Paint</strong><small>All-inclusive visit</small></div><i /> <div><span>02</span><strong>Fire</strong><small>Ready in one week</small></div><i /> <div><span>03</span><strong>Return</strong><small>Welcome-back offer</small></div></div><button className="ink-button">Draft the coupon <Arrow /></button></section>
        <section className="operation-block stack-block"><div className="block-heading"><span>Booking stack candidates</span><small>Test before committing</small></div>{software.slice(0, 4).map((item) => <div className="stack-row" key={item.name}><span><strong>{item.name}</strong><small>{item.role}</small></span><span className={`fit ${item.fit.toLowerCase().replaceAll(" ", "-")}`}>{item.fit}</span><span className="stack-note">{item.note}</span></div>)}</section>
        <section className="operation-block checklist-block"><div className="block-heading"><span>Readiness checklist</span><small>{Object.values(completed).filter(Boolean).length}/{checklist.length} checked</small></div>{checklist.map((item) => <label className={`check-row ${completed[item.id] ? "done" : ""}`} key={item.id}><input type="checkbox" checked={Boolean(completed[item.id])} onChange={() => toggleAction(item.id)} /><span className="check-box">✓</span><span><strong>{item.label}</strong><small>{item.owner} · {item.detail}</small></span></label>)}</section>
      </div>
    </div>
  );
}

function DetailDrawer({ item, onClose, onBuild }) {
  if (!item) return null;
  const isOffer = Boolean(item.description);
  const isTarget = Boolean(item.segment);
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="detail-drawer" onMouseDown={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close detail">×</button><div className="eyebrow">{isOffer ? item.category : isTarget ? item.segment : "Selected item"}</div><h2>{isOffer ? item.title : item.name}</h2>{isOffer ? <><p className="drawer-lead">{item.description}</p><div className="drawer-meta"><span><small>Audience</small><strong>{item.audience}</strong></span><span><small>Status</small><strong>{item.status}</strong></span></div><div className="drawer-section"><small>First move</small><p>{item.firstStep}</p></div><button className="primary-button full" onClick={onBuild}>Build this offer <Arrow /></button></> : <><p className="drawer-lead">{item.offer || "A working target in the Fired Arts regional growth system."}</p><div className="drawer-meta"><span><small>Place</small><strong>{item.place || "Working set"}</strong></span><span><small>Status</small><strong>{item.status || "Review"}</strong></span></div><div className="drawer-section"><small>Why it matters</small><p>Reach the organizer early with a specific, low-friction first offer instead of a general flyer.</p></div><button className="ink-button full" onClick={onClose}>Mark for follow-up <Arrow /></button></>}</aside></div>;
}

function BuilderModal({ offer, onClose }) {
  const [audience, setAudience] = useState(offer?.audience?.split(",")[0] || "Daycares");
  const [sent, setSent] = useState(false);
  if (!offer) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="builder-modal" role="dialog" aria-modal="true" aria-labelledby="builder-title" onMouseDown={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close offer builder">×</button><div className="eyebrow">Offer builder</div><h2 id="builder-title">{offer.title}</h2><p>{offer.description}</p><label>Primary audience<select value={audience} onChange={(event) => setAudience(event.target.value)}><option>Daycares</option><option>Schools / PTOs</option><option>Homeschool groups</option><option>Churches / seniors</option><option>Adults / young professionals</option><option>Regional corporate</option></select></label><label>First message<textarea defaultValue={`Hi — Fired Arts would love to bring ${offer.title.toLowerCase()} to your group. ${offer.firstStep}.`} /></label><div className="modal-actions">{sent ? <span className="success-note">Saved to your offer queue.</span> : <button className="primary-button" onClick={() => setSent(true)}>Save offer draft <Arrow /></button>}<button className="text-button" onClick={onClose}>Cancel</button></div></div></div>;
}

function App() {
  const [active, setActive] = useState("overview");
  const [range, setRange] = useState("Now");
  const [detail, setDetail] = useState(null);
  const [builder, setBuilder] = useState(null);
  const [completed, setCompleted] = useState({});

  const toggleAction = (id) => setCompleted((current) => ({ ...current, [id]: !current[id] }));
  const openOffer = (offer) => setDetail(offer);
  const buildOffer = (offer = detail || offers[0]) => { setDetail(null); setBuilder(offer); };

  const view = useMemo(() => {
    if (active === "outreach") return <OutreachView onTarget={setDetail} />;
    if (active === "competitors") return <CompetitorsView />;
    if (active === "offers") return <OffersView onOffer={openOffer} />;
    if (active === "operations") return <OperationsView completed={completed} toggleAction={toggleAction} />;
    return <Overview range={range} setRange={setRange} onBuild={() => setBuilder(offers[0])} onOffer={openOffer} onTarget={setDetail} setActive={setActive} />;
  }, [active, completed, range]);

  return <div className="app-shell"><Sidebar active={active} setActive={setActive} /><main className="main-canvas"><TopBar active={active} onBuild={() => setBuilder(offers[0])} />{view}<footer className="app-footer"><span>Fired Arts Studio · Kokomo, Indiana</span><span>Research system built around the 40-mile regional growth plan</span></footer></main><DetailDrawer item={detail} onClose={() => setDetail(null)} onBuild={() => buildOffer(detail)} /><BuilderModal offer={builder} onClose={() => setBuilder(null)} /></div>;
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
