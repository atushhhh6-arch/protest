import './style.css';
import { BRAND, COLORS } from './config.js';
import { validateArtwork, fitContain, viewSide } from './design.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const upload = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 16V4m-4 4 4-4 4 4M4 15v5h16v-5"/></svg>';
const rotate = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7"/></svg>';
const mark = '<svg viewBox="0 0 42 36" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m3 7 8 23L21 11l10 19 8-23M11 30 21 7l10 23"/></svg>';

document.querySelector('#app').innerHTML = `
<header class="header"><a class="wordmark" href="#" aria-label="Wearform home">${mark}${BRAND.name}<span>®</span></a><nav aria-label="Main navigation"><a class="nav-active" href="#studio">The studio</a><a href="#details">The details</a></nav><a class="header-cta" href="#artwork">Make it yours ${arrow}</a></header>
<main>
<section class="hero" id="studio" aria-labelledby="hero-title">
 <div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> ${BRAND.collection} <span class="edition">/ 001</span></div><h1 id="hero-title">Your canvas.<br>Your <em>identity.</em></h1><p>A blank tee. Endless possibilities.<br>Put your brand in the spotlight.</p><a href="#artwork" class="primary-button">Design your tee ${arrow}</a><div class="hero-footnote"><span class="tiny-cross">✳</span> MADE TO BE YOURS. SEEN FROM EVERY ANGLE.</div></div>
 <div class="studio" aria-label="Interactive T-shirt studio">
  <div class="stage-top"><span><span class="live-dot"></span> LIVE PREVIEW</span><span class="mono">01 / THE EVERYDAY TEE</span></div>
  <div class="stage-word" aria-hidden="true">YOUR<br>FORM.</div>
  <div class="canvas-wrap" id="canvas-wrap"><div class="canvas-loading" id="canvas-loading">Preparing your canvas<span></span></div><canvas id="scene" aria-label="Rotatable neutral slim mannequin wearing your T-shirt. Use the controls below to change view." role="img"></canvas><div id="fallback" hidden><svg viewBox="0 0 300 420" aria-label="Flat T-shirt preview" role="img"><path d="m93 45-56 35L9 144l57 25 13-23-6 210h155l-6-210 12 23 57-25-28-64-56-35q-57 40-114 0" fill="var(--shirt-color,#d8d6cb)" stroke="#8b8e7f" stroke-width="2"/><foreignObject x="105" y="125" width="90" height="115"><div xmlns="http://www.w3.org/1999/xhtml" id="fallback-art">YOUR<br/>BRAND<br/>HERE.</div></foreignObject></svg></div></div>
  <button class="print-callout" id="print-callout" aria-label="Edit front print area"><span class="callout-dot"></span><span id="callout-label">YOUR ART GOES HERE</span>${arrow}</button>
  <div class="stage-meta"><span>SLIM FIT<br><b>NEUTRAL MANNEQUIN</b></span><span>360°<br><b>EVERY ANGLE. YOURS.</b></span></div>
  <div class="view-controls"><div class="segmented" role="group" aria-label="Mannequin view"><button data-view="front" aria-pressed="true">Front</button><button data-view="back" aria-pressed="false">Back</button></div><button id="auto-rotate" class="rotate-button" aria-pressed="false">${rotate}<span>Auto rotate</span></button><button id="reset-view" class="icon-button" aria-label="Reset camera view">↺</button></div>
  <label class="rotation-label" for="rotation">Drag to explore <span aria-hidden="true">↔</span><input id="rotation" type="range" min="0" max="360" step="1" value="0" aria-label="Mannequin rotation in degrees"/></label>
 </div>
 <aside class="editor" id="artwork" aria-labelledby="editor-title"><div class="editor-heading"><span class="eyebrow">THE DESIGN STUDIO</span><span class="step-count">01—03</span></div><h2 id="editor-title">Make it yours.</h2><p class="editor-intro">A little you. On every side.</p>
 <fieldset class="color-field"><legend><span>01</span> Choose your canvas</legend><div class="swatches">${COLORS.map((c,i)=>`<button class="swatch ${i===0?'selected':''}" data-color="${i}" style="--swatch:${c.hex}" aria-label="${c.name} T-shirt" aria-pressed="${i===0}"></button>`).join('')}<span id="color-name">Chalk</span></div></fieldset>
 <fieldset class="print-field"><legend><span>02</span> Pick a print area</legend><div class="print-options"><button data-area="front" aria-pressed="true"><svg viewBox="0 0 60 58" aria-hidden="true"><path d="m20 7-11 6-6 15 12 5 3-7v26h24V26l3 7 12-5-6-15-11-6q-10 10-20 0Z"/><rect x="24" y="22" width="12" height="14"/></svg><span>Front</span><small>THE FIRST IMPRESSION</small></button><button data-area="back" aria-pressed="false"><svg viewBox="0 0 60 58" aria-hidden="true"><path d="m20 7-11 6-6 15 12 5 3-7v26h24V26l3 7 12-5-6-15-11-6q-10 4-20 0Z"/><rect x="23" y="18" width="14" height="21"/></svg><span>Back</span><small>THE LASTING ONE</small></button></div></fieldset>
 <fieldset class="art-field"><legend><span>03</span> Add your identity</legend><button id="upload-button" class="upload-area">${upload}<strong id="upload-title">Drop your artwork here</strong><span id="upload-subtitle">or click to browse</span><small>PNG, JPG, WEBP · UP TO 8 MB</small></button><input id="file-input" type="file" accept="image/png,image/jpeg,image/webp" hidden/><div class="art-actions" hidden><span id="file-name"></span><button id="remove-art" class="text-button">Remove</button></div><label class="size-control" for="art-scale">Artwork size <output id="scale-value">100%</output><input id="art-scale" type="range" min="40" max="120" step="5" value="100"/></label></fieldset>
 <button id="export" class="export-button">Save your design ${arrow}</button><p class="privacy-note">Your artwork stays in your browser.</p><p id="status" class="status" role="status" aria-live="polite"></p>
 </aside>
</section>
<div class="ticker" aria-hidden="true"><span>ONE TEE. EVERY POSSIBILITY.</span><span>✳</span><span>YOUR BRAND, IN REAL LIFE.</span><span>✳</span><span>BUILT AROUND YOU.</span><span>✳</span></div>
<section class="details" id="details" aria-labelledby="details-title"><div class="details-intro"><span class="eyebrow">LESS NOISE. MORE YOU.</span><h2 id="details-title">A simple canvas.<br>An unmistakable presence.</h2></div><article><span class="detail-number">01 / THE FIT</span><h3>Room to be yourself.</h3><p>A clean everyday silhouette, shown on a neutral slim mannequin. Your personal avatar can come next.</p></article><article><span class="detail-number">02 / THE PRINT</span><h3>Two sides. Your story.</h3><p>Give the front and back their own identity. Upload your artwork, find the balance, see it from every angle.</p></article><article class="event-card"><span class="detail-number">03 / THE PERSONAL EDIT</span><h3>${BRAND.eventDate}<span class="event-dot"></span></h3><p>${BRAND.eventNote} A design preview to make the look your own.</p></article></section>
</main><footer><a class="wordmark" href="#">${mark}${BRAND.name}<span>®</span></a><span>INDEPENDENT EXPRESSION. EVERYDAY FORM.</span><a href="#studio">Back to the studio ↑</a></footer>`;

