(() => {
  const button = document.querySelector('.intro-film-cover');
  if (!button) return;
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/dXECtGHerd0?autoplay=1&playsinline=1&rel=0';
    frame.title = 'Kimodo-Policy: Learning Kinematic Action Models for Humanoid Loco-Manipulation';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(frame);
    frame.focus();
  }, { once: true });
})();
