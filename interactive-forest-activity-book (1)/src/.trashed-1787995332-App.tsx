// ============================================================
// Les Copains de la Forêt — Mission Éco-Gardien — Tome 1
// Cahier d'activités interactif éducatif (5-7 ans)
// 40 pages · 11 chapitres · 44 missions
// ============================================================

import { type ReactNode } from 'react';

/* ==================== DONNÉES ==================== */

const C = {
  leo:    { name: 'Léo',    emoji: '🦊', role: 'Chef d\'équipe', desc: 'Petit renard orange, curieux et courageux. Porte un sac d\'explorateur vert.', img: 'images/leo.png' },
  nina:   { name: 'Nina',   emoji: '🐭', role: 'Enquêtrice',    desc: 'Petite souris grise, intelligente et observatrice. Utilise une loupe.', img: 'images/nina.png' },
  darina: { name: 'Darina', emoji: '🦔', role: 'Protectrice',   desc: 'Petit hérisson doux, spécialiste des plantes et animaux.', img: 'images/darina.png' },
  tom:    { name: 'Tom',    emoji: '🐦', role: 'Messager',      desc: 'Petit oiseau bleu et jaune, rapide et joyeux.', img: 'images/tom.png' },
};

const CC: Record<number,{p:string;l:string;d:string}> = {
  1:  { p:'#4caf50', l:'#e8f5e9', d:'#2e7d32' },
  2:  { p:'#2196f3', l:'#e3f2fd', d:'#1565c0' },
  3:  { p:'#ff9800', l:'#fff3e0', d:'#e65100' },
  4:  { p:'#e91e63', l:'#fce4ec', d:'#880e4f' },
  5:  { p:'#fdd835', l:'#fffde7', d:'#f57f17' },
  6:  { p:'#9c27b0', l:'#f3e5f5', d:'#6a1b9a' },
  7:  { p:'#ff5722', l:'#fbe9e7', d:'#bf360c' },
  8:  { p:'#00bcd4', l:'#e0f7fa', d:'#006064' },
  9:  { p:'#f44336', l:'#ffebee', d:'#b71c1c' },
  10: { p:'#009688', l:'#e0f2f1', d:'#004d40' },
  11: { p:'#ff8f00', l:'#fff8e1', d:'#e65100' },
};

/* ==================== COMPOSANTS UI ==================== */

function Page({ children, num, className = '' }: { children: ReactNode; num: number; className?: string }) {
  return (
    <div className={`page ${className}`} id={`page-${num}`}>
      <div className="page-content">{children}</div>
      <div style={{ position:'absolute', bottom:6, right:12, fontSize:9, color:'#bbb' }}>{num} / 40</div>
    </div>
  );
}

function CharImg({ name, size = 48 }: { name: keyof typeof C; size?: number }) {
  const c = C[name];
  return (
    <div className="img-placeholder" style={{ width: size, height: size }}>
      {/* <!-- INSÉRER IMAGE {c.name.toUpperCase()} ICI --> */}
      <img src={c.img} alt={c.name} style={{ width:'100%', height:'100%', objectFit:'contain' }}
        onError={e => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).nextElementSibling && ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).style.removeProperty('display'); }}
      />
      <span style={{ display:'none', fontSize: size*0.55 }}>{c.emoji}</span>
    </div>
  );
}

/* Fallback: show emoji if image fails */
function CharEmoji({ name, size = 28 }: { name: keyof typeof C; size?: number }) {
  return <span style={{ fontSize: size }} title={C[name].name}>{C[name].emoji}</span>;
}

function MissionBox({ num, title, character, icon, children, color = '#4caf50' }: {
  num: number; title: string; character: keyof typeof C | 'all'; icon: string; children: ReactNode; color?: string;
}) {
  return (
    <div style={{ border: `2px solid ${color}30`, borderRadius: 14, padding: '8px 10px', marginBottom: 8, background: `${color}05` }}>
      <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 6 }}>
        <div className="mission-badge" style={{ background: color }}>{num}</div>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{title}</span>
        {character !== 'all' && <CharEmoji name={character} size={22} />}
        {character === 'all' && <span style={{fontSize:14}}>🦊🐭🦔🐦</span>}
      </div>
      {children}
    </div>
  );
}

function Instr({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 11.5, marginBottom: 6, fontStyle:'italic', color:'#555' }}>{children}</p>;
}

function SecretWordBox({ word, chapter }: { word: string; chapter: number }) {
  return (
    <div style={{ background:'#fff8e1', border:'2px solid #ffb300', borderRadius:14, padding:'10px 14px', textAlign:'center', marginTop:6 }}>
      <p style={{ fontWeight:800, fontSize:13, color:'#e65100', marginBottom:4 }}>🔮 Trouve le mot magique caché dans les missions !</p>
      <div style={{ display:'flex', justifyContent:'center', gap:4, margin:'6px 0' }}>
        {word.split('').map((_,i) => <div key={i} className="letter-box">?</div>)}
      </div>
      <p style={{ fontSize:9, color:'#999', marginBottom:6 }}>Indice : {word.length} lettres</p>
      <div style={{ borderTop:'1.5px dashed #ccc', paddingTop:8 }}>
        <p style={{ fontSize:9, color:'#777', marginBottom:4 }}>📱 Scanne le QR code pour valider ce chapitre !</p>
        {/* <!-- [QR CODE CHAPITRE {chapter}] --> */}
        <div className="qr-placeholder">QR CODE<br/>CHAPITRE {chapter}</div>
        <p style={{ fontSize:8, color:'#aaa', marginTop:4 }}>Entre ton prénom, ton âge, le code du livre et le mot secret sur la plateforme.</p>
      </div>
    </div>
  );
}

function WritingLines({ count = 3 }: { count?: number }) {
  return <div>{Array.from({length:count}).map((_,i) => <div key={i} className="writing-line" />)}</div>;
}

function DrawingArea({ label, h = 100 }: { label: string; h?: number }) {
  return (
    <div className="drawing-area" style={{ minHeight: h, padding: 10 }}>
      <p style={{ color:'#aaa', fontSize:10, textAlign:'center' }}>{label}</p>
    </div>
  );
}

function CountRow({ emoji, count }: { emoji: string; count: number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 0', fontSize:12 }}>
      <div style={{ display:'flex', gap:2, flexWrap:'wrap', flex:1 }}>
        {Array.from({length:count}).map((_,i) => <span key={i} style={{fontSize:20}}>{emoji}</span>)}
      </div>
      <span style={{fontWeight:700}}>=</span>
      <span className="answer-box" style={{width:30}}>&nbsp;</span>
    </div>
  );
}

