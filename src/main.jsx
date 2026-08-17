import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useState } from "react";
import { assetLibrary, competitors, contentTemplates, checklist, offers, outreachTargets, platformGuidance, seedCampaigns, seedConversations, software, studio } from "./data";
import { copyToClipboard, exportWorkspaceFile, readStoredValue, writeStoredValue } from "./storage";
import "./styles.css";

const navItems = [
  ["overview", "Dashboard", "⌂"],
  ["campaigns", "Campaigns", "▣"],
  ["social", "Social Studio", "⌁"],
  ["calendar", "Content Calendar", "□"],
  ["conversations", "Conversations", "◌"],
  ["contacts", "Contacts", "♧"],
  ["competitors", "Competitors", "◒"],
  ["offers", "Offers", "✦"],
  ["operations", "Operations", "▤"],
  ["assets", "Assets", "▧"],
  ["templates", "Templates", "◇"],
  ["approvals", "Approvals", "✓"],
  ["reports", "Reports", "◫"],
  ["settings", "Settings", "⚙"],
];

const navGroups = [
  { label: "Growth engine", ids: ["overview", "campaigns", "social", "calendar"] },
  { label: "Relationships", ids: ["conversations", "contacts"] },
  { label: "Strategy", ids: ["competitors", "offers", "operations"] },
  { label: "Library", ids: ["assets", "templates", "approvals", "reports", "settings"] },
];

const platformIds = Object.keys(platformGuidance);

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStoredValue(key, fallback));
  useEffect(() => writeStoredValue(key, value), [key, value]);
  return [value, setValue];
}

function Arrow({ diagonal = false }) {
  return <span className={diagonal ? "arrow diagonal" : "arrow"} aria-hidden="true">→</span>;
}

function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <img className="brand-lockup" src="/brand/regionalgrowth.png" alt="Fired Arts Studio Regional Growth HQ" />
        <img className="brand-mark-image" src="/brand/fired-arts-mark.png" alt="" aria-hidden="true" />
      </div>

      <nav className="nav-list" aria-label="Main navigation">
        {navGroups.map((group) => <div className="nav-group" key={group.label}>
          <div className="nav-group-label">{group.label}</div>
          {group.ids.map((id) => {
            const [, label, icon] = navItems.find((item) => item[0] === id);
            return <button key={id} className={`nav-item ${active === id ? "active" : ""}`} onClick={() => setActive(id)}>
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
              {active === id && <span className="nav-active-line" />}
            </button>;
          })}
        </div>)}
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
        <button className="primary-button" onClick={onBuild}>New campaign <Arrow /></button>
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
          <SectionTitle eyebrow="Outreach targets" title="Start with the planners." action="Open contacts" onAction={() => setActive("contacts")} />
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

function PlatformTabs({ activePlatform, setActivePlatform }) {
  return <div className="platform-tabs" role="tablist" aria-label="Social platforms">
    <button className="brief-tab" role="tab" aria-selected={activePlatform === "brief"} onClick={() => setActivePlatform("brief")}><span>▣</span>Campaign Brief</button>
    {platformIds.map((id) => <button key={id} className={`platform-tab ${activePlatform === id ? "selected" : ""}`} role="tab" aria-selected={activePlatform === id} onClick={() => setActivePlatform(id)}><span className={`platform-symbol ${id}`}>{platformGuidance[id].icon}</span>{platformGuidance[id].label}</button>)}
  </div>;
}

