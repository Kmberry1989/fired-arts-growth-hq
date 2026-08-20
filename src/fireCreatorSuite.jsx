import { useEffect, useMemo, useRef, useState } from "react";
import { copyToClipboard, exportWorkspaceFile, readStoredValue, writeStoredValue } from "./storage";

const suiteTabs = [
  ["dashboard", "Command center", "⌂"],
  ["content", "Content Hub", "□"],
  ["planner", "Planner", "◫"],
  ["insights", "Insights", "⌁"],
  ["critic", "Critic Construct", "✦"],
  ["visualizer", "Visualizer", "◌"],
  ["scribble", "Scribble Diffusion", "✎"],
  ["images", "Artful Images", "✺"],
  ["templates", "Template Forge", "◇"],
];

const defaultContentDraft = {
  eventTitle: "",
  eventDescription: "",
  targetAudience: "Families and local creatives",
  platform: "Instagram",
  desiredTone: "Warm and inviting",
  generatedContent: "",
};

const defaultPlanner = {
  cards: [
    { id: "creator-card-1", title: "Studio welcome post", date: "2026-08-21", channel: "Instagram", status: "Draft", note: "Introduce a low-pressure reason to visit Fired Arts." },
    { id: "creator-card-2", title: "Pickup reminder", date: "2026-08-23", channel: "Email", status: "Ready", note: "Make the next visit easy to remember and act on." },
  ],
  todos: [
    { id: "creator-todo-1", text: "Choose the lead image", completed: false },
    { id: "creator-todo-2", text: "Confirm the call to action", completed: true },
  ],
  links: [],
  notes: "Keep every concept welcoming, specific, and possible for the actual studio team to execute.",
};

const defaultTemplates = [
  { id: "creator-template-1", title: "Event launch", description: "A clear, warm announcement shape for a new class, night, or group experience.", category: "Promotion", accent: "red", hook: "A new reason to make something together is coming to Fired Arts." },
  { id: "creator-template-2", title: "Behind the scenes", description: "Show the process, people, and small details that make the studio feel human.", category: "Storytelling", accent: "blue", hook: "Here is what happens before your piece comes home." },
  { id: "creator-template-3", title: "Community invitation", description: "Invite a local organization or audience into a practical first conversation.", category: "Outreach", accent: "green", hook: "We think this could be a good fit for your people." },
  { id: "creator-template-4", title: "Pickup loop", description: "Turn a finished piece into a thoughtful reason to return.", category: "Retention", accent: "yellow", hook: "Your piece is ready, and there is another good reason to visit." },
];

function creatorId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function useCreatorState(key, fallback) {
  const [value, setValue] = useState(() => readStoredValue(`creator-suite-${key}`, fallback));
  useEffect(() => writeStoredValue(`creator-suite-${key}`, value), [key, value]);
  return [value, setValue];
}

function CreatorButton({ children, onClick, secondary = false, disabled = false }) {
  return <button className={secondary ? "creator-button secondary" : "creator-button"} onClick={onClick} disabled={disabled}>{children}</button>;
}

function CreatorCard({ eyebrow, title, text, children, className = "" }) {
  return <section className={`creator-card ${className}`}><div className="creator-card-heading">{eyebrow && <span className="creator-eyebrow">{eyebrow}</span>}<h3>{title}</h3>{text && <p>{text}</p>}</div>{children}</section>;
}

function CreatorHeader({ tab, setTab }) {
  const current = suiteTabs.find(([id]) => id === tab) || suiteTabs[0];
  return <>
    <div className="creator-suite-intro"><div><span className="eyebrow">Fired Arts creative workspace</span><h1>Fire Creator Suite</h1><p>Turn a spark into a usable post, plan, visual direction, or conversation while keeping the final creative decision with the Fired Arts team.</p></div><span className="creator-suite-mark">✺</span></div>
    <div className="creator-tabs" role="tablist" aria-label="Fire Creator Suite tools">{suiteTabs.map(([id, label, icon]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}><span>{icon}</span>{label}</button>)}</div>
    <div className="creator-current-label"><span>{current[2]}</span><strong>{current[1]}</strong><small>Saved locally in this workspace</small></div>
  </>;
}

