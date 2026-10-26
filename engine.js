// RAYON · AI-shelf simulator for agentic commerce. Pure logic + rendering, no DOM.
// Brands and products are FICTIONAL. Scoring is a transparent simulation of how an AI agent
// matches shopper intent to catalogue attributes; it is not any real assistant's algorithm.

// ---------- 1. CATALOGUE (fictional brands) ----------
// null = attribute missing from the brand's product feed. HIDDEN holds what the brand knows but did not publish.
const CATS = {
  vacuum: { fr: "aspirateur sans fil", en: "cordless vacuum", rx: "aspirateur|aspi\\b|vacuum|hoover",
    items: [
      ["Nordik", "V8 Air", 279, { kg: 2.4, db: null, min: 45, pet: null, hepa: true, war: 2 }, 4.5, 820, true],
      ["Nordik", "V12 Max", 449, { kg: 3.1, db: 80, min: 70, pet: true, hepa: true, war: 2 }, 4.4, 410, true],
      ["Nordik", "V5 Compact", 179, { kg: 1.9, db: 78, min: 30, pet: false, hepa: false, war: 2 }, 4.0, 300, true],
      ["Volta", "Sweep S", 249, { kg: 2.6, db: 70, min: 40, pet: true, hepa: false, war: 2 }, 4.3, 1500, true],
      ["Volta", "Sweep Pro", 389, { kg: 2.9, db: 74, min: 60, pet: true, hepa: true, war: 2 }, 4.6, 980, true],
      ["Kiro", "Feather", 199, { kg: 1.7, db: 75, min: 35, pet: false, hepa: false, war: 2 }, 4.1, 650, true],
      ["Kiro", "Animal+", 289, { kg: 2.7, db: 70, min: 50, pet: true, hepa: true, war: 3 }, 4.4, 540, true],
      ["Aurel", "Silence", 329, { kg: 2.5, db: 66, min: 45, pet: false, hepa: true, war: 5 }, 4.2, 210, true],
      ["Aurel", "Silence Pet", 369, { kg: 2.6, db: 67, min: 45, pet: true, hepa: true, war: 5 }, 4.3, 180, true],
      ["Brisa", "Lite", 149, { kg: 1.6, db: 79, min: 25, pet: false, hepa: false, war: 2 }, 3.9, 900, true],
      ["Maelo", "Eco R", 259, { kg: 2.5, db: 72, min: 45, pet: true, hepa: false, war: 10 }, 4.2, 260, true],
      ["Maelo", "Eco R+", 339, { kg: 2.8, db: null, min: 60, pet: true, hepa: true, war: 10 }, 4.3, 120, false]] },
  headphones: { fr: "casque / écouteurs", en: "headphones / earbuds", rx: "casque|headphones?|ecouteurs?|earbuds|ecouteur",
    items: [
      ["Nordik", "Q3 ANC", 199, { type: "over", anc: 3, h: 40, g: 250, multi: null, ipx: 0, mic: 2 }, 4.4, 600, true],
      ["Nordik", "Q1", 99, { type: "over", anc: 1, h: 30, g: 210, multi: false, ipx: 0, mic: 1 }, 4.0, 900, true],
      ["Nordik", "Sport X", 129, { type: "buds", anc: 2, h: 8, g: 6, multi: true, ipx: 5, mic: 2 }, 4.2, 300, true],
      ["Volta", "Studio 700", 329, { type: "over", anc: 3, h: 30, g: 250, multi: true, ipx: 0, mic: 3 }, 4.6, 2100, true],
      ["Volta", "Air Buds", 179, { type: "buds", anc: 2, h: 7, g: 5, multi: true, ipx: 4, mic: 2 }, 4.4, 1300, true],
      ["Kiro", "Hush", 249, { type: "over", anc: 3, h: 50, g: 265, multi: true, ipx: 0, mic: 2 }, 4.5, 700, true],
      ["Kiro", "Run", 89, { type: "buds", anc: 0, h: 9, g: 7, multi: false, ipx: 7, mic: 1 }, 4.1, 400, true],
      ["Aurel", "Office Pro", 229, { type: "over", anc: 2, h: 35, g: 230, multi: true, ipx: 0, mic: 3 }, 4.5, 350, true],
      ["Brisa", "Go", 59, { type: "over", anc: 1, h: 25, g: 190, multi: false, ipx: 0, mic: 1 }, 3.8, 1200, true],
      ["Maelo", "Re:Sound", 219, { type: "over", anc: 2, h: 45, g: 280, multi: true, ipx: 0, mic: 2 }, 4.3, 140, true]] },
  coffee: { fr: "machine à café", en: "coffee machine", rx: "machine a cafe|cafetiere|expresso|espresso|coffee|\\bcafe\\b",
    items: [
      ["Nordik", "Barista One", 549, { kind: "bean", milk: true, db: null, cm: 24, clean: true }, 4.4, 520, true],
      ["Nordik", "Pod S", 89, { kind: "capsule", milk: false, db: 70, cm: 13, clean: false }, 4.0, 1800, true],
      ["Volta", "Bean 3", 449, { kind: "bean", milk: false, db: 72, cm: 26, clean: true }, 4.3, 900, true],
      ["Volta", "Bean 5 Latte", 699, { kind: "bean", milk: true, db: 70, cm: 28, clean: true }, 4.6, 600, true],
      ["Kiro", "Mini Bean", 349, { kind: "bean", milk: false, db: 74, cm: 19, clean: false }, 4.2, 400, true],
      ["Aurel", "Silenzio", 599, { kind: "bean", milk: true, db: 64, cm: 25, clean: true }, 4.5, 150, true],
      ["Brisa", "Capsule Duo", 79, { kind: "capsule", milk: true, db: 73, cm: 15, clean: false }, 3.9, 2500, true],
      ["Maelo", "Manual Lever", 299, { kind: "manual", milk: false, db: 40, cm: 20, clean: false }, 4.6, 90, true]] },
};
const HIDDEN = { "Nordik V8 Air": { db: 68, pet: true }, "Nordik Q3 ANC": { multi: true }, "Nordik Barista One": { db: 66 }, "Maelo Eco R+": { db: 71 } };
const BRANDS = ["Nordik", "Volta", "Kiro", "Aurel", "Brisa", "Maelo"];

