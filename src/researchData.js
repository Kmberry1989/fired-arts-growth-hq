export const researchSources = [
  { id: "source-pricing", fileName: "7way_pricing_comparison.csv", type: "Benchmark dataset", topic: "Competitor pricing", evidenceStatus: "Source only", note: "Seven-studio comparison supplied in the internal research pack." },
  { id: "source-social", fileName: "7way_social_metrics.csv", type: "Benchmark dataset", topic: "Social performance", evidenceStatus: "Source only", note: "Follower, posting, engagement, and format observations supplied in the internal research pack." },
  { id: "source-top-posts", fileName: "7way_top_posts.csv", type: "Benchmark dataset", topic: "Content examples", evidenceStatus: "Source only", note: "One observed top post per studio; useful for hypothesis generation, not causal proof." },
  { id: "source-feed-calendar", fileName: "FiredArts_7Day_Content_Calendar.csv", type: "Working calendar", topic: "Feed content", evidenceStatus: "Ready to use", note: "Seven-day feed calendar with visual direction, captions, hashtags, CTAs, and posting notes." },
  { id: "source-stories-calendar", fileName: "FiredArts_7Day_Stories_Calendar.csv", type: "Working calendar", topic: "Stories", evidenceStatus: "Ready to use", note: "Seven-day story calendar with polls, quizzes, countdowns, and response prompts." },
  { id: "source-reshare", fileName: "FiredArts_Reshare_Captions.csv", type: "Working calendar", topic: "Reshares", evidenceStatus: "Ready to use", note: "Follow-up copy that turns story responses into another content touchpoint." },
  { id: "source-six-month-metrics", fileName: "Fired Arts 6-Month Marketing Metrics Tracker.xlsx", type: "Tracker workbook", topic: "Measurement", evidenceStatus: "Template", note: "Six-month measurement structure supplied for ongoing manual entry." },
  { id: "source-complete-pack", fileName: "FiredArts_Complete_7Day_Pack.xlsx", type: "Working pack", topic: "Content operations", evidenceStatus: "Ready to use", note: "Combined feed and story planning pack; treated as a convenience copy of the CSV sources." },
  { id: "source-pyop-process", fileName: "how are pyop pieces created before they get to the pyop studio_.docx", type: "AI conversation transcript", topic: "PYOP manufacturing", evidenceStatus: "Needs verification", note: "Conversation-derived explanation of commercial slip casting and bisque preparation." },
  { id: "source-3d-printing", fileName: "could any of this be done or customized as a process with aid from 3d printing_.docx", type: "AI conversation transcript", topic: "3D-printing options", evidenceStatus: "Hypothesis", note: "Conversation-derived options for master models, mold tooling, and direct ceramic printing." },
  { id: "source-flashforge", fileName: "Flashforge AD5X, any items..docx", type: "AI conversation transcript", topic: "3D-printing workflow", evidenceStatus: "Needs verification", note: "Conversation-derived setup and post-processing suggestions for a plastic master pattern." },
  { id: "source-suppliers", fileName: "I work for Fired Arts in Kokomo Indiana.  Can you find out through some investigation maybe of the products they have in images they have online where they mass order from_.docx", type: "AI conversation transcript", topic: "Supplier leads", evidenceStatus: "Needs verification", note: "Conversation-derived distributor and manufacturer leads; not confirmed purchasing records." },
  { id: "source-custom-options", fileName: "would any of them participate in this process of customized options.docx", type: "AI conversation transcript", topic: "Custom manufacturing", evidenceStatus: "Needs verification", note: "Conversation-derived assumptions about MOQs, tooling, and contract manufacturing routes." },
  { id: "source-capabilities", fileName: "yes, can you also estimate Fired Arts own capabilities in terms of these processes based on information and visuals you gather in research.docx", type: "AI conversation transcript", topic: "Capability assessment", evidenceStatus: "Hypothesis", note: "Estimated capability fit; requires a real back-of-house equipment, staffing, safety, and kiln review." },
  { id: "source-sop", fileName: "yes.docx", type: "AI conversation transcript", topic: "Draft process controls", evidenceStatus: "Draft only", note: "Conversation-derived SOP and batch-schedule suggestions; not an approved studio procedure." },
  { id: "source-slip-short", fileName: "this.docx", type: "AI conversation transcript", topic: "Casting slip", evidenceStatus: "Needs verification", note: "Conversation-derived low-fire casting-slip recommendations and firing assumptions." },
  { id: "source-slip-report", fileName: "Low-Fire Casting Slip Brand Selection Report (1).docx", type: "AI conversation transcript", topic: "Casting slip", evidenceStatus: "Needs verification", note: "Long-form conversation-derived comparison; market and product claims require current supplier confirmation." },
];

