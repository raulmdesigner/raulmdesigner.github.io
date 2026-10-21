(()=>{'use strict';
const C=window.IAMUREL,$=s=>document.querySelector(s),q=new URLSearchParams(location.search),clean=t=>(t||'').slice(0,60);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lite=matchMedia('(prefers-reduced-motion:reduce)').matches||(navigator.connection&&navigator.connection.saveData)||(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2);
document.documentElement.classList.toggle('lite',!!lite);
const IX={capa:0,dor:1,gal:2,quiz:3,planos:4,rotina:5,pedido:6};
let modo=(q.get('conversa')==='1'||q.get('modo')==='conversa')?'conversa':'nova',sel=null,qr={};
const P=id=>C.planos.find(p=>p.id===id),fmt=p=>`R$ ${p.preco}/mês${p.aPartir?' (a partir de)':''}`;
const wa=t=>window.open('https://wa.me/'+C.whats+'?text='+encodeURIComponent(t),'_blank','noopener');
const ln=(a,i=0)=>a.map((t,k)=>`<span class="ln"><span style="--i:${i+k}">${t}</span></span>`).join('');
const idx=(n,t)=>`<p class="kick rv">[ ${String(n).padStart(2,'0')} / ${t} ]</p>`;
const tick=[1,2,3,4].flatMap(()=>C.ticker).map(t=>`<span>${t}</span>`).join('');
const cli=clean(q.get('cliente')),emp=clean(q.get('empresa')),ate=clean(q.get('ate'));
if(P(q.get('plano')))sel=q.get('plano');
const S=[
 {t:'pe cover',dark:1,h:`<div class="in"><div class="logo rv" role="img" aria-label="${C.marca}"></div>${idx(1,C.hero.tag)}<h1>${ln(C.hero.linhas,1)}</h1><p class="lead rv" style="--i:4">${C.hero.sub}</p><div class="ch rv" style="--i:5"><button class="btn" id="c1" type="button"></button><button class="btn ghost" id="c2" type="button">Ver exemplos</button></div><p class="hint rv" style="--i:6" id="para">Deslize para o lado →</p></div>
  <svg class="sun" viewBox="0 0 400 200" aria-hidden="true"><path d="M0 200a200 200 0 0 1 400 0z" fill="#F27A00"/><path d="M40 200a160 160 0 0 1 320 0z" fill="#E0894C"/><path d="M80 200a120 120 0 0 1 240 0z" fill="#60BCBC"/><path d="M120 200a80 80 0 0 1 160 0z" fill="#F6EEDC"/><path d="M160 200a40 40 0 0 1 80 0z" fill="#074145"/></svg><div class="tk" aria-hidden="true"><div>${tick}</div></div>`},
 {t:'cr',h:`<div class="in">${idx(2,'O dia a dia')}<h2>${ln(C.dorTitulo.split('<br>'),1)}</h2><div class="grid dor">${C.dores.map((d,k)=>`<div class="rv" style="--i:${k+3}"><p class="kick">Dor 0${k+1}</p><h3>${d[0]}</h3><p class="sol">→ ${d[1]}</p></div>`).join('')}</div></div>`},
 {t:'ma',dark:1,h:`<div class="in">${idx(3,'Exemplos')}<h2>${ln(['Veja como o seu negócio','pode <em>aparecer.</em>'],1)}</h2><div class="fl rv" style="--i:3" id="fl">${C.segmentos.map(s=>`<button type="button" class="chip" data-s="${s[0]}">${s[1]}</button>`).join('')}</div><div class="grid arts" id="arts">${C.artes.map((a,k)=>`<figure class="rv" data-seg="${a.seg}" style="--i:${k+3}"><img src="${a.src}" alt="${esc(a.alt)}" width="860" height="1075" loading="lazy" decoding="async"><figcaption>${a.legenda}</figcaption><p class="uso">Serve para: ${a.uso}</p></figure>`).join('')}</div><p class="vz" id="vz" hidden>Em breve, mais exemplos deste segmento.</p><div class="ch rv" style="--i:6"><button class="btn" id="g1" type="button">Quero algo assim no meu negócio →</button></div></div>`},
 {t:'pe',dark:1,h:`<div class="in">${idx(4,'Qual plano combina')}<h2>${ln(['Em poucos toques, o plano','<em>ideal</em> para você.'],1)}</h2><div class="wz rv" style="--i:3" id="qz"></div></div>`},
 {t:'cr',h:`<div class="in" style="gap:18px">${idx(5,'Planos mensais')}<h2 style="font-size:clamp(30px,4vw,52px)">${ln(['Escolha o ritmo do seu <em>conteúdo.</em>'],1)}</h2><div class="grid plans">${C.planos.map((p,k)=>`<article class="plan rv ${p.selo?'hot':''}" data-id="${p.id}" style="--i:${k+3}"><small>${p.tag}</small>${p.selo?`<span class="pill">${p.selo}</span>`:''}<span class="pill mine">Seu plano</span><h3>${p.nome}</h3><p class="pa">${p.para}</p><p>${p.desc}</p><div class="pr">${p.aPartir?'<em>A partir de</em>':''}R$ <b data-n="${p.preco}">${p.preco}</b> /mês</div><ul>${p.itens.map(i=>`<li><b>${i[0]}</b>${i[1]}</li>`).join('')}${p.checks.map(c=>`<li class="ck">${c}</li>`).join('')}</ul><p class="nt">${p.nota}</p><button class="btn" data-p="${p.id}" type="button">Quero o ${p.nome}</button><small>${C.rodape}</small></article>`).join('')}</div></div>`},
 {t:'pe',dark:1,h:`<div class="in">${idx(6,'Como funciona')}<h2>${ln(C.passosTitulo.split('<br>'),1)}</h2><div class="grid">${C.passos.map((p,k)=>`<div class="rv" style="--i:${k+3}"><div class="num">0${k+1}</div><h3>${p[0]}</h3><p>${p[1]}</p></div>`).join('')}</div><div class="two rv" style="--i:6"><ul class="cond">${C.condicoes.map(c=>`<li>${c}</li>`).join('')}<li id="val">Condições vigentes até ${C.validade}.</li></ul><div>${C.faq.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div></div></div>`},
 {t:'or',h:`<div class="in">${idx(7,'Próximo passo')}<h2 style="color:#242322">${ln(['Peça a sua','proposta.'],1)}</h2><div class="seg rv" style="--i:3" role="group" aria-label="Situação"><button type="button" data-m="nova">Primeira vez aqui</button><button type="button" data-m="conversa">Já estamos conversando</button></div><div class="form wz lt rv" style="--i:4" id="pd"></div><div class="ch rv" style="--i:5"><a class="btn ghost" href="${C.insta}" target="_blank" rel="noopener noreferrer">Instagram ${C.instaNome} ↗</a><a class="btn ghost" href="mailto:${C.email}?subject=${encodeURIComponent('Proposta IAMUREL')}">E-mail ${C.email}</a><a class="btn ghost" href="${C.site}" target="_blank" rel="noopener noreferrer">Site principal ↗</a></div></div>`}
];
const deck=$('#deck'),dots=$('#dots');
deck.innerHTML=S.map(s=>`<section class="slide t-${s.t}">${s.h}</section>`).join('');
const sl=[...deck.children];dots.innerHTML=S.map((_,k)=>`<button type="button" role="tab" aria-label="Seção ${k+1}" data-k="${k}"></button>`).join('');
/* ---------- assistente passo a passo (usado no quiz e no pedido) ---------- */
function wizard(el,steps,init){
 const v=Object.assign({},init);let k=0,back=false;
 el.innerHTML='<div class="bar"><i></i></div><div class="sw"></div>';const bar=el.querySelector('.bar i'),sw=el.querySelector('.sw');
 const vis=()=>steps.filter(s=>!s.if||s.if(v));
 function draw(focus){const L=vis();k=Math.min(k,L.length-1);const s=L[k];bar.style.transform=`scaleX(${(k+1)/L.length})`;
  let b=`<div class="st${back?' bk':''}"><p class="kick">Etapa ${k+1} de ${L.length}</p>`;
  if(s.t==='end'){b+=s.r(v)}else{b+=`<h3 class="wq">${s.p}</h3>`;
   if(s.t==='text')b+=`<input class="wi" type="text" maxlength="60" placeholder="${s.ph||''}" autocomplete="${s.ac||'off'}" value="${esc(v[s.id]||'')}">`;
   if(s.t==='long')b+=`<textarea class="wi" rows="3" maxlength="300" placeholder="Escreva aqui">${esc(v[s.id]||'')}</textarea>`;
   if(s.t==='choice')b+=`<div class="opts">${s.o.map(o=>`<button type="button" class="opt${String(v[s.id])===String(o[1])?' on':''}" data-v="${esc(o[1])}">${o[0]}</button>`).join('')}</div>`;
   if(s.t==='multi')b+=`<div class="opts">${s.o.map(o=>`<button type="button" class="opt${(v[s.id]||[]).includes(o)?' on':''}" aria-pressed="${(v[s.id]||[]).includes(o)}" data-v="${esc(o)}">${o}</button>`).join('')}</div>`}
  if(s.t!=='end')b+=`<div class="nv">${k?'<button class="btn ghost" data-b type="button">Voltar</button>':''}${s.t==='text'||s.t==='long'||s.t==='multi'?'<button class="btn" data-n type="button">Continuar →</button>':''}</div>`;
  b+='</div>';sw.innerHTML=b;back=false;const st=sw.firstChild;
  const go=(val,lab)=>{if(s.id){v[s.id]=val;if(lab!=null)v[s.id+'_l']=lab}k++;draw(1)};
  st.querySelector('[data-b]')&&(st.querySelector('[data-b]').onclick=()=>{k--;back=true;draw()});
  const inp=st.querySelector('.wi'),nx=st.querySelector('[data-n]');
  const next=()=>{if(s.t==='text'||s.t==='long'){const x=inp.value.trim();if(s.req&&!x){inp.classList.add('err');inp.focus();return}go(x)}else go(v[s.id]||[])};
  if(nx)nx.onclick=next;if(inp){inp.onkeydown=e=>{if(e.key==='Enter'&&s.t==='text'){e.preventDefault();next()}};if(focus)inp.focus({preventScroll:true})}
  st.querySelectorAll('.opt').forEach(o=>o.onclick=()=>{if(s.t==='choice'){st.querySelectorAll('.opt').forEach(x=>x.classList.toggle('on',x===o));setTimeout(()=>go(o.dataset.v,o.textContent),lite?0:220)}else{const a=v[s.id]||[],i=a.indexOf(o.dataset.v);i<0?a.push(o.dataset.v):a.splice(i,1);v[s.id]=a;o.classList.toggle('on');o.setAttribute('aria-pressed',i<0)}});
  if(s.t==='end'&&s.on)s.on(st,v,()=>{k=0;draw()})}
 draw();return{v,set:(a,b)=>{v[a]=b;draw()}}}
/* ---------- quiz ---------- */
function setSel(id,fromQuiz){sel=id;document.querySelectorAll('.plan').forEach(p=>p.classList.toggle('rec',p.dataset.id===id));sum();if(pd)pd.set('pl',id)}
function filt(s){document.querySelectorAll('#fl .chip').forEach(c=>{const on=c.dataset.s===s;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});let n=0;document.querySelectorAll('#arts figure').forEach(f=>{const h=s!=='todos'&&f.dataset.seg!==s;f.classList.toggle('off',h);if(!h)n++});$('#vz').hidden=n>0}
const qsteps=C.quiz.map(Q=>({id:Q.id,t:'choice',p:Q.p,o:Q.o})).concat([{t:'end',r:v=>{
 const sc=C.quiz.filter(Q=>Q.pontua!==0).map(Q=>+v[Q.id]||0);let i=Math.round(sc.reduce((a,b)=>a+b,0)/sc.length);if(+v.extra===2)i=C.planos.length-1;
 const p=C.planos[Math.min(i,C.planos.length-1)];qr={p,seg:v.seg_l||'meu negócio',sid:v.seg};
 return `<div class="res"><p class="kick">Recomendado para você</p><div class="num">${p.nome}</div><p>${p.desc}</p><p class="rp">${fmt(p)}</p><p class="idea"><b>Ideia de conteúdo:</b> ${C.ideias[v.seg]||C.ideias.outro}</p><div class="nv"><button class="btn" data-a="ver" type="button">Ver o plano ${p.nome}</button><button class="btn ghost" data-a="wa" type="button">Falar no WhatsApp</button><button class="btn ghost" data-a="re" type="button">Refazer</button></div></div>`},
 on:(st,v,re)=>{const p=qr.p;setSel(p.id,1);if(C.segmentos.some(s=>s[0]===v.seg))filt(v.seg);
  st.querySelector('[data-a=ver]').onclick=()=>go(IX.planos);st.querySelector('[data-a=re]').onclick=()=>{qr={};re()};
  st.querySelector('[data-a=wa]').onclick=()=>wa((modo==='conversa'?C.msg.quizConversa:C.msg.quiz).replace('{seg}',qr.seg.toLowerCase()).replace('{plano}',p.nome))}}]);
const qz=wizard($('#qz'),qsteps,{});
/* ---------- pedido ---------- */
const summary=v=>{const p=P(v.pl),r=[['Nome',v.nome],['Negócio',v.emp],['Instagram',v.ig],['Plano',p?`${p.nome} · ${fmt(p)}`:'Ainda não sei'],['Acréscimos',(v.ac||[]).join(', ')],['Observação',v.msg]].filter(x=>x[1]);
 return `<h3 class="wq">Tudo certo?</h3><ul class="sm">${r.map(x=>`<li><span>${x[0]}</span>${esc(x[1])}</li>`).join('')}</ul><div class="nv"><button class="btn ghost" data-b type="button">Voltar</button><button class="btn" data-a="send" type="button">Abrir WhatsApp com a mensagem pronta →</button></div>`};
const text=v=>{const nm=(v.nome||'').trim(),p=P(v.pl),L=[];
 if(modo==='conversa'){L.push((nm?`Oi, aqui é ${nm}! `:'Oi! ')+C.msg.conversa,'',p?`Quero seguir com o plano ${p.nome} (${fmt(p)}).`:'Ainda estou entre os planos e queria ajuda para escolher.')}
 else{L.push(C.msg.nova,'','Nome: '+nm);if(v.emp)L.push('Negócio: '+v.emp);if(qr.seg)L.push('Segmento: '+qr.seg);if(v.ig)L.push('Instagram: '+v.ig);L.push('Plano de interesse: '+(p?`${p.nome} (${fmt(p)})`:'ainda não sei'))}
 if((v.ac||[]).length)L.push('Acréscimos: '+v.ac.join(', '));if(v.msg)L.push('Observação: '+v.msg);L.push('',modo==='conversa'?C.msg.fechoConversa:C.msg.fecho);return L.join('\n')};
let pd=null;
function buildPedido(keep){const nova=modo==='nova',pl={id:'pl',t:'choice',p:'Qual plano te interessa?',o:C.planos.map(p=>[`${p.nome} · R$ ${p.preco}`,p.id]).concat([['Ainda não sei','duvida']])};
 const steps=(nova?[{id:'nome',t:'text',p:'Como posso te chamar?',ph:'Seu nome',req:1,ac:'name'},{id:'emp',t:'text',p:'Qual é o nome do seu negócio?',ph:'Empresa ou marca'},{id:'ig',t:'text',p:'Qual é o Instagram do negócio?',ph:'@seuperfil'}]:[{id:'nome',t:'text',p:'Como posso te chamar? (opcional)',ph:'Seu nome',ac:'name'}])
  .concat([pl,{id:'ac',t:'multi',if:v=>v.pl==='ultra',p:'Quer acrescentar algo à base do Ultra?',o:C.acrescimos},{id:'msg',t:'long',p:'Quer contar mais alguma coisa? (opcional)'},{t:'end',r:summary,on:(st,v)=>st.querySelector('[data-a=send]').onclick=()=>wa(text(v)) }]);
 document.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.m===modo));
 pd=wizard($('#pd'),steps,Object.assign({nome:cli,emp:emp,pl:sel||''},keep));
 const dd=document.querySelector('#pd .st');}
