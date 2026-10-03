import { useEffect, useMemo, useRef, useState } from "react";
import { copyToClipboard, exportWorkspaceFile } from "./storage";
import { callAuthenticatedApi, uploadAssetFile, useCloudCollection } from "./firebaseRest";

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
  cards: [],
  todos: [],
  links: [],
  notes: "",
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
  const [records, setRecords] = useCloudCollection("creatorState", []);
  const value = records.find((record) => record.id === key)?.value ?? fallback;
  const setValue = (nextValue) => setRecords((current) => {
    const currentValue = current.find((record) => record.id === key)?.value ?? fallback;
    const next = typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
    const record = { id: key, schemaVersion: 2, value: next, updatedAt: new Date().toISOString() };
    return current.some((item) => item.id === key) ? current.map((item) => item.id === key ? record : item) : [...current, record];
  });
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
    <div className="creator-current-label"><span>{current[2]}</span><strong>{current[1]}</strong><small>Authenticated cloud workspace</small></div>
  </>;
}

function CreatorDashboard({ setTab, planner, contentDraft, templates, criticHistory, insightResult, assets }) {
  const readyCards = planner.cards.filter((card) => card.status === "Ready").length;
  return <div className="creator-view-grid creator-dashboard-grid">
    <CreatorCard eyebrow="Suite overview" title="Make the next creative move obvious." text="The Fire Creator Suite gathers the reusable creative tools into a Fired Arts workflow. Governance and role-explainer surfaces are intentionally excluded.">
      <div className="creator-stat-grid"><div><strong>{planner.cards.length}</strong><small>planned items</small></div><div><strong>{readyCards}</strong><small>ready to use</small></div><div><strong>{assets.length}</strong><small>cloud assets</small></div><div><strong>{templates.length}</strong><small>templates</small></div></div>
    </CreatorCard>
    <CreatorCard eyebrow="Quick start" title="Choose a starting point." className="creator-quick-card">
      <div className="creator-launch-list"><button onClick={() => setTab("content")}><span>□</span><strong>Content Hub</strong><small>{contentDraft.generatedContent ? "Continue your saved draft" : "Build a platform-ready draft"}</small></button><button onClick={() => setTab("planner")}><span>◫</span><strong>Planner</strong><small>Organize cards, links, notes, and to-dos</small></button><button onClick={() => setTab("critic")}><span>✦</span><strong>Critic Construct</strong><small>{criticHistory.length ? "Review your saved critiques" : "Check a draft before it leaves the studio"}</small></button><button onClick={() => setTab("images")}><span>✺</span><strong>Artful Images</strong><small>Generate a visual or open cloud assets</small></button></div>
    </CreatorCard>
    <CreatorCard eyebrow="Working context" title="What this suite keeps in view." className="creator-context-card"><ul className="creator-check-list"><li><span>01</span>Fired Arts is always the brand voice.</li><li><span>02</span>Real studio images stay source-labeled.</li><li><span>03</span>Drafts and plans persist to the owner workspace.</li><li><span>04</span>Provider IDs confirm external actions.</li></ul></CreatorCard>
    <CreatorCard eyebrow="Latest insight" title={insightResult?.themes?.[0] || "No insight extracted yet."} text={insightResult ? insightResult.suggestions?.[0] : "Paste feedback into Insights to surface themes and next actions."} className="creator-insight-card"><CreatorButton secondary onClick={() => setTab("insights")}>Open Insights →</CreatorButton></CreatorCard>
  </div>;
}

