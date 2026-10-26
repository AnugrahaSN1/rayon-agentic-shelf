"""Builds index.html (self-contained) for Rayon, the AI-shelf simulator."""
import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
engine = open(os.path.join(HERE, "engine.js"), encoding="utf-8").read()
SEED = ["aspirateur sans fil léger pour un studio, moins de 200 €", "casque pour le sport, budget 150 €", "best coffee machine for a small kitchen",
        "machine à café en grains facile à nettoyer", "aspirateur pour allergies, grande maison", "écouteurs discrets pour les appels",
        "Nordik coffee machine with milk", "aspirateur durable et réparable"]
CHIPS = [("Aspirateur · appartement + chat", "Je cherche un aspirateur sans fil silencieux pour un appartement avec un chat, budget 300 €"),
         ("Corriger la fiche", "corrige la fiche"),
         ("Casque · métro + télétravail", "Casque à réduction de bruit pour le métro et les appels en télétravail, sur mon téléphone et mon ordinateur"),
         ("Café · lait, silencieux", "Machine à café silencieuse avec du lait, café en grains"),
         ("Earbuds for running (EN)", "Looking for earbuds for running, under €150"),
         ("Changer de marque : Volta", "marque Volta"), ("Rapport marque", "rapport"), ("Réinitialiser", "reset")]