// ---------- 2. INTENTS: what a shopper asks for, and the attribute that proves it ----------
// test(v) on the attribute value; label for the agent's reason; fix text for the brand.
const INTENTS = {
  vacuum: [
    { k: "quiet", rx: "silencieu|calme|quiet|bruit|noise|bebe|voisins|neighbou?rs", a: "db", w: 3, test: v => v <= 70, fr: v => `silencieux (${v} dB)`, en: v => `quiet (${v} dB)`, need: ["le calme", "quiet"], attr: ["niveau sonore", "noise level"] },
    { k: "pets", rx: "\\bchats?\\b|chien|animaux|poils|\\bpets?\\b|\\bcats?\\b|\\bdogs?\\b|fur", a: "pet", w: 3, test: v => v === true, fr: () => "brosse spéciale poils d'animaux", en: () => "pet-hair brush", need: ["un animal", "a pet"], attr: ["compatibilité poils d'animaux", "pet-hair compatibility"] },
    { k: "light", rx: "appartement|studio|leger|legere|light|petit|escaliers|stairs|\\bdos\\b|back pain|flat\\b|apartment", a: "kg", w: 2, test: v => v <= 2.5, fr: v => `léger (${String(v).replace(".", ",")} kg)`, en: v => `light (${v} kg)`, need: ["la légèreté", "lightness"], attr: ["poids", "weight"] },
    { k: "battery", rx: "grande maison|maison de|\\bhouse\\b|autonomie|battery|longtemps|\\d{3}\\s*m2|large home", a: "min", w: 2, test: v => v >= 50, fr: v => `${v} min d'autonomie`, en: v => `${v} min battery`, need: ["l'autonomie", "battery life"], attr: ["autonomie", "battery life"] },
    { k: "allergy", rx: "allergi|asthm|hepa|acariens|dust mite", a: "hepa", w: 3, test: v => v === true, fr: () => "filtre HEPA", en: () => "HEPA filter", need: ["les allergies", "allergies"], attr: ["filtre HEPA", "HEPA filter"] },
    { k: "durable", rx: "durable|reparable|repairable|longue duree|long.lasting|garantie|warranty", a: "war", w: 2, test: v => v >= 5, fr: v => `garantie ${v} ans`, en: v => `${v}-year warranty`, need: ["la durabilité", "durability"], attr: ["garantie / réparabilité", "warranty / repairability"] }],
  headphones: [
    { k: "anc", rx: "reduction de bruit|\\banc\\b|noise.cancel|metro|avion|plane|flight|open.space|bruit|noise|train", a: "anc", w: 3, test: v => v >= 3, fr: () => "réduction de bruit avancée", en: () => "strong noise cancelling", need: ["le calme", "noise cancelling"], attr: ["niveau de réduction de bruit", "ANC level"] },
    { k: "calls", rx: "appels|calls|teletravail|visio|meetings?|reunions?|remote work|zoom|teams", a: "mic", w: 2, test: v => v >= 2, fr: () => "micros adaptés aux appels", en: () => "good call microphones", need: ["les appels", "calls"], attr: ["qualité des micros", "microphone quality"] },
    { k: "multi", rx: "deux appareils|multipoint|telephone et (?:l')?ordi|phone and laptop|two devices|ordinateur", a: "multi", w: 2, test: v => v === true, fr: () => "connexion à deux appareils", en: () => "two-device connection", need: ["deux appareils", "two devices"], attr: ["multipoint", "multipoint"] },
    { k: "sport", rx: "sport|running|course a pied|\\bcourir\\b|gym|transpir|sweat|\\brun\\b", a: "ipx", w: 3, test: v => v >= 4, fr: v => `résistant à la transpiration (IPX${v})`, en: v => `sweat-resistant (IPX${v})`, need: ["le sport", "sport"], attr: ["indice IPX", "IPX rating"] },
    { k: "battery", rx: "autonomie|battery|long.courrier|long.haul|long voyage|vol de", a: "h", w: 2, test: v => v >= 40, fr: v => `${v} h d'autonomie`, en: v => `${v} h battery`, need: ["l'autonomie", "battery life"], attr: ["autonomie", "battery life"] },
    { k: "buds", rx: "ecouteurs|earbuds|intra|in.ear|discret", a: "type", w: 2, test: v => v === "buds", fr: () => "écouteurs compacts", en: () => "compact earbuds", need: ["des écouteurs", "earbuds"], attr: ["format", "form factor"] }],
  coffee: [
    { k: "beans", rx: "grains?|beans?|broyeur|grinder|moulu|fresh ground", a: "kind", w: 3, test: v => v === "bean", fr: () => "broyeur intégré (café en grains)", en: () => "built-in grinder", need: ["le café en grains", "whole beans"], attr: ["type de machine", "machine type"] },
    { k: "milk", rx: "\\blait\\b|latte|cappuccino|\\bmilk\\b|flat white|mousse", a: "milk", w: 3, test: v => v === true, fr: () => "boissons lactées automatiques", en: () => "automatic milk drinks", need: ["les boissons lactées", "milk drinks"], attr: ["système lait", "milk system"] },
    { k: "quiet", rx: "silencieu|calme|quiet|bruit|noise|tot le matin|early morning|bebe", a: "db", w: 3, test: v => v <= 68, fr: v => `silencieuse (${v} dB)`, en: v => `quiet (${v} dB)`, need: ["le calme", "quiet"], attr: ["niveau sonore", "noise level"] },
    { k: "small", rx: "petite cuisine|compact|studio|small kitchen|petit espace|peu de place|small space", a: "cm", w: 2, test: v => v <= 22, fr: v => `compacte (${v} cm)`, en: v => `compact (${v} cm)`, need: ["une petite cuisine", "a small kitchen"], attr: ["largeur", "width"] },
    { k: "easy", rx: "facile|simple|easy|entretien|nettoyage|cleaning|low maintenance", a: "clean", w: 2, test: v => v === true, fr: () => "nettoyage automatique", en: () => "automatic cleaning", need: ["la simplicité", "ease of use"], attr: ["nettoyage automatique", "auto-clean"] },
    { k: "eco", rx: "sans capsule|pas de capsule|zero dechet|zero waste|no pods|eco", a: "kind", w: 2, test: v => v !== "capsule", fr: () => "sans capsules", en: () => "no pods", need: ["moins de déchets", "less waste"], attr: ["type de machine", "machine type"] }],
};

