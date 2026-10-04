document.addEventListener('DOMContentLoaded', () => {
  const links = [...document.querySelectorAll('.section-nav a')];
  const targets = links.map(link => document.querySelector(link.hash));
  let scheduled = false;

  // 根据当前浏览位置更新 Tango 风格的吸顶导航状态。
  function updateNavigation() {
    let active = null;
    targets.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 150) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }

  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  updateNavigation();

  // 尚未发布的项目链接先保留入口样式，点击时不跳转到页面顶部。
  document.querySelectorAll('[data-link-placeholder]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
  });

  // 图片占位替换成视频后，暂停屏幕外的视频以减少资源占用。
  const videos = [...document.querySelectorAll('.task-video video')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) entry.target.pause();
        else if (entry.target.hasAttribute('data-autoplay')) entry.target.play().catch(() => {});
      });
    }, { threshold: 0.15 });
    videos.forEach(video => observer.observe(video));
  }
});
