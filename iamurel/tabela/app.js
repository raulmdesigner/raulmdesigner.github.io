(()=>{'use strict';
const C=window.IAMUREL,$=s=>document.querySelector(s),q=new URLSearchParams(location.search),clean=t=>(t||'').slice(0,60);
const lite=matchMedia('(prefers-reduced-motion:reduce)').matches||(navigator.connection&&navigator.connection.saveData)||(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2);
document.documentElement.classList.toggle('lite',!!lite);
const ln=(a,i=0)=>a.map((t,k)=>`<span class="ln"><span style="--i:${i+k}">${t}</span></span>`).join('');
const idx=(n,t)=>`<p class="kick rv">[ ${String(n).padStart(2,'0')} / ${t} ]</p>`;
const tick=C.ticker.concat(C.ticker).concat(C.ticker).concat(C.ticker).map(t=>`<span>${t}</span>`).join('');
const S=[
 {t:'pe',dark:1,h:`<div class="in"><div class="logo rv" role="img" aria-label="${C.marca}"></div>${idx(1,C.hero.tag)}<h1>${ln(C.hero.linhas,1)}</h1><p class="lead rv" style="--i:4">${C.hero.sub}</p><p class="hint rv" style="--i:5" id="para">Deslize para o lado →</p></div>
  <svg class="sun" viewBox="0 0 400 200" aria-hidden="true"><path d="M0 200a200 200 0 0 1 400 0z" fill="#F27A00"/><path d="M40 200a160 160 0 0 1 320 0z" fill="#E0894C"/><path d="M80 200a120 120 0 0 1 240 0z" fill="#60BCBC"/><path d="M120 200a80 80 0 0 1 160 0z" fill="#F6EEDC"/><path d="M160 200a40 40 0 0 1 80 0z" fill="#074145"/></svg><div class="tk" aria-hidden="true"><div>${tick}</div></div>`},
 {t:'cr',h:`<div class="in">${idx(2,'Quem somos')}<h2>${ln(C.sobre.titulo.split('<br>'),1)}</h2><p class="lead rv" style="--i:3">${C.sobre.texto}</p><div class="grid">${C.pilares.map((p,k)=>`<div class="rv" style="--i:${k+4}"><div class="num">0${k+1}</div><h3>${p[0]}</h3><p>${p[1]}</p></div>`).join('')}</div></div>`},
 {t:'ma',dark:1,h:`<div class="in">${idx(3,'Exemplos')}<h2>${ln(['Como a sua marca','pode <em>aparecer.</em>'],1)}</h2><div class="grid arts">${C.artes.map((a,k)=>`<figure class="rv" style="--i:${k+3}"><img src="${a.src}" alt="${a.alt}" width="860" height="1075" loading="lazy" decoding="async"><figcaption>${a.legenda}</figcaption></figure>`).join('')}</div></div>`},
 {t:'cr',h:`<div class="in" style="gap:18px">${idx(4,'Planos mensais')}<h2 style="font-size:clamp(30px,4vw,52px)">${ln(['Escolha o ritmo do seu <em>conteúdo.</em>'],1)}</h2><div class="grid plans">${C.planos.map((p,k)=>`<article class="plan rv ${p.hot?'hot':''}" style="--i:${k+3}"><small>${p.tag}</small>${p.hot?'<span class="pill">Em destaque</span>':''}<h3>${p.nome}</h3><p>${p.desc}</p><div class="pr">${p.aPartir?'<em>A partir de</em>':''}R$ <b data-n="${p.preco}">${p.preco}</b> /mês</div><ul>${p.itens.map(i=>`<li><b>${i[0]}</b>${i[1]}</li>`).join('')}${p.checks.map(c=>`<li class="ck">${c}</li>`).join('')}</ul><p class="nt">${p.nota}</p><button class="btn" data-p="${p.id}" type="button">Quero o ${p.nome}</button><small>${C.rodape}</small></article>`).join('')}</div></div>`},
 {t:'pe',dark:1,h:`<div class="in">${idx(5,'Qual plano combina')}<h2>${ln(['Em 3 toques, o plano','<em>ideal</em> para você.'],1)}</h2><div class="qz rv" style="--i:3" id="qz"></div></div>`},
 {t:'cr',h:`<div class="in">${idx(6,'Como funciona')}<h2>${ln(['Simples do início','ao <em>contrato.</em>'],1)}</h2><div class="grid">${C.passos.map((p,k)=>`<div class="rv" style="--i:${k+3}"><div class="num">0${k+1}</div><h3>${p[0]}</h3><p>${p[1]}</p></div>`).join('')}</div><div class="two rv" style="--i:7"><ul class="cond">${C.condicoes.map(c=>`<li>${c}</li>`).join('')}<li id="val">Condições vigentes até ${C.validade}.</li></ul><div>${C.faq.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div></div></div>`},
 {t:'or',h:`<div class="in">${idx(7,'Próximo passo')}<h2 style="color:#242322">${ln(['Peça a sua','proposta.'],1)}</h2><div class="form rv" style="--i:3"><label>Seu nome<input type="text" id="f-nome" autocomplete="name" placeholder="Como posso te chamar?"></label><label>Negócio<input type="text" id="f-emp" placeholder="Nome da empresa ou marca"></label><label>Instagram<input type="text" id="f-ig" placeholder="@seuperfil"></label><div class="lb">Plano de interesse<div class="chips" id="chips"></div></div><div class="lb">Acréscimos (opcional)<div class="chips" id="acs"></div></div><label>Mensagem (opcional)<textarea id="f-msg" rows="2" placeholder="Conte rapidamente o que você precisa"></textarea></label><button class="btn" id="send" type="button">Enviar pelo WhatsApp →</button></div>
  <div class="ch rv" style="--i:4"><a class="btn ghost" href="${C.insta}" target="_blank" rel="noopener noreferrer">Instagram ${C.instaNome} ↗</a><a class="btn ghost" href="mailto:${C.email}?subject=${encodeURIComponent('Proposta IAMUREL')}">E-mail ${C.email}</a><a class="btn ghost" href="${C.site}" target="_blank" rel="noopener noreferrer">Site principal ↗</a></div></div>`}
];
const deck=$('#deck'),dots=$('#dots');
deck.innerHTML=S.map(s=>`<section class="slide t-${s.t}">${s.h}</section>`).join('');
const sl=[...deck.children];dots.innerHTML=S.map((_,k)=>`<button type="button" role="tab" aria-label="Seção ${k+1}" data-k="${k}"></button>`).join('');
/* personalização por link */
const cli=clean(q.get('cliente')),emp=clean(q.get('empresa')),ate=clean(q.get('ate'));
if(cli){$('#para').textContent='Preparada para '+cli;$('#f-nome').value=cli}if(emp)$('#f-emp').value=emp;if(ate)$('#val').textContent='Condições vigentes até '+ate+'.';
const opts=C.planos.map(p=>[p.id,p.nome]).concat([['duvida','Ainda não sei']]);
$('#chips').innerHTML=opts.map(o=>`<label><input type="radio" name="pl" value="${o[0]}"><span>${o[1]}</span></label>`).join('');
$('#acs').innerHTML=C.acrescimos.map(a=>`<label><input type="checkbox" name="ac" value="${a}"><span>${a}</span></label>`).join('');
const pick=id=>{const r=document.querySelector(`[name=pl][value="${id}"]`);if(r)r.checked=true};pick(opts.some(o=>o[0]===q.get('plano'))?q.get('plano'):'duvida');
document.querySelectorAll('.plan .btn').forEach(b=>b.onclick=()=>{pick(b.dataset.p);go(sl.length-1)});
/* quiz */
const qz=$('#qz');let qi=0,best=0;
function quiz(){if(qi>=C.quiz.length){const p=C.planos[Math.min(best,C.planos.length-1)];qz.innerHTML=`<div class="res"><p class="kick">Recomendado para você</p><div class="num">${p.nome}</div><p>${p.desc}</p><p>R$ ${p.preco}/mês${p.aPartir?' (a partir de)':''}</p><div class="ch"><button class="btn" type="button" id="qy">Quero o ${p.nome}</button><button class="btn ghost" type="button" id="qr">Refazer</button></div></div>`;
  $('#qy').onclick=()=>{pick(p.id);go(sl.length-1)};$('#qr').onclick=()=>{qi=0;best=0;quiz()};return}
 const Q=C.quiz[qi];qz.innerHTML=`<div class="bar"><i style="transform:scaleX(${(qi+1)/C.quiz.length})"></i></div><p class="kick">Pergunta ${qi+1} de ${C.quiz.length}</p><h3 style="font:650 clamp(22px,3vw,34px)/1.15 var(--serif)">${Q.p}</h3><div class="opts">${Q.o.map((o,k)=>`<button class="opt" type="button" data-v="${o[1]}">${o[0]}</button>`).join('')}</div>`;
 qz.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{best=Math.max(best,+b.dataset.v);qi++;quiz()})}
quiz();
/* envio pelo WhatsApp (sem servidor, sem armazenar nada) */
$('#send').onclick=()=>{const n=$('#f-nome');if(!n.value.trim()){n.classList.add('err');n.focus();return}n.classList.remove('err');
 const v=document.querySelector('[name=pl]:checked'),p=C.planos.find(x=>x.id===(v&&v.value)),ac=[...document.querySelectorAll('[name=ac]:checked')].map(x=>x.value),g=id=>$(id).value.trim();
 const L=['Olá! Vim pela tabela de preços da IAMUREL.','','Nome: '+g('#f-nome')];if(g('#f-emp'))L.push('Negócio: '+g('#f-emp'));if(g('#f-ig'))L.push('Instagram: '+g('#f-ig'));
 L.push('Plano de interesse: '+(p?`${p.nome} (R$ ${p.preco}/mês${p.aPartir?', a partir de':''})`:'ainda não sei'));if(ac.length)L.push('Acréscimos: '+ac.join(', '));if(g('#f-msg'))L.push('Mensagem: '+g('#f-msg'));L.push('','Pode me enviar a proposta?');
 window.open('https://wa.me/'+C.whats+'?text='+encodeURIComponent(L.join('\n')),'_blank','noopener')};
/* contador de preço (só em aparelhos que aguentam) */
function count(s){if(lite)return;s.querySelectorAll('[data-n]').forEach(b=>{const t=+b.dataset.n.replace('.','').replace(',','.'),t0=performance.now();
 const f=n=>{const k=Math.min(1,(n-t0)/900),e=1-Math.pow(1-k,3);b.textContent=(t*e).toFixed(2).replace('.',',');if(k<1)requestAnimationFrame(f);else b.textContent=b.dataset.n};requestAnimationFrame(f)})}
/* deck: arrastar, setas, roda, teclado */
let i=0,x0=null,y0=0,t0=0,dx=0,ax=null,lock=0;
function go(n,anim=true){const was=i;i=Math.max(0,Math.min(sl.length-1,n));deck.classList.toggle('drag',!anim);deck.style.transform=`translate3d(${-i*innerWidth}px,0,0)`;
 sl.forEach((s,k)=>s.classList.toggle('on',k===i));[...dots.children].forEach((d,k)=>{d.classList.toggle('on',k===i);d.setAttribute('aria-selected',k===i)});
 document.body.style.setProperty('--nv',S[i].dark?'#F6EEDC':'#074145');$('#mark').style.opacity=i?1:0;$('#pv').disabled=!i;$('#nx').disabled=i===sl.length-1;
 if(i!==was&&S[i].h.includes('data-n'))count(sl[i]);history.replaceState(null,'','#'+(i+1))}
dots.onclick=e=>{const b=e.target.closest('[data-k]');if(b)go(+b.dataset.k)};$('#cta').onclick=()=>go(sl.length-1);$('#pv').onclick=()=>go(i-1);$('#nx').onclick=()=>go(i+1);addEventListener('resize',()=>go(i,false));
deck.addEventListener('pointerdown',e=>{if(e.target.closest('input,textarea,button,label,a,summary'))return;x0=e.clientX;y0=e.clientY;t0=performance.now();ax=null;dx=0},{passive:true});
addEventListener('pointermove',e=>{if(x0==null)return;const mx=e.clientX-x0,my=e.clientY-y0;if(!ax&&Math.hypot(mx,my)>8)ax=Math.abs(mx)>Math.abs(my)?'x':'y';if(ax==='x'){dx=mx;deck.classList.add('drag');deck.style.transform=`translate3d(${-i*innerWidth+dx}px,0,0)`}},{passive:true});
const end=()=>{if(x0==null)return;const v=dx/Math.max(1,performance.now()-t0);x0=null;if(ax==='x')go(dx<-60||v<-.5?i+1:dx>60||v>.5?i-1:i);ax=null};addEventListener('pointerup',end);addEventListener('pointercancel',end);
addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;const k=e.key;if(k==='ArrowRight'||k==='PageDown'||k===' '){e.preventDefault();go(i+1)}else if(k==='ArrowLeft'||k==='PageUp')go(i-1);else if(k==='Home')go(0);else if(k==='End')go(sl.length-1)});
addEventListener('wheel',e=>{const s=sl[i],h=Math.abs(e.deltaX)>Math.abs(e.deltaY),d=h?e.deltaX:e.deltaY;if(lock||Math.abs(d)<25)return;if(!h&&(d>0?s.scrollTop+s.clientHeight<s.scrollHeight-4:s.scrollTop>4))return;lock=1;go(i+(d>0?1:-1));setTimeout(()=>lock=0,800)},{passive:true});
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>go(Math.max(0,Math.min(sl.length-1,(+location.hash.slice(1)||1)-1)),false));
})();
