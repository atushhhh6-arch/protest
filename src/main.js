import './style.css';

const FRONT_MODEL = "https://media.canva.com/v2/image-resize/format:JPG/height:1456/quality:100/uri:ifs%3A%2F%2FM%2F7293d37b-d7b2-4011-b863-dc7607df7f43/watermark:F/width:1088?csig=AAAAAAAAAAAAAAAAAAAAACoM1lcHDnJInZuVbRLblltQLRdYcbXGAXzQhyNNTOjr&exp=1790628121&osig=AAAAAAAAAAAAAAAAAAAAANauw528kAU5y-iMv-ilTnIVgbrgN8x9EOMH2jFVz3F1&signer=media-rpc";
const BACK_MODEL = "https://media.canva.com/v2/image-resize/format:JPG/height:1456/quality:100/uri:ifs%3A%2F%2FM%2F7d26541a-4993-42fa-80e7-070b655a3f07/watermark:F/width:1088?csig=AAAAAAAAAAAAAAAAAAAAADJyWgDBSoptS-muPtxokyqf-cGvmVpcYl6KWEGJ6Dvf&exp=1790626756&osig=AAAAAAAAAAAAAAAAAAAAAMuMzoQMYvjagB495BmaR2ZSI0IPRrvoi7p965Ahz_82&signer=media-rpc";

const slots = {
  front: [
    {id:'f1',label:'Front 01',x:34,y:24,w:32,h:12},
    {id:'f2',label:'Front 02',x:24,y:39,w:24,h:14},
    {id:'f3',label:'Front 03',x:52,y:39,w:24,h:14},
    {id:'f4',label:'Front 04',x:34,y:57,w:32,h:16}
  ],
  back: [
    {id:'b1',label:'Back 01',x:34,y:24,w:32,h:12},
    {id:'b2',label:'Back 02',x:24,y:39,w:24,h:14},
    {id:'b3',label:'Back 03',x:52,y:39,w:24,h:14},
    {id:'b4',label:'Back 04',x:34,y:57,w:32,h:16}
  ]
};

let side='front';
const art={};

document.querySelector('#app').innerHTML = `
<header class="topbar">
  <a href="#" class="brand">OCT<span>02</span></a>
  <nav><a href="#studio">T-shirt</a><a href="#why">Why 2 Oct</a><a href="#spots">8 spots</a></nav>
  <a class="mini-cta" href="#studio">Preview spots ↗</a>
</header>

<main>
  <section class="hero">
    <div class="hero-copy">
      <div class="kicker"><span></span> PERSONAL PROTEST TEE / 02 OCT</div>
      <h1>8 spots.<br><em>One white tee.</em><br>Seen in public.</h1>
      <p>I’m building a one-off T-shirt layout around the 2 October protest. Four placements on the front, four on the back — each can hold a logo, message, artwork or sponsor mark.</p>
      <a class="primary" href="#studio">Build the tee <span>→</span></a>
      <div class="tiny">FRONT 4 · BACK 4 · LIVE MOCKUP · MOBILE READY</div>
    </div>

    <div class="model-card" id="studio">
      <div class="model-top"><span><i></i> LIVE TEE PREVIEW</span><b id="side-label">FRONT / 04 SPOTS</b></div>
      <div class="model-stage">
        <img id="model-img" src="${FRONT_MODEL}" alt="Front view model wearing a plain white T-shirt"/>
        <div id="slot-layer" class="slot-layer"></div>
        <div class="model-fallback" id="model-fallback" hidden><div class="head"></div><div class="tee">WHITE TEE</div><div class="legs"></div></div>
      </div>
      <div class="switcher">
        <button data-side="front" class="active">Front <small>4 spots</small></button>
        <button data-side="back">Back <small>4 spots</small></button>
      </div>
    </div>

    <aside class="control-panel" id="spots">
      <div class="panel-kicker">PLACEMENT STUDIO</div>
      <h2 id="panel-title">Front side.</h2>
      <p>Click any numbered area on the shirt, then upload the logo or artwork you want there.</p>
      <div id="spot-list" class="spot-list"></div>
      <label class="upload-box" id="upload-box">
        <input id="file-input" type="file" accept="image/png,image/jpeg,image/webp" hidden>
        <span class="upload-plus">+</span>
        <strong id="upload-title">Select a spot first</strong>
        <small>PNG / JPG / WEBP · stays in your browser</small>
      </label>
      <button class="clear-btn" id="clear-current" disabled>Remove selected artwork</button>
    </aside>
  </section>

  <section class="marquee" aria-hidden="true">
    <span>02 OCTOBER</span><b>✦</b><span>8 PLACEMENTS</span><b>✦</b><span>4 FRONT / 4 BACK</span><b>✦</b><span>PLAIN WHITE TEE</span>
  </section>

  <section class="info" id="why">
    <div class="info-title">
      <div class="kicker">EVENT CONTEXT / VERIFIED 28 SEP 2026</div>
      <h2>What the 2 October protest is about.</h2>
    </div>
    <article><span>01</span><h3>The announced demand</h3><p>The Cockroach Janta Party (CJP) has publicly demanded the resignation of Chief Election Commissioner Gyanesh Kumar.</p></article>
    <article><span>02</span><h3>Why they say they are protesting</h3><p>CJP has cited disputes around electoral-roll revisions and Election Commission decision-making. These are allegations and political claims; the Election Commission has rejected claims of wrongdoing.</p></article>
    <article><span>03</span><h3>2 October plan</h3><p>As of 28 September, reports say CJP announced nationwide protests beginning in Mumbai on 2 October. “Jantar Mantar 2.0” has been used by organisers as a name for a broader threatened agitation, but the reported 2 October launch point is Mumbai.</p></article>
  </section>

  <section class="how">
    <div><span>01</span><strong>Choose front or back</strong><p>Switch views without losing any placement.</p></div>
    <div><span>02</span><strong>Click one of 8 spots</strong><p>Each zone has its own artwork slot.</p></div>
    <div><span>03</span><strong>Upload logo or art</strong><p>Preview instantly on the T-shirt.</p></div>
    <div><span>04</span><strong>Walk in with the final layout</strong><p>Use the mockup to decide exact print positions.</p></div>
  </section>
</main>

<footer><a class="brand" href="#">OCT<span>02</span></a><p>Independent personal T-shirt concept · informational event context only.</p><a href="#studio">Back to preview ↑</a></footer>
`;