function ConnectEx({ left, right }: { left: string[]; right: string[] }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'0 8px' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {left.map((item,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{fontSize:14, minWidth:90}}>{item}</span>
            <span className="connect-dot" />
          </div>
        ))}
      </div>
      <div style={{ flex:1, minWidth:40 }} />
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {right.map((item,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span className="connect-dot" />
            <span style={{fontSize:14, minWidth:90}}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SortBins({ bins, items }: { bins: {label:string;color:string;emoji:string}[]; items: string[] }) {
  return (
    <div>
      <div style={{ display:'flex', gap:6, marginBottom:8 }}>
        {bins.map((b,i) => (
          <div key={i} className="sort-bin" style={{ borderColor:b.color }}>
            <div style={{ fontWeight:700, fontSize:11, marginBottom:4 }}>{b.emoji} {b.label}</div>
            <div style={{ minHeight:40 }} />
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:4, justifyContent:'center' }}>
        {items.map((item,i) => (
          <span key={i} style={{ background:'#f5f5f5', border:'1.5px solid #ddd', borderRadius:8, padding:'3px 8px', fontSize:10 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function Maze({ grid, startLabel, endLabel }: { grid: number[][]; startLabel: string; endLabel: string }) {
  const cols = grid[0].length;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <p style={{ fontSize:10, marginBottom:2 }}>🚩 {startLabel}</p>
      <div style={{ display:'inline-grid', gridTemplateColumns:`repeat(${cols}, 22px)`, gap:0 }}>
        {grid.flat().map((cell,i) => (
          <div key={i} className={`maze-cell ${cell===1?'maze-wall':'maze-path'}`}>
            {cell===2 && '🚩'}{cell===3 && '⭐'}
          </div>
        ))}
      </div>
      <p style={{ fontSize:10, marginTop:2 }}>⭐ {endLabel}</p>
    </div>
  );
}

function Quiz({ questions }: { questions: {q:string;opts:string[]}[] }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {questions.map((qq,i) => (
        <div key={i} style={{ fontSize:11 }}>
          <p style={{ fontWeight:700, marginBottom:2 }}>{i+1}. {qq.q}</p>
          <div style={{ display:'flex', gap:8, paddingLeft:12, flexWrap:'wrap' }}>
            {qq.opts.map((o,j) => (
              <label key={j} style={{ display:'flex', alignItems:'center', gap:3 }}>
                <span className="checkbox-item" /> <span>{o}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiffArea({ label1, label2, count }: { label1:string; label2:string; count:number }) {
  return (
    <div>
      <div style={{ display:'flex', gap:8 }}>
        <div style={{ flex:1, border:'2px dashed #90caf9', borderRadius:12, minHeight:100, display:'flex', alignItems:'center', justifyContent:'center', background:'#f5faff' }}>
          <p style={{ color:'#999', fontSize:10, textAlign:'center', padding:8 }}>
            {/* <!-- INSÉRER IMAGE {label1} ICI --> */}
            📷 {label1}
          </p>
        </div>
        <div style={{ flex:1, border:'2px dashed #ef9a9a', borderRadius:12, minHeight:100, display:'flex', alignItems:'center', justifyContent:'center', background:'#fff5f5' }}>
          <p style={{ color:'#999', fontSize:10, textAlign:'center', padding:8 }}>
            {/* <!-- INSÉRER IMAGE {label2} ICI --> */}
            📷 {label2}
          </p>
        </div>
      </div>
      <p style={{ textAlign:'center', fontSize:11, fontWeight:700, marginTop:4 }}>🔍 Trouve les {count} différences !</p>
    </div>
  );
}

function LogicSeq({ sequences }: { sequences: {items:string; answer:string}[] }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {sequences.map((s,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:4, fontSize:13 }}>
          <span style={{fontWeight:600}}>{i+1}.</span>
          <span style={{fontSize:18, letterSpacing:2}}>{s.items}</span>
          <span style={{fontSize:16}}>→</span>
          <span className="answer-box" style={{width:36, height:30, display:'inline-flex', alignItems:'center', justifyContent:'center'}}>?</span>
        </div>
      ))}
    </div>
  );
}

function ChapterBanner({ num, title, color }: { num: number; title: string; color: string }) {
  return (
    <div className="chapter-banner" style={{ background:`${color}18`, color }}>
      <span>📖</span> Chapitre {num} — {title}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      {items.map((item,i) => (
        <label key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
          <span className="checkbox-item" />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}

function Riddle({ num, text }: { num: number; text: string }) {
  return (
    <div style={{ marginBottom:6 }}>
      <p style={{ fontSize:11, fontWeight:600, marginBottom:2 }}>Énigme {num} : « {text} »</p>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <span style={{ fontSize:11 }}>Réponse :</span>
        <div className="writing-line" style={{ flex:1 }} />
      </div>
    </div>
  );
}

/* ==================== APP PRINCIPAL ==================== */

export default function App() {
  return (
    <div>
      {/* Bouton impression */}
      <div className="no-print" style={{ position:'fixed', top:16, right:16, zIndex:999, display:'flex', gap:8 }}>
        <button onClick={() => window.print()}
          style={{ background:'#4caf50', color:'#fff', border:'none', borderRadius:30, padding:'10px 20px', fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', fontFamily:'inherit' }}>
          🖨️ Imprimer / PDF
        </button>
      </div>

{/* ================================================================
    PAGE 1 — COUVERTURE
    ================================================================ */}
      <div className="page page-cover" id="page-1">
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:14, letterSpacing:3, textTransform:'uppercase', opacity:0.8 }}>Les Copains de la Forêt</div>
          <h1 style={{ fontSize:36, fontWeight:900, lineHeight:1.15, margin:'8px 0', textShadow:'0 3px 12px rgba(0,0,0,0.3)' }}>
            🌳 Mission<br/>Éco-Gardien
          </h1>
          <p style={{ fontSize:16, fontWeight:600, opacity:0.9 }}>Sauvons la Forêt !</p>
          <div style={{ display:'flex', gap:16, margin:'16px 0' }}>
            {/* <!-- INSÉRER IMAGE LÉO ICI --> */}
            <CharImg name="leo" size={64} />
            {/* <!-- INSÉRER IMAGE NINA ICI --> */}
            <CharImg name="nina" size={64} />
            {/* <!-- INSÉRER IMAGE DARINA ICI --> */}
            <CharImg name="darina" size={64} />
            {/* <!-- INSÉRER IMAGE TOM ICI --> */}
            <CharImg name="tom" size={64} />
          </div>
          <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:16, padding:'10px 24px', marginTop:8 }}>
            <p style={{ fontSize:18, fontWeight:800 }}>TOME 1</p>
          </div>
          <p style={{ fontSize:12, opacity:0.7, marginTop:12 }}>Cahier d'activités interactif · 5-7 ans</p>
          <p style={{ fontSize:11, opacity:0.6 }}>44 missions · 11 chapitres · Certification Éco-Gardien</p>
          <div style={{ marginTop:16 }}>
            <p style={{ fontSize:10, opacity:0.5 }}>Nom : ________________________________</p>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:6, right:12, fontSize:9, opacity:0.4 }}>1 / 40</div>
      </div>

{/* ================================================================
    PAGE 2 — PRÉSENTATION DE L'AVENTURE + PERSONNAGES
    ================================================================ */}
      <Page num={2} className="page-intro">
        <h2 style={{ fontSize:20, fontWeight:900, color:'#2e7d32', textAlign:'center', marginBottom:6 }}>🌿 Bienvenue, futur Éco-Gardien !</h2>
        <p style={{ fontSize:11, textAlign:'center', color:'#555', marginBottom:10, lineHeight:1.5 }}>
          La forêt a besoin de toi ! Rejoins Léo, Nina, Darina et Tom pour une grande aventure écologique.
          Accomplis les 44 missions, trouve les mots secrets et deviens un vrai Éco-Gardien !
        </p>

        <h3 style={{ fontSize:14, fontWeight:800, color:'#2e7d32', marginBottom:8 }}>🌟 Tes héros</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
          {(Object.keys(C) as (keyof typeof C)[]).map(key => (
            <div key={key} style={{ border:'2px solid #e8f5e9', borderRadius:12, padding:8, display:'flex', gap:8, alignItems:'center' }}>
              {/* <!-- INSÉRER IMAGE {C[key].name.toUpperCase()} ICI --> */}
              <CharImg name={key} size={56} />
              <div>
                <p style={{ fontWeight:800, fontSize:13, color:'#2e7d32' }}>{C[key].name}</p>
                <p style={{ fontSize:10, color:'#777', fontStyle:'italic' }}>{C[key].role}</p>
                <p style={{ fontSize:9.5, color:'#666', lineHeight:1.3 }}>{C[key].desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize:14, fontWeight:800, color:'#2e7d32', marginBottom:6 }}>📋 Comment ça marche ?</h3>
        <div style={{ fontSize:10.5, lineHeight:1.6, color:'#555' }}>
          <p>1️⃣ Lis l'histoire de chaque chapitre avec les personnages.</p>
          <p>2️⃣ Réalise les 4 missions de chaque chapitre.</p>
          <p>3️⃣ Trouve le <strong>mot secret</strong> caché dans les missions.</p>
          <p>4️⃣ Scanne le <strong>QR code</strong> à la fin du chapitre.</p>
          <p>5️⃣ Entre le mot secret sur la plateforme pour valider ton chapitre !</p>
          <p>6️⃣ Gagne un <strong>badge numérique</strong> et un certificat ! 🏅</p>
        </div>

        <div style={{ background:'#e8f5e9', borderRadius:12, padding:'8px 12px', marginTop:8, textAlign:'center' }}>
          <p style={{ fontWeight:700, fontSize:12, color:'#2e7d32' }}>🗺️ Sommaire des chapitres</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, marginTop:4, fontSize:9.5, color:'#444', textAlign:'left' }}>
            <p>Ch.1 — Bienvenue dans la forêt</p><p>Ch.7 — Animaux d'Afrique</p>
            <p>Ch.2 — L'eau est précieuse</p><p>Ch.8 — La forêt intelligente</p>
            <p>Ch.3 — Les amis les animaux</p><p>Ch.9 — Les héros du quotidien</p>
            <p>Ch.4 — Les plantes extraordinaires</p><p>Ch.10 — Grande aventure écologique</p>
            <p>Ch.5 — Mission recyclage</p><p>Ch.11 — Examen final</p>
            <p>Ch.6 — Les petits scientifiques</p><p>📜 Certificat Éco-Gardien</p>
          </div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 1 — BIENVENUE DANS LA FORÊT (pages 3-5)
    Mots secret : FORÊT
    ================================================================ */}

      {/* PAGE 3 */}
      <Page num={3}>
        <div style={{ background:CC[1].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[1].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[1].d, marginBottom:4 }}>🌲 Chapitre 1 : Bienvenue dans la forêt</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : découvrir la nature · reconnaître les animaux · comprendre l'environnement</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="leo" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« Salut, c'est moi <strong>Léo</strong> le renard ! 🦊 Aujourd'hui, je t'emmène découvrir ma forêt.
              Ici vivent des centaines d'animaux : des écureuils, des oiseaux, des hérissons, des grenouilles…
              Chacun a sa maison et joue un rôle important. Viens, mes amis Nina, Darina et Tom nous attendent
              pour la première mission ! Es-tu prêt à devenir un Éco-Gardien ? »</em>
            </p>
          </div>
        </div>

        <MissionBox num={1} title="Les habitants de la forêt" character="leo" icon="🎨" color={CC[1].p}>
          <Instr>Colorie les animaux de la forêt avec de belles couleurs ! Chaque animal doit avoir sa vraie couleur.</Instr>
          {/* <!-- INSÉRER IMAGE COLORIAGE FORÊT ICI --> */}
          <DrawingArea label="🎨 Espace de coloriage : un renard, un écureuil, un hérisson et un oiseau dans la forêt (insérer image à colorier)" h={130} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée dans cette mission : <strong>F</strong></p>
        </MissionBox>

        <MissionBox num={2} title="Qui se cache ici ?" character="nina" icon="🔍" color={CC[1].p}>
          <Instr>Nina a repéré des animaux cachés dans la forêt ! Coche chaque animal quand tu le trouves.</Instr>
          {/* <!-- INSÉRER IMAGE SCÈNE FORÊT AVEC ANIMAUX CACHÉS ICI --> */}
          <div style={{ border:'2px dashed #a5d6a7', borderRadius:12, minHeight:70, display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f8e9', marginBottom:6, padding:8 }}>
            <p style={{ color:'#999', fontSize:10 }}>📷 Scène de forêt avec 6 animaux cachés (insérer illustration)</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4 }}>
            {['🐿️ Écureuil','🐦 Oiseau','🦔 Hérisson','🐸 Grenouille','🐛 Chenille','🦋 Papillon'].map((a,i) =>
              <label key={i} style={{display:'flex',alignItems:'center',gap:4,fontSize:10}}><span className="checkbox-item"/>{a}</label>
            )}
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>O</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 4 */}
      <Page num={4}>
        <ChapterBanner num={1} title="Bienvenue dans la forêt" color={CC[1].d} />

        <MissionBox num={3} title="Chacun chez soi" character="darina" icon="🔗" color={CC[1].p}>
          <Instr>Relie chaque animal à sa maison en traçant un trait. Darina va t'aider !</Instr>
          <ConnectEx
            left={['🦊 Renard','🐦 Oiseau','🐟 Poisson','🐿️ Écureuil']}
            right={['🌳 Arbre creux','🕳️ Terrier','🪹 Nid','💧 Rivière']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:6 }}>🔤 Lettre cachée : <strong>R</strong></p>
        </MissionBox>

        <MissionBox num={4} title="Comptons ensemble !" character="tom" icon="🔢" color={CC[1].p}>
          <Instr>Tom a survolé la forêt ! Compte chaque élément et écris le nombre dans la case.</Instr>
          <CountRow emoji="🌳" count={7} />
          <CountRow emoji="🌻" count={5} />
          <CountRow emoji="🦋" count={3} />
          <CountRow emoji="🐦" count={6} />
          <CountRow emoji="🍄" count={4} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>Ê</strong> et <strong>T</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 5 — Secret + QR */}
      <Page num={5}>
        <ChapterBanner num={1} title="Bienvenue dans la forêt" color={CC[1].d} />
        <div style={{ textAlign:'center', marginBottom:8 }}>
          <p style={{ fontSize:12, fontWeight:700, color:CC[1].d }}>🎉 Bravo ! Tu as terminé les 4 missions du Chapitre 1 !</p>
          <p style={{ fontSize:10, color:'#777' }}>Rassemble les lettres cachées dans chaque mission pour trouver le mot secret.</p>
        </div>
        <SecretWordBox word="FORÊT" chapter={1} />
        <div style={{ marginTop:12, textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge à débloquer : « Découvreur de la Forêt »</p>
          <div className="badge-circle" style={{ margin:'8px auto' }}>🌲</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 2 — L'EAU EST PRÉCIEUSE (pages 6-8)
    Mot secret : EAU
    ================================================================ */}

      {/* PAGE 6 */}
      <Page num={6}>
        <div style={{ background:CC[2].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[2].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[2].d, marginBottom:4 }}>💧 Chapitre 2 : L'eau est précieuse</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : cycle de l'eau · économie d'eau · rivière propre</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="nina" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« Oh non ! 🐭 La rivière de la forêt est en danger ! J'ai observé avec ma loupe que l'eau
              est devenue trouble. Il faut comprendre comment fonctionne l'eau et apprendre à la protéger.
              Chaque goutte compte ! Aide-moi à sauver notre rivière ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={5} title="La goutte voyageuse" character="leo" icon="🗺️" color={CC[2].p}>
          <Instr>Aide la petite goutte d'eau à traverser le labyrinthe pour rejoindre la rivière !</Instr>
          <Maze
            grid={[
              [2,0,1,0,0,0,1],
              [1,0,1,0,1,0,0],
              [0,0,0,0,1,1,0],
              [0,1,1,0,0,0,0],
              [0,1,0,0,1,0,1],
              [0,0,0,1,1,0,0],
              [1,1,0,0,0,0,3],
            ]}
            startLabel="Goutte d'eau 💧"
            endLabel="Rivière 🏞️"
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>E</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 7 */}
      <Page num={7}>
        <ChapterBanner num={2} title="L'eau est précieuse" color={CC[2].d} />

        <MissionBox num={6} title="Bons et mauvais gestes" character="nina" icon="📦" color={CC[2].p}>
          <Instr>Classe ces actions : lesquelles économisent l'eau ✅ et lesquelles gaspillent l'eau ❌ ?</Instr>
          <SortBins
            bins={[
              { label:'Bons gestes ✅', color:'#4caf50', emoji:'💚' },
              { label:'Mauvais gestes ❌', color:'#f44336', emoji:'💔' },
            ]}
            items={['Fermer le robinet','Laisser couler l\'eau','Douche courte','Arroser quand il pleut','Récupérer l\'eau de pluie','Laver la voiture au jet']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>A</strong></p>
        </MissionBox>

        <MissionBox num={7} title="Le voyage de l'eau" character="darina" icon="🔗" color={CC[2].p}>
          <Instr>Relie les étapes du cycle de l'eau dans le bon ordre. L'eau fait un grand voyage !</Instr>
          <ConnectEx
            left={['1️⃣ ☀️ Le soleil chauffe','2️⃣ 💨 Évaporation','3️⃣ ☁️ Nuage se forme','4️⃣ 🌧️ Il pleut']}
            right={['🏞️ L\'eau retourne à la rivière','☁️ L\'eau monte dans le ciel','🌧️ Les gouttes tombent','💨 L\'eau devient vapeur']}
          />
        </MissionBox>
      </Page>

      {/* PAGE 8 */}
      <Page num={8}>
        <ChapterBanner num={2} title="L'eau est précieuse" color={CC[2].d} />

        <MissionBox num={8} title="Rivière propre, rivière sale" character="tom" icon="👀" color={CC[2].p}>
          <Instr>Compare les deux images et trouve les 6 différences entre la rivière propre et la rivière sale !</Instr>
          <DiffArea label1="Rivière propre 💎" label2="Rivière polluée 🚯" count={6} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>U</strong></p>
        </MissionBox>

        <SecretWordBox word="EAU" chapter={2} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Gardien de l'Eau »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>💧</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 3 — LES AMIS LES ANIMAUX (pages 9-11)
    Mot secret : VIE
    ================================================================ */}

      {/* PAGE 9 */}
      <Page num={9}>
        <div style={{ background:CC[3].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[3].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[3].d, marginBottom:4 }}>🐾 Chapitre 3 : Les amis les animaux</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : habitats · alimentation animale · protection des espèces</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="darina" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« Bonjour, c'est Darina ! 🦔 Dans la forêt, chaque animal est précieux. Les oiseaux
              mangent les insectes, les abeilles aident les fleurs, les vers de terre nourrissent la terre…
              Tout est lié ! Protéger les animaux, c'est protéger toute la forêt. Partons à leur rencontre ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={9} title="Qui habite où ?" character="darina" icon="🏠" color={CC[3].p}>
          <Instr>Relie chaque animal à l'endroit où il vit.</Instr>
          <ConnectEx
            left={['🐻 Ours','🐦 Oiseau','🐟 Poisson','🐛 Ver de terre']}
            right={['🌍 Sous la terre','🏔️ Grotte','🌊 Lac','🪹 Nid']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>V</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 10 */}
      <Page num={10}>
        <ChapterBanner num={3} title="Les amis les animaux" color={CC[3].d} />

        <MissionBox num={10} title="Familles d'animaux" character="nina" icon="📦" color={CC[3].p}>
          <Instr>Classe chaque animal dans la bonne famille !</Instr>
          <SortBins
            bins={[
              { label:'Mammifères', color:'#e65100', emoji:'🐾' },
              { label:'Oiseaux', color:'#1565c0', emoji:'🐦' },
              { label:'Insectes', color:'#2e7d32', emoji:'🐛' },
              { label:'Poissons', color:'#0097a7', emoji:'🐟' },
            ]}
            items={['🐶 Chien','🦅 Aigle','🦋 Papillon','🐟 Truite','🐱 Chat','🐦 Moineau','🐝 Abeille','🐠 Saumon']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>I</strong></p>
        </MissionBox>

        <MissionBox num={11} title="Le bon repas" character="leo" icon="🔗" color={CC[3].p}>
          <Instr>Relie chaque animal à sa nourriture préférée !</Instr>
          <ConnectEx
            left={['🐿️ Écureuil','🐇 Lapin','🐸 Grenouille','🐦 Oiseau']}
            right={['🐛 Vers','🌰 Noisettes','🦟 Mouches','🥕 Carottes']}
          />
        </MissionBox>
      </Page>

      {/* PAGE 11 */}
      <Page num={11}>
        <ChapterBanner num={3} title="Les amis les animaux" color={CC[3].d} />

        <MissionBox num={12} title="Qui vient ensuite ?" character="tom" icon="🧩" color={CC[3].p}>
          <Instr>Observe les suites et dessine ou écris l'animal qui vient après !</Instr>
          <LogicSeq sequences={[
            { items:'🐛 → 🦋 → 🐛 → 🦋 → 🐛', answer:'🦋' },
            { items:'🐸 → 🐸 → 🐦 → 🐸 → 🐸', answer:'🐦' },
            { items:'🐿️ → 🌰 → 🐿️ → 🌰', answer:'🐿️' },
            { items:'🐾 → 🐾 → 🐾 → 🐦 → 🐾 → 🐾 → 🐾', answer:'🐦' },
          ]} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>E</strong></p>
        </MissionBox>

        <SecretWordBox word="VIE" chapter={3} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Ami des Animaux »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>🐾</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 4 — LES PLANTES EXTRAORDINAIRES (pages 12-14)
    Mot secret : GRAINE
    ================================================================ */}

      {/* PAGE 12 */}
      <Page num={12}>
        <div style={{ background:CC[4].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[4].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[4].d, marginBottom:4 }}>🌱 Chapitre 4 : Les plantes extraordinaires</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : arbres · graines · croissance des plantes</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="darina" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« Regarde cette petite graine ! 🌱 Elle deviendra un jour un grand arbre.
              Les plantes sont magiques : elles fabriquent l'oxygène que nous respirons, elles nourrissent
              les animaux et protègent le sol. Apprends à les connaître avec moi ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={13} title="Les parties de la plante" character="darina" icon="🔍" color={CC[4].p}>
          <Instr>Écris le nom de chaque partie de la plante à côté de la flèche qui la montre.</Instr>
          {/* <!-- INSÉRER IMAGE SCHÉMA DE PLANTE AVEC FLÈCHES ICI --> */}
          <div style={{ border:'2px dashed #f48fb1', borderRadius:12, padding:10, background:'#fce4ec40', minHeight:80, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ color:'#999', fontSize:10 }}>📷 Schéma d'une plante avec flèches (insérer illustration)</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, marginTop:6 }}>
            {['🌸 Fleur → ___','🍃 Feuille → ___','🌿 Tige → ___','🌰 Fruit → ___','🌱 Racine → ___'].map((p,i) =>
              <span key={i} style={{ fontSize:10, padding:2 }}>{p}</span>
            )}
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>G</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 13 */}
      <Page num={13}>
        <ChapterBanner num={4} title="Les plantes extraordinaires" color={CC[4].d} />

        <MissionBox num={14} title="De la graine à l'arbre" character="nina" icon="🧩" color={CC[4].p}>
          <Instr>Numérote les étapes dans le bon ordre (de 1 à 5) pour montrer comment une graine devient un arbre.</Instr>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[
              { emoji:'🌳', label:'Grand arbre avec des fruits', box:'___' },
              { emoji:'🌱', label:'La petite pousse sort de terre', box:'___' },
              { emoji:'🌰', label:'La graine est plantée dans la terre', box:'___' },
              { emoji:'☀️💧', label:'Le soleil et la pluie aident la pousse', box:'___' },
              { emoji:'🌿', label:'La plante grandit et fait des feuilles', box:'___' },
            ].map((step,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
                <span className="answer-box" style={{ width:28 }}>&nbsp;</span>
                <span style={{ fontSize:20 }}>{step.emoji}</span>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>R</strong>, <strong>A</strong></p>
        </MissionBox>

        <MissionBox num={15} title="Mon jardin de fleurs" character="leo" icon="🎨" color={CC[4].p}>
          <Instr>Colorie ce magnifique jardin avec des couleurs joyeuses ! Chaque fleur a sa propre couleur.</Instr>
          {/* <!-- INSÉRER IMAGE COLORIAGE JARDIN ICI --> */}
          <DrawingArea label="🎨 Espace de coloriage : un jardin avec des tulipes, roses, tournesols et marguerites (insérer image à colorier)" h={110} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>I</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 14 */}
      <Page num={14}>
        <ChapterBanner num={4} title="Les plantes extraordinaires" color={CC[4].d} />

        <MissionBox num={16} title="Récolte dans la forêt" character="tom" icon="🔢" color={CC[4].p}>
          <Instr>Tom a survolé le jardin de Darina. Compte chaque récolte !</Instr>
          <CountRow emoji="🍎" count={5} />
          <CountRow emoji="🍄" count={3} />
          <CountRow emoji="🌰" count={7} />
          <CountRow emoji="🍃" count={4} />
          <CountRow emoji="🌻" count={6} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>N</strong>, <strong>E</strong></p>
        </MissionBox>

        <SecretWordBox word="GRAINE" chapter={4} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Expert des Plantes »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>🌱</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 5 — MISSION RECYCLAGE (pages 15-17)
    Mot secret : TRI
    ================================================================ */}

      {/* PAGE 15 */}
      <Page num={15}>
        <div style={{ background:CC[5].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[5].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[5].d, marginBottom:4 }}>♻️ Chapitre 5 : Mission recyclage</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : déchets · tri · réutilisation</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="leo" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« Alerte ! 🦊 On a trouvé des déchets partout dans la forêt ! Bouteilles, papiers, plastiques…
              Ce n'est pas normal ! Pour protéger notre forêt, nous devons apprendre à trier et recycler.
              Chaque déchet a sa poubelle ! Ensemble, nettoyons la forêt ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={17} title="Tri sélectif" character="leo" icon="📦" color={CC[5].p}>
          <Instr>Aide Léo à trier les déchets ! Écris le numéro de chaque déchet dans la bonne poubelle.</Instr>
          <SortBins
            bins={[
              { label:'Plastique', color:'#fdd835', emoji:'🟡' },
              { label:'Papier/Carton', color:'#1e88e5', emoji:'🔵' },
              { label:'Verre', color:'#43a047', emoji:'🟢' },
            ]}
            items={['① 🍶 Bouteille plastique','② 📰 Journal','③ 🫙 Pot en verre','④ 🧃 Brique de jus','⑤ 📦 Carton','⑥ 🍾 Bouteille verre']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>T</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 16 */}
      <Page num={16}>
        <ChapterBanner num={5} title="Mission recyclage" color={CC[5].d} />

        <MissionBox num={18} title="Recyclable ou non ?" character="nina" icon="🔍" color={CC[5].p}>
          <Instr>Entoure les objets qui peuvent être recyclés. Barre ceux qui ne le peuvent pas.</Instr>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {[
              { item:'🍶 Bouteille en plastique', recyclable: true },
              { item:'🍌 Peau de banane', recyclable: false },
              { item:'📰 Journal', recyclable: true },
              { item:'🥚 Coquille d\'œuf', recyclable: false },
              { item:'🥫 Boîte de conserve', recyclable: true },
              { item:'🧻 Mouchoir usagé', recyclable: false },
              { item:'📦 Boîte en carton', recyclable: true },
              { item:'🫙 Pot en verre', recyclable: true },
            ].map((obj,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10.5, padding:'3px 6px', border:'1.5px solid #eee', borderRadius:8 }}>
                <span className="checkbox-item" />
                <span>{obj.item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>R</strong></p>
        </MissionBox>

        <MissionBox num={19} title="Seconde vie" character="darina" icon="🔗" color={CC[5].p}>
          <Instr>Relie chaque déchet recyclé à ce qu'il peut devenir !</Instr>
          <ConnectEx
            left={['📰 Vieux journaux','🍶 Bouteilles plastique','🫙 Pots en verre']}
            right={['🫙 Nouveaux bocaux','📦 Nouveau carton','👕 Tissu polaire']}
          />
        </MissionBox>
      </Page>

      {/* PAGE 17 */}
      <Page num={17}>
        <ChapterBanner num={5} title="Mission recyclage" color={CC[5].d} />

        <MissionBox num={20} title="Parc propre, parc sale" character="tom" icon="👀" color={CC[5].p}>
          <Instr>Compare les deux parcs et trouve les 7 différences !</Instr>
          <DiffArea label1="Parc propre 🌿" label2="Parc avec déchets 🚯" count={7} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>I</strong></p>
        </MissionBox>

        <SecretWordBox word="TRI" chapter={5} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Champion du Recyclage »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>♻️</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 6 — LES PETITS SCIENTIFIQUES (pages 18-20)
    Mot secret : SCIENCE
    ================================================================ */}

      {/* PAGE 18 */}
      <Page num={18}>
        <div style={{ background:CC[6].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[6].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[6].d, marginBottom:4 }}>🔬 Chapitre 6 : Les petits scientifiques</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : observation · expériences simples · découverte</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="nina" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« 🐭 Ma loupe est prête ! Un bon scientifique observe, pose des questions et fait des
              expériences. Aujourd'hui, on va regarder la nature de très très près, faire une expérience
              avec de l'eau et résoudre des énigmes logiques. Enfile ta blouse de scientifique ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={21} title="L'expérience de l'eau" character="nina" icon="🔬" color={CC[6].p}>
          <Instr>Réalise cette expérience avec un adulte et note ce que tu observes !</Instr>
          <div style={{ display:'flex', flexDirection:'column', gap:4, fontSize:11 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f3e5f520', padding:'4px 8px', borderRadius:8 }}>
              <span style={{fontWeight:700}}>Étape 1 :</span> Remplis un verre d'eau 🥤
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f3e5f520', padding:'4px 8px', borderRadius:8 }}>
              <span style={{fontWeight:700}}>Étape 2 :</span> Ajoute du sel et mélange bien 🧂
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f3e5f520', padding:'4px 8px', borderRadius:8 }}>
              <span style={{fontWeight:700}}>Étape 3 :</span> Pose doucement un œuf dans l'eau 🥚
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f3e5f520', padding:'4px 8px', borderRadius:8 }}>
              <span style={{fontWeight:700}}>Étape 4 :</span> Observe ce qui se passe ! 👀
            </div>
          </div>
          <p style={{ fontSize:10, fontWeight:600, marginTop:6 }}>Que s'est-il passé ?</p>
          <WritingLines count={2} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>S</strong>, <strong>C</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 19 */}
      <Page num={19}>
        <ChapterBanner num={6} title="Les petits scientifiques" color={CC[6].d} />

        <MissionBox num={22} title="À la loupe !" character="nina" icon="🔍" color={CC[6].p}>
          <Instr>Observe la nature avec une loupe (ou tes yeux) et dessine ce que tu vois dans chaque cercle !</Instr>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {['🌿 Une feuille de près','🐜 Un petit insecte','🪨 La surface d\'une pierre','🌸 Le cœur d\'une fleur'].map((item,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <p style={{ fontSize:9.5, marginBottom:2, fontWeight:600 }}>{item}</p>
                <div style={{ width:80, height:80, borderRadius:'50%', border:'3px dashed #ce93d8', margin:'0 auto', background:'#fafafa' }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>I</strong></p>
        </MissionBox>

        <MissionBox num={23} title="Suite logique" character="leo" icon="🧩" color={CC[6].p}>
          <Instr>Observe chaque suite et dessine ou écris ce qui vient ensuite !</Instr>
          <LogicSeq sequences={[
            { items:'🔴 → 🔵 → 🔴 → 🔵 → 🔴', answer:'🔵' },
            { items:'🌳 → 🌻 → 🌳 → 🌻 → 🌳 → 🌻', answer:'🌳' },
            { items:'⭐ → ⭐ → 🌙 → ⭐ → ⭐ → 🌙', answer:'⭐' },
            { items:'🐛 → 🐛 → 🦋 → 🐛 → 🐛', answer:'🦋' },
          ]} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>E</strong>, <strong>N</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 20 */}
      <Page num={20}>
        <ChapterBanner num={6} title="Les petits scientifiques" color={CC[6].d} />

        <MissionBox num={24} title="Outils du scientifique" character="darina" icon="🔗" color={CC[6].p}>
          <Instr>Relie chaque outil scientifique à ce qu'il permet de faire !</Instr>
          <ConnectEx
            left={['🔍 Loupe','🌡️ Thermomètre','📏 Règle','⚗️ Tube à essai']}
            right={['Faire une expérience','Observer de près','Mesurer la longueur','Mesurer la température']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>C</strong>, <strong>E</strong></p>
        </MissionBox>

        <SecretWordBox word="SCIENCE" chapter={6} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Petit Scientifique »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>🔬</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 7 — PROTÉGER LES ANIMAUX D'AFRIQUE (pages 21-23)
    Mot secret : SAVANE
    ================================================================ */}

      {/* PAGE 21 */}
      <Page num={21}>
        <div style={{ background:CC[7].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[7].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[7].d, marginBottom:4 }}>🦁 Chapitre 7 : Protéger les animaux d'Afrique</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : biodiversité africaine · animaux sauvages · conservation</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="leo" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« 🦊 Aujourd'hui, on voyage jusqu'en Afrique ! Là-bas vivent des animaux extraordinaires :
              le lion, l'éléphant, la girafe, le zèbre… Mais ils sont en danger ! Leur maison, la savane,
              est menacée. Découvrons ensemble ces animaux incroyables et comment les protéger ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={25} title="Ombres africaines" character="leo" icon="🔗" color={CC[7].p}>
          <Instr>Relie chaque animal d'Afrique à son ombre !</Instr>
          {/* <!-- INSÉRER IMAGES OMBRES ANIMAUX AFRIQUE ICI --> */}
          <ConnectEx
            left={['🦁 Lion','🐘 Éléphant','🦒 Girafe','🦓 Zèbre']}
            right={['🔲 Ombre rayée','🔲 Ombre avec crinière','🔲 Ombre long cou','🔲 Ombre grandes oreilles']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>S</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 22 */}
      <Page num={22}>
        <ChapterBanner num={7} title="Protéger les animaux d'Afrique" color={CC[7].d} />

        <MissionBox num={26} title="Safari de couleurs" character="darina" icon="🎨" color={CC[7].p}>
          <Instr>Colorie les animaux de la savane africaine avec leurs vraies couleurs !</Instr>
          {/* <!-- INSÉRER IMAGE COLORIAGE ANIMAUX AFRIQUE ICI --> */}
          <DrawingArea label="🎨 Espace de coloriage : lion, éléphant, girafe, zèbre et rhinocéros dans la savane (insérer image à colorier)" h={110} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>A</strong>, <strong>V</strong></p>
        </MissionBox>

        <MissionBox num={27} title="Comptage safari" character="tom" icon="🔢" color={CC[7].p}>
          <Instr>Combien d'animaux de chaque espèce vois-tu ? Compte et écris le nombre !</Instr>
          <CountRow emoji="🦁" count={3} />
          <CountRow emoji="🐘" count={5} />
          <CountRow emoji="🦒" count={2} />
          <CountRow emoji="🦓" count={4} />
          <CountRow emoji="🦏" count={6} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>A</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 23 */}
      <Page num={23}>
        <ChapterBanner num={7} title="Protéger les animaux d'Afrique" color={CC[7].d} />

        <MissionBox num={28} title="Vers le point d'eau" character="nina" icon="🗺️" color={CC[7].p}>
          <Instr>Aide le petit éléphant à traverser la savane pour trouver le point d'eau !</Instr>
          <Maze
            grid={[
              [2,0,1,1,0,0,0],
              [0,0,0,1,0,1,0],
              [1,1,0,0,0,1,0],
              [0,0,0,1,0,0,0],
              [0,1,1,1,0,1,0],
              [0,0,0,0,0,1,0],
              [1,1,0,1,0,0,3],
            ]}
            startLabel="Éléphant 🐘"
            endLabel="Point d'eau 💧"
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>N</strong>, <strong>E</strong></p>
        </MissionBox>

        <SecretWordBox word="SAVANE" chapter={7} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Protecteur de la Savane »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>🦁</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 8 — LA FORÊT INTELLIGENTE (pages 24-26)
    Mot secret : ROBOT
    ================================================================ */}

      {/* PAGE 24 */}
      <Page num={24}>
        <div style={{ background:CC[8].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[8].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[8].d, marginBottom:4 }}>🤖 Chapitre 8 : La forêt intelligente</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : technologie · capteurs · découverte de l'IA</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="tom" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« 🐦 Piou piou ! J'ai découvert quelque chose d'incroyable ! Des scientifiques ont installé
              des petits appareils dans la forêt. Ce sont des capteurs et des robots qui aident à surveiller
              les animaux, la température et les arbres. La technologie peut aider la nature ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={29} title="Programme le robot" character="leo" icon="🧩" color={CC[8].p}>
          <Instr>Le petit robot doit ramasser les feuilles dans la forêt. Trace son chemin en suivant les flèches !</Instr>
          <div style={{ textAlign:'center', marginBottom:6 }}>
            <p style={{ fontSize:13, letterSpacing:4, fontWeight:700 }}>➡️ ⬆️ ⬆️ ➡️ ➡️ ⬇️ ⬇️ ➡️</p>
          </div>
          <div style={{ display:'inline-grid', gridTemplateColumns:'repeat(6, 28px)', gap:0, margin:'0 auto', justifyContent:'center' }}>
            {[
              '🤖','⬜','⬜','⬜','⬜','⬜',
              '⬜','⬜','🍃','⬜','⬜','⬜',
              '⬜','⬜','⬜','⬜','🍃','⬜',
              '⬜','🍃','⬜','⬜','⬜','⬜',
              '⬜','⬜','⬜','🍃','⬜','🏁',
            ].map((cell,i) => (
              <div key={i} style={{ width:28, height:28, border:'1px solid #b2ebf2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background: cell==='⬜' ? '#fff' : '#e0f7fa' }}>
                {cell !== '⬜' ? cell : ''}
              </div>
            ))}
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>R</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 25 */}
      <Page num={25}>
        <ChapterBanner num={8} title="La forêt intelligente" color={CC[8].d} />

        <MissionBox num={30} title="Capteurs malins" character="nina" icon="🔗" color={CC[8].p}>
          <Instr>Relie chaque capteur à ce qu'il mesure dans la forêt !</Instr>
          <ConnectEx
            left={['🌡️ Capteur de température','💧 Capteur d\'humidité','📷 Caméra','🎤 Microphone']}
            right={['Écoute les sons des animaux','Mesure la chaleur de l\'air','Prend des photos d\'animaux','Mesure l\'eau dans le sol']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>O</strong></p>
        </MissionBox>

        <MissionBox num={31} title="Capteurs cachés" character="darina" icon="🔍" color={CC[8].p}>
          <Instr>Retrouve les 5 capteurs cachés dans la forêt ! Coche chaque capteur quand tu le trouves.</Instr>
          {/* <!-- INSÉRER IMAGE SCÈNE FORÊT AVEC CAPTEURS CACHÉS ICI --> */}
          <div style={{ border:'2px dashed #80deea', borderRadius:12, minHeight:80, display:'flex', alignItems:'center', justifyContent:'center', background:'#e0f7fa40', marginBottom:6, padding:8 }}>
            <p style={{ color:'#999', fontSize:10 }}>📷 Scène de forêt avec 5 capteurs cachés (insérer illustration)</p>
          </div>
          <CheckList items={['🌡️ Capteur de température (dans un arbre)','💧 Capteur d\'humidité (près de la rivière)','📷 Caméra (cachée dans les buissons)','🎤 Micro (sur une branche)','☀️ Panneau solaire (en haut d\'un arbre)']} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>B</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 26 */}
      <Page num={26}>
        <ChapterBanner num={8} title="La forêt intelligente" color={CC[8].d} />

        <MissionBox num={32} title="Mon robot gardien" character="tom" icon="🎨" color={CC[8].p}>
          <Instr>Imagine et dessine ton propre robot gardien de la forêt ! Donne-lui un nom et des super-pouvoirs !</Instr>
          <DrawingArea label="✏️ Dessine ton robot gardien de la forêt ici !" h={120} />
          <div style={{ display:'flex', gap:8, marginTop:6 }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:10, fontWeight:600 }}>Nom du robot :</p>
              <div className="writing-line" />
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:10, fontWeight:600 }}>Son super-pouvoir :</p>
              <div className="writing-line" />
            </div>
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>O</strong>, <strong>T</strong></p>
        </MissionBox>

        <SecretWordBox word="ROBOT" chapter={8} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Inventeur Écolo »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>🤖</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 9 — LES HÉROS DU QUOTIDIEN (pages 27-29)
    Mot secret : ACTION
    ================================================================ */}

      {/* PAGE 27 */}
      <Page num={27}>
        <div style={{ background:CC[9].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[9].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[9].d, marginBottom:4 }}>🦸 Chapitre 9 : Les héros du quotidien</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : gestes écologiques · famille · école</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CharImg name="leo" size={48} />
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« 🦊 Tu sais quoi ? Pas besoin d'avoir des super-pouvoirs pour être un héros ! Chaque petit
              geste écologique que tu fais à la maison, à l'école ou dans le parc aide la planète.
              Éteindre la lumière, ne pas gaspiller l'eau, trier les déchets… Tu es déjà un héros ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={33} title="Bons gestes, mauvais gestes" character="leo" icon="📦" color={CC[9].p}>
          <Instr>Classe ces actions : les bons gestes pour la planète et les mauvais gestes.</Instr>
          <SortBins
            bins={[
              { label:'Bons gestes ✅', color:'#4caf50', emoji:'🌍' },
              { label:'Mauvais gestes ❌', color:'#f44336', emoji:'😢' },
            ]}
            items={['Éteindre la lumière','Jeter des papiers par terre','Planter un arbre','Gaspiller la nourriture','Faire du vélo','Laisser le robinet ouvert']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>A</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 28 */}
      <Page num={28}>
        <ChapterBanner num={9} title="Les héros du quotidien" color={CC[9].d} />

        <MissionBox num={34} title="Détective écolo" character="nina" icon="🔍" color={CC[9].p}>
          <Instr>Retrouve les 5 gestes écologiques dans cette scène de la vie quotidienne !</Instr>
          {/* <!-- INSÉRER IMAGE SCÈNE QUOTIDIENNE ICI --> */}
          <div style={{ border:'2px dashed #ef9a9a', borderRadius:12, minHeight:80, display:'flex', alignItems:'center', justifyContent:'center', background:'#ffebee40', marginBottom:6, padding:8 }}>
            <p style={{ color:'#999', fontSize:10 }}>📷 Scène de vie quotidienne avec gestes écologiques (insérer illustration)</p>
          </div>
          <CheckList items={[
            '♻️ Quelqu\'un qui recycle',
            '🚲 Quelqu\'un à vélo',
            '🌱 Un jardin potager',
            '☀️ Un panneau solaire',
            '🥬 Un composteur',
          ]} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>C</strong>, <strong>T</strong></p>
        </MissionBox>

        <MissionBox num={35} title="Ma promesse verte" character="darina" icon="✏️" color={CC[9].p}>
          <Instr>Écris 3 gestes écologiques que tu peux faire chaque jour pour protéger la planète !</Instr>
          <div style={{ paddingLeft:8 }}>
            <p style={{ fontSize:11, fontWeight:600, marginBottom:2 }}>1. Je m'engage à :</p>
            <WritingLines count={1} />
            <p style={{ fontSize:11, fontWeight:600, marginBottom:2, marginTop:6 }}>2. Je m'engage à :</p>
            <WritingLines count={1} />
            <p style={{ fontSize:11, fontWeight:600, marginBottom:2, marginTop:6 }}>3. Je m'engage à :</p>
            <WritingLines count={1} />
          </div>
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>I</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 29 */}
      <Page num={29}>
        <ChapterBanner num={9} title="Les héros du quotidien" color={CC[9].d} />

        <MissionBox num={36} title="Cause et effet" character="tom" icon="🔗" color={CC[9].p}>
          <Instr>Relie chaque geste écologique à son effet positif sur la planète !</Instr>
          <ConnectEx
            left={['🌳 Planter des arbres','💡 Éteindre les lumières','♻️ Trier les déchets','🚲 Aller à vélo']}
            right={['Moins de pollution de l\'air','Plus d\'oxygène pour tous','Économiser l\'énergie','Moins de déchets dans la nature']}
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>O</strong>, <strong>N</strong></p>
        </MissionBox>

        <SecretWordBox word="ACTION" chapter={9} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Héros du Quotidien »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>🦸</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 10 — GRANDE AVENTURE ÉCOLOGIQUE (pages 30-32)
    Mot secret : PLANÈTE
    ================================================================ */}

      {/* PAGE 30 */}
      <Page num={30}>
        <div style={{ background:CC[10].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[10].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[10].d, marginBottom:4 }}>🌍 Chapitre 10 : Grande aventure écologique</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Thèmes : révision générale · défis mélangés</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <div style={{ display:'flex', gap:4 }}>
              <CharImg name="leo" size={36} />
              <CharImg name="nina" size={36} />
            </div>
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« 🦊🐭 C'est l'heure de la grande aventure ! Toute l'équipe est là. Nous avons appris
              tellement de choses sur la forêt, l'eau, les animaux, les plantes et le recyclage.
              Maintenant, montrons que nous sommes de vrais Éco-Gardiens avec ces défis spéciaux ! »</em>
            </p>
          </div>
        </div>

        <MissionBox num={37} title="Le grand quiz nature" character="leo" icon="❓" color={CC[10].p}>
          <Instr>Réponds à ces questions en cochant la bonne réponse. Tu te souviens de tout ?</Instr>
          <Quiz questions={[
            { q:'Quel animal a une trompe ?', opts:['🦁 Lion','🐘 Éléphant','🐸 Grenouille'] },
            { q:'Quelle partie de la plante est sous terre ?', opts:['🌸 Fleur','🌱 Racine','🍃 Feuille'] },
            { q:'Combien de pattes a un insecte ?', opts:['4 pattes','6 pattes','8 pattes'] },
            { q:'Quelle poubelle pour le verre ?', opts:['🟡 Jaune','🟢 Verte','🔴 Rouge'] },
            { q:'Que produisent les arbres ?', opts:['💨 Du CO2','🌬️ De l\'oxygène','💨 De la fumée'] },
            { q:'Comment économiser l\'eau ?', opts:['Laisser couler','Prendre un bain','Douche courte'] },
          ]} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>P</strong>, <strong>L</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 31 */}
      <Page num={31}>
        <ChapterBanner num={10} title="Grande aventure écologique" color={CC[10].d} />

        <MissionBox num={38} title="Le grand parcours" character="nina" icon="🗺️" color={CC[10].p}>
          <Instr>Traverse ce grand labyrinthe pour arriver à la clairière secrète ! C'est le plus grand défi !</Instr>
          <Maze
            grid={[
              [2,0,1,1,0,0,1,0,0],
              [0,0,0,1,0,1,0,0,1],
              [1,1,0,0,0,1,0,1,0],
              [0,0,0,1,0,0,0,0,0],
              [0,1,1,1,0,1,1,0,1],
              [0,0,0,0,0,0,1,0,0],
              [1,0,1,1,1,0,0,0,1],
              [0,0,0,0,1,0,1,0,0],
              [1,1,0,1,0,0,0,0,3],
            ]}
            startLabel="Départ de l'aventure 🏕️"
            endLabel="Clairière secrète 🌟"
          />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettre cachée : <strong>A</strong></p>
        </MissionBox>

        <MissionBox num={39} title="Énigmes de la forêt" character="darina" icon="🧩" color={CC[10].p}>
          <Instr>Résous ces devinettes de Darina ! Écris la réponse sur la ligne.</Instr>
          <Riddle num={1} text="Je suis orange et j'ai une grande queue touffue. Qui suis-je ?" />
          <Riddle num={2} text="Je tombe du ciel et je remplis les rivières. Qui suis-je ?" />
          <Riddle num={3} text="Je suis petit avec des piquants sur le dos. Qui suis-je ?" />
          <Riddle num={4} text="Je vole dans le ciel et je chante le matin. Qui suis-je ?" />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>N</strong>, <strong>È</strong></p>
        </MissionBox>
      </Page>

      {/* PAGE 32 */}
      <Page num={32}>
        <ChapterBanner num={10} title="Grande aventure écologique" color={CC[10].d} />

        <MissionBox num={40} title="Notre belle planète" character="tom" icon="🎨" color={CC[10].p}>
          <Instr>Colorie notre belle planète Terre ! Dessine autour d'elle des arbres, des animaux et des fleurs.</Instr>
          {/* <!-- INSÉRER IMAGE COLORIAGE PLANÈTE TERRE ICI --> */}
          <DrawingArea label="🎨 Espace de coloriage : La Terre au centre, entourée d'arbres, d'animaux, de fleurs et d'eau (insérer image à colorier)" h={140} />
          <p style={{ fontSize:9, color:'#888', marginTop:4 }}>🔤 Lettres cachées : <strong>T</strong>, <strong>E</strong></p>
        </MissionBox>

        <SecretWordBox word="PLANÈTE" chapter={10} />
        <div style={{ textAlign:'center', marginTop:4 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#f57f17' }}>🏅 Badge : « Aventurier Écologique »</p>
          <div className="badge-circle" style={{ margin:'6px auto' }}>🌍</div>
        </div>
      </Page>

{/* ================================================================
    CHAPITRE 11 — L'EXAMEN FINAL DE L'ÉCO-GARDIEN (pages 33-36)
    Mot secret : ÉCO-GARDIEN
    ================================================================ */}

      {/* PAGE 33 */}
      <Page num={33}>
        <div style={{ background:CC[11].l, borderRadius:14, padding:'10px 14px', marginBottom:8, borderLeft:`4px solid ${CC[11].p}`, border:`2px solid ${CC[11].p}` }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:CC[11].d, marginBottom:4 }}>⭐ Chapitre 11 : L'examen final de l'Éco-Gardien</h2>
          <p style={{ fontSize:10, color:'#666', marginBottom:4 }}>Grande mission finale — Prouve que tu es un vrai Éco-Gardien !</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <div style={{ display:'flex', gap:2 }}>
              <CharImg name="leo" size={32} />
              <CharImg name="nina" size={32} />
              <CharImg name="darina" size={32} />
              <CharImg name="tom" size={32} />
            </div>
            <p style={{ fontSize:10.5, lineHeight:1.5, color:'#444', flex:1 }}>
              <em>« 🦊🐭🦔🐦 C'est le moment de vérité ! Tu as parcouru toute la forêt, découvert l'eau,
              les animaux, les plantes, le recyclage, la science, l'Afrique, la technologie et les
              gestes du quotidien. Il est temps de passer l'examen final ! Es-tu prêt ? »</em>
            </p>
          </div>
        </div>

        <MissionBox num={41} title="Le test final" character="all" icon="❓" color={CC[11].p}>
          <Instr>Réponds à toutes ces questions pour prouver que tu es un vrai Éco-Gardien !</Instr>
          <Quiz questions={[
            { q:'Où vit l\'oiseau ?', opts:['🕳️ Terrier','🪹 Nid','🌊 Rivière'] },
            { q:'Que fait-on pour économiser l\'eau ?', opts:['Bain long','Douche courte','Laisser couler'] },
            { q:'Quelle est la poubelle pour le papier ?', opts:['🟡 Jaune','🔵 Bleue','🟢 Verte'] },
            { q:'Que devient la chenille ?', opts:['🐸 Grenouille','🦋 Papillon','🐟 Poisson'] },
            { q:'Quel animal vit dans la savane ?', opts:['🐧 Pingouin','🦁 Lion','🐳 Baleine'] },
            { q:'Que mesurent les capteurs dans la forêt ?', opts:['La température','La musique','Les couleurs'] },
            { q:'Quel gaz les arbres produisent-ils ?', opts:['Du CO2','De l\'oxygène','De la vapeur'] },
            { q:'Que faut-il faire des déchets ?', opts:['Les cacher','Les trier','Les brûler'] },
          ]} />
        </MissionBox>
      </Page>

      {/* PAGE 34 */}
      <Page num={34}>
        <ChapterBanner num={11} title="Examen final de l'Éco-Gardien" color={CC[11].d} />

        <MissionBox num={42} title="La grande image" character="all" icon="🔍" color={CC[11].p}>
          <Instr>Observe cette grande scène de la forêt et retrouve tous les éléments de la liste !</Instr>
          {/* <!-- INSÉRER GRANDE IMAGE SCÈNE FORÊT COMPLÈTE ICI --> */}
          <div style={{ border:'2px dashed #ffb74d', borderRadius:14, minHeight:120, display:'flex', alignItems:'center', justifyContent:'center', background:'#fff8e140', marginBottom:6, padding:8 }}>
            <p style={{ color:'#999', fontSize:10 }}>📷 Grande scène de forêt avec tous les éléments à trouver (insérer illustration)</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3 }}>
            {[
              '🦊 Un renard avec un sac','🐭 Une souris avec une loupe',
              '🦔 Un hérisson près des fleurs','🐦 Un oiseau bleu et jaune',
              '💧 Une rivière propre','🌳 Un très grand arbre',
              '♻️ Une poubelle de tri','🤖 Un petit robot capteur',
              '🌻 Des fleurs colorées','🐿️ Un écureuil avec une noisette',
            ].map((item,i) => (
              <label key={i} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10 }}>
                <span className="checkbox-item" />{item}
              </label>
            ))}
          </div>
        </MissionBox>
      </Page>

      {/* PAGE 35 */}
      <Page num={35}>
        <ChapterBanner num={11} title="Examen final de l'Éco-Gardien" color={CC[11].d} />

        <MissionBox num={43} title="Mon serment d'Éco-Gardien" character="all" icon="✏️" color={CC[11].p}>
          <Instr>Complète le serment de l'Éco-Gardien et signe-le. C'est ta promesse à la nature !</Instr>
          <div style={{ background:'#fff8e1', border:'2px solid #ffd54f', borderRadius:12, padding:'10px 14px', fontSize:11, lineHeight:2 }}>
            <p style={{ textAlign:'center', fontWeight:800, fontSize:13, color:'#e65100', marginBottom:4 }}>📜 Serment de l'Éco-Gardien</p>
            <p>Moi, <span className="answer-box" style={{ width:100 }}>&nbsp;</span> , je fais le serment solennel de :</p>
            <p>🌳 Protéger les <span className="answer-box" style={{ width:70 }}>&nbsp;</span> et les forêts.</p>
            <p>💧 Ne jamais gaspiller l' <span className="answer-box" style={{ width:50 }}>&nbsp;</span> .</p>
            <p>🐾 Respecter tous les <span className="answer-box" style={{ width:70 }}>&nbsp;</span> .</p>
            <p>♻️ Toujours <span className="answer-box" style={{ width:60 }}>&nbsp;</span> mes déchets.</p>
            <p>🌍 Faire un geste écologique chaque <span className="answer-box" style={{ width:50 }}>&nbsp;</span> .</p>
            <div style={{ marginTop:10, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <p style={{ fontSize:10 }}>Date : ___/___/______</p>
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:10, marginBottom:2 }}>Signature :</p>
                <div style={{ width:100, height:40, borderBottom:'2px solid #333' }} />
              </div>
            </div>
          </div>
        </MissionBox>

        <MissionBox num={44} title="Ma forêt idéale" character="all" icon="🎨" color={CC[11].p}>
          <Instr>Dessine ta forêt idéale ! Avec des arbres, des animaux heureux, de l'eau propre et tes amis !</Instr>
          <DrawingArea label="✏️ Dessine ta forêt idéale ici — imagine le plus beau monde possible !" h={130} />
        </MissionBox>
      </Page>

      {/* PAGE 36 — Secret word + QR + Badge final */}
      <Page num={36}>
        <div style={{ textAlign:'center', marginBottom:10 }}>
          <h2 style={{ fontSize:20, fontWeight:900, color:'#e65100' }}>🎉 FÉLICITATIONS ! 🎉</h2>
          <p style={{ fontSize:12, color:'#666', marginTop:4 }}>Tu as terminé les 44 missions du Tome 1 !</p>
        </div>

        <SecretWordBox word="ÉCO-GARDIEN" chapter={11} />

        <div style={{ background:'linear-gradient(135deg, #fff8e1, #fff3e0)', border:'3px solid #ffc107', borderRadius:16, padding:'14px 18px', marginTop:12, textAlign:'center' }}>
          <p style={{ fontSize:16, fontWeight:900, color:'#e65100', marginBottom:6 }}>🏅 Badge Final</p>
          <div style={{ width:80, height:80, borderRadius:'50%', border:'4px solid #ffd54f', background:'linear-gradient(135deg, #fff8e1, #fffde7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, margin:'0 auto 8px' }}>
            🌟
          </div>
          <p style={{ fontSize:14, fontWeight:800, color:'#2e7d32' }}>« Éco-Gardien Niveau 1 »</p>
          <p style={{ fontSize:10, color:'#777', marginTop:4 }}>Tu as prouvé que tu peux protéger la nature !</p>
        </div>
      </Page>

{/* ================================================================
    PAGE 37 — CERTIFICAT ÉCO-GARDIEN
    ================================================================ */}
      <Page num={37} className="page-cert">
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
          <div style={{ border:'4px double #ffc107', borderRadius:20, padding:'24px 32px', maxWidth:500, width:'100%', background:'white' }}>
            <div style={{ borderBottom:'2px solid #e8e8e8', paddingBottom:12, marginBottom:12 }}>
              <p style={{ fontSize:12, letterSpacing:3, textTransform:'uppercase', color:'#888' }}>Les Copains de la Forêt</p>
              <h2 style={{ fontSize:24, fontWeight:900, color:'#2e7d32', margin:'6px 0' }}>📜 CERTIFICAT</h2>
              <p style={{ fontSize:16, fontWeight:700, color:'#e65100' }}>Éco-Gardien Niveau 1</p>
            </div>

            <p style={{ fontSize:12, marginBottom:6 }}>Ce certificat est décerné à :</p>
            <div style={{ borderBottom:'2.5px solid #2e7d32', width:'80%', margin:'0 auto 12px', height:30 }} />

            <p style={{ fontSize:11, lineHeight:1.6, color:'#555', marginBottom:12 }}>
              Pour avoir accompli avec succès les <strong>44 missions</strong> du Tome 1 « Mission Éco-Gardien : Sauvons la Forêt »,
              et avoir démontré sa connaissance et son engagement pour la protection de l'environnement.
            </p>

            <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:12 }}>
              <div className="badge-circle">🌲</div>
              <div className="badge-circle">💧</div>
              <div className="badge-circle">🐾</div>
              <div className="badge-circle">🌱</div>
              <div className="badge-circle">♻️</div>
              <div className="badge-circle">🔬</div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:16 }}>
              <div className="badge-circle">🦁</div>
              <div className="badge-circle">🤖</div>
              <div className="badge-circle">🦸</div>
              <div className="badge-circle">🌍</div>
              <div className="badge-circle">🌟</div>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', marginTop:16 }}>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:10 }}>Date</p>
                <div style={{ borderBottom:'2px solid #999', width:100, height:20, marginTop:4 }} />
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <CharEmoji name="leo" size={20} />
                <CharEmoji name="nina" size={20} />
                <CharEmoji name="darina" size={20} />
                <CharEmoji name="tom" size={20} />
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:10 }}>Signature</p>
                <div style={{ borderBottom:'2px solid #999', width:100, height:20, marginTop:4 }} />
              </div>
            </div>
          </div>
        </div>
      </Page>

{/* ================================================================
    PAGE 38 — TABLEAU DE SUIVI DES BADGES
    ================================================================ */}
      <Page num={38}>
        <h2 style={{ fontSize:18, fontWeight:900, color:'#2e7d32', textAlign:'center', marginBottom:8 }}>🏅 Mon Tableau de Badges</h2>
        <p style={{ fontSize:10, textAlign:'center', color:'#777', marginBottom:12 }}>
          Colorie chaque badge quand tu as validé le chapitre avec le mot secret !
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { ch:1, badge:'🌲', title:'Découvreur de la Forêt', word:'FORÊT' },
            { ch:2, badge:'💧', title:'Gardien de l\'Eau', word:'EAU' },
            { ch:3, badge:'🐾', title:'Ami des Animaux', word:'VIE' },
            { ch:4, badge:'🌱', title:'Expert des Plantes', word:'GRAINE' },
            { ch:5, badge:'♻️', title:'Champion du Recyclage', word:'TRI' },
            { ch:6, badge:'🔬', title:'Petit Scientifique', word:'SCIENCE' },
            { ch:7, badge:'🦁', title:'Protecteur de la Savane', word:'SAVANE' },
            { ch:8, badge:'🤖', title:'Inventeur Écolo', word:'ROBOT' },
            { ch:9, badge:'🦸', title:'Héros du Quotidien', word:'ACTION' },
            { ch:10, badge:'🌍', title:'Aventurier Écologique', word:'PLANÈTE' },
          ].map((b) => (
            <div key={b.ch} style={{ border:'2px solid #e0e0e0', borderRadius:12, padding:8, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', border:'3px dashed #ccc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, background:'#fafafa', flexShrink:0 }}>
                {b.badge}
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:10.5 }}>Ch.{b.ch} — {b.title}</p>
                <p style={{ fontSize:9, color:'#999' }}>Mot secret : _ _ _</p>
                <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                  <span className="checkbox-item" style={{ width:14, height:14 }} />
                  <span style={{ fontSize:9, color:'#888' }}>Validé</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ border:'3px solid #ffc107', borderRadius:14, padding:10, marginTop:12, textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <div style={{ width:52, height:52, borderRadius:'50%', border:'3px dashed #ffc107', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, background:'#fffde7' }}>
              🌟
            </div>
            <div>
              <p style={{ fontWeight:800, fontSize:12, color:'#e65100' }}>Ch.11 — Éco-Gardien Niveau 1</p>
              <p style={{ fontSize:9, color:'#999' }}>Badge final · Mot secret : _ _ _ _ _ _ _ _ _ _ _</p>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2, justifyContent:'center' }}>
                <span className="checkbox-item" style={{ width:14, height:14 }} />
                <span style={{ fontSize:9, color:'#888' }}>Certification obtenue</span>
              </div>
            </div>
          </div>
        </div>
      </Page>

