const playlist = ['transportation', 'football', 'banana', 'boxing', 'pnp', 'sitting'];
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
let coverResolution = connection?.saveData || (connection?.downlink > 0 && connection.downlink < 3) || /(^|-)2g$|3g/.test(connection?.effectiveType || '') ? 480 : 720;
const coverSource = index => `assets/cover/${playlist[index]}-${coverResolution}.mp4`;
const players = [...document.querySelectorAll('.cover-player')];
const toggle = document.querySelector('.video-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
let activePlayer = 0;
let clipIndex = 0;
let userPaused = reducedMotion.matches;
let switching = false;
let coverVisible = true;
let fallbackTimer;
function useLighterCover() {
  if (coverResolution === 480 || !shouldPlay()) return;
  coverResolution = 480;
  const video = currentVideo();
  const position = video.currentTime;
  video.addEventListener('loadedmetadata', () => { video.currentTime = position; syncPlayback(); }, {once:true});
  delete video.dataset.started;
  video.src = coverSource(clipIndex);
  video.load();
  const standby = players[1-activePlayer];
  standby.removeAttribute('src'); standby.preload = 'none'; standby.load();
}
function currentVideo() { return players[activePlayer]; }
function updateButton() {
  const paused = currentVideo().paused;
  toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
}
function shouldPlay() { return !userPaused && !document.hidden && coverVisible; }
function syncPlayback() {
  const video = currentVideo();
  let ahead = 0;
  for (let i = 0; i < video.buffered.length; i++) {
    if (video.buffered.start(i) <= video.currentTime && video.buffered.end(i) >= video.currentTime) ahead = video.buffered.end(i)-video.currentTime;
  }
  if (shouldPlay()) {
    // Build a small reserve before starting or resuming after a network stall.
    if (!video.paused || ahead >= (video.dataset.started ? 3 : 2) || (video.duration-video.currentTime < 3 && ahead > .01)) video.play().catch(updateButton);
  }
  else players.forEach(player => player.pause());
  updateButton();
}
function prepareNext(force = false) {
  const current = currentVideo();
  const next = players[1 - activePlayer];
  const source = coverSource((clipIndex + 1) % playlist.length);
  if (next.getAttribute('src') === source) return;
  // Let the visible clip build a buffer before fetching the next one.
  let ahead = 0;
  for (let i = 0; i < current.buffered.length; i++) {
    if (current.buffered.start(i) <= current.currentTime && current.buffered.end(i) >= current.currentTime) ahead = current.buffered.end(i) - current.currentTime;
  }
  if (!force && (!shouldPlay() || current.currentTime < 2 || (ahead < 6 && current.duration-current.currentTime > 8))) return;
  next.preload = 'auto';
  next.src = source;
  next.load();
}
async function advancePlaylist() {
  if (switching) return;
  switching = true;
  const previous = currentVideo();
  const next = players[1 - activePlayer];
  prepareNext(true);
  try {
    // Keep the last frame visible until the next clip can actually play.
    if (shouldPlay()) await next.play();
    activePlayer = 1 - activePlayer;
    clipIndex = (clipIndex + 1) % playlist.length;
    next.classList.add('is-active');
    previous.classList.remove('is-active');
    previous.pause();
    delete previous.dataset.started;
    previous.removeAttribute('src');
    previous.preload = 'none';
    previous.load();
    hero.dataset.clip = playlist[clipIndex];
    prepareNext();
    syncPlayback();
  } catch {
    // A browser may block playback; the visible play control remains available.
    updateButton();
  } finally { switching = false; }
}
players.forEach(player => {
  player.muted = true;
  player.addEventListener('waiting', () => {
    if (player !== currentVideo()) return;
    player.pause();
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(useLighterCover, 2500);
  });
  player.addEventListener('playing', () => { player.dataset.started = 'true'; clearTimeout(fallbackTimer); });
  for (const event of ['progress', 'canplay']) player.addEventListener(event, () => {
    if (player === currentVideo() && player.paused) syncPlayback();
  });
  player.addEventListener('timeupdate', () => { if (player === currentVideo()) prepareNext(); });
  player.addEventListener('ended', () => { if (player === currentVideo()) advancePlaylist(); });
  player.addEventListener('play', updateButton);
  player.addEventListener('pause', updateButton);
});
toggle.addEventListener('click', () => {
  userPaused = !currentVideo().paused;
  if (!userPaused && currentVideo().ended) advancePlaylist();
  else syncPlayback();
});
document.addEventListener('visibilitychange', syncPlayback);
reducedMotion.addEventListener('change', e => { userPaused = e.matches; syncPlayback(); });
new IntersectionObserver(entries => {
  coverVisible = entries[0].isIntersecting;
  syncPlayback();
}, {threshold:0}).observe(hero);
hero.dataset.clip = playlist[0];
currentVideo().src = coverSource(0);
currentVideo().load();
syncPlayback();

const navigation = document.querySelector('.sticky-nav');
function updateNavigation() {
  const threshold = Math.max(320, hero.offsetHeight - navigation.offsetHeight - 40);
  const fadeStart = Math.max(72, innerHeight * 0.08);
  const fadeEnd = Math.max(150, innerHeight * 0.25);
  const isScrolled = scrollY > threshold;
  const progress = Math.min(1, Math.max(0, (scrollY - fadeStart) / (fadeEnd - fadeStart)));
  const opacity = isScrolled ? 1 : 1 - progress;
  navigation.classList.toggle('nav-scrolled', isScrolled);
  navigation.style.setProperty('--nav-opacity', String(opacity));
  navigation.style.setProperty('--nav-pointer', opacity < 0.08 ? 'none' : 'auto');
  // Hidden transition navigation must also leave keyboard traversal.
  navigation.inert = opacity < 0.08;
}
window.addEventListener('scroll', updateNavigation, {passive:true});
window.addEventListener('resize', updateNavigation);
updateNavigation();

const navItems = [...document.querySelectorAll('.sticky-nav-links a')]
  .map(link => ({link, section:document.querySelector(link.hash)}))
  .filter(item => item.section);
let jumpTarget = null;
let jumpTimer;
function markCurrentSection(activeLink) {
  navItems.forEach(({link}) => {
    const active = link === activeLink;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function updateReadingPosition() {
  if (jumpTarget) return;
  const probeY = scrollY + innerHeight * 0.36;
  let active = null;
  navItems.forEach(item => {
    if (item.section.getBoundingClientRect().top + scrollY <= probeY) active = item.link;
  });
  markCurrentSection(active);
}
function finishNavigationJump() {
  clearTimeout(jumpTimer);
  jumpTarget = null;
  updateReadingPosition();
}
navItems.forEach(({link, section}) => {
  link.addEventListener('click', event => {
    event.preventDefault();
    clearTimeout(jumpTimer);
    jumpTarget = link;
    markCurrentSection(link);
    history.pushState(null, '', link.hash);
    const target = Math.max(0, section.getBoundingClientRect().top + scrollY - navigation.offsetHeight - 20);
    window.scrollTo({top:target, behavior:reducedMotion.matches ? 'instant' : 'smooth'});
    jumpTimer = setTimeout(finishNavigationJump, 1100);
  });
});
window.addEventListener('scroll', updateReadingPosition, {passive:true});
window.addEventListener('resize', updateReadingPosition, {passive:true});
window.addEventListener('scrollend', finishNavigationJump);
updateReadingPosition();

// Replay on each viewport entry; reset only after the graphic leaves fully.
// Load research images only near their section, rather than during cover playback.
const imageLoader = new IntersectionObserver(entries => {
  entries.forEach(({target: img, isIntersecting}) => {
    if (!isIntersecting) return;
    img.src = img.dataset.src;
    imageLoader.unobserve(img);
  });
}, {rootMargin:'200px'});
document.querySelectorAll('img[data-src]').forEach(img => imageLoader.observe(img));
const overviewMotion = document.querySelector('.overview-motion');
async function setupOverviewReveal() {
  if (!overviewMotion || !('IntersectionObserver' in window)) return;
  try {
    await Promise.all([...overviewMotion.querySelectorAll('img')].map(img => new Promise(resolve => {
      if (img.complete && img.naturalWidth) resolve();
      else { img.addEventListener('load', resolve, {once:true}); img.addEventListener('error', resolve, {once:true}); }
    })));
  } catch { return; }
  overviewMotion.classList.add('reveal-ready');
  let visible = false;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (reducedMotion.matches) overviewMotion.classList.add('is-revealed');
      else if (!entry.isIntersecting) overviewMotion.classList.remove('is-revealed');
      else if (entry.intersectionRatio >= 0.15) overviewMotion.classList.add('is-revealed');
    }
  }, {threshold:[0, 0.15]});
  observer.observe(overviewMotion);
  reducedMotion.addEventListener('change', event => {
    overviewMotion.classList.toggle('is-revealed', event.matches || visible);
  });
}
setupOverviewReveal();
