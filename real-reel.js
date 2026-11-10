(() => {
  const reel = document.querySelector('.real-reel');
  if (!reel) return;
  const viewport = reel.querySelector('.real-reel-viewport');
  const track = reel.querySelector('.real-reel-track');
  const toggle = reel.querySelector('.real-reel-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clips = window.KIMODO_VIDEOS.real;
  let visible = false, hovered = false, focused = false, paused = reduced.matches;
  let active = null, delay, cycle = 0, frame = 0, last = 0, position = 0;
  function clearActive() {
    clearTimeout(delay);
    if (active) {
      const video = active.querySelector('video');
      video.pause();
      active.classList.remove('is-playing', 'is-selected');
      active.setAttribute('aria-pressed', 'false');
      active = null;
    }
  }
  function select(card, immediate = false) {
    if (card === active) return;
    clearActive(); active = card;
    card.classList.add('is-selected');card.setAttribute('aria-pressed','true');
    const video = card.querySelector('video');
    delay = setTimeout(async () => {
      if (active !== card || !visible || document.hidden) return;
      if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
      try { await video.play(); if (active !== card || !visible || document.hidden) video.pause(); }
      catch { card.querySelector('.real-reel-status').textContent = 'Tap to play'; }
    }, immediate ? 0 : 300);
  }
  for (let copy = 0; copy < 2; copy++) {
    const group = document.createElement('div'); group.className = 'real-reel-group';
    if (copy) group.setAttribute('aria-hidden','true');
    clips.forEach((clip, i) => {
      const card = document.createElement('button');card.type='button';card.className='real-reel-card';
      card.setAttribute('aria-label', `Play ${clip.title}`);card.setAttribute('aria-pressed','false');
      if (copy) card.tabIndex = -1;
      const video = document.createElement('video');
      video.poster=clip.poster;video.dataset.src=clip.src;video.preload='none';video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;
      const overlay = document.createElement('span');overlay.className='real-reel-caption';
      const number = document.createElement('span');number.className='real-reel-number';number.textContent=String(i+1).padStart(2,'0');
      const title = document.createElement('span');title.textContent=clip.title;
      const status = document.createElement('span');status.className='real-reel-status';status.textContent='▶';
      const speed = document.createElement('span');speed.className='real-reel-speed';speed.textContent='Speed 1x';
      overlay.append(number,title,status);card.append(video,speed,overlay);group.append(card);
      video.addEventListener('playing',()=>{ if (active === card) {card.classList.add('is-playing');status.textContent='Playing';} else video.pause(); });
      video.addEventListener('pause',()=>{card.classList.remove('is-playing');status.textContent='▶';});
      card.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')select(card);});
      card.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch' && document.activeElement!==card && active===card)clearActive();});
      card.addEventListener('focus',()=>{focused=true;select(card);});
      card.addEventListener('blur',()=>{focused=false;if(!card.matches(':hover'))clearActive();});
      card.addEventListener('click',()=>{if(active===card && !video.paused){clearActive();card.blur();}else{if(active===card)clearActive();select(card,true);}});
    });track.append(group);
  }
  function updateButton() {toggle.textContent=paused?'▶':'Ⅱ';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Resume automatic scrolling':'Pause automatic scrolling');}
  toggle.addEventListener('click',()=>{paused=!paused;updateButton();});updateButton();
  viewport.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')hovered=true;});
  viewport.addEventListener('pointerleave',()=>{hovered=false;if(!focused)clearActive();});
  viewport.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')clearActive();});
  viewport.addEventListener('scroll',()=>{position=viewport.scrollLeft;},{passive:true});
  function tick(now) {
    const dt = Math.min((now-last)/1000, .05);last=now;
    if (!paused && !hovered && !focused && !active && cycle) {
      position=(position+dt*30)%cycle;viewport.scrollLeft=position;
    }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    if (visible && !document.hidden) {
      last=performance.now();frame=requestAnimationFrame(tick);
      const current = viewport.querySelector('.real-reel-card:hover, .real-reel-card:focus-visible');
      if (current) { if(active===current)clearActive(); select(current); }
    }
    else clearActive();
  }
  new ResizeObserver(()=>{cycle=track.children[1].offsetLeft-track.children[0].offsetLeft;position=viewport.scrollLeft;}).observe(viewport);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1}).observe(reel);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{paused=reduced.matches;updateButton();});
})();