let activeSide = 'front', colorIndex = 0, preview;
const artworks = { front: null, back: null };
const scales = { front: 100, back: 100 };
const status = document.querySelector('#status');
const announce = text => { status.textContent = text; };
const fileInput = document.querySelector('#file-input');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let auto = false;
function setAuto(value) { auto = value; preview?.setAuto(value); document.querySelector('#auto-rotate').setAttribute('aria-pressed', String(value)); }
function syncArtwork() {
 const art = artworks[activeSide];
 document.querySelector('.art-actions').hidden = !art;
 document.querySelector('#file-name').textContent = art?.name || '';
 document.querySelector('#upload-title').textContent = art ? 'Change your artwork' : 'Drop your artwork here';
 document.querySelector('#upload-subtitle').textContent = `${activeSide === 'front' ? 'Front' : 'Back'} print · ${art ? 'click to replace' : 'or click to browse'}`;
 document.querySelector('#art-scale').value = scales[activeSide];
 document.querySelector('#scale-value').textContent = `${scales[activeSide]}%`;
 updateFallback();
}
function selectSide(side, rotateView = true) {
 activeSide = side;
 document.querySelectorAll('[data-area], [data-view]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.area || b.dataset.view) === side)));
 document.querySelector('#print-callout').setAttribute('aria-label', `Edit ${side} print area`);
 if (rotateView) { setAuto(false); const angle = side === 'front' ? 0 : 180; preview?.setAngle(angle); document.querySelector('#rotation').value = angle; }
 syncArtwork();
}
function updateFallback() {
 const el = document.querySelector('#fallback-art'); el.replaceChildren();
 if (artworks[activeSide]) { const img = new Image(); img.src = artworks[activeSide].url; img.alt = `${activeSide} artwork`; img.style.width = `${scales[activeSide]}%`; el.append(img); }
 else el.textContent = 'YOUR BRAND HERE.';
}
document.querySelectorAll('[data-area],[data-view]').forEach(b => b.addEventListener('click', () => selectSide(b.dataset.area || b.dataset.view)));
document.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => {
 colorIndex = Number(b.dataset.color); preview?.setColor(COLORS[colorIndex].hex);
 document.querySelector('#color-name').textContent = COLORS[colorIndex].name;
 document.querySelector('#fallback').style.setProperty('--shirt-color', COLORS[colorIndex].hex);
 document.querySelectorAll('[data-color]').forEach(s => { s.classList.toggle('selected', s === b); s.setAttribute('aria-pressed', String(s===b)); });
}));
document.querySelector('#auto-rotate').addEventListener('click', () => setAuto(!auto));
document.querySelector('#rotation').addEventListener('input', e => { setAuto(false); const angle = Number(e.target.value); preview?.setAngle(angle, true); selectSide(viewSide(angle), false); });
document.querySelector('#reset-view').addEventListener('click', () => { preview?.reset(); selectSide('front'); });
document.querySelector('#print-callout').addEventListener('click', () => { document.querySelector('#artwork').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'center' }); document.querySelector('#upload-button').focus({preventScroll:true}); });
document.querySelector('#upload-button').addEventListener('click', () => fileInput.click());
let uploadSequence = { front: 0, back: 0 };
async function loadFile(file) {
 const error = validateArtwork(file); if(error) { announce(error); return; }
 const side = activeSide, ticket = ++uploadSequence[side];
 const url = URL.createObjectURL(file); const img = new Image();
 try {
  img.src = url; await img.decode();
  if (img.naturalWidth * img.naturalHeight > 25000000) throw new Error('Image exceeds 25 megapixels. Please resize it first.');
  if (ticket !== uploadSequence[side]) { URL.revokeObjectURL(url); return; }
  if (artworks[side]) URL.revokeObjectURL(artworks[side].url);
  artworks[side] = { image: img, url, name: file.name };
  preview?.setArtwork(side, img, scales[side]); syncArtwork(); announce(`${side === 'front' ? 'Front' : 'Back'} artwork added.`);
 } catch (e) { URL.revokeObjectURL(url); announce(e.message.includes('megapixels') ? e.message : 'This image could not be opened. Try another PNG, JPG or WebP.'); }
}
fileInput.addEventListener('change', e => { if(e.target.files[0]) loadFile(e.target.files[0]); e.target.value=''; });
const drop = document.querySelector('#upload-button');
['dragenter','dragover'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add('drag-over');}));
['dragleave','drop'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('drag-over');}));
drop.addEventListener('drop',e=>{if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);});
document.querySelector('#remove-art').addEventListener('click', () => { ++uploadSequence[activeSide]; if(artworks[activeSide])URL.revokeObjectURL(artworks[activeSide].url); artworks[activeSide]=null; preview?.setArtwork(activeSide,null,scales[activeSide]); syncArtwork(); announce('Artwork removed. Placeholder restored.'); });
document.querySelector('#art-scale').addEventListener('input',e=>{scales[activeSide]=Number(e.target.value);document.querySelector('#scale-value').textContent=`${e.target.value}%`;preview?.setArtwork(activeSide,artworks[activeSide]?.image,scales[activeSide]);updateFallback();});
function download(url, name) { const a=document.createElement('a');a.href=url;a.download=name;a.click(); }
document.querySelector('#export').addEventListener('click', () => {
 try {
  // A deterministic two-sided design sheet works even without WebGL.
  const c=document.createElement('canvas');c.width=1600;c.height=1200;const ctx=c.getContext('2d');
  ctx.fillStyle='#121413';ctx.fillRect(0,0,1600,1200);ctx.fillStyle='#edf0e4';ctx.font='bold 38px sans-serif';ctx.fillText('WEARFORM / YOUR PERSONAL EDIT',80,95);
  ctx.font='18px sans-serif';ctx.fillStyle='#a5ac9f';ctx.fillText(`${COLORS[colorIndex].name.toUpperCase()}  ·  FRONT + BACK  ·  CONCEPT PREVIEW`,80,140);
  ['front','back'].forEach((side,i)=>{
   const x=400+i*800; ctx.save();ctx.translate(x,290);ctx.scale(1.8,1.8);
   ctx.fillStyle=COLORS[colorIndex].hex;ctx.beginPath();ctx.moveTo(-65,0);ctx.lineTo(-120,30);ctx.lineTo(-150,105);ctx.lineTo(-90,135);ctx.lineTo(-73,96);ctx.lineTo(-78,305);ctx.lineTo(78,305);ctx.lineTo(73,96);ctx.lineTo(90,135);ctx.lineTo(150,105);ctx.lineTo(120,30);ctx.lineTo(65,0);ctx.quadraticCurveTo(0,side==='front'?55:20,-65,0);ctx.fill();
   const img=artworks[side]?.image, areaW=side==='front'?92:104, areaH=side==='front'?116:144;
   if(img){const d=fitContain(img.naturalWidth,img.naturalHeight,areaW*scales[side]/100,areaH*scales[side]/100);ctx.drawImage(img,-d.width/2,155-d.height/2,d.width,d.height);}
   else {ctx.fillStyle=colorIndex===1?'#d5ef76':'#303729';ctx.font='bold 21px sans-serif';ctx.textAlign='center';ctx.fillText('YOUR',0,125);ctx.fillText('BRAND',0,150);ctx.fillText('HERE.',0,175);}
   ctx.restore();ctx.fillStyle='#d5ef76';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText(side.toUpperCase(),x,930);
  });
  ctx.textAlign='left';ctx.fillStyle='#9bA391';ctx.font='18px sans-serif';ctx.fillText('Design concept only. Confirm garment measurements and print specifications with your printer.',80,1090);
  download(c.toDataURL('image/png'),'wearform-design.png');announce('Your front + back design sheet has been saved.');
 }catch{announce('The design could not be exported. Please try again.');}
});