const modelImg=document.querySelector('#model-img');
modelImg.addEventListener('error',()=>{modelImg.hidden=true;document.querySelector('#model-fallback').hidden=false;});

let selected='f1';
const layer=document.querySelector('#slot-layer');
const list=document.querySelector('#spot-list');
const input=document.querySelector('#file-input');
const uploadBox=document.querySelector('#upload-box');
const clearBtn=document.querySelector('#clear-current');

function activeSlots(){ return slots[side]; }
function render(){
  document.querySelector('#side-label').textContent=`${side.toUpperCase()} / 04 SPOTS`;
  document.querySelector('#panel-title').textContent=`${side==='front'?'Front':'Back'} side.`;
  modelImg.src=side==='front'?FRONT_MODEL:BACK_MODEL;
  modelImg.alt=`${side==='front'?'Front':'Back'} view model wearing a plain white T-shirt`;
  modelImg.hidden=false; document.querySelector('#model-fallback').hidden=true;
  document.querySelectorAll('[data-side]').forEach(b=>b.classList.toggle('active',b.dataset.side===side));
  layer.innerHTML='';
  list.innerHTML='';
  activeSlots().forEach((s,i)=>{
    const btn=document.createElement('button');
    btn.className='shirt-slot'+(selected===s.id?' selected':'')+(art[s.id]?' filled':'');
    btn.style.cssText=`left:${s.x}%;top:${s.y}%;width:${s.w}%;height:${s.h}%`;
    btn.dataset.id=s.id;
    btn.innerHTML=art[s.id]?`<img src="${art[s.id]}" alt=""><span>${i+1}</span>`:`<span>${i+1}</span><em>ADD</em>`;
    btn.addEventListener('click',()=>select(s.id));
    layer.appendChild(btn);

    const row=document.createElement('button');
    row.className='spot-row'+(selected===s.id?' active':'')+(art[s.id]?' done':'');
    row.innerHTML=`<span>0${i+1}</span><b>${s.label}</b><em>${art[s.id]?'Artwork added':'Empty'}</em>`;
    row.addEventListener('click',()=>select(s.id));
    list.appendChild(row);
  });
  const current=activeSlots().find(s=>s.id===selected);
  document.querySelector('#upload-title').textContent=current?`${current.label} · click to upload`:'Select a spot first';
  clearBtn.disabled=!current||!art[current.id];
}
function select(id){ selected=id; render(); }
document.querySelectorAll('[data-side]').forEach(b=>b.addEventListener('click',()=>{side=b.dataset.side;selected=slots[side][0].id;render();}));
uploadBox.addEventListener('click',()=>{if(selected)input.click();});
input.addEventListener('change',e=>{
  const f=e.target.files?.[0]; if(!f||!selected)return;
  if(!['image/png','image/jpeg','image/webp'].includes(f.type))return;
  const r=new FileReader();r.onload=()=>{art[selected]=r.result;render();};r.readAsDataURL(f);input.value='';
});
clearBtn.addEventListener('click',()=>{if(selected){delete art[selected];render();}});
render();