chips = "".join(f'<button class="chip" data-q="{q.replace(chr(34), "&quot;")}">{lab}</button>' for lab, q in CHIPS)
FONTS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
CSS = """
@property --n{syntax:'<integer>';initial-value:0;inherits:false}
@keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:translateY(14px) scale(.97)}100%{opacity:1;transform:none}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes count{from{--n:12}to{--n:var(--to)}}
@keyframes dot{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(215,242,90,0)}50%{box-shadow:0 0 0 6px rgba(215,242,90,.55)}}
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{font-family:'Plus Jakarta Sans',system-ui,'Helvetica Neue',Arial,sans-serif;color:#111216;display:flex;flex-direction:column;align-items:center;
  background:radial-gradient(1100px 420px at 50% -120px,rgba(91,61,245,.16),transparent 70%),#F6F7FB;-webkit-font-smoothing:antialiased}
.mono{font-family:'JetBrains Mono',Menlo,Consolas,monospace}
.lab{text-transform:uppercase;letter-spacing:.12em;font-size:10px;font-weight:700;color:#6B6F7B}
.top{width:min(940px,100% - 32px);display:flex;align-items:center;gap:12px;padding:22px 2px 14px}
.logo{width:40px;height:40px;border-radius:12px;background:#111216;color:#D7F25A;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;flex:none}
.top h1{margin:0;font-size:21px;font-weight:800;letter-spacing:-.02em}.top p{margin:1px 0 0;font-size:13px;color:#6B6F7B}
.top .tag{margin-left:auto;font-size:11px;font-weight:600;color:#5B3DF5;background:rgba(91,61,245,.08);border-radius:999px;padding:5px 11px}
#app{width:min(940px,100% - 32px);margin:0 16px 10px;flex:1;min-height:0;display:flex;flex-direction:column;background:#fff;border:1px solid #E4E6EC;border-radius:20px;overflow:hidden;
  box-shadow:0 30px 70px rgba(17,18,22,.08)}
#log{flex:1;overflow-y:auto;padding:6px 22px 14px;min-height:0;position:relative}
.u{display:flex;justify-content:flex-end;margin:16px 0}.u>div{background:#111216;color:#fff;padding:11px 16px;max-width:78%;font-weight:500;font-size:14px;border-radius:16px 16px 4px 16px}
.b{display:flex;align-items:flex-start;margin:16px 0}.b>.card{min-width:0;flex:1;max-width:calc(100% - 44px)}
.b.txt>.card{flex:0 1 auto;background:#F3F4F7;border-radius:4px 16px 16px 16px;padding:13px 16px;font-size:14px;line-height:1.6}
.av{width:30px;min-width:30px;height:30px;border-radius:9px;background:#111216;color:#D7F25A;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;margin:2px 12px 0 0}
.pre{background:#F4FBD6;border:1px solid #D7F25A;border-radius:10px;padding:8px 12px;font-size:13px;font-weight:600;margin-bottom:10px}
.agent{background:#F3F4F7;border-radius:16px;padding:14px}
.agent-h{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;margin-bottom:8px}
.ai{background:linear-gradient(135deg,#5B3DF5,#8C6BFF);color:#fff;font-size:10px;font-weight:800;border-radius:6px;padding:3px 6px}
.simtag{font-size:10px;font-weight:600;color:#6B6F7B;border:1px solid #D5D8E0;border-radius:999px;padding:1px 7px}
.said{font-size:14px;margin:0 0 10px;line-height:1.5}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.pc{background:#fff;border:1px solid #E4E6EC;border-radius:14px;padding:12px;display:flex;flex-direction:column;position:relative}
.pc.mine{border:2px solid #5B3DF5;box-shadow:0 8px 20px rgba(91,61,245,.15)}
.pc.mine::before{content:"VOTRE MARQUE";position:absolute;top:-9px;left:12px;background:#5B3DF5;color:#fff;font-size:9px;font-weight:800;letter-spacing:.1em;padding:2px 7px;border-radius:999px}
html[lang=en] .pc.mine::before{content:"YOUR BRAND"}
.pimg{width:100%;aspect-ratio:16/9;border-radius:10px;background:linear-gradient(135deg,#ECEEF3,#DFE2EA);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#B9BDC9;margin-bottom:8px}
.pb{font-size:11px;font-weight:700;color:#6B6F7B;text-transform:uppercase;letter-spacing:.08em}.pn{font-weight:700;font-size:15px;margin-top:1px}
.pr{font-size:12.5px;margin-top:3px}.st{color:#E0A100;letter-spacing:1px}.rv{color:#6B6F7B}
.pc ul{list-style:none;padding:0;margin:8px 0 10px;font-size:12px;line-height:1.45;flex:1}.pc li{padding-left:16px;position:relative;margin:2px 0}
.pc li::before{position:absolute;left:0;font-weight:800}.pc li.ok::before{content:"✓";color:#13795B}.pc li.unk{color:#6B6F7B}.pc li.unk::before{content:"?";color:#9AA0AE}.pc li.no::before{content:"✕";color:#C2414B}
.buy{text-align:center;font-size:12.5px;font-weight:700;background:#111216;color:#fff;border-radius:10px;padding:7px 0}
.bview{margin-top:12px;border:1px solid #E4E6EC;border-radius:16px;padding:14px 16px;background:#fff}
.bv-h{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.brandchip{background:#5B3DF5;color:#fff;font-weight:700;font-size:12px;border-radius:999px;padding:2px 10px}
.rk{display:flex;gap:14px;align-items:flex-start}.rk ul{margin:4px 0 0;padding-left:18px;font-size:13px;line-height:1.5}
.rankbox{flex:none;width:96px;border-radius:12px;padding:9px 10px;text-align:center;background:#F3F4F7}
.rankbox .big{font-weight:800;font-size:30px;line-height:1.05;font-variant-numeric:tabular-nums}
.rankbox.out .big{color:#C2414B}.rankbox.in .big{color:#13795B}
.rankbox.after{background:#111216;color:#fff}.rankbox.after .lab{color:#B9BDC9}.rankbox.after .big{color:#D7F25A}
.gain{margin-top:4px;font-size:11px;font-weight:800;background:#D7F25A;color:#111216;border-radius:999px;padding:2px 0;animation:glow 1.6s ease-in-out 2.2s 2}
.fixbox{margin-top:12px;background:#F4FBD6;border-radius:12px;padding:10px 12px}.fixbox ul{margin:4px 0 0;padding-left:18px;font-size:13px;line-height:1.55}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}.kpi{background:#F3F4F7;border-radius:12px;padding:12px}.kpi .big{font-weight:800;font-size:22px}
.kpi .lab{margin-top:4px;letter-spacing:.06em}
.h{font-weight:800;font-size:21px;letter-spacing:-.01em;margin-top:2px}
.sec{margin-top:14px;padding-top:12px;border-top:1px solid #EEF0F4}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}.two ul{margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.55}
.foot{font-size:11.5px;color:#6B6F7B;margin-top:10px}
.count{counter-reset:n var(--to)}.count::after{content:counter(n)}
.new{animation:up .35s ease both}
.new .row{opacity:0;animation:pop .45s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--i)*140ms + 250ms)}
.new .bar{transform-origin:left;transform:scaleX(0);animation:grow .9s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--i)*90ms + 300ms)}
.new .bview{opacity:0;animation:up .45s ease forwards;animation-delay:900ms}
.new .kpi{opacity:0;animation:up .4s ease forwards;animation-delay:calc(var(--i)*100ms + 150ms)}
.new .count{animation:count 1s ease-out forwards;animation-delay:1000ms;counter-reset:n var(--n)}
.new .rankbox.after{opacity:0;animation:pop .5s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:1600ms}
.dots i{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:#5B3DF5;animation:dot 1s infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}
#chips{display:flex;gap:8px;overflow-x:auto;padding:12px 18px 4px;border-top:1px solid #EEF0F4;scrollbar-width:none}#chips::-webkit-scrollbar{display:none}
.chip{font:inherit;font-size:12.5px;font-weight:600;background:#fff;color:#111216;border:1px solid #E4E6EC;border-radius:999px;padding:7px 13px;cursor:pointer;white-space:nowrap;transition:border-color .15s,background .15s}
.chip:hover{border-color:#5B3DF5;background:rgba(91,61,245,.05)}
form{display:flex;gap:10px;padding:8px 18px 18px}
#q{flex:1;min-width:0;font:inherit;font-size:14.5px;border:1px solid #E4E6EC;border-radius:12px;padding:12px 14px;outline:none;background:#F6F7FB}
#q:focus{border-color:#5B3DF5;background:#fff;box-shadow:0 0 0 3px rgba(91,61,245,.12)}
#go{font:inherit;font-weight:700;font-size:14px;background:#5B3DF5;color:#fff;border:0;border-radius:12px;padding:0 20px;cursor:pointer}#go:hover{background:#4A2EE0}
footer{color:#6B6F7B;font-size:11.5px;text-align:center;padding:4px 16px 16px;max-width:940px;line-height:1.6}footer b{color:#111216}
@media (max-width:700px){.pimg{aspect-ratio:auto;height:64px}.top p,.top .tag{display:none}.cards{grid-template-columns:1fr}.kpis{grid-template-columns:1fr 1fr}.two{grid-template-columns:1fr}.rk{flex-wrap:wrap}#log{padding:4px 12px 10px}#chips,form{padding-left:12px;padding-right:12px}}
@media (prefers-reduced-motion:reduce){.new,.new *{animation:none !important;opacity:1 !important;transform:none !important}}
"""
page = f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rayon · votre marque dans les conversations IA</title>
<meta name="description" content="Simulez la réponse d'un assistant IA à une demande client, voyez où se place votre marque et ce qu'il faut corriger dans vos fiches produits. Prototype étudiant, marques fictives.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="{FONTS}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23111216'/%3E%3Ctext x='32' y='43' font-family='Arial' font-weight='800' font-size='32' fill='%23D7F25A' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E">
<style>{CSS}</style></head><body>
<div class="top"><div class="logo">R</div><div><h1>Rayon</h1><p>Votre marque dans les conversations IA · simulateur pour stratèges en commerce agentique</p></div><span class="tag">Prototype</span></div>
<div id="app">
  <div id="log"><div id="inner"></div></div>
  <div id="chips">{chips}</div>
  <form id="f" autocomplete="off"><input id="q" aria-label="Message" placeholder="Écrivez la demande du client / Type the shopper's request"><button id="go" type="submit">Simuler</button></form>
