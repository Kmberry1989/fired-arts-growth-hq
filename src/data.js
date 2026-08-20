export const studio = {
  name: "Fired Arts",
  descriptor: "Regional Growth HQ",
  location: "Kokomo, Indiana",
  address: "111 W Sycamore St.",
  phone: "(765) 450-3088",
  stats: {
    outreach: 53,
    radius: 15,
    ready: 24,
    verify: 27,
  },
  baseline: [
    ["All-inclusive pricing", "Since 11/1/2023", "No studio fee"],
    ["Piece range", "$10–$100", "Base price of pottery"],
    ["Firing turnaround", "1 week", "Ready for pickup"],
    ["Pickup hold", "60 days", "Up to 3 courtesy calls"],
    ["Birthday capacity", "Up to 24", "Package based on 8"],
  ],
};

const outreachTargetSeed = [
  { name: "Kokomo School Corporation", segment: "Schools / PTOs", place: "Kokomo", status: "Ready to approach", offer: "Field trip + tile-wall fundraiser", priority: 5 },
  { name: "MicroChips Early Learning Center", segment: "Daycare / preschool", place: "Kokomo", status: "Verify first", offer: "Family keepsake coupon", priority: 5 },
  { name: "Kid City USA", segment: "Daycare / preschool", place: "Kokomo", status: "Verify first", offer: "Fired Arts To Go", priority: 5 },
  { name: "KASH Homeschool Network", segment: "Homeschool", place: "Kokomo", status: "Ready to approach", offer: "Monthly technique lab", priority: 5 },
  { name: "Homeschool Helpers", segment: "Homeschool", place: "Kokomo", status: "New lead", offer: "Monday private studio event", priority: 4 },
  { name: "Classical Conversations", segment: "Homeschool", place: "Kokomo", status: "New lead", offer: "History-themed pottery lab", priority: 4 },
  { name: "Sagamore Council", segment: "Scouts", place: "Kokomo / regional", status: "Ready to approach", offer: "Badge-aligned workshop", priority: 5 },
  { name: "Girl Scouts of Central Indiana", segment: "Scouts", place: "Regional", status: "Verify first", offer: "Potter badge workshop", priority: 4 },
  { name: "Crossroads Community Church", segment: "Church / youth", place: "Kokomo", status: "New lead", offer: "High-school creative outing", priority: 3 },
  { name: "First Congregational Christian Church", segment: "Church / seniors", place: "Kokomo", status: "New lead", offer: "Senior Socials", priority: 3 },
  { name: "Kokomo Family YMCA", segment: "Civic / community", place: "Kokomo", status: "Ready to approach", offer: "Camp add-on / family night", priority: 5 },
  { name: "KHCPL Homeschool Hangout", segment: "Library / community", place: "Kokomo", status: "Ready to approach", offer: "Mobile mini-project + coupon", priority: 4 },
  { name: "Greater Kokomo Chamber", segment: "Chamber / B2B", place: "Kokomo", status: "Ready to approach", offer: "Team-building night", priority: 5 },
  { name: "Miami County Chamber", segment: "Chamber / regional", place: "Peru", status: "Verify first", offer: "Rainy-day destination", priority: 3 },
  { name: "Hamilton County HR pipeline", segment: "Corporate / regional", place: "Carmel + north Indy", status: "New lead", offer: "Creative retreat", priority: 3 },
  { name: "Senior activity directors", segment: "Senior / community", place: "40-mile radius", status: "New segment", offer: "Calm daytime social", priority: 3 },
];

export const outreachTargets = outreachTargetSeed.map((item, index) => ({
  id: `target-${String(index + 1).padStart(2, "0")}`,
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  notes: "",
  relationshipStatus: item.status === "Ready to approach" ? "Research" : "New",
  ...item,
}));