// ---------- 3. HELPERS ----------
const cache = {}; const rx = (p, f = "") => cache[p + "|" + f] || (cache[p + "|" + f] = new RegExp(p, f));
function norm(s) { return String(s).toLowerCase().replace(/œ/g, "oe").replace(/’/g, "'").normalize("NFKD").replace(/[̀-ͯ]/g, ""); }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
const eur = (x, lang) => lang === "fr" ? `${x} €` : `€${x}`;
const pct = (x, lang) => Math.round(x * 100) + (lang === "fr" ? " %" : "%");
const FR_W = "\\b(je|cherche|pour|un|une|avec|mon|ma|mes|chat|appartement|budget|moins|de|le|la|les|et|quel|quelle|meilleur|silencieux|qui|est|pas|marque)\\b";
const EN_W = "\\b(i|looking|for|a|with|my|cat|apartment|budget|under|the|and|which|best|quiet|that|is|not|brand|need|want)\\b";
const isFrench = t => { const n = norm(t); return (n.match(rx(FR_W, "g")) || []).length >= (n.match(rx(EN_W, "g")) || []).length; };

// feed state: copy so "fixes" can be applied per session
const FEED = {};
function resetFeed() { for (const [c, C] of Object.entries(CATS)) FEED[c] = C.items.map(([brand, name, price, at, rating, reviews, stock]) => ({ cat: c, brand, name, price, at: { ...at }, rating, reviews, stock, full: brand + " " + name })); }
resetFeed();

