/* Global JS: theme, page transitions, cursor, reveal, tabs, to-top, carousel bounce */

// 1) Theme (persistent) - Soft Dark Mode
(function(){
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if(stored) root.setAttribute('data-theme', stored);

  window.toggleTheme = function(){
    const now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', now);
    localStorage.setItem('theme', now);
  };
})();

/* 2) Fade transitions for local HTML links */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('a[href]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      if(!href || !href.endsWith('.html')) return;
      e.preventDefault();
      const page = document.querySelector('.page');
      if(page) page.classList.add('fade-out');
      setTimeout(()=> location.href = href, 420);
    });
  });
});

/* 3) Custom cursor */
(function(){
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.id = 'cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e)=>{
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // enlarge on interactive elements
  const interactive = () => document.querySelectorAll('a, button, input, textarea, .card, .tab-btn, .carousel-card');
  setTimeout(()=> interactive().forEach(el=>{
    el.addEventListener('mouseenter', ()=> cursor.classList.add('big'));
    el.addEventListener('mouseleave', ()=> cursor.classList.remove('big'));
  }), 200);
})();

/* 4) Reveal on scroll + pixel bounce for carousel cards */
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        // pixel bounce for carousel-card
        if(e.target.classList.contains('carousel-card')){
          e.target.animate([
            { transform: 'translateY(12px)'},
            { transform: 'translateY(-8px)'},
            { transform: 'translateY(0)'}
          ], { duration: 700, easing: 'cubic-bezier(.2,.9,.2,1)' });
        }
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
  document.querySelectorAll('.carousel-card').forEach(el=> io.observe(el));
})();

/* 5) Back to top button */
(function(){
  const btn = document.getElementById('toTop');
  if(!btn) return;
  window.addEventListener('scroll', ()=> {
    if(window.scrollY > 420) btn.style.display = 'block'; else btn.style.display = 'none';
  });
  btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  const smallBtn = document.getElementById('toTopSmall');
  if(smallBtn) smallBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
})();

/* 6) Tabs on hobby pages */
(function(){
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(t.classList.contains('tab-btn')){
      const parent = t.closest('.tabs');
      if(!parent) return;
      parent.querySelectorAll('.tab-btn').forEach(b=> b.classList.remove('active'));
      t.classList.add('active');
      // panels wrapper is next sibling (tab-panels)
      const panelsWrapper = parent.nextElementSibling || parent.parentElement.querySelector('.tab-panels');
      if(!panelsWrapper) return;
      const idx = Array.from(parent.children).indexOf(t);
      panelsWrapper.querySelectorAll('.tab-panel').forEach((p,i)=> {
        p.classList.toggle('active', i === idx);
        // reveal inside new active
        p.querySelectorAll('.reveal').forEach(el=> el.classList.add('show'));
      });
    }
  });
})();

/* 7) Range inputs small UI sync */
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('input[type="range"]').forEach(r=>{
    const label = r.nextElementSibling;
    if(label && label.tagName === 'STRONG') label.textContent = r.value;
    r.addEventListener('input', ()=> { if(label) label.textContent = r.value; });
  });
});

/* 8) accessible keyboard "Home" -> scroll top */
document.addEventListener('keydown', (e)=> { if(e.key === 'Home') window.scrollTo({top:0, behavior:'smooth'}); });

/* 9) gentle snap scroll for carousel when using keyboard arrows */
document.addEventListener('keydown', (e)=>{
  const c = document.querySelector('.carousel');
  if(!c) return;
  if(e.key === 'ArrowRight') c.scrollBy({left: 340, behavior:'smooth'});
  if(e.key === 'ArrowLeft') c.scrollBy({left: -340, behavior:'smooth'});
});