function CreatorDashboard({ setTab, planner, contentDraft, templates, criticHistory, insightResult, assets }) {
  const readyCards = planner.cards.filter((card) => card.status === "Ready").length;
  return <div className="creator-view-grid creator-dashboard-grid">
    <CreatorCard eyebrow="Suite overview" title="Make the next creative move obvious." text="The Fire Creator Suite gathers the reusable creative tools into a Fired Arts workflow. Governance and role-explainer surfaces are intentionally excluded.">
      <div className="creator-stat-grid"><div><strong>{planner.cards.length}</strong><small>planned items</small></div><div><strong>{readyCards}</strong><small>ready to use</small></div><div><strong>{assets.length}</strong><small>local assets</small></div><div><strong>{templates.length}</strong><small>templates</small></div></div>
    </CreatorCard>
    <CreatorCard eyebrow="Quick start" title="Choose a starting point." className="creator-quick-card">
      <div className="creator-launch-list"><button onClick={() => setTab("content")}><span>□</span><strong>Content Hub</strong><small>{contentDraft.generatedContent ? "Continue your saved draft" : "Build a platform-ready draft"}</small></button><button onClick={() => setTab("planner")}><span>◫</span><strong>Planner</strong><small>Organize cards, links, notes, and to-dos</small></button><button onClick={() => setTab("critic")}><span>✦</span><strong>Critic Construct</strong><small>{criticHistory.length ? "Review your saved critiques" : "Check a draft before it leaves the studio"}</small></button><button onClick={() => setTab("images")}><span>✺</span><strong>Artful Images</strong><small>Make a visual brief or open local assets</small></button></div>
    </CreatorCard>
    <CreatorCard eyebrow="Working context" title="What this suite keeps in view." className="creator-context-card"><ul className="creator-check-list"><li><span>01</span>Fired Arts is always the brand voice.</li><li><span>02</span>Real studio images stay user-supplied.</li><li><span>03</span>Drafts and plans persist locally.</li><li><span>04</span>Publishing and external integrations remain manual.</li></ul></CreatorCard>
    <CreatorCard eyebrow="Latest insight" title={insightResult?.themes?.[0] || "No insight extracted yet."} text={insightResult ? insightResult.suggestions?.[0] : "Paste feedback into Insights to surface themes and next actions."} className="creator-insight-card"><CreatorButton secondary onClick={() => setTab("insights")}>Open Insights →</CreatorButton></CreatorCard>
  </div>;
}

