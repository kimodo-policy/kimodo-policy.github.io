(() => {
 const video = document.querySelector('#intro-film-video');
 if (!video) return;
 const shell = video.closest('.intro-film-shell');
 const bar = shell.querySelector('.intro-film-controls');
 const play = bar.querySelector('[data-intro-play]');
 const mute = bar.querySelector('[data-intro-mute]');
 const seek = bar.querySelector('[data-intro-seek]');
 const time = bar.querySelector('[data-intro-time]');
 const fullscreen = bar.querySelector('[data-intro-fullscreen]');
 const status = document.querySelector('.intro-film-status');
 const stamp = value => { const n = Math.floor(Number.isFinite(value) ? value : 0); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
 const update = () => {
  play.textContent = video.paused ? 'Play' : 'Pause';
  play.setAttribute('aria-label', video.paused ? 'Play introduction video' : 'Pause introduction video');
  seek.value = video.duration ? video.currentTime / video.duration * 100 : 0;
  time.textContent = `${stamp(video.currentTime)} / ${stamp(video.duration || 95.6)}`;
  mute.textContent = video.muted ? 'Sound off' : 'Sound on';
  mute.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
  mute.setAttribute('aria-pressed', String(video.muted));
 };
 const toggle = async () => {
  if (!video.paused) { video.pause(); return; }
  try { await video.play(); status.hidden = true; } catch { status.hidden = false; }
 };
 play.addEventListener('click', toggle);
 video.addEventListener('click', toggle);
 mute.addEventListener('click', () => { video.muted = !video.muted; });
 seek.addEventListener('input', () => { if (Number.isFinite(video.duration)) video.currentTime = video.duration * Number(seek.value) / 100; });
 fullscreen.addEventListener('click', async () => {
  try {
   if (document.fullscreenElement) await document.exitFullscreen();
   else if (shell.requestFullscreen) await shell.requestFullscreen();
   else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  } catch { /* Keep the working inline player if fullscreen is unavailable. */ }
 });
 document.addEventListener('fullscreenchange', () => { fullscreen.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; });
 ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'volumechange'].forEach(name => video.addEventListener(name, update));
 video.addEventListener('error', () => { status.hidden = false; });
 video.controls = false;
 bar.hidden = false;
 let hideTimer;
 const hideControls = () => { clearTimeout(hideTimer); bar.hidden = true; };
 const showControls = () => {
  clearTimeout(hideTimer);
  bar.hidden = false;
  if (!video.paused) hideTimer = setTimeout(() => {
   if (!bar.contains(document.activeElement)) hideControls();
  }, 1800);
 };
 shell.addEventListener('pointermove', showControls);
 shell.addEventListener('pointerdown', showControls);
 shell.addEventListener('focusin', showControls);
 document.addEventListener('pointerdown', event => {
  if (!shell.contains(event.target)) {
   if (bar.contains(document.activeElement)) document.activeElement.blur();
   hideControls();
  }
 });
 video.addEventListener('play', showControls);
 video.addEventListener('pause', showControls);
 video.addEventListener('ended', showControls);
 shell.addEventListener('keydown', event => { if (event.key === 'Escape') hideControls(); });
 update();
})();