// ---------- 4. THE SIMULATED AGENT ----------
function parse(text) {
  const t = norm(text), q = { raw: text };
  q.cat = Object.keys(CATS).find(c => rx(CATS[c].rx).test(t)) || null;
  const b = rx("(?:budget|moins de|max(?:imum)?|under|below|jusqu'a|<)\\s*(?:de\\s*)?(\\d{2,4})|(\\d{2,4})\\s*(?:€|eur|euros?)").exec(t); if (b) q.budget = parseInt(b[1] || b[2]);
  q.intents = q.cat ? INTENTS[q.cat].filter(I => rx(I.rx).test(t)) : [];
  if (q.cat === "headphones" && q.intents.some(i => i.k === "sport") && !q.intents.some(i => i.k === "buds")) q.intents.push(INTENTS.headphones.find(i => i.k === "buds"));
  q.fast = rx("demain|tomorrow|vite|rapidement|urgent|asap|ce week.end").test(t);
  q.named = BRANDS.filter(br => rx("\\b" + norm(br) + "\\b").test(t));
  q.undecided = q.named.length === 0;
  return q;
}
function evaluate(p, q) {
  let s = (p.rating - 4) * 3 + Math.log10(p.reviews) * 0.8;
  const hits = [], misses = [], unknown = [];
  for (const I of q.intents) {
    const v = p.at[I.a];
    if (v === null || v === undefined) { s -= 0.6 * I.w; unknown.push(I); }
    else if (I.test(v)) { s += I.w; hits.push([I, v]); }
    else { s -= I.w; misses.push([I, v]); }
  }
  if (q.budget) s += 1.2 * Math.max(0, (q.budget - p.price) / q.budget);
  if (q.fast && !p.stock) s -= 4;
  if (q.named.length && q.named.includes(p.brand)) s += 3;
  return { p, s, hits, misses, unknown };
}
function shelf(q) {
  return FEED[q.cat].filter(p => !q.budget || p.price <= q.budget * 1.05).map(p => evaluate(p, q)).sort((a, b) => b.s - a.s || b.p.reviews - a.p.reviews);
}

// ---------- 5. BRAND VIEW: why the client brand wins or loses, and what fixing the feed would do ----------
function brandView(q, ranked, client) {
  const mine = ranked.map((r, i) => ({ ...r, rank: i + 1 })).filter(r => r.p.brand === client);
  const over = FEED[q.cat].filter(p => p.brand === client && q.budget && p.price > q.budget * 1.05);
  if (!mine.length) return { absent: true, over: over.map(p => p.full) };
  const best = mine[0];
  const fixes = [];
  for (const m of mine) for (const I of m.unknown) { const h = HIDDEN[m.p.full]; if (h && h[I.a] !== undefined) fixes.push({ prod: m.p, I, val: h[I.a] }); }
  let after = null;
  if (fixes.length) {
    const saved = fixes.map(f => [f.prod, f.I.a, f.prod.at[f.I.a]]);
    fixes.forEach(f => { f.prod.at[f.I.a] = f.val; });
    const r2 = shelf(q); const i2 = r2.findIndex(r => r.p.brand === client);
    after = { rank: i2 + 1, prod: r2[i2].p.full };
    saved.forEach(([p, a, v]) => { p.at[a] = v; });
  }
  return { best, fixes, after, n: ranked.length, over: over.map(p => p.full) };
}
function completeness(cat, client) {
  const prods = FEED[cat].filter(p => p.brand === client); let tot = 0, ok = 0;
  prods.forEach(p => Object.values(p.at).forEach(v => { tot++; if (v !== null && v !== undefined) ok++; }));
  return tot ? ok / tot : 1;
}
function applyFixes(cat, client) {
  let n = 0;
  FEED[cat].filter(p => p.brand === client).forEach(p => { const h = HIDDEN[p.full]; if (h) for (const [a, v] of Object.entries(h)) if (p.at[a] === null) { p.at[a] = v; n++; } });
  return n;
}