export const pricingBenchmark = [
  { id: "price-fired-arts", sourceId: "source-pricing", studio: "Fired Arts Studio", location: "Kokomo, IN", feeModel: "All-inclusive since Nov 2023; return fee only", pieceRange: "Porch Goose 15in $98 / 7in $58; general pieces varied", workshop: "Canvas, mosaic, goose painting workshops", promotion: "First Friday Get Schooled 20% off", implication: "Protect the no-studio-fee message while making workshops and pickup retention more visible." },
  { id: "price-oh-slip", sourceId: "source-pricing", studio: "Oh Slip Ceramics and Bisque", location: "Kokomo, IN", feeModel: "$60/month membership or $25 Clay Lab plus add-ons", pieceRange: "$5-$100+; vintage molds and seasonal shapes", workshop: "Adult Wheel $95; kids events and seasonal workshops", promotion: "Kid's Day, Plant Bingo, Leaf Bowl, Cobblestone Pumpkins", implication: "Differentiate on immediate walk-in ease and all-inclusive clarity." },
  { id: "price-kiln-creations", sourceId: "source-pricing", studio: "Kiln Creations", location: "Noblesville, IN", feeModel: "$5-$6 reservation plus pottery", pieceRange: "Pottery included with paints, glazing, and firing", workshop: "Try It Wheel and four-week course", promotion: "Spirit Day; 20% to PTO", implication: "Use school and fundraiser tie-ins as a concrete local partnership lane." },
  { id: "price-upaint", sourceId: "source-pricing", studio: "uPaint Pottery Studio", location: "Greenwood / Hamilton County / Plainfield / Westfield / Polaris", feeModel: "One price; no studio fees", pieceRange: "$15-$49 examples", workshop: "uPaint a Story, Pottery Painting, Plant Lady, Enjoy, seasonal events", promotion: "Summer sale and homeschool art day", implication: "Regional competitors validate simple pricing and recurring themed programming." },
  { id: "price-muncie", sourceId: "source-pricing", studio: "Made In Muncie Pottery", location: "Muncie, IN", feeModel: "Walk-ins; supplies and firing included", pieceRange: "$7-$50; some $5-$100+", workshop: "Private wheel lessons and date nights", promotion: "First Thursday pumpkin drop and new-location opening", implication: "Use local identity and event cadence as a regional-content test." },
  { id: "price-all-fired", sourceId: "source-pricing", studio: "All Fired Up!", location: "West Lafayette, IN", feeModel: "$8 adults / $5 kids plus pottery", pieceRange: "600+ bisque shapes", workshop: "Custom birthday plates", promotion: "Flash weekend, student, diva, and family discounts", implication: "Custom group products are a useful offer hypothesis, not a reason to match every discount." },
  { id: "price-glazed-gypsy", sourceId: "source-pricing", studio: "The Glazed Gypsy", location: "Martinsville, IN", feeModel: "No-fee windows during sales", pieceRange: "Autumn and Halloween bisqueware", workshop: "Marbled Mug and Ravioli Spoon Rest", promotion: "End-of-summer and Christmas-in-July no-fee events", implication: "Seasonal scarcity and no-fee windows can inform calendar experiments." },
];