function CampaignModal({ open, offers: offerOptions, targets, onClose, onSave }) {
  const [offerId, setOfferId] = useState(offerOptions[0]?.id || "");
  const offer = offerOptions.find((item) => item.id === offerId) || offerOptions[0];
  const [title, setTitle] = useState(offer ? `${offer.title} campaign` : "New Fired Arts campaign");
  const [audience, setAudience] = useState(offer?.audience?.split(",")[0] || "Local families");
  const [objective, setObjective] = useState(offer?.description || "Create a clear reason for the right people to visit Fired Arts.");
  const [targetId, setTargetId] = useState("");
  if (!open || !offer) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="builder-modal campaign-modal" role="dialog" aria-modal="true" aria-labelledby="campaign-modal-title" onMouseDown={(event) => event.stopPropagation()}>
    <button className="drawer-close" onClick={onClose} aria-label="Close campaign builder">×</button>
    <div className="eyebrow">Campaign workspace</div><h2 id="campaign-modal-title">Start a campaign</h2>
    <p>Turn one Fired Arts offer into an editable set of platform-ready posts and a partner conversation.</p>
    <label>Campaign title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
    <label>Offer lane<select value={offerId} onChange={(event) => { const nextOffer = offerOptions.find((item) => item.id === event.target.value); setOfferId(event.target.value); setTitle(nextOffer ? `${nextOffer.title} campaign` : title); setAudience(nextOffer?.audience?.split(",")[0] || audience); setObjective(nextOffer?.description || objective); }}>{offerOptions.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label>
    <label>Primary audience<select value={audience} onChange={(event) => setAudience(event.target.value)}><option>Local families</option><option>Schools / PTOs</option><option>Homeschool groups</option><option>Churches / seniors</option><option>Adults / young professionals</option><option>Regional corporate</option><option>Downtown partners</option></select></label>
    <label>Partner tie-in<select value={targetId} onChange={(event) => setTargetId(event.target.value)}><option value="">No partner selected yet</option>{targets.map((target) => <option value={target.id} key={target.id}>{target.name}</option>)}</select></label>
    <label>Objective<textarea value={objective} onChange={(event) => setObjective(event.target.value)} /></label>
    <div className="modal-actions"><button className="primary-button" onClick={() => onSave({ title, audience, objective, offer, targetId })}>Create campaign <Arrow /></button><button className="text-button" onClick={onClose}>Cancel</button></div>
  </div></div>;
}

function CampaignsView({ campaigns, onOpen, onCreate }) {
  return <div className="view-content workspace-view">
    <SectionTitle eyebrow="Marketing workspace" title="Give every good idea a place to go." text="Campaigns turn a Fired Arts offer into a brief, a platform-ready content set, a calendar slot, and a reason to start a local conversation." action="New campaign" onAction={onCreate} />
    <div className="workspace-summary"><div><small>Active campaigns</small><strong>{campaigns.length}</strong></div><div><small>Platform variants</small><strong>{campaigns.length * platformIds.length}</strong></div><div><small>Needs review</small><strong>{campaigns.filter((campaign) => campaign.status === "Review").length}</strong></div><div><small>Local-first workflow</small><strong>Ready</strong></div></div>
    <div className="campaign-list">{campaigns.map((campaign) => <button className="campaign-list-row" key={campaign.id} onClick={() => onOpen(campaign.id)}><span className="campaign-status-dot" /><span><strong>{campaign.title}</strong><small>{campaign.audience} · {campaign.startDate || "No date set"}</small></span><span className="campaign-platforms">{campaign.platformIds.map((id) => <i key={id} className={id}>{platformGuidance[id].icon}</i>)}</span><span className={`status-chip ${campaign.status.toLowerCase()}`}>{campaign.status}</span><Arrow /></button>)}</div>
  </div>;
}

function SocialStudioView({ campaign, assets, onChange, onSave, onExport, onStartConversation, onCreate, onBack }) {
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [copyState, setCopyState] = useState("");
  if (!campaign) return <div className="view-content"><SectionTitle eyebrow="Social Studio" title="Choose a campaign to begin." text="Create a campaign first, then adapt the same idea across Instagram, Facebook, TikTok, and LinkedIn." action="New campaign" onAction={onCreate} /></div>;
  const editingPlatform = activePlatform === "brief" ? "instagram" : activePlatform;
  const variant = campaign.variants[editingPlatform];
  const guidance = platformGuidance[editingPlatform];
  const selectedAsset = assets.find((asset) => variant.assetIds.includes(asset.id)) || assets[0];
  const target = outreachTargets.find((item) => campaign.targetIds?.includes(item.id)) || outreachTargets[0];
  const updateVariant = (field, value) => onChange({ ...campaign, variants: { ...campaign.variants, [editingPlatform]: { ...variant, [field]: value } } });
  const toggleAsset = (assetId) => updateVariant("assetIds", variant.assetIds.includes(assetId) ? variant.assetIds.filter((id) => id !== assetId) : [...variant.assetIds, assetId]);
  const toggleReview = () => { const nextStatus = campaign.status === "Review" ? "Draft" : "Review"; onChange({ ...campaign, status: nextStatus, variants: Object.fromEntries(platformIds.map((id) => [id, { ...campaign.variants[id], status: nextStatus }])) }); };
  const copyPost = async () => { const copied = await copyToClipboard(`${variant.hook}\n\n${variant.caption}\n\n${variant.hashtags}`); setCopyState(copied ? "Copied" : "Select and copy"); window.setTimeout(() => setCopyState(""), 1800); };
  return <div className="view-content studio-view">
    <div className="studio-heading"><div><button className="back-link" onClick={onBack}>← Campaigns</button><div className="eyebrow">Social Studio / Campaign</div><h1>{campaign.title}</h1><p>{campaign.objective}</p></div><div className="studio-heading-actions"><span className={`status-chip ${campaign.status.toLowerCase()}`}>{campaign.status}</span><button className="text-button" onClick={toggleReview}>{campaign.status === "Draft" ? "Send to review" : "Return to draft"}</button><button className="primary-button" onClick={onSave}>Save draft <Arrow /></button><button className="ink-button" onClick={onExport}>Export pack <Arrow /></button></div></div>
    <PlatformTabs activePlatform={activePlatform} setActivePlatform={setActivePlatform} />
    <div className="studio-grid">
      <section className="studio-card brief-card"><div className="studio-card-head"><h2>Campaign Brief</h2><button className="text-button" onClick={() => onChange({ ...campaign, objective: `${campaign.objective} Refine the message for a local, welcoming audience.` })}>Edit</button></div><div className="brief-copy"><small>Objective</small><p>{campaign.objective}</p><small>Key message</small><textarea value={campaign.keyMessage} onChange={(event) => onChange({ ...campaign, keyMessage: event.target.value })} /><small>Audience</small><input value={campaign.audience} onChange={(event) => onChange({ ...campaign, audience: event.target.value })} /><small>Call to action</small><input value={campaign.cta} onChange={(event) => onChange({ ...campaign, cta: event.target.value })} /></div><div className="key-details"><small>Key details</small><strong>{offers.find((offer) => offer.id === campaign.offerId)?.title || "Fired Arts offer"}</strong><span>{campaign.startDate || "Date to be set"} · {campaign.endDate || "Open-ended"}</span><span>Kokomo, Indiana · local-first campaign</span></div></section>
      <section className="studio-card composer-card"><div className="studio-card-head"><h2>Post Composer <small>({guidance.label})</small></h2><span className="code-native">&lt;/&gt; Code-native</span></div><label>Hook <span>{variant.hook.length} / {guidance.hookLimit}</span><input value={variant.hook} onChange={(event) => updateVariant("hook", event.target.value)} /></label><label>Caption <span>{variant.caption.length} / {guidance.captionLimit}</span><textarea value={variant.caption} onChange={(event) => updateVariant("caption", event.target.value)} /></label><label>Call to action<select value={variant.cta} onChange={(event) => updateVariant("cta", event.target.value)}><option>Plan your visit</option><option>Reserve your seat</option><option>Request the PTO menu</option><option>See the studio</option><option>Start a conversation</option><option>Learn more</option></select></label><label>Destination link<input value={variant.destinationUrl} onChange={(event) => updateVariant("destinationUrl", event.target.value)} /></label><label>Hashtags<input value={variant.hashtags} onChange={(event) => updateVariant("hashtags", event.target.value)} /></label><div className="composer-actions"><button className="text-button" onClick={copyPost}>{copyState || "Copy post"} <Arrow /></button><span className={variant.caption.length > guidance.captionLimit ? "validation-warning" : "validation-ready"}>{variant.caption.length > guidance.captionLimit ? "Needs a trim" : "Ready to review"}</span></div></section>
      <section className="studio-card preview-card"><div className="studio-card-head"><h2>Post Preview <small>({guidance.label})</small></h2><span className="preview-format">{guidance.format}</span></div><div className={`post-preview ${activePlatform}`}><div className="preview-account"><span className="preview-avatar"><img src="/brand/fired-arts-mark.png" alt="" /></span><span><strong>firedartsstudio</strong><small>Kokomo, Indiana</small></span><b>•••</b></div><div className="preview-media"><img src={selectedAsset.src} alt={selectedAsset.name} /><span>{variant.hook}</span></div><div className="preview-reactions"><span>♡</span><span>◌</span><span>⌁</span><span>□</span></div><p><strong>firedartsstudio</strong> {variant.caption}</p><small className="preview-tags">{variant.hashtags}</small><small className="preview-location">{variant.cta} · Downtown Kokomo</small></div></section>
      <aside className="studio-rail"><section className="studio-card asset-card"><div className="studio-card-head"><h2>Asset / Shot List</h2><span>Use Assets to upload</span></div>{assets.slice(0, 4).map((asset) => <label className="asset-row" key={asset.id}><img src={asset.src} alt="" /><span><strong>{asset.name}</strong><small>{asset.type} · {asset.size}</small></span><input type="checkbox" checked={variant.assetIds.includes(asset.id)} onChange={() => toggleAsset(asset.id)} /></label>)}</section><section className="studio-card conversation-card"><div className="studio-card-head"><h2>Start the Conversation</h2><button className="text-button" onClick={() => onStartConversation(target)}>View all</button></div><span className="target-kicker">Target business</span><strong>{target.name}</strong><small>{target.segment} · {target.place}</small><p>Turn this campaign into a personal, useful opener for a local partner.</p><button className="ink-button full" onClick={() => onStartConversation(target)}>Draft partner message <Arrow /></button></section></aside>
    </div>
    <section className="platform-overview"><div className="studio-card-head"><h2>Platform adaptations overview</h2><span>One brief · four editable variants</span></div><div className="adaptation-grid">{platformIds.map((id) => <button key={id} className={`adaptation-card ${campaign.variants[id].status.toLowerCase()}`} onClick={() => setActivePlatform(id)}><span className={`platform-symbol ${id}`}>{platformGuidance[id].icon}</span><strong>{platformGuidance[id].label}</strong><small>{platformGuidance[id].format}</small><p>{platformGuidance[id].description}</p><span className="status-chip">{campaign.variants[id].status}</span></button>)}</div></section>
  </div>;
}

function CalendarView({ campaigns, onOpen, onChangeCampaign }) {
  const [filter, setFilter] = useState("All");
  const rows = campaigns.flatMap((campaign) => platformIds.map((platform) => ({ campaign, platform, variant: campaign.variants[platform], date: campaign.variants[platform].scheduledAt || campaign.startDate || "Not scheduled" }))).filter((row) => filter === "All" || row.variant.status === filter);
  const updateVariant = (campaign, platform, changes) => onChangeCampaign({ ...campaign, variants: { ...campaign.variants, [platform]: { ...campaign.variants[platform], ...changes } } });
  return <div className="view-content workspace-view"><SectionTitle eyebrow="Content calendar" title="Keep the good ideas moving." text="Prepare a steady rhythm of posts without losing the local story behind each campaign." /><div className="view-toolbar"><FilterBar options={["All", "Draft", "Review", "Approved", "Queued"]} value={filter} onChange={setFilter} /><span className="calendar-note">{rows.length} platform variants · publishing remains manual in v1</span></div><div className="calendar-list">{rows.map((row) => <div className="calendar-row" key={`${row.campaign.id}-${row.platform}`}><span className="calendar-date">{row.date}</span><span className={`platform-symbol ${row.platform}`}>{platformGuidance[row.platform].icon}</span><button className="calendar-row-open" onClick={() => onOpen(row.campaign.id)}><strong>{row.campaign.title}</strong><small>{platformGuidance[row.platform].label} · {row.variant.hook}</small></button><label className="calendar-control"><span>Date</span><input type="date" value={row.variant.scheduledAt || row.campaign.startDate || ""} onChange={(event) => updateVariant(row.campaign, row.platform, { scheduledAt: event.target.value })} /></label><label className="calendar-control"><span>Status</span><select value={row.variant.status} onChange={(event) => updateVariant(row.campaign, row.platform, { status: event.target.value })}>{["Draft", "Review", "Approved", "Queued"].map((status) => <option key={status}>{status}</option>)}</select></label></div>)}</div></div>;
}

function ConversationsView({ conversations, onChange, onStart, onContact, onLogActivity }) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || "");
  const selected = conversations.find((conversation) => conversation.id === selectedId) || conversations[0];
  if (!selected) return <div className="view-content"><SectionTitle eyebrow="Conversations" title="Start with a useful reason to talk." text="Create your first partner conversation from a local target or campaign." action="Open Contacts" onAction={onContact} /></div>;
  const target = outreachTargets.find((item) => item.id === selected.targetId) || outreachTargets[0];
  const patchConversation = (changes) => onChange({ ...selected, ...changes });
  return <div className="view-content workspace-view"><SectionTitle eyebrow="Local partner conversations" title="Make the first message feel like a real invitation." text="Track the people, businesses, and organizations that can help Fired Arts become part of a larger local day." action="Open contacts" onAction={onContact} /><div className="conversation-layout"><div className="conversation-list">{conversations.map((conversation) => { const item = outreachTargets.find((row) => row.id === conversation.targetId) || {}; return <button className={`conversation-list-row ${conversation.id === selected.id ? "selected" : ""}`} key={conversation.id} onClick={() => setSelectedId(conversation.id)}><span className="conversation-avatar">{item.name?.slice(0, 1)}</span><span><strong>{item.name}</strong><small>{conversation.status} · {conversation.nextFollowUpAt || "No follow-up"}</small></span><Arrow /></button>; })}<button className="table-footer" onClick={() => onStart(target)}>+ Start a conversation <Arrow /></button></div><section className="conversation-detail studio-card"><div className="studio-card-head"><div><div className="eyebrow">{target.segment}</div><h2>{target.name}</h2></div><span className={`status-chip ${selected.status.toLowerCase().replaceAll(" ", "-")}`}>{selected.status}</span></div><div className="drawer-meta"><span><small>Place</small><strong>{target.place}</strong></span><span><small>Offer lane</small><strong>{target.offer}</strong></span></div><label>Channel<select value={selected.channel} onChange={(event) => patchConversation({ channel: event.target.value })}><option>Email</option><option>Instagram DM</option><option>Phone</option><option>In person</option><option>LinkedIn</option></select></label><label>Contact name<input value={selected.contactName} onChange={(event) => patchConversation({ contactName: event.target.value })} placeholder="Add a person when verified" /></label><label>Personalized message<textarea value={selected.messageDraft} onChange={(event) => patchConversation({ messageDraft: event.target.value })} /></label><label>Notes<textarea value={selected.notes} onChange={(event) => patchConversation({ notes: event.target.value })} /></label><div className="conversation-actions"><label>Follow-up date<input type="date" value={selected.nextFollowUpAt || ""} onChange={(event) => patchConversation({ nextFollowUpAt: event.target.value })} /></label><label>Status<select value={selected.status} onChange={(event) => patchConversation({ status: event.target.value })}>{["New", "Research", "Drafted", "Sent", "Replied", "Follow-up", "Won", "Paused"].map((status) => <option key={status}>{status}</option>)}</select></label></div>{selected.history?.length > 0 && <div className="activity-log"><div className="activity-log-head"><strong>Activity log</strong><small>{selected.history.length} logged</small></div>{selected.history.slice().reverse().map((entry) => <div className="activity-entry" key={entry.id}><span>{entry.date}</span><p><strong>{entry.type}</strong> via {entry.channel}<br />{entry.body}</p></div>)}</div>}<div className="modal-actions"><button className="primary-button" onClick={() => onLogActivity(selected)}>Mark sent & log <Arrow /></button><button className="text-button" onClick={() => copyToClipboard(selected.messageDraft)}>Copy message <Arrow /></button><span className="success-note">Saved locally</span></div></section></div></div>;
}