// ---------- 6. TEXTS ----------
const TXT = {
  fr: { hello: "Bonjour ! Écrivez une demande comme un client la poserait à un assistant IA. Je montre ce que l'agent recommanderait, où se place votre marque (Nordik par défaut) et ce qu'il faut corriger dans vos fiches produits pour être recommandé.\nEssayez : « je cherche un aspirateur sans fil silencieux pour un appartement avec un chat, budget 300 € ».\nEnsuite : « corrige la fiche », « marque Volta », « rapport ».",
        ask: "Quel produit cherche le client ? Je couvre les aspirateurs sans fil, les casques et écouteurs, et les machines à café.",
        agent: "Réponse de l'agent", sim: "simulation", for_: "Pour", here: "voici mes 3 recommandations", buy: "Voir l'offre", unk: "non communiqué",
        brand: "Vue marque", rank: "Position", in3: "Recommandé dans le top 3", out3: "Absent des 3 recommandations", why: "Pourquoi", fix: "Correctif à apporter à la fiche",
        after: "Après correction", places: "places", nofix: "Rien à corriger dans la fiche : le produit perd sur le fond (prix, caractéristiques).", absent: "Aucun produit de la marque dans ce budget.",
        complete: "Complétude des fiches", fixed: "Fiches corrigées : {n} attribut(s) publié(s). Voici la même demande, rejouée.", nothingfix: "Rien à publier de plus pour cette catégorie.",
        switch: "Vous représentez maintenant {b}.", note: "Simulation pédagogique · marques et produits fictifs · non affilié à Lemrock ni à un assistant IA.",
        undecided: "client indécis", decided: "client décidé", reset: "Nouvelle session : fiches remises à l'état initial." },
  en: { hello: "Hi! Type a request the way a shopper would ask an AI assistant. I show what the agent would recommend, where your brand ranks (Nordik by default) and what to fix in your product data to get recommended.\nTry: \"looking for a quiet cordless vacuum for a small apartment with a cat, budget €300\".\nThen: \"fix the feed\", \"brand Volta\", \"report\".",
        ask: "What is the shopper looking for? I cover cordless vacuums, headphones and earbuds, and coffee machines.",
        agent: "Agent answer", sim: "simulation", for_: "For", here: "here are my 3 picks", buy: "View offer", unk: "not stated",
        brand: "Brand view", rank: "Rank", in3: "Recommended in the top 3", out3: "Not in the top 3", why: "Why", fix: "Fix to make in the product data",
        after: "After the fix", places: "places", nofix: "Nothing to fix in the data: the product loses on substance (price, specs).", absent: "No product from the brand within this budget.",
        complete: "Feed completeness", fixed: "Feed fixed: {n} attribute(s) published. Here is the same request, replayed.", nothingfix: "Nothing more to publish in this category.",
        switch: "You now represent {b}.", note: "Teaching simulation · fictional brands and products · not affiliated with Lemrock or any AI assistant.",
        undecided: "undecided shopper", decided: "decided shopper", reset: "New session: product data back to its original state." },
};

// ---------- 7. SESSION + REPORT ----------
const LOG = []; let SEEDED = 0;
const STATE = { client: "Nordik", last: null, lang: "fr" };
function record(q, ranked, client) {
  const top = ranked.slice(0, 3).map(r => r.p.brand);
  const mine = ranked.findIndex(r => r.p.brand === client);
  const bv = brandView(q, ranked, client);
  LOG.push({ cat: q.cat, undecided: q.undecided, top, intents: q.intents.map(i => i.k), clientIn: top.includes(client),
             unknown: bv.best ? bv.best.unknown.map(I => I.attr) : [], raw: q.raw, client });
}
function report(lang) {
  const fr = lang === "fr", client = STATE.client, L = LOG.filter(l => l.client === client);
  if (!L.length) return { type: "text", lang, text: fr ? "Pas encore de demandes analysées." : "No requests analysed yet." };
  const n = L.length, und = L.filter(l => l.undecided);
  const share = b => L.filter(l => l.top.includes(b)).length / n;
  const brands = BRANDS.map(b => [b, share(b)]).sort((a, b) => b[1] - a[1]);
  const lostAttr = new Map(); L.filter(l => l.client === client && !l.top.includes(client)).forEach(l => l.unknown.forEach(a => { const k = a[fr ? 0 : 1]; lostAttr.set(k, (lostAttr.get(k) || 0) + 1); }));
  const intents = new Map(); L.forEach(l => l.intents.forEach(k => intents.set(k, (intents.get(k) || 0) + 1)));
  const lost = L.filter(l => !l.top.includes(client)).slice(-3).map(l => l.raw);
  return { type: "report", lang, client, n, und: und.length / n, shareAll: share(client), shareUnd: und.length ? und.filter(l => l.top.includes(client)).length / und.length : 0,
           brands, lostAttr: [...lostAttr.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3), lost, seeded: SEEDED };
}

