/* ============================================================
   TAKUMA WATANABE — Living Light · shared behavior
   parallax · scroll reveals · mobile nav
   ============================================================ */
(function(){
  /* ---- mobile nav ---- */
  function initNav(){
    var nav=document.querySelector('.nav');
    if(!nav)return;
    var burger=nav.querySelector('.nav-burger');
    if(burger){
      burger.addEventListener('click',function(){nav.classList.toggle('open')});
      nav.querySelectorAll('.nav-links a').forEach(function(a){
        a.addEventListener('click',function(){nav.classList.remove('open')});
      });
    }
  }

  /* ---- parallax on .bleed[data-parallax] ---- */
  function initParallax(){
    var layers=[].slice.call(document.querySelectorAll('[data-parallax]'));
    if(!layers.length)return;
    var ticking=false;
    function frame(){
      var vh=window.innerHeight;
      layers.forEach(function(l){
        var sec=l.parentElement;
        var r=sec.getBoundingClientRect();
        if(r.bottom<-200||r.top>vh+200)return;
        var prog=(r.top+r.height/2-vh/2)/vh;
        var amt=parseFloat(l.getAttribute('data-parallax'))*vh;
        l.style.transform='translateY('+(prog*amt*-1).toFixed(1)+'px)';
      });
      ticking=false;
    }
    function onScroll(){if(!ticking){requestAnimationFrame(frame);ticking=true;}}
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',frame);
    frame();
  }

  /* ---- reveals (robust: IO + scroll + safety force) ---- */
  function initReveals(){
    var items=[].slice.call(document.querySelectorAll('.reveal'));
    if(!items.length)return;
    items.forEach(function(el,i){el.style.transitionDelay=((i%4)*70)+'ms';});
    function show(el){el.classList.add('in');}
    function force(el){el.style.transition='none';el.style.opacity='1';el.style.transform='none';}
    function check(){
      var vh=window.innerHeight;
      items.forEach(function(el){
        if(el.classList.contains('in'))return;
        var r=el.getBoundingClientRect();
        if(r.top<vh*0.92&&r.bottom>0)show(el);
      });
    }
    if('IntersectionObserver'in window){
      var io=new IntersectionObserver(function(es){
        es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});
      },{threshold:0.05,rootMargin:'0px 0px -7% 0px'});
      items.forEach(function(el){io.observe(el);});
    }
    window.addEventListener('scroll',check,{passive:true});
    window.addEventListener('load',check);
    requestAnimationFrame(function(){check();requestAnimationFrame(check);});
    setTimeout(function(){items.forEach(force);},1600);
  }

  /* ---- bilingual EN | JP ---- */
  function setLang(l){
    var jp=(l==='jp');
    document.documentElement.classList.toggle('lang-jp',jp);
    document.documentElement.setAttribute('lang',jp?'ja':'en');
    try{localStorage.setItem('tw-lang',l);}catch(e){}
    [].forEach.call(document.querySelectorAll('.lang-toggle button'),function(b){
      b.classList.toggle('on',b.getAttribute('data-setlang')===l);
    });
    /* swapped-in text must not be stuck at opacity:0 */
    [].forEach.call(document.querySelectorAll('.reveal'),function(el){el.classList.add('in');});
    window.dispatchEvent(new CustomEvent('langchange',{detail:l}));
    window.dispatchEvent(new Event('scroll'));
  }
  function initLang(){
    var saved='en';
    try{saved=localStorage.getItem('tw-lang')||'en';}catch(e){}
    setLang(saved);
    [].forEach.call(document.querySelectorAll('.lang-toggle button'),function(b){
      b.addEventListener('click',function(){setLang(b.getAttribute('data-setlang'));});
    });
  }

  /* ---- lightbox ---- */
  function initLightbox(){
    var overlay=document.createElement('div');
    overlay.id='lb-overlay';
    var img=document.createElement('img');
    var btn=document.createElement('button');
    btn.id='lb-close';btn.innerHTML='&times;';btn.setAttribute('aria-label','Close');
    overlay.appendChild(btn);overlay.appendChild(img);
    document.body.appendChild(overlay);
    function open(src,alt){img.src=src;img.alt=alt||'';overlay.classList.add('open');document.body.style.overflow='hidden';}
    function close(){overlay.classList.remove('open');document.body.style.overflow='';img.src='';}
    btn.addEventListener('click',close);
    overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    document.querySelectorAll('.bleed img, a.series img').forEach(function(el){
      el.classList.add('lb-trigger');
      el.addEventListener('click',function(e){e.preventDefault();open(el.src,el.alt);});
    });
  }

  function boot(){initNav();initLang();initParallax();initReveals();initLightbox();}
  if(document.readyState!=='loading')boot();
  else document.addEventListener('DOMContentLoaded',boot);
})();