function AssetsView({ assets, onAddAsset }) {
  const [query, setQuery] = useState("");
  const filtered = assets.filter((asset) => `${asset.name} ${asset.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  const handleUpload = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onAddAsset({ id: makeId("asset"), name: file.name, type: "Uploaded image", size: `${Math.round(file.size / 1024)} KB`, src: reader.result, tags: ["uploaded", "session"] }); reader.readAsDataURL(file); event.target.value = ""; };
  return <div className="view-content workspace-view"><SectionTitle eyebrow="Asset library" title="Keep the visual language close at hand." text="A lightweight local library for brand marks, studio images, finished work, and campaign-ready shots." /><div className="view-toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search assets and tags" /><label className="primary-button upload-button">Add local asset <Arrow /><input type="file" accept="image/*" onChange={handleUpload} /></label></div><div className="asset-library-grid">{filtered.map((asset) => <article className="library-asset" key={asset.id}><img src={asset.src} alt={asset.name} /><div><strong>{asset.name}</strong><small>{asset.type} · {asset.size}</small><span>{asset.tags.join(" · ")}</span></div></article>)}</div></div>;
}

function TemplatesView({ onUse }) {
  return <div className="view-content workspace-view"><SectionTitle eyebrow="Content templates" title="Start with a useful shape, then make it yours." text="Templates protect consistency while leaving room for the real local detail that makes Fired Arts feel like Fired Arts." /><div className="template-grid">{contentTemplates.map((template) => <button className="template-card" key={template.id} onClick={() => onUse(template)}><span className={`template-accent ${template.accent}`} /><small>{template.category}</small><h3>{template.title}</h3><p>{template.description}</p><span className="template-footer">Use this shape <Arrow /></span></button>)}</div></div>;
}

function ApprovalsView({ campaigns, onOpen, onApprove }) {
  const reviewCampaigns = campaigns.filter((campaign) => campaign.status === "Review" || campaign.status === "Approved" || Object.values(campaign.variants).some((variant) => variant.status === "Review"));
  return <div className="view-content workspace-view"><SectionTitle eyebrow="Approval queue" title="Review the whole story before it leaves the studio." text="Check the brief, platform variants, assets, and partner tie-in as one campaign." /><div className="approval-list">{reviewCampaigns.map((campaign) => <div className="approval-row" key={campaign.id}><span><strong>{campaign.title}</strong><small>{campaign.audience} · {platformIds.length} variants</small></span><span className={`status-chip ${campaign.status.toLowerCase()}`}>{campaign.status}</span><button className="text-button" onClick={() => onOpen(campaign.id)}>Review <Arrow /></button>{campaign.status === "Review" && <button className="primary-button" onClick={() => onApprove(campaign.id)}>Approve <Arrow /></button>}</div>)}{reviewCampaigns.length === 0 && <div className="empty-state">No campaigns are waiting for review yet.</div>}</div></div>;
}

function ReportsView({ campaigns, conversations }) {
  const sent = conversations.filter((conversation) => ["Sent", "Replied", "Won"].includes(conversation.status)).length;
  return <div className="view-content workspace-view"><SectionTitle eyebrow="Reports" title="See where the growth system is moving." text="A local-first snapshot of campaign readiness and relationship momentum." /><div className="report-grid"><div><small>Campaigns</small><strong>{campaigns.length}</strong><span>working briefs</span></div><div><small>Variants ready</small><strong>{campaigns.reduce((sum, campaign) => sum + Object.values(campaign.variants).filter((variant) => variant.status !== "Draft").length, 0)}</strong><span>across four platforms</span></div><div><small>Conversations</small><strong>{conversations.length}</strong><span>partner threads</span></div><div><small>In motion</small><strong>{sent}</strong><span>sent, replied, or won</span></div></div><div className="report-note"><strong>Next useful question</strong><p>Which local partner can make the next Fired Arts offer feel like part of a larger day in Kokomo?</p></div></div>;
}

function SettingsView() {
  return <div className="view-content workspace-view"><SectionTitle eyebrow="Workspace settings" title="Keep the system easy to trust." text="These controls describe the current local-first boundary and the brand defaults used by the workspace." /><div className="settings-list"><div><strong>Persistence</strong><span>Versioned browser storage · local-only</span><em>Active</em></div><div><strong>Publishing</strong><span>Manual copy/export workflow · no OAuth connections</span><em>Not connected</em></div><div><strong>Brand source</strong><span>Fired Arts Regional Growth HQ lockup</span><em>Canonical</em></div><div><strong>Location</strong><span>{studio.location} · 40-mile growth core</span><em>Working context</em></div></div></div>;
}

function DetailDrawer({ item, onClose, onBuild, onStartConversation }) {
  if (!item) return null;
  const isOffer = Boolean(item.description);
  const isTarget = Boolean(item.segment);
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="detail-drawer" onMouseDown={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close detail">×</button><div className="eyebrow">{isOffer ? item.category : isTarget ? item.segment : "Selected item"}</div><h2>{isOffer ? item.title : item.name}</h2>{isOffer ? <><p className="drawer-lead">{item.description}</p><div className="drawer-meta"><span><small>Audience</small><strong>{item.audience}</strong></span><span><small>Status</small><strong>{item.status}</strong></span></div><div className="drawer-section"><small>First move</small><p>{item.firstStep}</p></div><button className="primary-button full" onClick={onBuild}>Build this offer <Arrow /></button></> : <><p className="drawer-lead">{item.offer || "A working target in the Fired Arts regional growth system."}</p><div className="drawer-meta"><span><small>Place</small><strong>{item.place || "Working set"}</strong></span><span><small>Relationship</small><strong>{item.relationshipStatus || item.status || "Review"}</strong></span></div><div className="drawer-contact-meta"><span><small>Contact path</small><strong>{item.contactName || "Name to verify"}</strong><em>{item.contactEmail || item.contactPhone || "Email or phone not recorded"}</em></span><span><small>Notes</small><strong>{item.notes || "Add context after the first research pass."}</strong></span></div><div className="drawer-section"><small>Why it matters</small><p>Reach the organizer early with a specific, low-friction first offer instead of a general flyer.</p></div><button className="primary-button full" onClick={() => onStartConversation(item)}>Start the conversation <Arrow /></button><button className="ink-button full" onClick={onClose}>Mark for follow-up <Arrow /></button></>}</aside></div>;
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
  const [completed, setCompleted] = useStoredState("checklist", {});
  const [campaigns, setCampaigns] = useStoredState("campaigns", seedCampaigns);
  const [conversations, setConversations] = useStoredState("conversations", seedConversations);
  const [assets, setAssets] = useStoredState("assets", assetLibrary);
  const [campaignModal, setCampaignModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useStoredState("selected-campaign", seedCampaigns[0].id);

  const toggleAction = (id) => setCompleted((current) => ({ ...current, [id]: !current[id] }));
  const openOffer = (offer) => setDetail(offer);
  const buildOffer = (offer = detail || offers[0]) => { setDetail(null); setBuilder(offer); };
  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) || campaigns[0];
  const updateCampaign = (updated) => setCampaigns((current) => current.map((campaign) => campaign.id === updated.id ? updated : campaign));
  const openCampaign = (id) => { setSelectedCampaignId(id); setActive("social"); };
  const createCampaign = ({ title, audience, objective, offer, targetId }) => {
    const campaignId = makeId("campaign");
    const variants = Object.fromEntries(platformIds.map((platform) => [platform, {
      id: makeId(`variant-${platform}`), platform, format: platformGuidance[platform].format,
      hook: `${offer.title}: ${offer.firstStep}.`,
      caption: `${offer.description} Fired Arts is building a welcoming local reason to visit in Kokomo.`,
      cta: "Plan your visit", hashtags: "#FiredArts #KokomoCreates #SupportLocal",
      destinationUrl: "https://firedartsstudio.com/visit", assetIds: ["asset-glaze"], status: "Draft", scheduledAt: "",
    }]));
    const campaign = { id: campaignId, title, objective, offerId: offer.id, audience, keyMessage: offer.description, cta: "Plan your visit", destinationUrl: "https://firedartsstudio.com/visit", startDate: "", endDate: "", status: "Draft", platformIds, assetIds: ["asset-glaze"], targetIds: targetId ? [targetId] : [], variants };
    setCampaigns((current) => [campaign, ...current]);
    setSelectedCampaignId(campaignId);
    setCampaignModal(false);
    setActive("social");
  };
  const exportCampaign = () => {
    if (!selectedCampaign) return;
    const rows = platformIds.map((platform) => ({ campaign: selectedCampaign.title, platform, ...selectedCampaign.variants[platform] }));
    exportWorkspaceFile(`${selectedCampaign.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-campaign-pack.json`, JSON.stringify({ campaign: selectedCampaign, variants: rows }, null, 2));
    const csv = ["campaign,platform,status,scheduledAt,hook,caption,cta,hashtags,destinationUrl", ...rows.map((row) => [row.campaign, row.platform, row.status, row.scheduledAt, row.hook, row.caption, row.cta, row.hashtags, row.destinationUrl].map(csvCell).join(","))].join("\n");
    window.setTimeout(() => exportWorkspaceFile(`${selectedCampaign.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-campaign-pack.csv`, csv, "text/csv"), 150);
  };
  const updateConversation = (updated) => setConversations((current) => current.map((conversation) => conversation.id === updated.id ? updated : conversation));
  const logConversationActivity = (conversation) => {
    const date = new Date().toISOString().slice(0, 10);
    updateConversation({ ...conversation, status: "Sent", lastContactedAt: date, history: [...(conversation.history || []), { id: makeId("activity"), date, type: "Message sent", channel: conversation.channel, body: conversation.messageDraft }] });
  };
  const startConversation = (target) => {
    const existing = conversations.find((conversation) => conversation.targetId === target.id && (!selectedCampaign || conversation.campaignId === selectedCampaign.id));
    if (existing) { setActive("conversations"); return; }
    const campaign = selectedCampaign || campaigns[0];
    const newConversation = { id: makeId("conversation"), targetId: target.id, campaignId: campaign?.id || "", channel: "Email", contactName: "", status: "Drafted", messageDraft: `Hi — ${target.name} and Fired Arts seem like a natural local fit. We would love to share a simple idea around ${target.offer.toLowerCase()}. Would you be open to a quick conversation?`, notes: "Personalize this opener after verifying the best contact path.", lastContactedAt: "", nextFollowUpAt: "", history: [] };
    setConversations((current) => [newConversation, ...current]);
    setActive("conversations");
  };
  const useTemplate = (template) => {
    const campaign = selectedCampaign || campaigns[0];
    if (!campaign) return;
    updateCampaign({ ...campaign, keyMessage: template.description, cta: template.cta, variants: Object.fromEntries(platformIds.map((platform) => [platform, { ...campaign.variants[platform], hook: template.hook, cta: template.cta }])) });
    setSelectedCampaignId(campaign.id);
    setActive("social");
  };

  const view = useMemo(() => {
    if (active === "campaigns") return <CampaignsView campaigns={campaigns} onOpen={openCampaign} onCreate={() => setCampaignModal(true)} />;
    if (active === "social") return <SocialStudioView campaign={selectedCampaign} assets={assets} onChange={updateCampaign} onSave={() => updateCampaign({ ...selectedCampaign, status: "Draft" })} onExport={exportCampaign} onStartConversation={startConversation} onCreate={() => setCampaignModal(true)} onBack={() => setActive("campaigns")} />;
    if (active === "calendar") return <CalendarView campaigns={campaigns} onOpen={openCampaign} onChangeCampaign={updateCampaign} />;
    if (active === "conversations") return <ConversationsView conversations={conversations} onChange={updateConversation} onStart={startConversation} onContact={() => setActive("contacts")} onLogActivity={logConversationActivity} />;
    if (active === "contacts" || active === "outreach") return <OutreachView onTarget={setDetail} />;
    if (active === "competitors") return <CompetitorsView />;
    if (active === "offers") return <OffersView onOffer={openOffer} />;
    if (active === "operations") return <OperationsView completed={completed} toggleAction={toggleAction} />;
    if (active === "assets") return <AssetsView assets={assets} onAddAsset={(asset) => setAssets((current) => [asset, ...current])} />;
    if (active === "templates") return <TemplatesView onUse={useTemplate} />;
    if (active === "approvals") return <ApprovalsView campaigns={campaigns} onOpen={openCampaign} onApprove={(id) => { const campaign = campaigns.find((item) => item.id === id); if (campaign) updateCampaign({ ...campaign, status: "Approved", variants: Object.fromEntries(platformIds.map((platform) => [platform, { ...campaign.variants[platform], status: "Approved" }])) }); }} />;
    if (active === "reports") return <ReportsView campaigns={campaigns} conversations={conversations} />;
    if (active === "settings") return <SettingsView />;
    return <Overview range={range} setRange={setRange} onBuild={() => setBuilder(offers[0])} onOffer={openOffer} onTarget={setDetail} setActive={setActive} />;
  }, [active, assets, campaigns, completed, conversations, range, selectedCampaign]);

  return <div className="app-shell"><Sidebar active={active} setActive={setActive} /><main className="main-canvas"><TopBar active={active} onBuild={() => setCampaignModal(true)} />{view}<footer className="app-footer"><span>Fired Arts Studio · Kokomo, Indiana</span><span>Local-first growth workspace · publishing and messaging remain manual</span></footer></main><DetailDrawer item={detail} onClose={() => setDetail(null)} onBuild={() => buildOffer(detail)} onStartConversation={startConversation} /><BuilderModal offer={builder} onClose={() => setBuilder(null)} /><CampaignModal open={campaignModal} offers={offers} targets={outreachTargets} onClose={() => setCampaignModal(false)} onSave={createCampaign} /></div>;
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
