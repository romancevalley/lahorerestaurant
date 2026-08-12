document.addEventListener('DOMContentLoaded', function(){

  // ============================================================
  // BILINGUAL SYSTEM (PL default / EN toggle)
  // ============================================================
  const SEO = {
    pl: {
      title: "Restauracja Lahore Warszawa | Autentyczna Kuchnia Pakistańska, BBQ i Biryani",
      desc: "Restauracja Lahore w Warszawie — kinowa podróż kulinarna po Pakistanie. BBQ, Karahi, Biryani, Nihari i Tandoori. Zarezerwuj stolik lub zamów online.",
      ogTitle: "Lahore Restaurant | Poczuj smak serca Pakistanu w Warszawie",
      ogDesc: "Kinowa restauracja pakistańska w Warszawie. BBQ, Karahi, Biryani, Nihari, Tandoori — dziedzictwo podane z luksusem.",
      locale: "pl_PL"
    },
    en: {
      title: "Lahore Restaurant Warsaw | Authentic Pakistani Cuisine, BBQ & Biryani",
      desc: "Lahore Restaurant Warsaw — a cinematic Pakistani fine-dining destination for BBQ, Karahi, Biryani, Nihari & Tandoori. Reserve your table or order online.",
      ogTitle: "Lahore Restaurant | Taste the Heart of Pakistan in Warsaw",
      ogDesc: "A cinematic Pakistani fine-dining destination in Warsaw. BBQ, Karahi, Biryani, Nihari, Tandoori — crafted with heritage and served with luxury.",
      locale: "en_US"
    }
  };

  function getSavedLang(){
    const cookieMatch = document.cookie.match(/(?:^|; )lrLang=([^;]+)/);
    if(cookieMatch) return decodeURIComponent(cookieMatch[1]);
    const stored = localStorage.getItem('lrLang');
    if(stored) return stored;
    return 'pl'; // Polish is the default language
  }

  function applyLang(lang){
    document.querySelectorAll('[data-en]').forEach(el => {
      const val = lang === 'en' ? el.dataset.en : el.dataset.pl;
      if(val === undefined) return;
      if(el.hasAttribute('data-html')){
        el.innerHTML = val.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
      } else {
        el.textContent = val.replace(/&amp;/g,'&').replace(/&quot;/g,'"');
      }
    });
    document.querySelectorAll('[data-en-ph]').forEach(el => {
      el.setAttribute('placeholder', lang === 'en' ? el.dataset.enPh : el.dataset.plPh);
    });
    document.documentElement.lang = lang;
    const s = SEO[lang];
    document.getElementById('pageTitle').textContent = s.title;
    document.getElementById('metaDesc').setAttribute('content', s.desc);
    document.getElementById('ogTitleTag').setAttribute('content', s.ogTitle);
    document.getElementById('ogDesc').setAttribute('content', s.ogDesc);
    document.getElementById('twTitle').setAttribute('content', s.ogTitle);
    document.getElementById('twDesc').setAttribute('content', s.ogDesc);
    document.getElementById('ogLocale').setAttribute('content', s.locale);
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    localStorage.setItem('lrLang', lang);
    document.cookie = 'lrLang=' + lang + '; path=/; max-age=31536000';
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  applyLang(getSavedLang());

  // ---- Preloader ----
  window.addEventListener('load', function(){
    setTimeout(function(){ document.getElementById('preloader').classList.add('hidden'); }, 400);
  });

  // ---- Header scroll state + progress bar + parallax + back-to-top ----
  const header = document.getElementById('siteHeader');
  const heroBg = document.getElementById('heroBg');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    if(heroBg) heroBg.style.transform = 'translateY(' + (y * 0.35) + 'px)';
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    backToTop.classList.toggle('show', y > 700);
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function(){
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('active'));
    l.classList.add('active');
  }));

  // ---- Scroll reveal ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- Animated counters ----
  const counters = document.querySelectorAll('.count');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let cur = 0; const step = Math.max(1, target/60);
        const t = setInterval(() => {
          cur += step;
          if(cur >= target){ cur = target; clearInterval(t); }
          el.textContent = Math.floor(cur).toLocaleString();
        }, 22);
        counterIO.unobserve(el);
      }
    });
  }, {threshold:.5});
  counters.forEach(c => counterIO.observe(c));

  // ---- Testimonials slider ----
const track = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const slides = track.children.length;

let idx = 0;

// Create dots
for (let i = 0; i < slides; i++) {
  const b = document.createElement('button');

  if (i === 0) {
    b.classList.add('active');
  }

  b.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(b);
}

// Move slider
function goTo(i) {
  idx = i;

  track.style.transform = `translateX(-${i * 100}%)`;

  [...dotsWrap.children].forEach((dot, di) => {
    dot.classList.toggle('active', di === i);
  });
}

// Start
goTo(0);

// Auto slide every 6 seconds
setInterval(() => {
  goTo((idx + 1) % slides);
}, 6000);

  // ---- Menu tabs ----
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.menu-category').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('cat-' + tab.dataset.cat).classList.add('active');
    });
  });

  // ---- Gallery filters ----
  document.querySelectorAll('.gfilter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gfilter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('#galleryMasonry figure').forEach(fig => {
        fig.style.display = (f==='all' || fig.dataset.cat===f) ? '' : 'none';
      });
    });
  });

  // ---- Contact form tabs ----
  document.querySelectorAll('.form-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.form-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.form-panel').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector('.form-panel[data-panel="'+tab.dataset.panel+'"]').classList.add('active');
      document.getElementById('formSuccess').classList.remove('show');
    });
  });

  // ---- Form validation + success ----
  function validateForm(form){
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.field');
      let ok = input.value.trim() !== '';
      if(input.type === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if(input.type === 'tel' && ok) ok = input.value.replace(/\D/g,'').length >= 7;
      field.classList.toggle('error', !ok);
      if(!ok) valid = false;
    });
    return valid;
  }
  ['reservationForm','generalForm'].forEach(id => {
    const form = document.getElementById(id);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(validateForm(form)){
        document.getElementById('formSuccess').classList.add('show');
        form.reset();
        form.querySelectorAll('.field').forEach(f=>f.classList.remove('error'));
      }
    });
  });
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', function(e){
    e.preventDefault();
    newsletterForm.querySelector('input').value = '';
    newsletterForm.querySelector('button').innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(()=> newsletterForm.querySelector('button').innerHTML = '<i class="fa-solid fa-paper-plane"></i>', 2000);
  });

  // ---- Reservation countdown (counts down to 23:00 today) ----
  function updateCountdown(){
    const now = new Date();
    const end = new Date();
    end.setHours(23,0,0,0);
    if(end <= now) end.setDate(end.getDate()+1);
    const diff = end - now;
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    document.getElementById('cdHours').textContent = String(h).padStart(2,'0');
    document.getElementById('cdMins').textContent = String(m).padStart(2,'0');
    document.getElementById('cdSecs').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---- Active nav link on scroll ----
  const sections = ['home','menu','about','gallery','contact'].map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+entry.target.id));
      }
    });
  }, {threshold:.4});
  sections.forEach(s => navIO.observe(s));

});