document.querySelector('.seg').onclick=e=>{const b=e.target.closest('[data-m]');if(!b||b.dataset.m===modo)return;modo=b.dataset.m;buildPedido({nome:pd.v.nome,emp:pd.v.emp,pl:pd.v.pl});top2()};
/* ---------- personalização e ações ---------- */
function top2(){const c=modo==='conversa';$('#c1').textContent=c?C.hero.ctaConversa:C.hero.cta;$('#cta').innerHTML=c?'<span class="lg">Fechar </span>plano ↗':'<span class="lg">Pedir </span>proposta ↗';
 $('#para').textContent=cli?(c?`Olá, ${cli}! Aqui está a tabela que combinamos.`:'Preparada para '+cli):'Deslize para o lado →'}
$('#c1').onclick=()=>modo==='conversa'?go(IX.planos):wa(C.msg.rapida);$('#c2').onclick=()=>go(IX.gal);$('#g1').onclick=()=>go(IX.quiz);
if(ate)$('#val').textContent='Condições vigentes até '+ate+'.';
$('#fl').onclick=e=>{const b=e.target.closest('[data-s]');if(b)filt(b.dataset.s)};filt('todos');
document.querySelectorAll('.plan .btn').forEach(b=>b.onclick=()=>{setSel(b.dataset.p);go(IX.pedido)});
buildPedido();top2();
/* barra de resumo do plano escolhido */
const bar=document.createElement('div');bar.className='sum';bar.hidden=true;document.body.appendChild(bar);
function sum(){const p=P(sel),on=p&&(i===IX.planos||i===IX.rotina);bar.hidden=!on;if(on){bar.innerHTML=`<span><b>${p.nome}</b> · ${fmt(p)}</span><button class="btn" type="button">Seguir →</button>`;bar.querySelector('button').onclick=()=>go(IX.pedido)}}
/* contador de preço (só em aparelhos que aguentam) */
function count(s){if(lite)return;s.querySelectorAll('[data-n]').forEach(b=>{const t=+b.dataset.n.replace('.','').replace(',','.'),t0=performance.now();const f=n=>{const k=Math.min(1,(n-t0)/900),e=1-Math.pow(1-k,3);b.textContent=(t*e).toFixed(2).replace('.',',');if(k<1)requestAnimationFrame(f);else b.textContent=b.dataset.n};requestAnimationFrame(f)})}
/* ---------- deck: arrastar, setas, roda, teclado ---------- */
let i=0,x0=null,y0=0,t0=0,dx=0,ax=null,lock=0;
function go(n,anim=true){const was=i;i=Math.max(0,Math.min(sl.length-1,n));deck.classList.toggle('drag',!anim);deck.style.transform=`translate3d(${-i*innerWidth}px,0,0)`;
 sl.forEach((s,k)=>s.classList.toggle('on',k===i));[...dots.children].forEach((d,k)=>{d.classList.toggle('on',k===i);d.setAttribute('aria-selected',k===i)});
 document.body.style.setProperty('--nv',S[i].dark?'#F6EEDC':'#074145');$('#mark').style.opacity=i?1:0;$('#pv').disabled=!i;$('#nx').disabled=i===sl.length-1;
 if(i!==was&&S[i].h.includes('data-n'))count(sl[i]);sum();history.replaceState(null,'','#'+(i+1)+(location.search?'':''))}