function ContentHub({ draft, setDraft, templates, onSaveTemplateUse, brandVoice }) {
  const [saved, setSaved] = useState(false);
  const [generation, setGeneration] = useState({ busy: false, error: "", runId: "" });
  const generate = async () => { setGeneration({ busy: true, error: "", runId: "" }); try { const result = await callAuthenticatedApi("/api/ai/generate-content", { title: draft.eventTitle, description: draft.eventDescription, audience: draft.targetAudience, platform: draft.platform, brandVoice: `${brandVoice} Desired tone: ${draft.desiredTone}` }); const output = result.data.output; setDraft((current) => ({ ...current, generatedContent: `${output.hook}\n\n${output.caption}\n\n${output.cta}\n${output.hashtags.join(" ")}`, aiRunId: result.data.runId, reviewRequired: true })); setGeneration({ busy: false, error: "", runId: result.data.runId }); setSaved(false); } catch (error) { setGeneration({ busy: false, error: error.message, runId: "" }); } };
  const save = () => { setDraft((current) => ({ ...current })); setSaved(true); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Content Alchemist" title="Build a useful draft from verified details." text="Gemini generates a structured, brand-grounded draft. Every result remains review-required until a person approves it."><div className="creator-form-grid"><label>Event or post title<input value={draft.eventTitle} onChange={(event) => setDraft((current) => ({ ...current, eventTitle: event.target.value }))} placeholder="e.g. Friday night at Fired Arts" /></label><label>Audience<input value={draft.targetAudience} onChange={(event) => setDraft((current) => ({ ...current, targetAudience: event.target.value }))} /></label><label className="creator-span-2">Description<textarea value={draft.eventDescription} onChange={(event) => setDraft((current) => ({ ...current, eventDescription: event.target.value }))} placeholder="Use confirmed dates, prices, availability, and links only." /></label><label>Platform<select value={draft.platform} onChange={(event) => setDraft((current) => ({ ...current, platform: event.target.value }))}><option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>Email</option></select></label><label>Tone<input value={draft.desiredTone} onChange={(event) => setDraft((current) => ({ ...current, desiredTone: event.target.value }))} /></label></div><div className="creator-actions"><CreatorButton onClick={generate} disabled={generation.busy || !draft.eventTitle.trim() || !draft.eventDescription.trim()}>{generation.busy ? "Generating…" : "Generate with Gemini →"}</CreatorButton>{saved && <span className="creator-success">Draft retained</span>}</div>{generation.error && <span className="creator-error" role="alert">{generation.error}</span>}</CreatorCard><CreatorCard eyebrow="AI-generated content" title="Review before you share." text={draft.aiRunId ? `AI draft—review required · run ${draft.aiRunId}` : "The model cannot publish or verify business facts."}><textarea className="creator-output" value={draft.generatedContent} onChange={(event) => setDraft((current) => ({ ...current, generatedContent: event.target.value }))} placeholder="Your AI draft will appear here." /><div className="creator-actions"><CreatorButton secondary disabled={!draft.generatedContent} onClick={() => copyToClipboard(draft.generatedContent)}>Copy draft</CreatorButton><CreatorButton secondary disabled={!draft.generatedContent} onClick={() => exportWorkspaceFile("fired-arts-content-draft.txt", draft.generatedContent, "text/plain")}>Export .txt</CreatorButton><CreatorButton secondary disabled={!draft.generatedContent} onClick={save}>Retain draft</CreatorButton></div></CreatorCard><CreatorCard eyebrow="Template shapes" title="Start from a reusable pattern." className="creator-span-2"><div className="creator-template-strip">{templates.map((template) => <button key={template.id} onClick={() => onSaveTemplateUse(template)}><span className={`creator-accent ${template.accent}`} /><small>{template.category}</small><strong>{template.title}</strong><p>{template.description}</p></button>)}</div></CreatorCard></div>;
}

function Planner({ planner, setPlanner }) {
  const [newCard, setNewCard] = useState({ title: "", date: "", channel: "Instagram", note: "" });
  const [newTodo, setNewTodo] = useState("");
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const addCard = () => { if (!newCard.title.trim()) return; setPlanner((current) => ({ ...current, cards: [{ ...newCard, id: creatorId("card"), status: "Draft" }, ...current.cards] })); setNewCard({ title: "", date: "", channel: "Instagram", note: "" }); };
  const addTodo = () => { if (!newTodo.trim()) return; setPlanner((current) => ({ ...current, todos: [...current.todos, { id: creatorId("todo"), text: newTodo.trim(), completed: false }] })); setNewTodo(""); };
  const addLink = () => { if (!newLink.title.trim() || !newLink.url.trim()) return; const url = newLink.url.startsWith("http") ? newLink.url : `https://${newLink.url}`; setPlanner((current) => ({ ...current, links: [...current.links, { id: creatorId("link"), title: newLink.title.trim(), url }] })); setNewLink({ title: "", url: "" }); };
  return <div className="creator-planner"><div className="creator-planner-board"><CreatorCard eyebrow="Planner board" title="Keep the idea, the work, and the next step together." text="A cloud-backed planning board for resources, notes, and to-dos. Calendar events remain provider-confirmed." className="creator-span-2"><div className="creator-planner-add"><input value={newCard.title} onChange={(event) => setNewCard((current) => ({ ...current, title: event.target.value }))} placeholder="New planned item" /><input type="date" value={newCard.date} onChange={(event) => setNewCard((current) => ({ ...current, date: event.target.value }))} /><select value={newCard.channel} onChange={(event) => setNewCard((current) => ({ ...current, channel: event.target.value }))}><option>Instagram</option><option>Facebook</option><option>Email</option><option>In studio</option></select><CreatorButton onClick={addCard}>Add card</CreatorButton></div><div className="creator-plan-list">{planner.cards.map((card) => <article key={card.id} className="creator-plan-card"><div><small>{card.date || "Unscheduled"} · {card.channel}</small><strong>{card.title}</strong><p>{card.note || "Add a note when the next detail is clear."}</p></div><select value={card.status} onChange={(event) => setPlanner((current) => ({ ...current, cards: current.cards.map((item) => item.id === card.id ? { ...item, status: event.target.value } : item) }))}><option>Draft</option><option>Ready</option><option>Complete</option><option>Parked</option></select><button className="creator-icon-button" onClick={() => setPlanner((current) => ({ ...current, cards: current.cards.filter((item) => item.id !== card.id) }))} aria-label={`Delete ${card.title}`}>×</button></article>)}{planner.cards.length === 0 && <p className="creator-empty">No planned items yet. Add the first card above.</p>}</div></CreatorCard><CreatorCard eyebrow="To-do" title="Small actions that keep the plan moving."><div className="creator-add-row"><input value={newTodo} onChange={(event) => setNewTodo(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTodo()} placeholder="Add a to-do" /><CreatorButton onClick={addTodo}>+</CreatorButton></div><div className="creator-todo-list">{planner.todos.map((todo) => <label key={todo.id}><input type="checkbox" checked={todo.completed} onChange={() => setPlanner((current) => ({ ...current, todos: current.todos.map((item) => item.id === todo.id ? { ...item, completed: !item.completed } : item) }))} /><span className={todo.completed ? "done" : ""}>{todo.text}</span><button type="button" onClick={() => setPlanner((current) => ({ ...current, todos: current.todos.filter((item) => item.id !== todo.id) }))}>×</button></label>)}</div></CreatorCard><CreatorCard eyebrow="Resources" title="Keep useful references close."><div className="creator-add-stack"><input value={newLink.title} onChange={(event) => setNewLink((current) => ({ ...current, title: event.target.value }))} placeholder="Resource title" /><input value={newLink.url} onChange={(event) => setNewLink((current) => ({ ...current, url: event.target.value }))} placeholder="https://..." /><CreatorButton onClick={addLink}>Add resource</CreatorButton></div><div className="creator-link-list">{planner.links.map((link) => <div key={link.id}><a href={link.url} target="_blank" rel="noreferrer">{link.title}</a><button onClick={() => setPlanner((current) => ({ ...current, links: current.links.filter((item) => item.id !== link.id) }))}>×</button></div>)}</div></CreatorCard><CreatorCard eyebrow="Whiteboard note" title="Leave context for the next creative pass." className="creator-span-2"><textarea className="creator-output creator-note" value={planner.notes} onChange={(event) => setPlanner((current) => ({ ...current, notes: event.target.value }))} /></CreatorCard></div></div>;
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
  const [request, setRequest] = useState({ busy: false, error: "" });
  const run = async () => { if (!raw.trim()) return; setRequest({ busy: true, error: "" }); try { const response = await callAuthenticatedApi("/api/ai/extract-insights", { sourceText: raw }); const output = response.data.output; setResult({ themes: output.themes, suggestions: output.actions, evidence: output.evidence, uncertainty: output.uncertainty, runId: response.data.runId }); setRequest({ busy: false, error: "" }); } catch (error) { setRequest({ busy: false, error: error.message }); } };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Insight Extractor" title="Turn unstructured feedback into an evidence-backed next question." text="Gemini must attach a short source quote to every interpretation and state uncertainty when the sample is weak."><textarea className="creator-large-input" value={raw} onChange={(event) => setRaw(event.target.value)} placeholder="Paste feedback or notes here..." /><div className="creator-actions"><CreatorButton onClick={run} disabled={!raw.trim() || request.busy}>{request.busy ? "Analyzing…" : "Extract with Gemini →"}</CreatorButton><CreatorButton secondary onClick={() => { setRaw(""); setResult(null); }}>Clear</CreatorButton></div>{request.error && <span className="creator-error" role="alert">{request.error}</span>}</CreatorCard><CreatorCard eyebrow="AI-generated insights" title={result ? "Evidence to review." : "Your result will appear here."}>{result ? <div className="creator-result-stack"><div><small>Key themes</small><div className="creator-pill-row">{result.themes.map((theme) => <span key={theme}>{theme}</span>)}</div></div><div><small>Quoted evidence</small><ul>{result.evidence?.map((item, index) => <li key={`${item.quote}-${index}`}><q>{item.quote}</q> — {item.interpretation}</li>)}</ul></div><div><small>Suggested actions</small><ul>{result.suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul></div><div><small>Uncertainty</small><ul>{result.uncertainty?.map((item) => <li key={item}>{item}</li>)}</ul></div><CreatorButton secondary onClick={() => exportWorkspaceFile("fired-arts-insights.json", JSON.stringify(result, null, 2))}>Export insight record</CreatorButton></div> : <p className="creator-empty">Paste real feedback to create an evidence-aware starting point.</p>}</CreatorCard></div>;
}

function CriticConstruct({ history, setHistory, brandVoice }) {
  const [draft, setDraft] = useCreatorState("critic-draft", { postText: "", postLink: "", mediaDescription: "" });
  const [result, setResult] = useState(null);
  const [request, setRequest] = useState({ busy: false, error: "" });
  const analyze = async () => { if (!draft.postText.trim()) return; setRequest({ busy: true, error: "" }); try { const response = await callAuthenticatedApi("/api/ai/critique", { postText: draft.postText, mediaDescription: draft.mediaDescription, brandVoice }); setResult({ ...response.data.output, runId: response.data.runId }); setRequest({ busy: false, error: "" }); } catch (error) { setRequest({ busy: false, error: error.message }); } };
  const save = () => { if (!result) return; setHistory((current) => [{ id: creatorId("critique"), ...result, original: draft.postText, savedAt: new Date().toISOString().slice(0, 10) }, ...current]); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Critic Construct" title="Check the draft before it leaves the studio." text="Gemini checks clarity, audience fit, and unsupported claims without publishing anything."><textarea className="creator-large-input" value={draft.postText} onChange={(event) => setDraft((current) => ({ ...current, postText: event.target.value }))} placeholder="Paste the post text here..." /><input value={draft.postLink} onChange={(event) => setDraft((current) => ({ ...current, postLink: event.target.value }))} placeholder="Optional post or campaign link" /><input value={draft.mediaDescription} onChange={(event) => setDraft((current) => ({ ...current, mediaDescription: event.target.value }))} placeholder="Describe the attached visual" /><div className="creator-actions"><CreatorButton onClick={analyze} disabled={request.busy || !draft.postText.trim()}>{request.busy ? "Analyzing…" : "Analyze with Gemini →"}</CreatorButton><CreatorButton secondary onClick={() => copyToClipboard(draft.postText)} disabled={!draft.postText}>Copy original</CreatorButton></div>{request.error && <span className="creator-error" role="alert">{request.error}</span>}</CreatorCard><CreatorCard eyebrow="AI analysis · review required" title={result ? `${result.score}/10 · human review required` : "Your analysis will appear here."}>{result ? <div className="creator-result-stack"><p>{result.critique}</p>{result.unsupportedClaims?.length > 0 && <div className="creator-note-box"><strong>Unsupported claims</strong><ul>{result.unsupportedClaims.map((claim) => <li key={claim}>{claim}</li>)}</ul></div>}<label>Reconstructed post<textarea className="creator-output" value={result.reconstructedPost} onChange={(event) => setResult((current) => ({ ...current, reconstructedPost: event.target.value }))} /></label><div className="creator-actions"><CreatorButton secondary onClick={() => copyToClipboard(result.reconstructedPost)}>Copy improved draft</CreatorButton><CreatorButton secondary onClick={save}>Retain analysis</CreatorButton></div></div> : <p className="creator-empty">Add draft text to begin.</p>}</CreatorCard><CreatorCard eyebrow="Retained analyses" title="Keep the useful comparisons." className="creator-span-2">{history.length ? <div className="creator-history-list">{history.slice(0, 5).map((item) => <article key={item.id}><strong>{item.score}/10</strong><p>{item.critique}</p><small>{item.savedAt}</small></article>)}</div> : <p className="creator-empty">Retained critiques will appear here.</p>}</CreatorCard></div>;
}

function Visualizer({ visual, setVisual, tabLabel = "Visualizer" }) {
  const [prompt, setPrompt] = useCreatorState(`${tabLabel.toLowerCase().replaceAll(" ", "-")}-prompt`, "");
  const suggestions = tabLabel === "Scribble Diffusion" ? ["A playful clay stamp for a family workshop", "A hand-drawn pattern for a pottery night", "A simple icon for a pickup reminder"] : ["A warm editorial image of hands making a ceramic piece", "A colorful square post for a Fired Arts class", "A calm workshop scene with room for headline text"];
  const createBrief = () => { if (!prompt.trim()) return; setVisual({ title: prompt.trim().slice(0, 48), direction: `Create a ${tabLabel === "Scribble Diffusion" ? "hand-drawn, imperfect" : "warm, tactile"} visual around “${prompt.trim()}”. Keep the composition clear enough for a Fired Arts social post.`, palette: "Warm paper · cobalt · terracotta · deep ink", crop: "Square first; keep the main subject inside the center-safe area.", note: "Use a real studio image or approved artwork before publishing." }); };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow={tabLabel} title={tabLabel === "Scribble Diffusion" ? "Combine a scribble with a useful visual direction." : "Turn a prompt into a visual production brief."} text="This planning step keeps the idea, crop, palette, and production note together. It does not claim to generate or publish an image."><div className="creator-suggestion-list">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setPrompt(suggestion)}>✦ {suggestion}</button>)}</div><textarea className="creator-large-input" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={tabLabel === "Scribble Diffusion" ? "Describe what the scribble should become..." : "Describe the visual you want to explore..."} />{tabLabel === "Scribble Diffusion" && <ScribblePad /> }<div className="creator-actions"><CreatorButton onClick={createBrief} disabled={!prompt.trim()}>Create production brief →</CreatorButton><CreatorButton secondary onClick={() => setPrompt("")}>Clear prompt</CreatorButton></div></CreatorCard><CreatorCard eyebrow="Generated concept" title={visual?.title || "Your concept awaits."} text={visual ? "Review the direction, then move into Assets or Social Studio when a real image is ready." : "Your brief will appear here."}>{visual ? <div className="creator-result-stack"><div><small>Visual direction</small><p>{visual.direction}</p></div><div><small>Palette</small><strong>{visual.palette}</strong></div><div><small>Crop</small><p>{visual.crop}</p></div><div className="creator-note-box">{visual.note}</div><CreatorButton secondary onClick={() => exportWorkspaceFile(`${tabLabel.toLowerCase().replaceAll(" ", "-")}-brief.txt`, `${visual.title}\n\n${visual.direction}\n\nPalette: ${visual.palette}\nCrop: ${visual.crop}\n\n${visual.note}`, "text/plain")}>Export brief</CreatorButton></div> : <p className="creator-empty">Start with a short description or choose a suggestion.</p>}</CreatorCard></div>;
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
  const [request, setRequest] = useState({ busy: false, error: "" });
  const upload = async (event) => { const file = event.target.files?.[0]; if (!file) return; setRequest({ busy: true, error: "" }); try { onAddAsset(await uploadAssetFile(file)); setRequest({ busy: false, error: "" }); } catch (error) { setRequest({ busy: false, error: error.message }); } finally { event.target.value = ""; } };
  const create = async () => { if (!prompt.trim()) return; setRequest({ busy: true, error: "" }); try { const response = await callAuthenticatedApi("/api/ai/generate-image", { prompt, aspectRatio: "4:5" }); const imageResponse = await fetch(response.data.imageDataUrl); const blob = await imageResponse.blob(); const file = new File([blob], `fired-arts-ai-${Date.now()}.png`, { type: blob.type || "image/png" }); const asset = await uploadAssetFile(file); onAddAsset({ ...asset, tags: [...asset.tags, "ai-generated", "review-required"], aiRunId: response.data.runId, reviewRequired: true }); setVisual({ title: prompt.trim().slice(0, 48), direction: prompt.trim(), palette: "Generated by Google Imagen", crop: "4:5 portrait", note: `AI-generated asset—review required · run ${response.data.runId}` }); setRequest({ busy: false, error: "" }); } catch (error) { setRequest({ busy: false, error: error.message }); } };
  return <div className="creator-view-grid creator-two-column"><CreatorCard eyebrow="Artful Images" title="Generate a review-ready visual or upload approved photography." text="Google Imagen results are stored in the protected asset library and labeled AI-generated until reviewed."><textarea className="creator-large-input" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the visual you want to create..." /><div className="creator-actions"><CreatorButton onClick={create} disabled={!prompt.trim() || request.busy}>{request.busy ? "Generating and uploading…" : "Generate with Imagen →"}</CreatorButton><label className="creator-upload">Upload approved image<input type="file" accept="image/*" disabled={request.busy} onChange={upload} /></label><CreatorButton secondary onClick={onOpenAssets}>Open Assets →</CreatorButton></div>{request.error && <span className="creator-error" role="alert">{request.error}</span>}</CreatorCard><CreatorCard eyebrow="Cloud gallery" title={`${assets.length} stored asset${assets.length === 1 ? "" : "s"}.`}>{assets.length ? <div className="creator-asset-grid">{assets.slice(0, 8).map((asset) => <img key={asset.id} src={asset.downloadUrl || asset.src} alt={asset.name} title={asset.name} />)}</div> : <p className="creator-empty">Generate a review-ready visual or upload an approved Fired Arts image.</p>}</CreatorCard>{visual && <CreatorCard eyebrow="Visual record" title={visual.title} className="creator-span-2"><div className="creator-result-stack"><p>{visual.direction}</p><span>{visual.palette} · {visual.crop}</span><div className="creator-note-box">{visual.note}</div></div></CreatorCard>}</div>;
}

function TemplateForge({ templates, setTemplates, onUse }) {
  const [form, setForm] = useState({ title: "", description: "", category: "Custom", accent: "blue" });
  const add = () => { if (!form.title.trim()) return; setTemplates((current) => [{ ...form, id: creatorId("template") }, ...current]); setForm({ title: "", description: "", category: "Custom", accent: "blue" }); };
  return <div className="creator-view-grid creator-template-page"><CreatorCard eyebrow="Template Forge" title="Build reusable shapes for Fired Arts work." text="Templates from the command suite are adapted here for authenticated cloud persistence and can feed the Content Hub directly."><div className="creator-form-grid"><label>Template title<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="e.g. Weekend workshop" /></label><label>Category<input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} /></label><label className="creator-span-2">Description<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What should this template help the team do?" /></label></div><div className="creator-actions"><CreatorButton onClick={add}>Create template →</CreatorButton></div></CreatorCard><div className="creator-template-library">{templates.map((template) => <article key={template.id} className="creator-template-card"><span className={`creator-accent ${template.accent}`} /><small>{template.category}</small><h3>{template.title}</h3><p>{template.description}</p><div className="creator-actions"><CreatorButton onClick={() => onUse(template)}>Use template</CreatorButton>{template.id.startsWith("creator-template-") ? null : <button className="creator-text-button" onClick={() => setTemplates((current) => current.filter((item) => item.id !== template.id))}>Remove</button>}</div></article>)}</div></div>;
}

export function FireCreatorSuite({ assets, onAddAsset, onOpenAssets, brandVoice = "Warm, welcoming, specific, and grounded in real studio details." }) {
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
  if (tab === "content") content = <ContentHub draft={contentDraft} setDraft={setContentDraft} templates={templates} onSaveTemplateUse={useTemplate} brandVoice={brandVoice} />;
  if (tab === "planner") content = <Planner planner={planner} setPlanner={setPlanner} />;
  if (tab === "insights") content = <Insights result={insightResult} setResult={setInsightResult} />;
  if (tab === "critic") content = <CriticConstruct history={criticHistory} setHistory={setCriticHistory} brandVoice={brandVoice} />;
  if (tab === "visualizer") content = <Visualizer visual={visual} setVisual={setVisual} />;
  if (tab === "scribble") content = <Visualizer visual={scribbleVisual} setVisual={setScribbleVisual} tabLabel="Scribble Diffusion" />;
  if (tab === "images") content = <ArtfulImages assets={normalizedAssets} onAddAsset={onAddAsset} onOpenAssets={onOpenAssets} visual={imageVisual} setVisual={setImageVisual} />;
  if (tab === "templates") content = <TemplateForge templates={templates} setTemplates={setTemplates} onUse={useTemplate} />;
  return <div className="view-content workspace-view creator-suite"><CreatorHeader tab={tab} setTab={setTab} />{content}</div>;
}
