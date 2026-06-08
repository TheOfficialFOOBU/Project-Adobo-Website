// Basic site JS for Project Adobo
document.addEventListener('DOMContentLoaded', () => {
  // Example: simple mobile nav toggle if you add a .nav-toggle button
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=> nav.classList.toggle('open'))
  }

  // Lazy-load images with data-src
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const img = e.target; img.src = img.dataset.src; obs.unobserve(img);
        }
      })
    });
    lazyImgs.forEach(i=>io.observe(i));
  } else {
    lazyImgs.forEach(i=>i.src = i.dataset.src);
  }
});