export const competitors = [
  { name: "Oh Slip", type: "Direct ceramics", distance: "~2 mi", audience: "Kids, adults, serious hobbyists", strength: "Vintage molds, wheel, classes, memberships", response: "Contemporary walk-in ease, groups, keepsakes", level: "Direct" },
  { name: "Gravity", type: "High-energy party", distance: "~3 mi", audience: "Kids, teens, parties", strength: "Physical energy + turnkey parties", response: "All-ability, quieter, intergenerational", level: "Indirect" },
  { name: "The Zone", type: "Competitive group", distance: "~4 mi", audience: "Teens, adults, corporate", strength: "Laser tag, Nerf, VR, billiards", response: "Connection over competition", level: "Indirect" },
  { name: "Heritage Lanes", type: "Food + activity", distance: "~4 mi", audience: "Families, teams, adults", strength: "Cosmic bowling, food, packages", response: "Continuous creative participation", level: "Indirect" },
  { name: "Scanlines Arcade", type: "Downtown culture", distance: "Local", audience: "Teens, adults, gamers", strength: "Nostalgia + walkable location", response: "Partner for a create-then-play night", level: "Partner" },
  { name: "Raceway Fun Park", type: "Outdoor activity", distance: "~3 mi", audience: "Families, teens", strength: "Affordable summer energy", response: "Weather-proof downtown alternative", level: "Indirect" },
  { name: "Kokomo Opalescent Glass", type: "Arts + tourism", distance: "~3 mi", audience: "Visitors, art lovers", strength: "History, tours, specialized workshops", response: "Safe, casual, walk-in creation", level: "Creative" },
  { name: "Black Wax Cafe", type: "Culture + nightlife", distance: "Downtown", audience: "Teens, young adults", strength: "Music, records, live events", response: "Vinyl & Vases-style paint nights", level: "Creative" },
  { name: "uPaint", type: "Regional PYOP", distance: "31–35 mi", audience: "Walk-ins, parties, groups", strength: "Polished events + regional reach", response: "No-studio-fee value + downtown identity", level: "Regional" },
  { name: "The Wandering Peacock", type: "Regional ceramics", distance: "31 mi", audience: "Adults, classes, date nights", strength: "Wheel throwing + art-therapy tone", response: "Immediate PYOP gratification", level: "Regional" },
  { name: "Artworks Gallery / Artist Alley", type: "Arts ecosystem", distance: "Downtown", audience: "Local art audience", strength: "Professional art + cultural credibility", response: "Don't just view local art—create it", level: "Partner" },
];

export const offers = [
  { id: "mobile", title: "Fired Arts To Go", category: "Mobile revenue stream", audience: "Daycares, schools, churches, libraries", description: "Bring pre-selected bisque pieces and a low-mess paint kit to the group, then return finished pieces after firing.", firstStep: "Pilot one 90-minute daycare session", accent: "blue", status: "Pilot" },
  { id: "tile-wall", title: "School tile-wall fundraiser", category: "School partnership", audience: "PTOs, private schools, classrooms", description: "Students paint 4×4 tiles that become a permanent school installation while raising funds for the school.", firstStep: "Draft a one-page PTO menu", accent: "red", status: "Build" },
  { id: "homeschool", title: "Homeschool Arts Curriculum", category: "Daytime utilization", audience: "KASH, co-ops, homeschool families", description: "Turn quiet weekday hours into recurring lessons with history, technique, and multi-age projects.", firstStep: "Invite Homeschool Helpers to a Monday test", accent: "green", status: "Build" },
  { id: "senior", title: "Senior Socials", category: "New audience", audience: "Church groups, senior activity directors", description: "A calm, social, low-pressure daytime experience built around conversation and a finished keepsake.", firstStep: "Create a Tuesday/Wednesday menu", accent: "yellow", status: "New" },
  { id: "adult", title: "Adult nights", category: "Repeat behavior", audience: "Singles, couples, young professionals", description: "Music-led, mature events such as Vinyl & Vases, Couples Canvas, terrarium nights, and themed socials.", firstStep: "Select two quarterly themes", accent: "red", status: "Build" },
  { id: "downtown", title: "Day in Downtown Kokomo", category: "Destination package", audience: "Peru, Tipton, Hamilton County", description: "Pair a Fired Arts experience with lunch, First Friday, or a partner stop so the regional drive feels intentional.", firstStep: "Pitch one restaurant + Scanlines", accent: "blue", status: "Partner" },
  { id: "pickup", title: "Pickup loop", category: "Retention", audience: "Every finished-piece customer", description: "Use the one-week pickup moment to offer a welcome-back coupon and create a reason to return outside birthdays.", firstStep: "Write the coupon and redemption rule", accent: "green", status: "Priority" },
];

