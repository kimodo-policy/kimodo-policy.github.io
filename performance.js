(() => {
  const $ = id => document.getElementById(id);
  const section = $('performance');
  if (!section) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = [...section.querySelectorAll('[role="tab"]')];
  let benchmark = 'arena', data, hidden = new Set(), frame, visible = false;
  const fmt = value => value == null ? '—' : Number(value.toFixed(2)).toString();
  const complete = () => data.models.filter(m => m.values.every(v => v != null));
  const svgNode = (name, attrs, content) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v));
    if (content != null) el.textContent = content;
    return el;
  };
  function radar() {
    const svg = $('eval-radar'); svg.replaceChildren();
    const n = data.tasks.length, cx = 280, cy = 226, r = 165;
    const point = (i, v) => { const a = i * Math.PI * 2 / n - Math.PI / 2; return [cx + Math.cos(a)*r*v/100, cy + Math.sin(a)*r*v/100]; };
    for (let v = 20; v <= 100; v += 20) {
      svg.append(svgNode('polygon',{points:data.tasks.map((_,i)=>point(i,v).join(',')).join(' '),fill:'none',stroke:'#dfe4e8','stroke-width':1}));
      svg.append(svgNode('text',{x:cx+5,y:cy-r*v/100-4,fill:'#99a1ab','font-size':11},v));
    }
    data.tasks.forEach((task,i) => {
      const p = point(i,100), label = point(i,121);
      svg.append(svgNode('line',{x1:cx,y1:cy,x2:p[0],y2:p[1],stroke:'#e5e8eb'}));
      const text = svgNode('text',{x:label[0],y:label[1],fill:'#5e6672','font-size':13,'text-anchor':'middle','dominant-baseline':'middle'});
      const lines = task === 'Push Office Chair' ? ['Push Office','Chair'] : task === 'XMoveBendPick' ? ['XMove','BendPick'] : task === 'Single-Arm PNP' ? ['Single-Arm','PNP'] : task === 'Dual-Arm PNP' ? ['Dual-Arm','PNP'] : task === 'Football Scoring' ? ['Football','Scoring'] : task === 'Banana Cabinet' ? ['Banana','Cabinet'] : task === 'Cushion Sitting' ? ['Cushion','Sitting'] : [task];
      lines.forEach((line,j)=>text.append(svgNode('tspan',{x:label[0],dy:j ? 16 : -(lines.length-1)*8},line)));
      svg.append(text);
    });
    complete().forEach(m => {
      const group = svgNode('g',{'class':'eval-series','data-model':m.name,opacity:hidden.has(m.name)?0:1});
      group.append(svgNode('polygon',{points:m.values.map((v,i)=>point(i,v).join(',')).join(' '),fill:m.color,'fill-opacity':m.name.startsWith('Kimodo')?.11:.025,stroke:m.color,'stroke-width':m.name.startsWith('Kimodo')?2.8:1.7,'stroke-linejoin':'round'}));
      m.values.forEach((v,i)=>{ const p=point(i,v); const dot=svgNode('circle',{cx:p[0],cy:p[1],r:3,fill:m.color}); dot.append(svgNode('title',{},`${m.name} · ${data.tasks[i]}: ${fmt(v)}%${m.imputed?.[i] ? ' (unreported; displayed as zero)' : ''}`));group.append(dot); });
      svg.append(group);
    });
  }
  function animate() {
    cancelAnimationFrame(frame);
    const target=data.value, start=performance.now();
    $('eval-value').parentElement.setAttribute('aria-label',`${fmt(target)} percent`);
    $('eval-value').setAttribute('aria-hidden','true');
    section.classList.remove('eval-animated');
    if (!visible && !reduced.matches) { $('eval-value').textContent=fmt(target); return; }
    requestAnimationFrame(()=>section.classList.add('eval-animated'));
    if (reduced.matches) { $('eval-value').textContent=fmt(target); return; }
    function tick(now) { const t=Math.min(1,(now-start)/1150); $('eval-value').textContent=(target*(1-Math.pow(1-t,3))).toFixed(target%1 ? 2 : 0); if(t<1)frame=requestAnimationFrame(tick); }
    frame=requestAnimationFrame(tick);
  }
  function render() {
    data=window.KIMODO_RESULTS[benchmark==='arena'?$('arena-setting').value:benchmark];
    if (benchmark === 'simple') {
      const colors=['#987eb3','#76B900','#8b98a6','#db9851','#49a69c','#c06c87','#577fbd','#ad9d40','#a17757','#5a9fae'];
      data={...data, models:data.models.map((model,i)=>{
        const imputed=model.values.map(value=>value==null);
        const values=model.values.map(value=>value??0);
        return {...model,values,imputed,color:colors[i],mean:values.reduce((sum,value)=>sum+value,0)/values.length};
      }), note:'Table 3 · RTC disabled. Task percentages aggregate L0/L1/L2 (30 trials per tested task). For this visualization, unreported tasks are filled with 0* and included in the eight-task mean; these are not measured failures or paper-reported means. Kimodo: 182/240 trials (75.83%).'};
    }
    hidden.clear();
    tabs.forEach(tab=>{const active=tab.dataset.benchmark===benchmark;tab.setAttribute('aria-selected',active);tab.tabIndex=active?0:-1; if(active)$('eval-panel').setAttribute('aria-labelledby',tab.id);});
    $('eval-setting').hidden=benchmark!=='arena';
    ['eyebrow','title','description'].forEach(key=>$('eval-'+key).textContent=data[key]);
    $('eval-footnote').textContent=benchmark==='simple'?'8 tasks · 3 levels · 240 trials':benchmark==='real'?'8 tasks · 10 trials per task':'7 tasks · success rate (%)';
    $('eval-table-note').textContent=data.note;
    const isRadar=data.chart==='radar';
    $('eval-chart-title').textContent=isRadar?'Success rate by task':'Mean success rate';
    $('eval-radar-wrap').hidden=!isRadar; $('eval-bars').hidden=isRadar;
    $('eval-legend').hidden=!isRadar; $('eval-hint').hidden=!isRadar;
    $('eval-legend').replaceChildren();
    if(isRadar) {
      complete().forEach(m=>{
        const button=document.createElement('button');button.type='button';button.textContent=m.name;button.style.setProperty('--series-color',m.color);button.setAttribute('aria-pressed','true');
        button.addEventListener('click',()=>{if(hidden.has(m.name))hidden.delete(m.name);else hidden.add(m.name);button.setAttribute('aria-pressed',!hidden.has(m.name));section.querySelectorAll('.eval-series').forEach(g=>g.style.opacity=hidden.has(g.dataset.model)?0:1);});
        $('eval-legend').append(button);
      }); radar();
    } else {
      $('eval-bars').replaceChildren();
      data.models.forEach(m=>{
        const row=document.createElement('div');row.className='eval-bar-row';
        const label=document.createElement('div');label.className='eval-bar-label';const name=document.createElement('span');name.textContent=m.name;const value=document.createElement('strong');value.textContent=fmt(m.mean)+'%';label.append(name,value);
        const track=document.createElement('div');track.className='eval-bar-track';const fill=document.createElement('div');fill.className='eval-bar-fill';fill.style.setProperty('--bar-value',m.mean+'%');fill.style.background=m.color;track.append(fill);row.append(label,track);$('eval-bars').append(row);
      });
    }
    const table=$('eval-table'), head=table.tHead, body=table.tBodies[0];head.replaceChildren();body.replaceChildren();
    const tr=document.createElement('tr');['Policy',...data.tasks,'Mean'].forEach(t=>{const th=document.createElement('th');th.scope='col';th.textContent=t;tr.append(th);});head.append(tr);
    data.models.forEach(m=>{
      const row=document.createElement('tr');if(m.name.startsWith('Kimodo'))row.className='eval-ours';
      const name=document.createElement('th');name.scope='row';name.textContent=m.name;row.append(name);
      [...m.values,m.mean].forEach((value,i)=>{
        const cell=document.createElement('td');cell.textContent=fmt(value);
        if(m.imputed?.[i]){cell.textContent+='*';cell.title='Not reported; displayed as zero for this comparison.';}
        if(i===data.tasks.length && m.imputed?.some(Boolean))cell.title='Eight-task mean with unreported tasks filled with zero.';
        if(m.sd && i<m.values.length){const sd=document.createElement('small');sd.textContent=' ± '+fmt(m.sd[i]);cell.append(sd);}
        if(m.counts && i<m.values.length)cell.title='L0 / L1 / L2: '+m.counts[i].map(v=>v+'/10').join(' · ');
        const best=Math.max(...data.models.map(other=>i===data.tasks.length?(other.mean??-1):(other.values[i]??-1)));
        if(value!=null && value===best)cell.classList.add('eval-best');row.append(cell);
      }); body.append(row);
    }); animate();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>{benchmark=tab.dataset.benchmark;render();});
    tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!=null){e.preventDefault();tabs[next].focus();tabs[next].click();}});
  });
  $('arena-setting').addEventListener('change',render);
  new IntersectionObserver(entries=>{entries.forEach(entry=>{const now=entry.isIntersecting;if(now&&!visible){visible=true;animate();}else if(!now){visible=false;cancelAnimationFrame(frame);section.classList.remove('eval-animated');}});},{threshold:.15}).observe($('eval-panel'));
  reduced.addEventListener('change',animate);
  render();
})();