export const socialBenchmark = [
  { id: "social-kiln", sourceId: "source-social", studio: "Kiln Creations", platform: "Instagram", followers: 2275, gain30d: 0, postsPerWeek: "67.6 combined FB + IG", avgLikes: 4.5, avgComments: 0.4, bestFormat: "Reel", mostPosted: "Photo", bestTime: "4 PM", implication: "High volume is not automatically high engagement; test fewer, stronger local stories." },
  { id: "social-upaint", sourceId: "source-social", studio: "uPaint Pottery Studio", platform: "Instagram", followers: 3015, gain30d: 11, postsPerWeek: "12.6 combined FB + IG", avgLikes: 6.2, avgComments: 0.3, bestFormat: "Reel", mostPosted: "Photo", bestTime: "8 PM", implication: "Short video and seasonal promotion are useful formats to test." },
  { id: "social-muncie", sourceId: "source-social", studio: "Made In Muncie", platform: "Instagram", followers: 1997, gain30d: 0, postsPerWeek: "6.3 combined FB + IG", avgLikes: 36, avgComments: 0.5, bestFormat: "Carousel", mostPosted: "Photo", bestTime: "5 PM", implication: "Progress and place-based carousels may be stronger than generic product posts." },
  { id: "social-all-fired", sourceId: "source-social", studio: "All Fired Up!", platform: "Instagram", followers: 1938, gain30d: 2, postsPerWeek: "5.6 combined FB + IG", avgLikes: 22.9, avgComments: 0.3, bestFormat: "Reel", mostPosted: "Mixed", bestTime: "2 PM", implication: "Custom products and visual motion can support conversion-oriented experiments." },
  { id: "social-glazed", sourceId: "source-social", studio: "The Glazed Gypsy", platform: "Instagram", followers: 130, gain30d: "-", postsPerWeek: "6 combined FB + IG", avgLikes: 5.9, avgComments: 1.4, bestFormat: "Photo", mostPosted: "Carousel", bestTime: "12 PM", implication: "Conversation rate may matter more than audience size for a local studio." },
  { id: "social-color-me", sourceId: "source-social", studio: "Color Me Mine", platform: "Instagram", followers: 30677, gain30d: 255, postsPerWeek: "1 combined FB + IG", avgLikes: 79.5, avgComments: 0.3, bestFormat: "Reel", mostPosted: "Mixed", bestTime: "12 PM", implication: "Use as a category benchmark, not a directly comparable local target." },
  { id: "social-fired-arts", sourceId: "source-social", studio: "Fired Arts Studio", platform: "Instagram", followers: 526, gain30d: 0, postsPerWeek: "13.5 combined FB + IG + Threads", avgLikes: 3.4, avgComments: 0.8, bestFormat: "Photo", mostPosted: "Photo", bestTime: "5 AM", implication: "Test stronger Reels, response-led Stories, and posting-time changes against a documented baseline." },
];

export const topPosts = [
  { id: "post-kiln", sourceId: "source-top-posts", studio: "Kiln Creations", date: "2026-08-15", format: "Reel", likes: 75, comments: 2, theme: "Rain flooding closure — annoyed but safety first" },
  { id: "post-upaint", sourceId: "source-top-posts", studio: "uPaint Pottery Studio", date: "2026-07-28", format: "Reel", likes: 50, comments: 1, theme: "Summer sale coming" },
  { id: "post-muncie", sourceId: "source-top-posts", studio: "Made In Muncie", date: "2026-08-12", format: "Feed", likes: 186, comments: 0, theme: "Progress and new-location fall opening" },
  { id: "post-all-fired", sourceId: "source-top-posts", studio: "All Fired Up!", date: "2026-07-23", format: "Reel", likes: 140, comments: 0, theme: "Purdue puzzle mugs custom" },
  { id: "post-glazed", sourceId: "source-top-posts", studio: "The Glazed Gypsy", date: "2026-08-05", format: "Feed", likes: 6, comments: 0, theme: "Augtober autumn inventory" },
  { id: "post-color-me", sourceId: "source-top-posts", studio: "Color Me Mine", date: "2026-08-11", format: "Reel", likes: 245, comments: 0, theme: "Creative time and self-care" },
  { id: "post-fired-arts", sourceId: "source-top-posts", studio: "Fired Arts Studio", date: "2026-08-07", format: "Feed", likes: 5, comments: 0, theme: "Goose is Loose painting event" },
];

const feedItems = [
  ["2026-08-21", "4:00 PM", "Photo", "Unpainted ceramic pumpkins on shelf", "Reasons we love ceramic pumpkins: they do not rot, squirrels do not eat them, and you can paint them Colts blue. Fall bisque is landing this week.", "Comment pumpkin emoji to save one", "Feed post"],
  ["2026-08-22", "2:30 PM", "Reel", "Customer creations: chihuahua, bunnies, strawberry dish", "POV: you walked in to just look and left with three new shelf friends. Tag us in yours and we will feature you.", "Tag us", "Feed post"],
  ["2026-08-23", "5:00 PM", "Carousel", "Mosaic projects, supplies, finished pieces", "Not just pottery: pick your base, pick your tiles, and we handle the grout stress. DM MOSAIC for open spots.", "DM us MOSAIC", "Feed post"],
  ["2026-08-23", "4:00 PM", "Reel", "Kiln unload with goose, pumpkin, Wildkat tray", "Kiln day is Christmas morning. Look what Kokomo made this week; pickup next week.", "Your turn tomorrow?", "Feed post"],
  ["2026-08-24", "3:00 PM", "Photo / event graphic", "Garden gnomes canvas, Black & Gold", "Weekly Canvas Workshop: Black & Gold gnomes, all supplies and step-by-step instruction included.", "Link in bio to save a seat", "Feed post"],
  ["2026-08-25", "2:00 PM", "Photo", "Football / Wildkat tray example", "Game-day platters are officially our August thing. What team should we make next?", "Comment your team", "Feed post"],
  ["2026-08-26", "4:30 PM", "Photo", "Bacon heart pig", "Do not go bacon my heart. Tuesday studio is open 11–6; walk-ins welcome.", "Walk-ins welcome", "Feed post"],
];

