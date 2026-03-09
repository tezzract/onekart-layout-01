/* ═══════════════════════════════════════════
   VAUX — Ecommerce JavaScript
   script.js
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── CUSTOM CURSOR ─── */
  const cursor = document.getElementById('cursor');

  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .cat-card, .product-card, .nav-icon').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hovered'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hovered'); });
  });

  /* ─── SCROLL REVEAL ─── */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i * 0.08) + 's';
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

});

/* ═══════════════════════════════════════
   PRODUCT DATA (matches your site)
═══════════════════════════════════════ */
const PRODUCTS = [
  { name: 'Oversized Linen Blazer', brand: 'Maison Vaux', price: '$349', category: 'Women', tags: ['blazer','linen','jacket'], img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=120&q=70' },
  { name: 'Draped Silk Midi Dress', brand: 'Vaux Studio', price: '$189', category: 'Women', tags: ['silk','dress','midi'], img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&q=70' },
  { name: 'Butter Leather Moto Jacket', brand: 'VAUX Black', price: '$695', category: 'Men', tags: ['leather','jacket','moto'], img: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=120&q=70' },
  { name: 'Long Cashmere Coat', brand: 'Vaux Atelier', price: '$890', category: 'Women', tags: ['cashmere','coat','winter'], img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&q=70' },
  { name: "Women's Fashion Edit", brand: 'VAUX', price: 'From $89', category: 'Women', tags: ['women','fashion','new in'], img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=120&q=70' },
  { name: "Men's Collection Picks", brand: 'VAUX', price: 'From $79', category: 'Men', tags: ['men','collection','trending'], img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=120&q=70' },
  { name: 'Luxury Accessories Set', brand: 'Vaux Curated', price: '$145', category: 'Accessories', tags: ['accessories','curated'], img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=120&q=70' },
  { name: 'Premium Footwear', brand: 'VAUX Step', price: '$280', category: 'Footwear', tags: ['footwear','shoes','boots'], img: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=120&q=70' },
];

/* ═══════════════════════════════════════
   SEARCH
═══════════════════════════════════════ */
const searchOverlay = document.getElementById('searchOverlay');
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('searchResults');
const searchSuggestions = document.getElementById('searchSuggestions');
const noResults     = document.getElementById('noResults');
const noResultsQuery = document.getElementById('noResultsQuery');

document.getElementById('searchTrigger').addEventListener('click', () => {
  searchOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput.focus(), 400);
});

function closeSearch() {
  searchOverlay.classList.remove('active');
  document.body.style.overflow = '';
  searchInput.value = '';
  searchResults.innerHTML = '';
  searchResults.classList.remove('has-results');
  noResults.classList.remove('show');
  searchSuggestions.style.display = '';
}

document.getElementById('searchClose').addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closeLogin(); } });

function doSearch(query) {
  query = query.toLowerCase().trim();
  searchResults.innerHTML = '';
  searchResults.classList.remove('has-results');
  noResults.classList.remove('show');

  if (!query) {
    searchSuggestions.style.display = '';
    return;
  }
  searchSuggestions.style.display = 'none';

  const matched = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.brand.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.tags.some(t => t.includes(query))
  );

  if (matched.length === 0) {
    noResultsQuery.textContent = query;
    noResults.classList.add('show');
    return;
  }

  searchResults.classList.add('has-results');
  matched.forEach(p => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    // Highlight matched text
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const highlighted = p.name.replace(re, '<mark style="background:transparent;color:var(--gold)">$1</mark>');
    item.innerHTML = `
      <img class="result-img" src="${p.img}" alt="${p.name}" />
      <div class="result-info">
        <div class="result-brand">${p.brand} · ${p.category}</div>
        <div class="result-name">${highlighted}</div>
      </div>
      <div class="result-price">${p.price}</div>
    `;
    item.addEventListener('click', () => {
      closeSearch();
      // Navigate or open product — hook up your router here
    });
    searchResults.appendChild(item);
  });
}

// Live search
let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => doSearch(searchInput.value), 200);
});