// ---------- 8. CHAT ----------
function chatData(text) {
  const t = norm(text.trim()); const lang = isFrench(text) ? "fr" : "en"; STATE.lang = lang; const T = TXT[lang];
  if (["bonjour", "hello", "hi", "aide", "help"].includes(t)) return { type: "text", lang, text: T.hello };
  if (["reset", "recommencer", "nouvelle session"].includes(t)) { resetFeed(); return { type: "text", lang, text: T.reset }; }
  const sw = rx("(?:marque|brand|je (?:suis|travaille) (?:chez|pour)|i (?:am|work) (?:at|for)|client)\\s*:?\\s*(nordik|volta|kiro|aurel|brisa|maelo)").exec(t);
  if (sw) { STATE.client = BRANDS.find(b => norm(b) === sw[1]); const pre = T.switch.replace("{b}", STATE.client); return STATE.last ? answer(STATE.last, lang, pre) : { type: "text", lang, text: pre }; }
  if (rx("^\\s*(rapport|report|insights?|bilan)").test(t)) return report(lang);
  if (rx("corrige|corriger|fix|appliquer|apply|publie").test(t) && STATE.last) {
    const n = applyFixes(STATE.last.cat, STATE.client);
    return answer(STATE.last, lang, n ? T.fixed.replace("{n}", n) : T.nothingfix, true);
  }
  const q = parse(text);
  if (!q.cat) return { type: "text", lang, text: T.ask };
  STATE.last = q;
  return answer(q, lang, null);
}
function answer(q, lang, pre, replay) {
  const ranked = shelf(q); const client = STATE.client;
  if (!replay) record(q, ranked, client);
  return { type: "shelf", lang, q, top: ranked.slice(0, 3), ranked, bv: brandView(q, ranked, client), client, pre, comp: completeness(q.cat, client) };
}

