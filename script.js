const playlist = ['transportation', 'football', 'banana', 'boxing', 'pnp', 'sitting'];
const players = [...document.querySelectorAll('.cover-player')];
const toggle = document.querySelector('.video-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
let activePlayer = 0;
let clipIndex = 0;
let userPaused = reducedMotion.matches;
let switching = false;
let coverVisible = true;
function currentVideo() { return players[activePlayer]; }
function updateButton() {
  const paused = currentVideo().paused;
  toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
}
function shouldPlay() { return !userPaused && !document.hidden && coverVisible; }
function syncPlayback() {
  if (shouldPlay()) currentVideo().play().catch(updateButton);
  else players.forEach(player => player.pause());
  updateButton();
}
function prepareNext() {
  const next = players[1 - activePlayer];
  next.src = `assets/${playlist[(clipIndex + 1) % playlist.length]}.mp4`;
  next.load();
}
async function advancePlaylist() {
  if (switching) return;
  switching = true;
  const previous = currentVideo();
  const next = players[1 - activePlayer];
  try {
    // Keep the last frame visible until the next clip can actually play.
    if (shouldPlay()) await next.play();
    activePlayer = 1 - activePlayer;
    clipIndex = (clipIndex + 1) % playlist.length;
    next.classList.add('is-active');
    previous.classList.remove('is-active');
    previous.pause();
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
prepareNext();
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
const overviewMotion = document.querySelector('.overview-motion');
async function setupOverviewReveal() {
  if (!overviewMotion || !('IntersectionObserver' in window)) return;
  try {
    await Promise.all([...overviewMotion.querySelectorAll('img')].map(img => img.decode()));
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
