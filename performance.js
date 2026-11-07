(() => {
  const $ = id => document.getElementById(id);
  const section = $('performance');
  if (!section) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = [...section.querySelectorAll('[role="tab"]')];
  let benchmark = 'arena', data, hidden = new Set(), frame, visible = false;
  const fmt = value => value == null ? '—' : Number(value.toFixed(2)).toString();
  const plottedModels = () => data.models.filter(m =>
    m.values.every(v => v != null) &&
    !(benchmark === 'arena' && $('arena-setting').value === 'multi' && ['HuGe-OFT', 'HuGe-GR00T'].includes(m.name))
  );
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
    plottedModels().forEach(m => {
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
      }), note:'Table 3 · Each cell shows the paper’s rounded success rate, with L0 / L1 / L2 success counts below (10 trials per level). Radar traces and eight-task means use exact counts. Unreported tasks are displayed as 0† and included in the mean, as a visualization convention; they are not measured failures or paper-reported means. Kimodo-Policy*: 182/240 trials (75.83%); Ψ₀: 181/240 (75.42%). * = VLA pretraining. RTC disabled.'};
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
      plottedModels().forEach(m=>{
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
    const columns = [{label:'Policy'}];
    if(benchmark==='arena') columns.push({label:'AFR ↓',key:'afr',lower:true});
    data.tasks.forEach((task,index)=>{
      columns.push({label:task,index});
      if(benchmark==='arena' && index===2)columns.push({label:'HOI avg ↑',key:'hoi',sdKey:'hoiSd'});
      if(benchmark==='arena' && index===6)columns.push({label:'HSI avg ↑',key:'hsi',sdKey:'hsiSd'});
    });
    columns.push({label:benchmark==='arena'?'Overall ↑':'Mean ↑',key:'mean'});
    const tr=document.createElement('tr');columns.forEach(c=>{const th=document.createElement('th');th.scope='col';th.textContent=c.label;tr.append(th);});head.append(tr);
    table.caption.textContent=benchmark==='simple'?'SIMPLE success rates and L0 / L1 / L2 success counts; unreported tasks are filled with zero only for the website comparison.':'Success and fall rates reported in the Kimodo-Policy paper';
    // Sort baselines and our policies separately, keeping our rows at the bottom.
    const tableModels = [...data.models].sort((a,b) => {
      const group = Number(a.name.startsWith('Kimodo')) - Number(b.name.startsWith('Kimodo'));
      return group || (a.mean ?? -1) - (b.mean ?? -1);
    });
    tableModels.forEach(m=>{
      const row=document.createElement('tr');if(m.name.startsWith('Kimodo'))row.className='eval-ours';
      const name=document.createElement('th');name.scope='row';name.textContent=m.name;row.append(name);
      columns.slice(1).forEach(column=>{
        const i=column.index, value=column.key?m[column.key]:m.values[i];
        const displayValue=benchmark==='simple' && i!=null && !m.imputed[i]?m.paperValues[i]:value;
        const cell=document.createElement('td');cell.textContent=fmt(displayValue);
        if(m.imputed?.[i]){cell.textContent+='†';cell.title='Not reported; displayed as zero for this comparison.';}
        if(column.key==='mean' && m.imputed?.some(Boolean))cell.title='Eight-task mean with unreported tasks filled with zero.';
        const sd=column.sdKey?m[column.sdKey]:(i!=null?m.sd?.[i]:null);
        if(sd!=null){const small=document.createElement('small');small.textContent=' ± '+fmt(sd);cell.append(small);}
        if(m.counts?.[i]){
          const counts=document.createElement('small');counts.className='eval-counts';counts.textContent=m.counts[i].join(' / ');cell.append(counts);
          cell.title='L0 / L1 / L2: '+m.counts[i].map(v=>v+'/10').join(' · ');
        }
        const candidates=data.models.map(other=>column.key?other[column.key]:other.values[i]).filter(v=>v!=null);
        const best=column.lower?Math.min(...candidates):Math.max(...candidates);
        if(value!=null && value===best && !m.imputed?.[i])cell.classList.add('eval-best');row.append(cell);
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