function showFallback(message) {
 document.querySelector('#scene').hidden=true;document.querySelector('#fallback').hidden=false;
 document.querySelector('#canvas-loading').hidden=true;
 document.querySelector('#auto-rotate').disabled=true;document.querySelector('#rotation').disabled=true;
 document.querySelector('#reset-view').disabled=true;
 document.querySelector('.rotation-label').firstChild.textContent='Flat preview mode ';
 announce(message);syncArtwork();
}
async function start() {
 try {
  const { createPreview }=await import('./preview.js');
  preview=await createPreview(document.querySelector('#scene'), { onRotate:angle=>{document.querySelector('#rotation').value=Math.round(angle);const side=viewSide(angle);if(side!==activeSide)selectSide(side,false);}, onDrag:()=>setAuto(false), onError:()=>showFallback('3D is unavailable. You can still design and save using the flat preview.') });
  preview.setColor(COLORS[colorIndex].hex);
  for (const side of ['front','back'])preview.setArtwork(side,artworks[side]?.image,scales[side]);
  document.querySelector('#canvas-loading').hidden=true;
 }catch{showFallback('3D is unavailable on this device. Front/back editing and export still work in flat preview.');}
}
motion.addEventListener('change',()=>{if(motion.matches)setAuto(false);});
window.addEventListener('pagehide',()=>{setAuto(false);});
syncArtwork();start();