// Submit on Enter / button
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(searchInput.value); });
document.getElementById('searchSubmit').addEventListener('click', () => doSearch(searchInput.value));

// Suggestion tags
document.querySelectorAll('.suggestion-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    searchInput.value = tag.dataset.query;
    doSearch(tag.dataset.query);
  });
});

/* ═══════════════════════════════════════
   LOGIN / REGISTER
═══════════════════════════════════════ */
const loginOverlay = document.getElementById('loginOverlay');
const modalToast   = document.getElementById('modalToast');

// Fake user store (in-memory — swap with real API)
let currentUser = null;

document.getElementById('loginTrigger').addEventListener('click', () => {
  loginOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});

function closeLogin() {
  loginOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('loginClose').addEventListener('click', closeLogin);
loginOverlay.addEventListener('click', e => { if (e.target === loginOverlay) closeLogin(); });

// Tabs
document.querySelectorAll('.modal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.modal-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
  });
});

function showToast(msg) {
  modalToast.textContent = msg;
  modalToast.style.background = '#c9a96e';
  modalToast.classList.add('show');
  setTimeout(() => modalToast.classList.remove('show'), 3000);
}

function setLoggedIn(name) {
  currentUser = name;
  document.getElementById('loginTrigger').style.display = 'none';
  const avatar = document.getElementById('userAvatar');
  avatar.style.display = 'flex';
  avatar.textContent = name.charAt(0).toUpperCase();
  avatar.title = `Signed in as ${name}`;
}

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function clearErrors() {
  document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
  document.querySelectorAll('.form-error').forEach(e => e.classList.remove('show'));
}

// Sign In
document.getElementById('loginSubmit').addEventListener('click', () => {
  clearErrors();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  let valid = true;

  if (!validateEmail(email)) {
    document.getElementById('loginEmail').classList.add('error');
    document.getElementById('loginEmailErr').classList.add('show');
    valid = false;
  }
  if (pass.length < 6) {
    document.getElementById('loginPassword').classList.add('error');
    document.getElementById('loginPassErr').classList.add('show');
    valid = false;
  }
  if (!valid) return;

  // Simulate API call
  const btn = document.getElementById('loginSubmit');
  btn.disabled = true; btn.textContent = 'Signing in…';
  setTimeout(() => {
    btn.disabled = false; btn.textContent = 'Sign In';
    showToast('Welcome back! You are now signed in.');
    const name = email.split('@')[0];
    setLoggedIn(name);
    setTimeout(closeLogin, 1800);
  }, 1200);
});

// Register
document.getElementById('registerSubmit').addEventListener('click', () => {
  clearErrors();
  const first = document.getElementById('regFirst').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPassword').value;
  let valid = true;

  if (!validateEmail(email)) {
    document.getElementById('regEmail').classList.add('error');
    document.getElementById('regEmailErr').classList.add('show');
    valid = false;
  }
  if (pass.length < 8) {
    document.getElementById('regPassword').classList.add('error');
    document.getElementById('regPassErr').classList.add('show');
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById('registerSubmit');
  btn.disabled = true; btn.textContent = 'Creating account…';
  setTimeout(() => {
    btn.disabled = false; btn.textContent = 'Create Account';
    showToast('Account created! Welcome to VAUX.');
    setLoggedIn(first || email.split('@')[0]);
    setTimeout(closeLogin, 1800);
  }, 1400);
});

// Password strength meter
document.getElementById('regPassword').addEventListener('input', function () {
  const v = this.value;
  const bar = document.getElementById('pwBar');
  let strength = 0;
  if (v.length >= 8) strength++;
  if (/[A-Z]/.test(v)) strength++;
  if (/[0-9]/.test(v)) strength++;
  if (/[^a-zA-Z0-9]/.test(v)) strength++;
  const colors = ['', '#e05555', '#e09d55', '#c9a96e', '#5a9e6f'];
  const widths = ['0%', '25%', '50%', '75%', '100%'];
  bar.style.width  = widths[strength];
  bar.style.background = colors[strength];
});