export const software = [
  { name: "WannaBook", role: "PYOP booking + capacity", fit: "Priority test", note: "Walk-ins, parties, memberships, tickets, table coordination." },
  { name: "CollectIt", role: "Kiln-to-pickup workflow", fit: "Priority test", note: "Piece tracking, ready notifications, deposits, booking, POS." },
  { name: "Classly", role: "Classes + open studio", fit: "Strong", note: "Workshops, memberships, open studio, rosters, waitlists." },
  { name: "anny", role: "Resource + kiln planning", fit: "Strong", note: "Courses, firing capacity, room resources, deposits, B2B invoices." },
  { name: "Punchpass", role: "Courses + private events", fit: "Good", note: "Multi-week series, family accounts, waivers, events, reminders." },
  { name: "Zenamu", role: "General scheduling", fit: "Fallback", note: "Useful for classes and notifications, but not ceramics-specific." },
];

export const checklist = [
  { id: "contact", label: "Verify the top 20 contact paths", owner: "Outreach", detail: "Names, permissions, flyer rules, and best email." },
  { id: "mobile", label: "Prototype a mobile kit", owner: "Fired Arts To Go", detail: "Pre-selected bisque, paints, staffing, transport, return flow." },
  { id: "pickup", label: "Launch the pickup coupon", owner: "Retention", detail: "Add a next-visit reason to every completed order." },
  { id: "booking", label: "Map the booking workflow", owner: "Operations", detail: "Walk-in, party, class, kiln, pickup, payments, waitlists." },
  { id: "regional", label: "Add Hamilton County HR targets", owner: "Regional", detail: "Carmel and northern Indianapolis retreat buyers." },
  { id: "site", label: "Create three primary CTAs", owner: "Website", detail: "Walk-In Information, Plan a Party, See the Calendar." },
];

export const platformGuidance = {
  instagram: { label: "Instagram", icon: "◎", format: "Square 1:1", tone: "red", hookLimit: 80, captionLimit: 2200, description: "Visual storytelling and community engagement." },
  facebook: { label: "Facebook", icon: "f", format: "Landscape 1.91:1", tone: "blue", hookLimit: 80, captionLimit: 63206, description: "Local reach, events, and fuller detail." },
  tiktok: { label: "TikTok", icon: "♪", format: "Vertical 9:16", tone: "ink", hookLimit: 80, captionLimit: 2200, description: "Short-form video and creative storytelling." },
  linkedin: { label: "LinkedIn", icon: "in", format: "Landscape 1.91:1", tone: "blue", hookLimit: 80, captionLimit: 3000, description: "Professional partnerships and community impact." },
};

export const contentTemplates = [
  { id: "behind-scenes", title: "Behind the scenes", category: "Studio rhythm", description: "Show the hands, tools, kiln, and small moments that make the studio feel welcoming.", accent: "blue", hook: "A little glimpse behind the glaze.", cta: "Plan your visit" },
  { id: "finished-work", title: "Finished customer work", category: "Proof + pride", description: "Celebrate the finished piece and invite the next person to imagine what they could make.", accent: "red", hook: "Look what came out of the kiln.", cta: "See the studio" },
  { id: "events-offers", title: "Events and offers", category: "Conversion", description: "Turn a specific event, workshop, or offer into a clear reason to visit now.", accent: "yellow", hook: "Your next creative night starts here.", cta: "Reserve your seat" },
  { id: "partner-spotlight", title: "Partner spotlight", category: "Local conversation", description: "Put a local organization or business in the story and make the partnership feel mutual.", accent: "green", hook: "Good things grow when local businesses share the table.", cta: "Start a conversation" },
  { id: "education", title: "Pottery education", category: "Trust + teaching", description: "Answer a beginner question or explain a studio process in a friendly, useful way.", accent: "blue", hook: "No experience needed—here is how it works.", cta: "Learn more" },
  { id: "downtown-community", title: "Downtown Kokomo", category: "Regional pull", description: "Make Fired Arts part of a bigger downtown day, not a one-stop errand.", accent: "red", hook: "Make a day of downtown Kokomo.", cta: "Build your day" },
];

export const assetLibrary = [
  { id: "asset-logo", name: "regionalgrowth.png", type: "Brand", size: "1672×941", src: "/brand/regionalgrowth.png", tags: ["brand", "logo"] },
];

