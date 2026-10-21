(() => {
  const section = document.getElementById('videos');
  const grid = document.getElementById('task-video-grid');
  const tabs = [...section.querySelectorAll('[role="tab"]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const inView = new Set();
  const play = video => {
    if (!document.hidden && !reduced.matches) video.play().catch(() => {});
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target: video, isIntersecting}) => {
      if (isIntersecting) {
        inView.add(video);
        if (!video.getAttribute('src')) { video.poster = video.dataset.poster; video.src = video.dataset.src; video.load(); }
        play(video);
      } else { inView.delete(video); video.pause(); }
    });
  }, {threshold: .15});
  const summaries = {
    real: '6 selected real-world demonstrations.',
    humanoidarena: '7 tasks in HumanoidArena.',
    simple: '8 tasks in Simple · 3 selected clips per task.'
  };
  function show(key) {
    document.getElementById('real-deployment').hidden = key !== 'real';
    observer.disconnect(); inView.clear();
    grid.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
    grid.replaceChildren();
    tabs.forEach(tab => {
      const active = tab.dataset.videoSet === key;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      if (active) document.getElementById('video-panel').setAttribute('aria-labelledby',tab.id);
    });
    document.getElementById('video-summary').textContent = summaries[key];
    const clips = window.KIMODO_VIDEOS[key];
    clips.forEach((clip, i) => {
      const card = document.createElement('article'); card.className = 'task-video-card';
      card.style.setProperty('--card-delay', `${Math.min(i,5)*35}ms`);
      const frame = document.createElement('div'); frame.className = 'task-video-frame';
      const video = document.createElement('video');
      video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
      video.controls = true; video.preload = 'none'; video.dataset.poster = clip.poster;
      video.dataset.src = clip.src; video.setAttribute('aria-label', `${clip.title}${clip.detail ? ' · '+clip.detail : ''}`);
      const tag = document.createElement('span'); tag.className = 'task-video-tag'; tag.textContent = clip.tag;
      const error = document.createElement('a'); error.className = 'task-video-error'; error.href = clip.src;
      error.textContent = 'Open video'; error.hidden = true;
      video.addEventListener('error', () => { if(video.getAttribute('src'))error.hidden = false; });
      frame.append(video,tag,error);
      if (key === 'real') {
        const speed = document.createElement('span'); speed.className = 'task-video-speed'; speed.textContent = 'Speed 1x';
        video.addEventListener('ratechange', () => { speed.textContent = `Speed ${video.playbackRate}x`; });
        frame.append(speed);
      }
      const title = document.createElement('h3'); title.textContent = clip.title;
      const caption = document.createElement('p'); caption.textContent = `${String(i+1).padStart(2,'0')} / ${String(clips.length).padStart(2,'0')}${clip.detail ? ' · '+clip.detail : ''}`;
      card.append(frame,title,caption);
      if (clip.prompt) {
        const prompt = document.createElement('p'); prompt.className = 'task-video-prompt';
        const label = document.createElement('span'); label.textContent = 'Prompt';
        prompt.append(label,document.createTextNode(clip.prompt)); card.append(prompt);
      }
      grid.append(card); observer.observe(video);
    });
  }
  tabs.forEach((tab,i) => {
    tab.addEventListener('click', () => show(tab.dataset.videoSet));
    tab.addEventListener('keydown', event => {
      let next;
      if(event.key === 'ArrowRight')next = (i+1)%tabs.length;
      if(event.key === 'ArrowLeft')next = (i+tabs.length-1)%tabs.length;
      if(event.key === 'Home')next = 0;
      if(event.key === 'End')next = tabs.length-1;
      if(next != null){event.preventDefault();tabs[next].focus();tabs[next].click();}
    });
  });
  const sync = () => inView.forEach(video => document.hidden || reduced.matches ? video.pause() : play(video));
  document.addEventListener('visibilitychange',sync); reduced.addEventListener('change',sync);
  show('real');
})();
