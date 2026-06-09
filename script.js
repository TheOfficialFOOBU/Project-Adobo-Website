/*
  script.js — Basic site JS for Project Adobo
  Coded by FOOBU
  Small, readable helpers for navigation and lazy-loading images.
*/
document.addEventListener('DOMContentLoaded', () => {
  // Example: simple mobile nav toggle if you add a .nav-toggle button
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Lazy-load images with data-src
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          obs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach((i) => io.observe(i));
  } else {
    lazyImgs.forEach((i) => (i.src = i.dataset.src));
  }
});

/* Inline site script from index.html — moved here for maintainability */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle (keeps parity with inline version)
  const menuBtn = document.getElementById('menu-btn');
  const siteNav = document.getElementById('site-nav');
  menuBtn &&
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('open');
    });

  // The rest of the page script (RSVP handler, members, lightbox, etc.)
  // (Moved from inline <script> in index.html.)

  // Simple RSVP events form handling (client-side)
  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.right = '16px';
    t.style.bottom = '16px';
    t.style.padding = '12px 16px';
    t.style.background = 'linear-gradient(90deg,var(--accent),var(--accent2))';
    t.style.color = 'var(--bg)';
    t.style.borderRadius = '10px';
    t.style.zIndex = 3000;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  const RSVP_ENDPOINT = '/.netlify/functions/rsvp'; // change if you deploy elsewhere
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      const formData = Object.fromEntries(new FormData(rsvpForm).entries());
      submitBtn && (submitBtn.disabled = true);

      try {
        const res = await fetch(RSVP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await res.json();
          rsvpForm.reset();
          showToast('Thanks — RSVP received!');
          submitBtn && (submitBtn.disabled = false);
          return;
        }
      } catch (err) {
        console.warn('RSVP server error:', err);
      }

      const store = JSON.parse(localStorage.getItem('rsvps') || '[]');
      store.push(formData);
      localStorage.setItem('rsvps', JSON.stringify(store));
      rsvpForm.reset();
      showToast('Saved locally — will sync when server is available.');
      submitBtn && (submitBtn.disabled = false);
    });
  }

  // Many page helpers follow — to keep file concise they were moved verbatim.
  // (Due to size, the remaining functions were copied from the inline script.)
  // Google Calendar link generator for event buttons
  function toGCalURL(title, startIso, endIso, details = '') {
    const start = startIso.replace(/-|:|\.\d{3}/g, '');
    const end = endIso.replace(/-|:|\.\d{3}/g, '');
    const base = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({ text: title, dates: `${start}/${end}`, details });
    return `${base}&${params.toString()}`;
  }

  document.querySelectorAll('.add-gcal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.dataset.title;
      const start = btn.dataset.start;
      const end = btn.dataset.end;
      const url = toGCalURL(title, start, end, 'Adobo Guild Event');
      window.open(url, '_blank');
    });
  });

  // Smooth scroll navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Add scroll animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Guild Members Data (restored full list)
  const guildMembers = [
    {
      name: '独Sanji',
      class: 'DPS',
      position: 'Officer',
      weapon: 'Nameless Sword / Nameless Spear',
      image: 'images/members/Sanji.jpg',
      quote: 'LF partner any gender basta babae.',
    },
    {
      name: 'swaggo',
      class: 'DPS/Tank',
      position: 'Whale',
      weapon: 'Phalanxbane Blade / Heng Blade - Nameless Sword / Nameless Spear',
      image: 'images/members/Swaggo.png',
      quote: "Heir to the porcelain throne (I'm lactose intolerant).",
    },
    {
      name: 'Ambón',
      class: 'Tank',
      position: 'Member',
      weapon: 'Thundercry Mo Blade / Stormbreaker Spear - Mo Blade / Heng Blade',
      image: 'images/members/Ambon.jpg',
      quote: 'If u think about it, pinagisipan mo',
    },
    {
      name: 'AstrOphiliac',
      class: 'DPS/Healer',
      position: 'Member',
      weapon: 'Vernal Umbrella / Panacea Fan',
      image: 'images/members/Astro.png',
      quote: 'Just try and try bro, no one will judge... if there is? PUNCH THEM 😜.',
    },
    {
      name: 'LANHAO',
      class: 'DPS',
      position: 'Member',
      weapon: 'Infernal Twinblades / Snowparting Blade',
      image: 'images/members/LANHAO.jpg',
      quote: 'SPAM DEFLECT KAHIT SELOS KAYA KO DEFLECT.',
    },
    {
      name: 'Sumimasorry',
      class: 'Healer',
      position: 'Member',
      weapon: 'Soulshade Umbrella / Panacea Fan',
      image: 'images/members/Sumi.jpg',
      quote: 'Goodness gracious, ikaw yung nag shoplift ~',
    },
    {
      name: 'Aeleigh',
      class: 'DPS',
      position: 'Member',
      weapon: 'Infernal Twinblades / Martial Rope Dart',
      image: 'images/members/Aeleigh.png',
      quote: 'Bumili ako ng bituka ng butiki sa botika na nakakapagpabagabag istg fr fr',
    },
    {
      name: 'Paupauu',
      class: 'Healer',
      position: 'Member',
      weapon: 'Soulshade Umbrella / Panacea Fan',
      image: 'images/members/Paupau.jpg',
      quote: 'Hello hehe',
    },
    {
      name: 'Raissia',
      class: 'DPS',
      position: 'Member',
      weapon: 'Inkwell Fan / Vernal Umbrella',
      image: 'images/members/Raissia.png',
      quote: '^^',
    },
    {
      name: 'waterlloyd',
      class: 'DPS/Healer',
      position: 'Member',
      weapon: 'Vernal Umbrella / Panacea Fan',
      image: 'images/members/waterlloyd.jpg',
      quote: 'dili ko gahatag ug iyot (i dont give a fuck) XD',
    },
    {
      name: 'HESPERUS',
      class: 'Tank',
      position: 'Member',
      weapon: 'Thundercry Mo Blade / Stormbreaker Spear',
      image: 'images/members/HESPERUS.png',
      quote: 'TAYO AY NASA FINE DINING RESTAURANT 🤬',
    },
    {
      name: 'AutumnLeaf',
      class: 'DPS',
      position: 'Member',
      weapon: 'Nameless Sword / Nameless Spear',
      image: 'images/members/AutumnLeaf.png',
      quote: 'It is what is it',
    },
    {
      name: 'Leiselle',
      class: 'Healer',
      position: 'Member',
      weapon: 'Soulshade Umbrella / Panacea Fan',
      image: 'images/members/Leiselle.png',
      quote: 'End Me.',
    },
    {
      name: 'Heuphemia',
      class: 'Healer',
      position: 'Member',
      weapon: 'Soulshade Umbrella / Panacea Fan',
      image: 'images/members/Heuphemia.jpg',
      quote: '"..." [Time remaining: 24h0min]',
    },
    {
      name: 'shiaaaaaaa',
      class: 'DPS',
      position: 'Member',
      weapon: 'Everspring Umbrella / Unfettered Rope Darts',
      image: 'images/members/shiaaaaaaa.jpg',
      quote: '...',
    },
    {
      name: 'Raikoju',
      class: 'DPS/Healer',
      position: 'Member',
      weapon: 'Vernal Umbrella / Panacea Fan',
      image: 'images/members/Raikoju.jpg',
      quote: 'Wag ka maniniwala sa swerte, malas yan 🤧',
    },
    {
      name: 'Yeesan',
      class: 'DPS',
      position: 'Member',
      weapon: 'Heng Blade / Vernal Umbrella',
      image: 'images/members/Yeesan.png',
      quote: 'Ano ka gold?',
    },
    {
      name: 'FOOBU',
      class: 'Guild Leader',
      position: 'Guild Leader',
      weapon: '',
      image: 'images/members/FOOBU.png',
      quote: '',
    },
    {
      name: 'Maxisle',
      class: 'DPS',
      position: 'Vice Master',
      weapon: '',
      image: 'images/members/Maxisle.png',
      quote: '',
    },
    {
      name: 'Schalsweiser',
      class: 'Tank',
      position: 'Vice Master',
      weapon: '',
      image: 'images/members/Schalsweiser.png',
      quote: '',
    },
  ];

  // Pagination & search state
  let pageSize = 12;
  let currentPage = 1;
  let filteredMembers = guildMembers.slice();

  // Populate members grid
  const membersList = document.getElementById('members-list');

  // Render core members (leaders/officers) into the team grid
  function renderCoreMembers() {
    const coreContainer = document.getElementById('core-members-list');
    if (!coreContainer) return;
    coreContainer.innerHTML = '';
    const core = guildMembers.filter((m) =>
      ['Guild Leader', 'Vice Master', 'Officer'].includes(m.position)
    );
    core.forEach((member) => {
      const el = document.createElement('div');
      el.className = 'team-member';
      const base = member.image ? member.image.replace(/\.(jpg|jpeg|png)$/i, '') : '';
      const pic = document.createElement('picture');
      const srcWebp = document.createElement('source');
      srcWebp.type = 'image/webp';
      srcWebp.srcset = `${base}-640.webp 640w, ${base}-1024.webp 1024w`;
      srcWebp.sizes = '(max-width:600px) 100vw, 220px';
      const img = document.createElement('img');
      img.src = member.image;
      img.alt = member.name;
      img.width = 320;
      img.height = 320;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.width = '100%';
      img.style.height = 'auto';
      pic.appendChild(srcWebp);
      pic.appendChild(img);
      el.appendChild(pic);
      const name = document.createElement('h4');
      name.textContent = member.name;
      el.appendChild(name);
      const pos = document.createElement('div');
      pos.className = 'member-position';
      pos.textContent = member.position;
      el.appendChild(pos);
      const cls = document.createElement('div');
      cls.className = 'member-class';
      cls.textContent = member.class;
      el.appendChild(cls);
      if (member.weapon) {
        const w = document.createElement('div');
        w.className = 'member-weapon';
        w.textContent = member.weapon;
        el.appendChild(w);
      }
      if (member.quote) {
        const q = document.createElement('p');
        q.textContent = member.quote;
        el.appendChild(q);
      }
      coreContainer.appendChild(el);
      // Attach fallback handlers
      img.addEventListener('error', () => tryAlternateSources(img));
    });
  }

  // Helper: reveal a picture when its <img> is loaded (handles cached images too)
  function revealPictureOnLoad(img, picture) {
    const done = () => {
      const bgEl = picture.querySelector('.skeleton-bg');
      if (bgEl) bgEl.classList.add('hidden');
      picture.classList.remove('skeleton');
      picture.classList.add('loaded');
      img.style.opacity = '1';
    };
    if (img.complete && img.naturalWidth > 1) {
      done();
      return;
    }
    img.addEventListener('load', done, { once: true });
  }

  // Helper: try alternate extensions when an image fails to load
  function tryAlternateSources(img) {
    const orig = img.getAttribute('data-orig') || img.src;
    const base = orig.replace(/\.(webp|png|jpe?g)$/i, '');
    const attempts = [
      `${base}.png`,
      `${base}.jpg`,
      `${base}.jpeg`,
      `${base}-lossless-1600.webp`,
      `${base}-1600.webp`,
    ];
    const tryExtras = [];
    attempts.forEach((a) => {
      tryExtras.push(`./${a}`);
      tryExtras.push(window.location.origin + '/' + a.replace(/^\//, ''));
    });
    const allAttempts = attempts.concat(tryExtras);
    let idx = 0;
    img.onerror = null; // avoid recursion
    const tryNext = () => {
      if (idx >= allAttempts.length) {
        const name = img.alt || '';
        const initials = (
          name
            .split(' ')
            .map((s) => s[0])
            .join('') || ''
        )
          .slice(0, 2)
          .toUpperCase();
        const bg = '#1a1a1a';
        const fg = '#e9e9e9';
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' font-family='${encodeURIComponent("Inter, system-ui, -apple-system, 'Segoe UI', Roboto")}' font-size='140' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${initials}</text></svg>`;
        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        img.onerror = null;
        const pic = img.closest('picture');
        if (pic) {
          pic.querySelector('.skeleton-bg')?.classList.add('hidden');
          pic.classList.remove('skeleton');
          pic.classList.add('loaded');
        }
        return;
      }
      img.src = allAttempts[idx++];
      img.onerror = tryNext;
    };
    tryNext();
  }

  // Diagnostics overlay
  function runImageDiagnostics() {
    const imgs = Array.from(
      document.querySelectorAll('#members-list img, .team-member img, .leader-avatar')
    );
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.right = '12px';
    panel.style.bottom = '12px';
    panel.style.maxWidth = '320px';
    panel.style.maxHeight = '40vh';
    panel.style.overflow = 'auto';
    panel.style.zIndex = 9999;
    panel.style.padding = '8px';
    panel.style.background = 'rgba(0,0,0,0.7)';
    panel.style.color = '#fff';
    panel.style.fontSize = '12px';
    panel.style.borderRadius = '8px';
    panel.innerHTML = '<strong>Image diagnostics</strong><br>';
    document.body.appendChild(panel);
    imgs.forEach((img) => {
      const url = img.getAttribute('data-orig') || img.src;
      fetch(url, { method: 'HEAD' })
        .then((r) => {
          const item = document.createElement('div');
          item.textContent = `${url} → ${r.status} ${r.statusText}`;
          panel.appendChild(item);
          if (!r.ok) {
            const note = document.createElement('div');
            note.style.color = '#f99';
            note.textContent = '(attempting fallbacks)';
            panel.appendChild(note);
            tryAlternateSources(img);
          }
        })
        .catch(() => {
          const item = document.createElement('div');
          item.textContent = `${url} → network/CORS error`;
          item.style.color = '#f99';
          panel.appendChild(item);
          tryAlternateSources(img);
        });
    });
    setTimeout(() => panel.remove(), 12000);
  }
  // expose for manual debugging
  window.runImageDiagnostics = runImageDiagnostics;

  // Attach static image fallbacks
  function attachStaticImageFallbacks() {
    document.querySelectorAll('.team-member img, .member-card img').forEach((i) => {
      i.setAttribute('data-orig', i.src);
      i.addEventListener('error', () => tryAlternateSources(i));
      const pic = i.closest('picture');
      if (pic) revealPictureOnLoad(i, pic);
    });
  }

  function renderMembers(members = filteredMembers, page = currentPage) {
    membersList.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageSlice = members.slice(start, start + pageSize);
    pageSlice.forEach((member) => {
      const memberCard = document.createElement('div');
      memberCard.className = 'member-card';
      const imgBase = member.image.replace(/\.(jpg|jpeg|png)$/i, '');
      const picture = document.createElement('picture');
      picture.className = 'skeleton-wrap';
      const ext = (member.image || '').toLowerCase().endsWith('.png') ? 'png' : 'jpg';
      const srcFallback = document.createElement('source');
      srcFallback.type = ext === 'png' ? 'image/png' : 'image/jpeg';
      srcFallback.srcset = new URL(member.image, window.location.href).href;
      const img = document.createElement('img');
      img.src = new URL(member.image, window.location.href).href;
      img.style.opacity = '0';
      const lq = member.image ? new URL(`${imgBase}-320.webp`, window.location.href).href : null;
      if (lq) {
        const bg = document.createElement('div');
        bg.className = 'skeleton-bg';
        bg.style.backgroundImage = `url(${lq})`;
        picture.appendChild(bg);
      }
      revealPictureOnLoad(img, picture);
      img.setAttribute('data-orig', img.src);
      img.addEventListener('error', () => tryAlternateSources(img));
      picture.classList.add('skeleton');
      img.dataset.full = `${imgBase}-lossless-1600.webp`;
      img.classList.add('lightbox-target');
      img.alt = member.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.appendChild(srcFallback);
      picture.appendChild(img);
      memberCard.appendChild(picture);
      memberCard.insertAdjacentHTML(
        'beforeend',
        `
          <h5>${member.name}</h5>
          <div class="member-position">${member.position}</div>
          <div class="member-class">${member.class}</div>
          <div class="member-weapon">⚔️ ${member.weapon}</div>
          <div class="member-quote">"${member.quote}"</div>
          <div style="margin-top:0.75rem"><button class="cta-button profile-btn" type="button">Profile</button></div>
        `
      );
      membersList.appendChild(memberCard);
      const btn = memberCard.querySelector('.profile-btn');
      if (btn) btn.addEventListener('click', () => openMemberProfile(member));
    });
    renderPagination(Math.ceil(members.length / pageSize), page);
  }

  function renderPagination(totalPages, page) {
    let pag = document.getElementById('members-pagination');
    if (!pag) {
      pag = document.createElement('div');
      pag.id = 'members-pagination';
      pag.style.display = 'flex';
      pag.style.gap = '8px';
      pag.style.justifyContent = 'center';
      pag.style.marginTop = '1rem';
      membersList.parentNode.appendChild(pag);
    }
    pag.innerHTML = '';
    if (totalPages <= 1) return;
    const prev = document.createElement('button');
    prev.className = 'cta-button small';
    prev.textContent = 'Prev';
    prev.disabled = page <= 1;
    prev.addEventListener('click', () => {
      currentPage = Math.max(1, page - 1);
      renderMembers(filteredMembers, currentPage);
    });
    pag.appendChild(prev);

    const info = document.createElement('div');
    info.textContent = `Page ${page} of ${totalPages}`;
    info.style.alignSelf = 'center';
    pag.appendChild(info);

    const next = document.createElement('button');
    next.className = 'cta-button small';
    next.textContent = 'Next';
    next.disabled = page >= totalPages;
    next.addEventListener('click', () => {
      currentPage = Math.min(totalPages, page + 1);
      renderMembers(filteredMembers, currentPage);
    });
    pag.appendChild(next);
  }

  // Run static fallback attachment
  attachStaticImageFallbacks();
  // Initial filtered set and render
  filteredMembers = guildMembers.slice();
  renderMembers(filteredMembers, currentPage);

  // After initial render, verify member images load on hosted environment (GitHub Pages)
  function checkAndFixImage(img) {
    if (!img || !img.src) return;
    fetch(img.src, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) tryAlternateSources(img);
      })
      .catch(() => {
        tryAlternateSources(img);
      });
  }

  function verifyAllMemberImages() {
    document
      .querySelectorAll('#members-list img, .team-member img, .leader-avatar')
      .forEach((img) => {
        setTimeout(() => checkAndFixImage(img), 150);
      });
  }

  verifyAllMemberImages();

  // MEMBER SEARCH
  function debounce(fn, wait = 200) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  const memberSearch = document.getElementById('member-search');
  const clearSearch = document.getElementById('clear-search');
  function applySearch() {
    const q = (memberSearch.value || '').trim().toLowerCase();
    if (!q) {
      filteredMembers = guildMembers.slice();
      currentPage = 1;
      return renderMembers(filteredMembers, currentPage);
    }
    filteredMembers = guildMembers.filter((m) => {
      return [m.name, m.class, m.position, m.weapon].join(' ').toLowerCase().includes(q);
    });
    currentPage = 1;
    renderMembers(filteredMembers, currentPage);
  }
  memberSearch && memberSearch.addEventListener('input', debounce(applySearch, 200));
  clearSearch &&
    clearSearch.addEventListener('click', () => {
      memberSearch.value = '';
      applySearch();
      memberSearch.focus();
    });

  // MEMBER PROFILE MODAL
  const memberModal = document.getElementById('member-modal');
  const closeMemberModal = document.getElementById('close-member-modal');
  const memberModalName = document.getElementById('member-modal-name');
  const memberModalAvatar = document.getElementById('member-modal-avatar');
  const memberModalPosition = document.getElementById('member-modal-position');
  const memberModalClass = document.getElementById('member-modal-class');
  const memberModalQuote = document.getElementById('member-modal-quote');
  const memberModalProfilelink = document.getElementById('member-modal-profilelink');

  function openMemberProfile(member) {
    memberModal.setAttribute('aria-hidden', 'false');
    memberModal.style.display = 'block';
    memberModalName.textContent = member.name;
    memberModalAvatar.src = member.image;
    memberModalAvatar.alt = member.name;
    memberModalPosition.textContent = member.position;
    memberModalClass.textContent = member.class + ' • ' + member.weapon;
    memberModalQuote.textContent = `"${member.quote}"`;
    memberModalProfilelink.href = '#';
    document.body.style.overflow = 'hidden';
  }

  function closeMember() {
    memberModal.setAttribute('aria-hidden', 'true');
    memberModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  closeMemberModal.addEventListener('click', closeMember);
  window.addEventListener('click', (e) => {
    if (e.target === memberModal) closeMember();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && memberModal.style.display === 'block') closeMember();
  });

  // Sorting functionality
  const sortSelect = document.getElementById('sort-select');
  sortSelect &&
    sortSelect.addEventListener('change', (e) => {
      const sortBy = e.target.value;
      let sortedMembers = [...guildMembers];
      switch (sortBy) {
        case 'name':
          sortedMembers.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'position': {
          const positionOrder = { 'Guild Leader': 1, 'Vice Master': 2, Officer: 3, Member: 4 };
          sortedMembers.sort((a, b) => positionOrder[a.position] - positionOrder[b.position]);
          break;
        }
        case 'class':
          sortedMembers.sort((a, b) => a.class.localeCompare(b.class));
          break;
        case 'weapon':
          sortedMembers.sort((a, b) => a.weapon.localeCompare(b.weapon));
          break;
      }
      renderMembers(sortedMembers);
    });

  // Toggle members grid functionality
  const toggleBtn = document.getElementById('toggle-members-btn');
  const allMembersGrid = document.getElementById('all-members-grid');
  toggleBtn &&
    toggleBtn.addEventListener('click', () => {
      allMembersGrid.classList.toggle('expanded');
      toggleBtn.textContent = allMembersGrid.classList.contains('expanded')
        ? 'Hide All Members'
        : 'View All Members';
    });

  // Contact Leader Modal functionality
  const contactModal = document.getElementById('contact-modal');
  const contactLeaderBtn = document.getElementById('contact-leader-btn');
  const closeModal = document.querySelector('.close-modal');
  contactLeaderBtn &&
    contactLeaderBtn.addEventListener('click', () => {
      contactModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  closeModal &&
    closeModal.addEventListener('click', () => {
      contactModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      contactModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.style.display === 'block') {
      contactModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // LIGHTBOX FUNCTIONALITY
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.querySelector('#lightbox .lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let lbTargets = [];
  function refreshLightboxTargets() {
    lbTargets = Array.from(document.querySelectorAll('.lightbox-target'));
  }
  refreshLightboxTargets();
  function openLightbox(src, caption) {
    lbImage.src = src;
    lbImage.alt = caption || '';
    lbCaption.textContent = caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    document.body.style.overflow = 'auto';
  }
  function currentIndex() {
    return lbTargets.findIndex((t) => t.dataset.full === lbImage.src || t.src === lbImage.src);
  }
  function showPrev() {
    const i = currentIndex();
    if (i > 0) {
      const t = lbTargets[i - 1];
      openLightbox(t.dataset.full || t.src, t.alt || '');
    }
  }
  function showNext() {
    const i = currentIndex();
    if (i < lbTargets.length - 1) {
      const t = lbTargets[i + 1];
      openLightbox(t.dataset.full || t.src, t.alt || '');
    }
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.lightbox-target');
    if (!t) return;
    e.preventDefault();
    refreshLightboxTargets();
    openLightbox(t.dataset.full || t.src, t.alt || t.getAttribute('title') || '');
  });
  lbClose && lbClose.addEventListener('click', closeLightbox);
  lightbox &&
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  lbPrev && lbPrev.addEventListener('click', showPrev);
  lbNext && lbNext.addEventListener('click', showNext);
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
  });

  // Initialize skeletons for existing project images
  function initSkeletons() {
    document.querySelectorAll('picture.skeleton-wrap img').forEach((img) => {
      const pic = img.closest('picture');
      const lqip = img.dataset.lqip || img.getAttribute('data-lqip');
      if (lqip && !pic.querySelector('.skeleton-bg')) {
        const bg = document.createElement('div');
        bg.className = 'skeleton-bg';
        bg.style.backgroundImage = `url(${lqip})`;
        pic.appendChild(bg);
      }
      if (img.complete && img.naturalWidth > 1) {
        const bgEl = pic.querySelector('.skeleton-bg');
        if (bgEl) bgEl.classList.add('hidden');
        pic.classList.add('loaded');
        img.style.opacity = '1';
      } else {
        pic.classList.add('skeleton');
        img.style.opacity = '0';
        img.addEventListener(
          'load',
          () => {
            const bgEl = pic.querySelector('.skeleton-bg');
            if (bgEl) bgEl.classList.add('hidden');
            pic.classList.remove('skeleton');
            pic.classList.add('loaded');
            img.style.opacity = '1';
          },
          { once: true }
        );
      }
    });
  }

  // Run after DOM ready
  initSkeletons();
});