const storyItems = [
  ["2026-08-21", "11:00 AM", "Poll", "Empty pumpkin shelf and Colts-blue mockup", "Need Colts blue pumpkins?", "DM PUMPKIN to save", "Story"],
  ["2026-08-22", "10:30 AM", "Question", "Chihuahua figurine boomerang", "What creation should we feature next?", "Tag @firedartsstudio", "Story"],
  ["2026-08-23", "3:00 PM", "Countdown", "Kiln closed, gloves on top", "Kiln unload in one hour", "Reminder to the 4 PM Reel", "Story"],
  ["2026-08-23", "5:30 PM", "Quiz", "Mosaic tiles close-up", "Do mosaics need grout stress?", "Highlight the no-stress answer", "Story"],
  ["2026-08-24", "10:00 AM", "Countdown", "Garden gnomes canvas example", "Canvas Workshop Tuesday 5:30 PM", "Book a canvas seat", "Story"],
  ["2026-08-25", "11:30 AM", "Poll", "Blank tray and four team examples", "What team tray next?", "Vote, then tally results", "Story"],
  ["2026-08-26", "3:30 PM", "Poll", "Bacon heart pig in kiln", "Paint tonight?", "Walk-ins today", "Story"],
];

const reshareItems = [
  ["2026-08-21", "2026-08-22", "Colts blue pumpkins?", "You voted yes; comment BLUE to save yours.", "Poll results plus blue pumpkin", "DM BLUE"],
  ["2026-08-22", "2026-08-23", "What creation should we feature next?", "You asked for more bunnies; here are three more bunny bowls.", "Three bunny bowls", "Tag a bunny lover"],
  ["2026-08-25", "2026-08-26", "Wildkats vs Colts / IU vs Purdue", "Wildkats won; next up is a live Wildkats tray paint.", "Poll results plus tray WIP", "Vote in next poll"],
  ["2026-08-26", "2026-08-27", "Paint tonight?", "Seven people said they were on the way and actually came; bacon hearts are firing now.", "Bacon hearts on drying rack", "Walk-ins today"],
  ["2026-08-27", "2026-08-28", "How cute is this frog?", "Average frog cuteness: 98%; new crackle planters are now on the shelf.", "Poll result plus planter shelf", "Save for plant night"],
];

export const researchContent = [
  ...feedItems.map(([date, time, format, asset, copy, cta, channel], index) => ({ id: `feed-${index + 1}`, sourceId: "source-feed-calendar", date, time, channel, format, asset, copy, cta, status: "Draft", hypothesis: "A specific visual plus one local CTA will generate more meaningful replies than a generic studio reminder." })),
  ...storyItems.map(([date, time, format, asset, copy, cta, channel], index) => ({ id: `story-${index + 1}`, sourceId: "source-stories-calendar", date, time, channel, format, asset, copy, cta, status: "Draft", hypothesis: "Interactive stickers will create response signals that can be reshared into a second touchpoint." })),
  ...reshareItems.map(([originalDate, date, prompt, copy, asset, cta], index) => ({ id: `reshare-${index + 1}`, sourceId: "source-reshare", date, time: "10:00 AM", channel: "Reshare", format: "Story reshare", asset, copy, cta, status: "Draft", hypothesis: "A response-led follow-up will convert audience participation into return attention.", originalDate, prompt })),
];