dots.onclick=e=>{const b=e.target.closest('[data-k]');if(b)go(+b.dataset.k)};$('#cta').onclick=()=>go(IX.pedido);$('#pv').onclick=()=>go(i-1);$('#nx').onclick=()=>go(i+1);addEventListener('resize',()=>go(i,false));
deck.addEventListener('pointerdown',e=>{if(e.target.closest('input,textarea,button,label,a,summary'))return;x0=e.clientX;y0=e.clientY;t0=performance.now();ax=null;dx=0},{passive:true});
addEventListener('pointermove',e=>{if(x0==null)return;const mx=e.clientX-x0,my=e.clientY-y0;if(!ax&&Math.hypot(mx,my)>8)ax=Math.abs(mx)>Math.abs(my)?'x':'y';if(ax==='x'){dx=mx;deck.classList.add('drag');deck.style.transform=`translate3d(${-i*innerWidth+dx}px,0,0)`}},{passive:true});
const end=()=>{if(x0==null)return;const v=dx/Math.max(1,performance.now()-t0);x0=null;if(ax==='x')go(dx<-60||v<-.5?i+1:dx>60||v>.5?i-1:i);ax=null};addEventListener('pointerup',end);addEventListener('pointercancel',end);
addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;const k=e.key;if(k==='ArrowRight'||k==='PageDown'||k===' '){e.preventDefault();go(i+1)}else if(k==='ArrowLeft'||k==='PageUp')go(i-1);else if(k==='Home')go(0);else if(k==='End')go(sl.length-1)});
addEventListener('wheel',e=>{const s=sl[i],h=Math.abs(e.deltaX)>Math.abs(e.deltaY),d=h?e.deltaX:e.deltaY;if(lock||Math.abs(d)<25)return;if(!h&&(d>0?s.scrollTop+s.clientHeight<s.scrollHeight-4:s.scrollTop>4))return;lock=1;go(i+(d>0?1:-1));setTimeout(()=>lock=0,800)},{passive:true});
if(sel)setSel(sel);
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>go(Math.max(0,Math.min(sl.length-1,(+location.hash.slice(1)||1)-1)),false));
})();