function ContentHub({ draft, setDraft, templates, onSaveTemplateUse }) {
  const [saved, setSaved] = useState(false);
  const generate = () => {
    const title = draft.eventTitle.trim() || "A new Fired Arts experience";
    const description = draft.eventDescription.trim() || "A welcoming, hands-on studio moment for people who want to make something together.";
    const tone = draft.desiredTone.trim() || "Warm and inviting";
    const content = `${title}\n\n${description} ${tone === "Warm and inviting" ? "Come make room for a little creativity with Fired Arts." : `We are keeping this one ${tone.toLowerCase()} and easy to join.`}\n\nWho it is for: ${draft.targetAudience || "Fired Arts guests"}\nPlatform: ${draft.platform}\n\nReserve your spot or message Fired Arts to plan your visit. #FiredArts #KokomoCreates #MakeSomethingTogether`;
    setDraft((current) => ({ ...current, generatedContent: content }));
    setSaved(false);
  };
  const save = () => { setDraft((current) => ({ ...current })); setSaved(true); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Content Alchemist" title="Build a useful draft from the details that matter." text="This local-first version keeps the content workflow editable and exportable without pretending a remote AI service or publisher is connected."><div className="creator-form-grid"><label>Event or post title<input value={draft.eventTitle} onChange={(event) => setDraft((current) => ({ ...current, eventTitle: event.target.value }))} placeholder="e.g. Friday night at Fired Arts" /></label><label>Audience<input value={draft.targetAudience} onChange={(event) => setDraft((current) => ({ ...current, targetAudience: event.target.value }))} /></label><label className="creator-span-2">Description<textarea value={draft.eventDescription} onChange={(event) => setDraft((current) => ({ ...current, eventDescription: event.target.value }))} placeholder="Describe the event, offer, or story in plain language." /></label><label>Platform<select value={draft.platform} onChange={(event) => setDraft((current) => ({ ...current, platform: event.target.value }))}><option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>Email</option></select></label><label>Tone<input value={draft.desiredTone} onChange={(event) => setDraft((current) => ({ ...current, desiredTone: event.target.value }))} /></label></div><div className="creator-actions"><CreatorButton onClick={generate}>Generate local draft →</CreatorButton>{saved && <span className="creator-success">Saved locally</span>}</div></CreatorCard><CreatorCard eyebrow="Generated content" title="Edit before you share." text="The draft is plain text on purpose: the studio owns the final voice."><textarea className="creator-output" value={draft.generatedContent} onChange={(event) => setDraft((current) => ({ ...current, generatedContent: event.target.value }))} placeholder="Your draft will appear here." /><div className="creator-actions"><CreatorButton secondary disabled={!draft.generatedContent} onClick={() => copyToClipboard(draft.generatedContent)}>Copy draft</CreatorButton><CreatorButton secondary disabled={!draft.generatedContent} onClick={() => exportWorkspaceFile("fired-arts-content-draft.txt", draft.generatedContent, "text/plain")}>Export .txt</CreatorButton><CreatorButton secondary disabled={!draft.generatedContent} onClick={save}>Save draft</CreatorButton></div></CreatorCard><CreatorCard eyebrow="Template shapes" title="Start from a reusable pattern." className="creator-span-2"><div className="creator-template-strip">{templates.map((template) => <button key={template.id} onClick={() => onSaveTemplateUse(template)}><span className={`creator-accent ${template.accent}`} /><small>{template.category}</small><strong>{template.title}</strong><p>{template.description}</p></button>)}</div></CreatorCard></div>;
}

function Planner({ planner, setPlanner }) {
  const [newCard, setNewCard] = useState({ title: "", date: "", channel: "Instagram", note: "" });
  const [newTodo, setNewTodo] = useState("");
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const addCard = () => { if (!newCard.title.trim()) return; setPlanner((current) => ({ ...current, cards: [{ ...newCard, id: creatorId("card"), status: "Draft" }, ...current.cards] })); setNewCard({ title: "", date: "", channel: "Instagram", note: "" }); };
  const addTodo = () => { if (!newTodo.trim()) return; setPlanner((current) => ({ ...current, todos: [...current.todos, { id: creatorId("todo"), text: newTodo.trim(), completed: false }] })); setNewTodo(""); };
  const addLink = () => { if (!newLink.title.trim() || !newLink.url.trim()) return; const url = newLink.url.startsWith("http") ? newLink.url : `https://${newLink.url}`; setPlanner((current) => ({ ...current, links: [...current.links, { id: creatorId("link"), title: newLink.title.trim(), url }] })); setNewLink({ title: "", url: "" }); };
  return <div className="creator-planner"><div className="creator-planner-board"><CreatorCard eyebrow="Planner board" title="Keep the idea, the work, and the next step together." text="A local replacement for the shared calendar, resource rail, whiteboard, and to-do list." className="creator-span-2"><div className="creator-planner-add"><input value={newCard.title} onChange={(event) => setNewCard((current) => ({ ...current, title: event.target.value }))} placeholder="New planned item" /><input type="date" value={newCard.date} onChange={(event) => setNewCard((current) => ({ ...current, date: event.target.value }))} /><select value={newCard.channel} onChange={(event) => setNewCard((current) => ({ ...current, channel: event.target.value }))}><option>Instagram</option><option>Facebook</option><option>Email</option><option>In studio</option></select><CreatorButton onClick={addCard}>Add card</CreatorButton></div><div className="creator-plan-list">{planner.cards.map((card) => <article key={card.id} className="creator-plan-card"><div><small>{card.date || "Unscheduled"} · {card.channel}</small><strong>{card.title}</strong><p>{card.note || "Add a note when the next detail is clear."}</p></div><select value={card.status} onChange={(event) => setPlanner((current) => ({ ...current, cards: current.cards.map((item) => item.id === card.id ? { ...item, status: event.target.value } : item) }))}><option>Draft</option><option>Ready</option><option>Published</option><option>Parked</option></select><button className="creator-icon-button" onClick={() => setPlanner((current) => ({ ...current, cards: current.cards.filter((item) => item.id !== card.id) }))} aria-label={`Delete ${card.title}`}>×</button></article>)}{planner.cards.length === 0 && <p className="creator-empty">No planned items yet. Add the first card above.</p>}</div></CreatorCard><CreatorCard eyebrow="To-do" title="Small actions that keep the plan moving."><div className="creator-add-row"><input value={newTodo} onChange={(event) => setNewTodo(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTodo()} placeholder="Add a to-do" /><CreatorButton onClick={addTodo}>+</CreatorButton></div><div className="creator-todo-list">{planner.todos.map((todo) => <label key={todo.id}><input type="checkbox" checked={todo.completed} onChange={() => setPlanner((current) => ({ ...current, todos: current.todos.map((item) => item.id === todo.id ? { ...item, completed: !item.completed } : item) }))} /><span className={todo.completed ? "done" : ""}>{todo.text}</span><button type="button" onClick={() => setPlanner((current) => ({ ...current, todos: current.todos.filter((item) => item.id !== todo.id) }))}>×</button></label>)}</div></CreatorCard><CreatorCard eyebrow="Resources" title="Keep useful references close."><div className="creator-add-stack"><input value={newLink.title} onChange={(event) => setNewLink((current) => ({ ...current, title: event.target.value }))} placeholder="Resource title" /><input value={newLink.url} onChange={(event) => setNewLink((current) => ({ ...current, url: event.target.value }))} placeholder="https://..." /><CreatorButton onClick={addLink}>Add resource</CreatorButton></div><div className="creator-link-list">{planner.links.map((link) => <div key={link.id}><a href={link.url} target="_blank" rel="noreferrer">{link.title}</a><button onClick={() => setPlanner((current) => ({ ...current, links: current.links.filter((item) => item.id !== link.id) }))}>×</button></div>)}</div></CreatorCard><CreatorCard eyebrow="Whiteboard note" title="Leave context for the next creative pass." className="creator-span-2"><textarea className="creator-output creator-note" value={planner.notes} onChange={(event) => setPlanner((current) => ({ ...current, notes: event.target.value }))} /></CreatorCard></div></div>;
}

function extractLocalInsights(value) {
  const stopWords = new Set("the and for that with this from into your our are was were have has about they them their will would just very more when what where which while fired arts studio people group event make made than then there here".split(" "));
  const words = (value.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || []).filter((word) => !stopWords.has(word));
  const counts = words.reduce((all, word) => ({ ...all, [word]: (all[word] || 0) + 1 }), {});
  const themes = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  const positive = ["love", "great", "easy", "fun", "welcoming", "enjoy", "good", "helpful", "beautiful"].reduce((sum, word) => sum + (value.toLowerCase().match(new RegExp(`\\b${word}\\b`, "g")) || []).length, 0);
  const negative = ["hard", "confusing", "expensive", "difficult", "late", "bad", "unclear", "frustrating"].reduce((sum, word) => sum + (value.toLowerCase().match(new RegExp(`\\b${word}\\b`, "g")) || []).length, 0);
  const sentiment = Math.max(1, Math.min(10, 6 + positive - negative));
  return { themes: themes.length ? themes : ["More input needed"], suggestions: themes.length ? [`Test a Fired Arts message that speaks directly to ${themes[0].toLowerCase()}.`, `Ask one follow-up question about ${themes[1]?.toLowerCase() || "the strongest theme"}.`] : ["Paste a few sentences, comments, or survey responses to create a useful signal."], sentiment };
}

function Insights({ result, setResult }) {
  const [raw, setRaw] = useCreatorState("insight-input", "");
  const run = () => { if (raw.trim()) setResult(extractLocalInsights(raw)); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Insight Extractor" title="Turn unstructured feedback into a next question." text="Paste comments, reviews, survey responses, or conversation notes. The local extractor surfaces recurring words and a testable next move."><textarea className="creator-large-input" value={raw} onChange={(event) => setRaw(event.target.value)} placeholder="Paste feedback or notes here..." /><div className="creator-actions"><CreatorButton onClick={run} disabled={!raw.trim()}>Extract insights →</CreatorButton><CreatorButton secondary onClick={() => { setRaw(""); setResult(null); }}>Clear</CreatorButton></div></CreatorCard><CreatorCard eyebrow="Generated insights" title={result ? "A signal to work with." : "Your result will appear here."}>{result ? <div className="creator-result-stack"><div><small>Key themes</small><div className="creator-pill-row">{result.themes.map((theme) => <span key={theme}>{theme}</span>)}</div></div><div><small>Actionable suggestions</small><ul>{result.suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul></div><div><small>Local sentiment signal</small><strong className="creator-score">{result.sentiment}/10</strong></div><CreatorButton secondary onClick={() => exportWorkspaceFile("fired-arts-insights.txt", `Themes: ${result.themes.join(", ")}\n\n${result.suggestions.join("\n")}\n\nSentiment: ${result.sentiment}/10`, "text/plain")}>Export insight note</CreatorButton></div> : <p className="creator-empty">Paste real feedback to create an evidence-aware starting point.</p>}</CreatorCard></div>;
}

function CriticConstruct({ history, setHistory }) {
  const [draft, setDraft] = useCreatorState("critic-draft", { postText: "", postLink: "", mediaDescription: "" });
  const [result, setResult] = useState(null);
  const analyze = () => { const text = draft.postText.trim(); if (!text && !draft.postLink && !draft.mediaDescription) return; const hasCta = /visit|book|reserve|message|learn|join|save|comment/i.test(text); const score = Math.min(10, 4 + (text.length > 80 ? 2 : 0) + (text.length > 180 ? 1 : 0) + (hasCta ? 2 : 0) + (draft.mediaDescription ? 1 : 0)); const critique = hasCta ? "The draft has a clear next step. Tighten the opening and keep the invitation specific to the Fired Arts experience." : "The idea is present, but the reader still needs one clear next step and a reason to care now."; const reconstructedPost = `${text || "Make something worth coming back for."}${hasCta ? "" : "\n\nCome make something with Fired Arts—message us to plan your visit."}`; setResult({ score, critique, reconstructedPost }); };
  const save = () => { if (!result) return; setHistory((current) => [{ id: creatorId("critique"), ...result, original: draft.postText, savedAt: new Date().toISOString().slice(0, 10) }, ...current]); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Critic Construct" title="Check the draft before it leaves the studio." text="A local review pass for clarity, audience fit, visual context, and a usable call to action."><textarea className="creator-large-input" value={draft.postText} onChange={(event) => setDraft((current) => ({ ...current, postText: event.target.value }))} placeholder="Paste the post text here..." /><input value={draft.postLink} onChange={(event) => setDraft((current) => ({ ...current, postLink: event.target.value }))} placeholder="Optional post or campaign link" /><input value={draft.mediaDescription} onChange={(event) => setDraft((current) => ({ ...current, mediaDescription: event.target.value }))} placeholder="Describe the attached visual" /><div className="creator-actions"><CreatorButton onClick={analyze}>Analyze draft →</CreatorButton><CreatorButton secondary onClick={() => copyToClipboard(draft.postText)} disabled={!draft.postText}>Copy original</CreatorButton></div></CreatorCard><CreatorCard eyebrow="Analysis & score" title={result ? `${result.score}/10 · ready for a human pass` : "Your analysis will appear here."}>{result ? <div className="creator-result-stack"><p>{result.critique}</p><label>Reconstructed post<textarea className="creator-output" value={result.reconstructedPost} onChange={(event) => setResult((current) => ({ ...current, reconstructedPost: event.target.value }))} /></label><div className="creator-actions"><CreatorButton secondary onClick={() => copyToClipboard(result.reconstructedPost)}>Copy improved draft</CreatorButton><CreatorButton secondary onClick={save}>Save analysis</CreatorButton></div></div> : <p className="creator-empty">Add text, a link, or a visual description to begin.</p>}</CreatorCard><CreatorCard eyebrow="Saved analyses" title="Keep the useful comparisons." className="creator-span-2">{history.length ? <div className="creator-history-list">{history.slice(0, 5).map((item) => <article key={item.id}><strong>{item.score}/10</strong><p>{item.critique}</p><small>{item.savedAt}</small></article>)}</div> : <p className="creator-empty">Saved critiques will appear here.</p>}</CreatorCard></div>;
}

function Visualizer({ visual, setVisual, tabLabel = "Visualizer" }) {
  const [prompt, setPrompt] = useCreatorState(`${tabLabel.toLowerCase().replaceAll(" ", "-")}-prompt`, "");
  const suggestions = tabLabel === "Scribble Diffusion" ? ["A playful clay stamp for a family workshop", "A hand-drawn pattern for a pottery night", "A simple icon for a pickup reminder"] : ["A warm editorial image of hands making a ceramic piece", "A colorful square post for a Fired Arts class", "A calm workshop scene with room for headline text"];
  const createBrief = () => { if (!prompt.trim()) return; setVisual({ title: prompt.trim().slice(0, 48), direction: `Create a ${tabLabel === "Scribble Diffusion" ? "hand-drawn, imperfect" : "warm, tactile"} visual around “${prompt.trim()}”. Keep the composition clear enough for a Fired Arts social post.`, palette: "Warm paper · cobalt · terracotta · deep ink", crop: "Square first; keep the main subject inside the center-safe area.", note: "Use a real studio image or approved artwork before publishing." }); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow={tabLabel} title={tabLabel === "Scribble Diffusion" ? "Combine a scribble with a useful visual direction." : "Turn a prompt into a visual production brief."} text="This local-first creative step keeps the idea, crop, palette, and production note together. It does not claim to generate or publish an image without an approved asset."><div className="creator-suggestion-list">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setPrompt(suggestion)}>✦ {suggestion}</button>)}</div><textarea className="creator-large-input" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={tabLabel === "Scribble Diffusion" ? "Describe what the scribble should become..." : "Describe the visual you want to explore..."} />{tabLabel === "Scribble Diffusion" && <ScribblePad /> }<div className="creator-actions"><CreatorButton onClick={createBrief} disabled={!prompt.trim()}>Create local brief →</CreatorButton><CreatorButton secondary onClick={() => setPrompt("")}>Clear prompt</CreatorButton></div></CreatorCard><CreatorCard eyebrow="Generated concept" title={visual?.title || "Your concept awaits."} text={visual ? "Review the direction, then move into Assets or Social Studio when a real image is ready." : "Your brief will appear here."}>{visual ? <div className="creator-result-stack"><div><small>Visual direction</small><p>{visual.direction}</p></div><div><small>Palette</small><strong>{visual.palette}</strong></div><div><small>Crop</small><p>{visual.crop}</p></div><div className="creator-note-box">{visual.note}</div><CreatorButton secondary onClick={() => exportWorkspaceFile(`${tabLabel.toLowerCase().replaceAll(" ", "-")}-brief.txt`, `${visual.title}\n\n${visual.direction}\n\nPalette: ${visual.palette}\nCrop: ${visual.crop}\n\n${visual.note}`, "text/plain")}>Export brief</CreatorButton></div> : <p className="creator-empty">Start with a short description or choose a suggestion.</p>}</CreatorCard></div>;
}

function ScribblePad() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const begin = (event) => { drawing.current = true; const canvas = canvasRef.current; const rect = canvas.getBoundingClientRect(); const context = canvas.getContext("2d"); context.beginPath(); context.moveTo((event.clientX - rect.left) * (canvas.width / rect.width), (event.clientY - rect.top) * (canvas.height / rect.height)); };
  const draw = (event) => { if (!drawing.current) return; const canvas = canvasRef.current; const rect = canvas.getBoundingClientRect(); const context = canvas.getContext("2d"); context.lineWidth = 4; context.lineCap = "round"; context.strokeStyle = "#b23a18"; context.lineTo((event.clientX - rect.left) * (canvas.width / rect.width), (event.clientY - rect.top) * (canvas.height / rect.height)); context.stroke(); };
  return <div className="creator-scribble-wrap"><small>Optional scribble pad · use it as a thinking tool</small><canvas ref={canvasRef} width="640" height="260" onPointerDown={begin} onPointerMove={draw} onPointerUp={() => { drawing.current = false; }} onPointerLeave={() => { drawing.current = false; }} aria-label="Scribble drawing pad" /></div>;
}

function ArtfulImages({ assets, onAddAsset, onOpenAssets, visual, setVisual }) {
  const [prompt, setPrompt] = useCreatorState("artful-images-prompt", "");
  const upload = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onAddAsset({ id: creatorId("asset"), name: file.name, type: "Uploaded image", size: `${Math.round(file.size / 1024)} KB`, src: reader.result, tags: ["uploaded", "creator-suite"] }); reader.readAsDataURL(file); event.target.value = ""; };
  const create = () => { if (!prompt.trim()) return; setVisual({ title: prompt.trim().slice(0, 48), direction: `A Fired Arts visual exploration for ${prompt.trim()}. Keep the people, materials, and invitation recognizable rather than over-polished.`, palette: "Warm paper · cobalt · terracotta", crop: "Square or 4:5 portrait", note: "Attach an approved local asset before publishing." }); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Artful Images" title="Build a visual idea, then choose a real image." text="The original component generated and stored images through Firebase. Here the creative brief and local upload path stay available without an external service or generic placeholder art."><textarea className="creator-large-input" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the visual you want to create..." /><div className="creator-actions"><CreatorButton onClick={create} disabled={!prompt.trim()}>Create visual brief →</CreatorButton><label className="creator-upload">Upload real image<input type="file" accept="image/*" onChange={upload} /></label><CreatorButton secondary onClick={onOpenAssets}>Open Assets →</CreatorButton></div></CreatorCard><CreatorCard eyebrow="Local gallery" title={`${assets.length} approved or uploaded asset${assets.length === 1 ? "" : "s"}.`}>{assets.length ? <div className="creator-asset-grid">{assets.slice(0, 8).map((asset) => <img key={asset.id} src={asset.src} alt={asset.name} title={asset.name} />)}</div> : <p className="creator-empty">Upload a real Fired Arts image or open Assets to manage the library.</p>}</CreatorCard>{visual && <CreatorCard eyebrow="Visual brief" title={visual.title} className="creator-span-2"><div className="creator-result-stack"><p>{visual.direction}</p><span>{visual.palette} · {visual.crop}</span><CreatorButton secondary onClick={() => exportWorkspaceFile("fired-arts-visual-brief.txt", `${visual.title}\n\n${visual.direction}\n${visual.palette}\n${visual.crop}\n\n${visual.note}`, "text/plain")}>Export visual brief</CreatorButton></div></CreatorCard>}</div>;
}

function TemplateForge({ templates, setTemplates, onUse }) {
  const [form, setForm] = useState({ title: "", description: "", category: "Custom", accent: "blue" });
  const add = () => { if (!form.title.trim()) return; setTemplates((current) => [{ ...form, id: creatorId("template") }, ...current]); setForm({ title: "", description: "", category: "Custom", accent: "blue" }); };
  return <div className="creator-view-grid creator-template-page"><CreatorCard eyebrow="Template Forge" title="Build reusable shapes for Fired Arts work." text="Templates from the command suite are adapted here for local persistence and can feed the Content Hub directly."><div className="creator-form-grid"><label>Template title<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="e.g. Weekend workshop" /></label><label>Category<input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} /></label><label className="creator-span-2">Description<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What should this template help the team do?" /></label></div><div className="creator-actions"><CreatorButton onClick={add}>Create template →</CreatorButton></div></CreatorCard><div className="creator-template-library">{templates.map((template) => <article key={template.id} className="creator-template-card"><span className={`creator-accent ${template.accent}`} /><small>{template.category}</small><h3>{template.title}</h3><p>{template.description}</p><div className="creator-actions"><CreatorButton onClick={() => onUse(template)}>Use template</CreatorButton>{template.id.startsWith("creator-template-") ? null : <button className="creator-text-button" onClick={() => setTemplates((current) => current.filter((item) => item.id !== template.id))}>Remove</button>}</div></article>)}</div></div>;
}