</div>
<footer>Prototype étudiant indépendant par <b>Anugraha SN</b> · BBA, EDHEC Business School · marques et produits fictifs · non affilié à Lemrock ni à un assistant IA.</footer>
<script>
{engine}
const inner = document.getElementById('inner'), logEl = document.getElementById('log'), q = document.getElementById('q');
const AV = '<div class="av">R</div>';
const sleep = ms => new Promise(r => setTimeout(r, ms));
function add(html) {{ inner.querySelectorAll('.new').forEach(n => n.classList.remove('new')); inner.insertAdjacentHTML('beforeend', html); return inner.lastElementChild; }}
let busy = false;
async function say(text) {{
  if (!text.trim() || busy) return; busy = true;
  add(`<div class="u new"><div>${{esc(text)}}</div></div>`);
  const typing = add(`<div class="b txt new">${{AV}}<div class="card"><span class="dots"><i></i><i></i><i></i></span></div></div>`);
  logEl.scrollTo({{top: logEl.scrollHeight, behavior: 'smooth'}});
  const d = chatData(text); document.documentElement.lang = d.lang; await sleep(800); typing.remove();
  const b = add(`<div class="b ${{d.type === 'text' ? 'txt' : ''}} new">${{AV}}<div class="card">${{toHtml(d)}}</div></div>`);
  logEl.scrollTo({{top: Math.max(0, b.previousElementSibling.offsetTop - 10), behavior: 'smooth'}}); busy = false;
}}
document.getElementById('f').addEventListener('submit', e => {{ e.preventDefault(); const t = q.value; q.value = ''; say(t); }});
document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => say(c.dataset.q)));
seed({json.dumps(SEED, ensure_ascii=False)});
add(`<div class="b txt new">${{AV}}<div class="card">${{toHtml({{type:'text', lang:'fr', text: TXT.fr.hello}})}}</div></div>`);
</script></body></html>"""
open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(page)
print("index.html", len(page) // 1024, "KB")