export const researchOpportunities = [
  { id: "opp-content-format", title: "Response-led local content test", category: "Marketing experiment", sourceIds: ["source-social", "source-top-posts", "source-feed-calendar", "source-stories-calendar"], evidenceStatus: "Hypothesis", fit: "High", risk: "Low", status: "Ready", owner: "Marketing", nextTest: "Run the seven-day feed/story pack, record reach, replies, saves, profile visits, and walk-in mentions.", successMetric: "Story response rate and attributable visit conversations beat the current baseline." },
  { id: "opp-pickup-loop", title: "Pickup-to-return loop", category: "Retention", sourceIds: ["source-pricing", "source-six-month-metrics"], evidenceStatus: "Ready to test", fit: "High", risk: "Low", status: "Build", owner: "Studio team", nextTest: "Add a welcome-back offer to the pickup handoff and track redemptions for 30 days.", successMetric: "Redemptions and second visits are recorded without slowing pickup." },
  { id: "opp-local-exclusive", title: "Kokomo micro-batch exclusive", category: "Product experiment", sourceIds: ["source-3d-printing", "source-capabilities", "source-custom-options"], evidenceStatus: "Hypothesis", fit: "Medium", risk: "Medium", status: "Validate", owner: "Owner + studio lead", nextTest: "Choose one simple, open form; validate equipment, staff time, contamination controls, firing fit, and a 10–30 piece pilot before spending on tooling.", successMetric: "A safe pilot produces acceptable bisque at a margin and labor level the studio accepts." },
  { id: "opp-supplier-audit", title: "Supplier and catalog audit", category: "Operations", sourceIds: ["source-suppliers", "source-slip-short", "source-slip-report"], evidenceStatus: "Needs verification", fit: "Medium", risk: "Medium", status: "Research", owner: "Owner + purchasing", nextTest: "Confirm current distributor relationships, invoices, product codes, shipping terms, and current slip availability directly with suppliers.", successMetric: "A verified source-of-truth list replaces conversation-derived supplier assumptions." },
  { id: "opp-custom-partner", title: "External custom manufacturing route", category: "Product experiment", sourceIds: ["source-custom-options", "source-3d-printing"], evidenceStatus: "Needs verification", fit: "Low", risk: "High", status: "Parked", owner: "Owner", nextTest: "Only pursue after a specific design, volume estimate, target margin, and supplier quote exist.", successMetric: "A quote-supported decision shows a viable volume and margin case." },
];

export const researchMetrics = [
  { id: "metric-aug-2026-followers", period: "2026-08", area: "Audience", metric: "Instagram followers", actual: 526, target: "Record baseline", unit: "count", definition: "Follower count observed in the supplied social benchmark", sourceId: "source-social", status: "Baseline" },
  { id: "metric-aug-2026-likes", period: "2026-08", area: "Engagement", metric: "Instagram average likes", actual: 3.4, target: "Improve", unit: "per post", definition: "Average likes reported in the supplied social benchmark", sourceId: "source-social", status: "Baseline" },
  { id: "metric-aug-2026-comments", period: "2026-08", area: "Engagement", metric: "Instagram average comments", actual: 0.8, target: "Improve", unit: "per post", definition: "Average comments reported in the supplied social benchmark", sourceId: "source-social", status: "Baseline" },
  { id: "metric-aug-2026-content", period: "2026-08", area: "Execution", metric: "Seven-day feed items ready", actual: 7, target: 7, unit: "items", definition: "Rows in the supplied seven-day feed calendar", sourceId: "source-feed-calendar", status: "Ready" },
  { id: "metric-aug-2026-stories", period: "2026-08", area: "Execution", metric: "Seven-day story items ready", actual: 7, target: 7, unit: "items", definition: "Rows in the supplied seven-day stories calendar", sourceId: "source-stories-calendar", status: "Ready" },
  { id: "metric-aug-2026-reshare", period: "2026-08", area: "Execution", metric: "Reshare follow-ups ready", actual: 5, target: 5, unit: "items", definition: "Rows in the supplied reshare caption calendar", sourceId: "source-reshare", status: "Ready" },
];

export const researchDecisions = [
  { id: "decision-content", question: "Which content format deserves more time?", decision: "Test response-led Stories plus kiln/customer-creation Reels against the current photo-heavy baseline.", status: "Open", owner: "Marketing", due: "2026-09-01", sourceIds: ["source-social", "source-top-posts"] },
  { id: "decision-microbatch", question: "Should Fired Arts produce a custom local blank in-house?", decision: "Do not approve production yet; validate design simplicity, contamination controls, staffing, costs, and firing fit first.", status: "Guardrail", owner: "Owner + studio lead", due: "2026-09-15", sourceIds: ["source-3d-printing", "source-capabilities", "source-sop"] },
  { id: "decision-slip", question: "Which casting slip should be tested?", decision: "Create a verified supplier shortlist and run compatibility tests before choosing a production body.", status: "Open", owner: "Owner + purchasing", due: "2026-09-15", sourceIds: ["source-slip-short", "source-slip-report"] },
];

export const evidenceStatuses = ["All", "Source only", "Ready to use", "Template", "Needs verification", "Hypothesis", "Draft only", "Ready to test", "Baseline"];