export function FireCreatorSuite({ assets, onAddAsset, onOpenAssets }) {
  const [tab, setTab] = useState("dashboard");
  const [contentDraft, setContentDraft] = useCreatorState("content-draft", defaultContentDraft);
  const [planner, setPlanner] = useCreatorState("planner", defaultPlanner);
  const [templates, setTemplates] = useCreatorState("templates", defaultTemplates);
  const [insightResult, setInsightResult] = useCreatorState("insight-result", null);
  const [criticHistory, setCriticHistory] = useCreatorState("critic-history", []);
  const [visual, setVisual] = useCreatorState("visual", null);
  const [imageVisual, setImageVisual] = useCreatorState("image-visual", null);
  const [scribbleVisual, setScribbleVisual] = useCreatorState("scribble-visual", null);
  const normalizedAssets = useMemo(() => Array.isArray(assets) ? assets : [], [assets]);
  const useTemplate = (template) => { setContentDraft((current) => ({ ...current, eventTitle: template.title, eventDescription: template.description, generatedContent: `${template.hook}\n\n${template.description}\n\nMessage Fired Arts to plan your visit.` })); setTab("content"); };
  let content = <CreatorDashboard setTab={setTab} planner={planner} contentDraft={contentDraft} templates={templates} criticHistory={criticHistory} insightResult={insightResult} assets={normalizedAssets} />;
  if (tab === "content") content = <ContentHub draft={contentDraft} setDraft={setContentDraft} templates={templates} onSaveTemplateUse={useTemplate} />;
  if (tab === "planner") content = <Planner planner={planner} setPlanner={setPlanner} />;
  if (tab === "insights") content = <Insights result={insightResult} setResult={setInsightResult} />;
  if (tab === "critic") content = <CriticConstruct history={criticHistory} setHistory={setCriticHistory} />;
  if (tab === "visualizer") content = <Visualizer visual={visual} setVisual={setVisual} />;
  if (tab === "scribble") content = <Visualizer visual={scribbleVisual} setVisual={setScribbleVisual} tabLabel="Scribble Diffusion" />;
  if (tab === "images") content = <ArtfulImages assets={normalizedAssets} onAddAsset={onAddAsset} onOpenAssets={onOpenAssets} visual={imageVisual} setVisual={setImageVisual} />;
  if (tab === "templates") content = <TemplateForge templates={templates} setTemplates={setTemplates} onUse={useTemplate} />;
  return <div className="view-content workspace-view creator-suite"><CreatorHeader tab={tab} setTab={setTab} />{content}</div>;
}