const makeVariant = (platform, source = {}) => ({
  id: `variant-${platform}`,
  platform,
  format: platformGuidance[platform].format,
  hook: source.hook || "Make something beautiful in Kokomo.",
  caption: source.caption || "Come paint a piece, bring a friend, and leave with something that is yours. Fired Arts is a welcoming creative stop in downtown Kokomo.",
  cta: source.cta || "Plan your visit",
  hashtags: source.hashtags || "#FiredArts #KokomoCreates #SupportLocal",
  destinationUrl: source.destinationUrl || "https://firedartsstudio.com/visit",
  assetIds: source.assetIds || [],
  status: source.status || "Draft",
  scheduledAt: source.scheduledAt || "",
});

export const seedCampaigns = [
  {
    id: "campaign-pickup-loop",
    title: "Make the pickup worth returning for",
    objective: "Turn the one-week pickup moment into a welcome-back visit.",
    offerId: "pickup",
    audience: "Finished-piece customers",
    keyMessage: "Your finished piece is ready—and your next creative visit should be too.",
    cta: "Plan your next visit",
    destinationUrl: "https://firedartsstudio.com/visit",
    startDate: "2026-08-18",
    endDate: "2026-08-31",
    status: "Draft",
    platformIds: Object.keys(platformGuidance),
    assetIds: [],
    targetIds: [],
    variants: {
      instagram: makeVariant("instagram", { hook: "Your piece is ready. What will you make next?", cta: "Plan your next visit" }),
      facebook: makeVariant("facebook", { hook: "Pickup day can be the start of your next Fired Arts visit.", cta: "Plan your next visit" }),
      tiktok: makeVariant("tiktok", { hook: "POV: the kiln text just came through.", cta: "See the studio" }),
      linkedin: makeVariant("linkedin", { hook: "A small pickup moment can build a lasting local habit.", cta: "Start a conversation" }),
    },
  },
  {
    id: "campaign-school-tile-wall",
    title: "School tile-wall fundraiser",
    objective: "Help PTOs create a permanent school keepsake while raising funds.",
    offerId: "tile-wall",
    audience: "Schools and PTOs",
    keyMessage: "A fundraiser students can make together and see for years.",
    cta: "Request the PTO menu",
    destinationUrl: "https://firedartsstudio.com/contact",
    startDate: "2026-08-24",
    endDate: "2026-09-14",
    status: "Review",
    platformIds: Object.keys(platformGuidance),
    assetIds: [],
    targetIds: ["target-01"],
    variants: {
      instagram: makeVariant("instagram", { hook: "Paint a fundraiser your school can keep.", cta: "Request the PTO menu" }),
      facebook: makeVariant("facebook", { hook: "Give your next school fundraiser a lasting place on the wall.", cta: "Request the PTO menu" }),
      tiktok: makeVariant("tiktok", { hook: "A whole school, one tile at a time.", cta: "Learn more" }),
      linkedin: makeVariant("linkedin", { hook: "A creative fundraiser can strengthen both school identity and community connection.", cta: "Start a conversation" }),
    },
  },
];

export const seedConversations = [
  {
    id: "conversation-kokomo-school",
    targetId: "target-01",
    campaignId: "campaign-school-tile-wall",
    channel: "Email",
    contactName: "School partnership lead",
    status: "Drafted",
    messageDraft: "Hi — Fired Arts would love to share a simple tile-wall fundraiser idea for Kokomo School Corporation. Students create a lasting installation while the school raises funds. Would you be open to a quick look at the one-page menu?",
    notes: "Confirm the best PTO contact and flyer permissions before sending.",
    lastContactedAt: "",
    nextFollowUpAt: "2026-08-21",
    history: [],
  },
  {
    id: "conversation-chamber",
    targetId: "target-13",
    campaignId: "campaign-pickup-loop",
    channel: "Email",
    contactName: "Chamber partnerships",
    status: "Research",
    messageDraft: "Hi — Fired Arts is building a few downtown creative experiences that give local businesses an easy way to welcome new visitors. I would love to compare notes on a small team-building or partner night for Chamber members.",
    notes: "Look for the next member event and identify a warm introduction.",
    lastContactedAt: "",
    nextFollowUpAt: "2026-08-28",
    history: [],
  },
];