{/* ================================================================
    PAGE 39 — MES NOTES D'ÉCO-GARDIEN
    ================================================================ */}
      <Page num={39}>
        <h2 style={{ fontSize:18, fontWeight:900, color:'#2e7d32', textAlign:'center', marginBottom:4 }}>📝 Mes Notes d'Éco-Gardien</h2>
        <p style={{ fontSize:10, textAlign:'center', color:'#777', marginBottom:10 }}>
          Utilise cette page pour écrire tes découvertes, dessiner ce que tu as observé ou noter tes idées !
        </p>

        <div style={{ marginBottom:12 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#2e7d32', marginBottom:4 }}>🌿 Ce que j'ai appris de plus important :</p>
          <WritingLines count={4} />
        </div>

        <div style={{ marginBottom:12 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#2e7d32', marginBottom:4 }}>🐾 Mon animal préféré et pourquoi :</p>
          <WritingLines count={3} />
        </div>

        <div style={{ marginBottom:12 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#2e7d32', marginBottom:4 }}>🎨 Mon dessin libre :</p>
          <DrawingArea label="" h={120} />
        </div>

        <div>
          <p style={{ fontSize:11, fontWeight:700, color:'#2e7d32', marginBottom:4 }}>💡 Mes idées pour aider la planète :</p>
          <WritingLines count={4} />
        </div>
      </Page>

{/* ================================================================
    PAGE 40 — DOS DE COUVERTURE
    ================================================================ */}
      <div className="page page-back" id="page-40">
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', gap:12 }}>
            <CharImg name="leo" size={52} />
            <CharImg name="nina" size={52} />
            <CharImg name="darina" size={52} />
            <CharImg name="tom" size={52} />
          </div>

          <h2 style={{ fontSize:22, fontWeight:900, textShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
            Les Copains de la Forêt
          </h2>
          <p style={{ fontSize:13, opacity:0.9, maxWidth:350, lineHeight:1.5 }}>
            Tome 1 — Mission Éco-Gardien : Sauvons la Forêt !
          </p>

          <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:14, padding:'12px 20px', maxWidth:400 }}>
            <p style={{ fontSize:11, lineHeight:1.5, opacity:0.9 }}>
              🌱 44 missions éducatives<br/>
              🧩 11 chapitres d'aventures<br/>
              🔮 Mots secrets à découvrir<br/>
              🏅 Badges numériques à collectionner<br/>
              📜 Certification Éco-Gardien Niveau 1
            </p>
          </div>

          <p style={{ fontSize:11, opacity:0.7, marginTop:8 }}>
            Un cahier d'activités pour les enfants de 5 à 7 ans
          </p>

          <div style={{ marginTop:16, opacity:0.5, fontSize:9 }}>
            <p>© Les Copains de la Forêt — Tous droits réservés</p>
            <p style={{ marginTop:4 }}>
              🌐 www.lescopainsdelaforet.fr
            </p>
            <div style={{ marginTop:8 }}>
              {/* <!-- [QR CODE SITE WEB] --> */}
              <div className="qr-placeholder" style={{ borderColor:'rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)' }}>
                QR CODE<br/>SITE WEB
              </div>
            </div>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:6, right:12, fontSize:9, opacity:0.4 }}>40 / 40</div>
      </div>

    </div>
  );
}