// ---------- 9. RENDERING ----------
const INK = "#111216", VIO = "#5B3DF5", LIME = "#D7F25A", GREY = "#6B6F7B", LINE = "#E4E6EC", SOFT = "#F3F4F7", RED = "#C2414B", GREEN = "#13795B";
const UNIT = { kg: " kg", db: " dB", min: " min", h: " h", g: " g", cm: " cm", war: [" ans", "-year"] };
function fmtVal(I, v, lang) {
  const fr = lang === "fr";
  if (v === true) return fr ? "oui" : "yes"; if (v === false) return fr ? "non" : "no";
  if (I.a === "ipx") return "IPX" + v;
  if (I.a === "anc") return ["aucune", "basique", "bonne", "avancée"][v] && (fr ? ["aucune", "basique", "bonne", "avancée"][v] : ["none", "basic", "good", "strong"][v]);
  if (I.a === "mic") return fr ? ["", "basiques", "bons", "excellents"][v] : ["", "basic", "good", "excellent"][v];
  if (I.a === "type") return v === "buds" ? (fr ? "écouteurs" : "earbuds") : (fr ? "casque" : "over-ear");
  if (I.a === "kind") return { bean: fr ? "grains" : "beans", capsule: "capsules", manual: fr ? "manuelle" : "manual" }[v];
  const u = UNIT[I.a]; const n = fr ? String(v).replace(".", ",") : String(v);
  if (Array.isArray(u)) return fr ? n + u[0] : n + u[1];
  return n + (u || "");
}
const TINT = { Nordik: ["#E9E4FF", "#5B3DF5"], Volta: ["#FFE9DC", "#E0662B"], Kiro: ["#DDF5EF", "#13795B"], Aurel: ["#FFF3D6", "#B7860B"], Brisa: ["#DFF0FF", "#2B7BD6"], Maelo: ["#E8F6DC", "#4F8A1F"] };
const ICON = {
  vacuum: c => `<svg viewBox="0 0 64 64" width="46" height="46" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M40 8l-14 38"/><rect x="34" y="6" width="14" height="10" rx="3"/><path d="M18 46h20a4 4 0 0 1 0 8H14a4 4 0 0 1 0-8z"/><circle cx="44" cy="22" r="5"/></svg>`,
  headphones: c => `<svg viewBox="0 0 64 64" width="46" height="46" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 38v-6a20 20 0 0 1 40 0v6"/><rect x="8" y="36" width="12" height="18" rx="5"/><rect x="44" y="36" width="12" height="18" rx="5"/></svg>`,
  coffee: c => `<svg viewBox="0 0 64 64" width="46" height="46" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="8" width="36" height="12" rx="3"/><path d="M18 20v26M46 20v26M14 54h36"/><path d="M26 34h12v8a6 6 0 0 1-12 0z"/><path d="M38 36h3a3 3 0 0 1 0 6h-3"/></svg>`,
};
const stars = r => `${"★".repeat(Math.round(r))}${"☆".repeat(5 - Math.round(r))}`;
function toHtml(d) {
  const T = TXT[d.lang], fr = d.lang === "fr", i = fr ? 0 : 1;
  if (d.type === "text") return esc(d.text).replace(/\n/g, "<br>");
  if (d.type === "report") {
    const bars = d.brands.map(([b, v], k) => `<div class="row" style="--i:${k};display:flex;align-items:center;gap:10px;margin:6px 0;font-size:13px"><span style="width:70px;font-weight:${b === d.client ? 700 : 500}">${b}</span>`
      + `<span style="flex:1;background:${SOFT};height:10px;border-radius:99px"><span class="bar" style="--i:${k};display:block;height:10px;border-radius:99px;width:${Math.round(v * 100)}%;background:${b === d.client ? VIO : "#C9CCD6"}"></span></span><span class="mono" style="width:44px;text-align:right">${pct(v, d.lang)}</span></div>`).join("");
    const kpi = (k, v, l) => `<div class="kpi" style="--i:${k}"><div class="big">${v}</div><div class="lab">${l}</div></div>`;
    const attrs = d.lostAttr.map(([a, n]) => `<li>${esc(a)} <span class="mono" style="color:${GREY}">× ${n}</span></li>`).join("") || `<li>${fr ? "aucun" : "none"}</li>`;
    const lost = d.lost.map(r => `<li>« ${esc(r)} »</li>`).join("") || `<li>${fr ? "aucune" : "none"}</li>`;
    return `<div class="lab">${fr ? "Rapport marque" : "Brand report"} · ${d.client}</div><div class="h">${fr ? "Part de recommandation" : "Share of recommendation"}</div>`
      + `<div class="kpis">${kpi(0, d.n, fr ? "demandes analysées" : "requests analysed")}${kpi(1, pct(d.und, d.lang), fr ? "clients indécis" : "undecided shoppers")}${kpi(2, pct(d.shareAll, d.lang), fr ? "présence dans le top 3" : "top-3 presence")}${kpi(3, pct(d.shareUnd, d.lang), fr ? "présence chez les indécis" : "presence with undecided")}</div>`
      + `<div class="sec"><div class="lab">${fr ? "Top 3 par marque" : "Top-3 share by brand"}</div>${bars}</div>`
      + `<div class="sec two"><div><div class="lab">${fr ? "Attributs manquants qui coûtent des recommandations" : "Missing attributes costing recommendations"}</div><ul>${attrs}</ul></div>`
      + `<div><div class="lab">${fr ? "Demandes perdues récentes" : "Recent lost requests"}</div><ul>${lost}</ul></div></div>`
      + `<div class="foot">${fr ? "Dans une conversation IA, ce qui n'est pas dans la fiche n'existe pas pour l'agent." : "In an AI conversation, what isn't in the product data doesn't exist for the agent."}${d.seeded ? (fr ? ` Inclut ${d.seeded} demandes de démonstration.` : ` Includes ${d.seeded} demo requests.`) : ""}</div>`;
  }
  // shelf answer
  const q = d.q, out = [];
  if (d.pre) out.push(`<div class="pre">${esc(d.pre)}</div>`);
  const needs = q.intents.map(I => I.need[i]);
  const intro = `${T.for_} ${needs.length ? needs.join(", ") : CATS[q.cat][d.lang]}${q.budget ? (fr ? ` et un budget de ${eur(q.budget, d.lang)}` : ` and a ${eur(q.budget, d.lang)} budget`) : ""}, ${T.here} :`;
  const cards = d.top.map((r, k) => {
    const reasons = r.hits.slice(0, 2).map(([I, v]) => `<li class="ok">${esc(I[d.lang](v))}</li>`).join("")
      + r.unknown.slice(0, 1).map(I => `<li class="unk">${esc(I.attr[i])} : ${T.unk}</li>`).join("")
      + r.misses.slice(0, 1).map(([I, v]) => `<li class="no">${esc(I.attr[i])} : ${esc(fmtVal(I, v, d.lang))}</li>`).join("");
    const mine = r.p.brand === d.client;
    return `<div class="pc row${mine ? " mine" : ""}" style="--i:${k}"><div class="pimg" style="background:${TINT[r.p.brand][0]}">${ICON[q.cat](TINT[r.p.brand][1])}</div><div class="pb">${esc(r.p.brand)}</div><div class="pn">${esc(r.p.name)}</div>`
      + `<div class="pr"><span class="mono">${eur(r.p.price, d.lang)}</span> <span class="st">${stars(r.p.rating)}</span> <span class="rv">(${r.p.reviews})</span></div><ul>${reasons}</ul><div class="buy">${T.buy}</div></div>`;
  }).join("");
  out.push(`<div class="agent"><div class="agent-h"><span class="ai">AI</span>${T.agent} <span class="simtag">${T.sim}</span><span class="mono" style="margin-left:auto;color:${GREY};font-size:11px">${q.undecided ? T.undecided : T.decided}</span></div>`
    + `<div class="said">${esc(intro)}</div><div class="cards">${cards}</div></div>`);
  // brand view
  const bv = d.bv;
  let body = "";
  if (bv.absent) body = `<div style="font-size:13.5px">${T.absent}${bv.over.length ? ` (${esc(bv.over.join(", "))} ${fr ? "au-dessus du budget" : "over budget"})` : ""}</div>`;
  else {
    const r = bv.best, inTop = r.rank <= 3;
    const why = [...r.unknown.map(I => `${I.attr[i]} : ${fr ? "non publié dans la fiche, l'agent ne peut pas le vérifier" : "not in the product data, so the agent can't verify it"}`),
                 ...r.misses.map(([I, v]) => `${I.attr[i]} : ${fmtVal(I, v, d.lang)}, ${fr ? "ne répond pas au besoin" : "doesn't meet the need"}`)];
    if (!why.length) why.push(inTop ? (fr ? "toutes les caractéristiques demandées sont publiées et conformes" : "all requested attributes are published and match") : (fr ? "concurrents mieux notés ou moins chers" : "competitors better rated or cheaper"));
    const fixes = bv.fixes.map(f => `<li>${fr ? "Publier" : "Publish"} <b>${esc(f.I.attr[i])}</b> ${fr ? "pour" : "for"} ${esc(f.prod.name)} : <span class="mono">${esc(f.I[d.lang](f.val))}</span></li>`).join("");
    const gain = bv.after ? r.rank - bv.after.rank : 0;
    body = `<div class="rk"><div class="rankbox ${inTop ? "in" : "out"}"><div class="lab">${T.rank}</div><div class="big">#<span class="count" style="--to:${r.rank}"></span><span style="font-size:14px;color:${GREY}"> / ${bv.n}</span></div></div>`
      + `<div style="flex:1;min-width:0"><div style="font-weight:700">${esc(r.p.full)}</div><div style="font-size:12.5px;color:${inTop ? GREEN : RED};font-weight:600">${inTop ? "✓ " + T.in3 : "✕ " + T.out3}</div>`
      + `<div class="lab" style="margin-top:8px">${T.why}</div><ul>${why.map(w => `<li>${esc(w)}</li>`).join("")}</ul></div>`
      + (bv.after ? `<div class="rankbox after"><div class="lab">${T.after}</div><div class="big">#${bv.after.rank}</div>${gain > 0 ? `<div class="gain">+${gain} ${T.places}</div>` : ""}</div>` : "") + `</div>`
      + (fixes ? `<div class="fixbox"><div class="lab" style="color:${INK}">${T.fix}</div><ul>${fixes}</ul></div>` : (!inTop ? `<div style="font-size:12.5px;color:${GREY};margin-top:8px">${T.nofix}</div>` : ""));
  }
  out.push(`<div class="bview"><div class="bv-h"><span class="lab" style="color:${INK}">${T.brand}</span><span class="brandchip">${esc(d.client)}</span>`
    + `<span class="mono" style="margin-left:auto;font-size:11.5px;color:${GREY}">${T.complete} : <b style="color:${INK}">${pct(d.comp, d.lang)}</b></span></div>${body}</div>`);
  out.push(`<div class="foot">${T.note}</div>`);
  return out.join("");
}
function seed(list) { const c = STATE.client; for (const m of list) chatData(m); SEEDED = list.length; STATE.last = null; STATE.client = c; }
if (typeof module !== "undefined") module.exports = { chatData, toHtml, seed, STATE, LOG, resetFeed };
