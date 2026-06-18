// App logic: load products, render pages, cart, admin
const BASE = '/mouse-site';
const PRODUCTS_JSON = BASE + '/products.json';
const CART_KEY = 'nm_cart_v1';
const ADMIN_KEY = 'nm_products_edit_v1';
let products = [];

async function loadProducts() {
  // if admin edits exist in localStorage, use them
  const edited = localStorage.getItem(ADMIN_KEY);
  if (edited) {
    try {
      products = JSON.parse(edited);
      return products;
    } catch (e) { console.warn('Invalid edited products JSON'); }
  }

  const res = await fetch(PRODUCTS_JSON);
  products = await res.json();
  return products;
}

function findProduct(id) { return products.find(p => p.id === id); }

// Cart helpers
function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; } }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((s,n)=>s+n,0);
  countEl.textContent = count;
}

function addToCart(id, qty=1) {
  const cart = getCart();
  cart[id] = (cart[id]||0) + qty;
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
}

function clearCart() { localStorage.removeItem(CART_KEY); updateCartCount(); }

// Render product grid (used on index and products page)
function renderGrid(rootId, list) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-thumb"><img src="${p.image}" alt="${p.name}" /></div>
      <div class="product-title">${p.name}</div>
      <div class="specs">${p.type} • ${p.dpi} • ${p.weight}</div>
      <div class="product-actions">
        <a class="btn-ghost" href="${BASE}/product.html#${p.id}">Learn more</a>
        <button class="btn-primary" data-buy="${p.id}">${p.priceLabel || ('$'+p.price)}</button>
      </div>
    `;
    root.appendChild(card);
  });
}

// Product detail render
function renderProductDetail(id) {
  const root = document.getElementById('product-root');
  if (!root) return;
  const p = findProduct(id);
  if (!p) { root.innerHTML = '<p>Product not found.</p>'; return; }
  root.innerHTML = `
    <div class="product-detail-grid">
      <div style="max-width:640px"><img src="${p.image}" alt="${p.name}" style="width:100%;border-radius:12px;box-shadow:var(--shadow)"/></div>
      <div style="padding:18px 0;">
        <h2>${p.name}</h2>
        <p class="specs">${p.type} • ${p.dpi} • ${p.weight}</p>
        <p style="margin:16px 0">${p.desc}</p>
        <div style="display:flex;gap:12px;align-items:center"><button class="btn-primary" id="buy-now">${p.priceLabel || ('$'+p.price)}</button> <button class="btn-ghost" id="add-one">Add +1</button></div>
      </div>
    </div>
  `;
  document.getElementById('buy-now').addEventListener('click', ()=>{ addToCart(p.id,1); alert('Added to cart'); });
  document.getElementById('add-one').addEventListener('click', ()=>{ addToCart(p.id,1); });
}

// Cart page render
function renderCartPage() {
  const root = document.getElementById('cart-root');
  if (!root) return;
  const cart = getCart();
  const ids = Object.keys(cart);
  if (ids.length === 0) { root.innerHTML = '<p>Your cart is empty.</p>'; return; }
  root.innerHTML = '';
  let total = 0;
  ids.forEach(id => {
    const p = findProduct(id);
    const qty = cart[id];
    const row = document.createElement('div');
    row.className = 'cart-row';
    const price = (p && p.price) ? p.price * qty : 0;
    total += price;
    row.innerHTML = `
      <img src="${p ? p.image : ''}" alt="${p ? p.name : id}" />
      <div style="flex:1">
        <div style="font-weight:600">${p ? p.name : id}</div>
        <div class="specs">${p ? p.priceLabel || ('$'+p.price) : ''} × ${qty}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:600">${p ? ('$'+(p.price*qty).toFixed(2)) : ''}</div>
        <button class="btn-ghost" data-remove="${id}">Remove</button>
      </div>
    `;
    root.appendChild(row);
  });
  const totalEl = document.createElement('div');
  totalEl.style.marginTop = '12px';
  totalEl.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  root.appendChild(totalEl);

  // remove handlers
  root.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', (e)=>{ removeFromCart(e.target.dataset.remove); renderCartPage(); }));
}

// Admin UI
function initAdmin() {
  const form = document.getElementById('product-form');
  const list = document.getElementById('admin-list');
  const resetBtn = document.getElementById('reset-products');
  const exportBtn = document.getElementById('export-json');
  const resetForm = document.getElementById('reset-form');

  function refreshList() {
    list.innerHTML = '';
    products.forEach(p => {
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.innerHTML = `<div>${p.name} <span class="specs">${p.type} • ${p.priceLabel||('$'+p.price)}</span></div><div><button data-edit="${p.id}" class="btn-ghost">Edit</button> <button data-delete="${p.id}" class="btn-ghost">Delete</button></div>`;
      list.appendChild(item);
    });
    list.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', (e)=>{ const id=e.target.dataset.edit; const p=findProduct(id); if(p){ fillForm(p);} }));
    list.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', (e)=>{ const id=e.target.dataset.delete; products = products.filter(x=>x.id!==id); localStorage.setItem(ADMIN_KEY, JSON.stringify(products)); refreshList(); }));
  }

  function fillForm(p){
    form.id.value = p.id; form.name.value = p.name; form.image.value = p.image; form.price.value = p.price; form.priceLabel.value = p.priceLabel || ('$'+p.price); form.dpi.value = p.dpi; form.weight.value = p.weight; form.type.value = p.type; form.desc.value = p.desc;
  }

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const fd = new FormData(form);
    const obj = {};
    for (const [k,v] of fd.entries()) obj[k]=v;
    // coerce price
    obj.price = Number(obj.price) || 0;
    if (!obj.priceLabel) obj.priceLabel = '$'+obj.price;
    const existing = findProduct(obj.id);
    if (existing) {
      Object.assign(existing, obj);
    } else {
      products.push(obj);
    }
    localStorage.setItem(ADMIN_KEY, JSON.stringify(products));
    refreshList();
    form.reset();
  });

  resetForm.addEventListener('click', ()=>form.reset());

  exportBtn.addEventListener('click', ()=>{
    const data = JSON.stringify(products, null, 2);
    const el = document.createElement('textarea'); el.value = data; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); alert('Products JSON copied to clipboard — paste into products.json in the repo to persist.');
  });

  resetBtn.addEventListener('click', ()=>{ localStorage.removeItem(ADMIN_KEY); loadProducts().then(()=>{ refreshList(); alert('Reset to default products.json'); }); });

  refreshList();
}

// Search / filter helpers
function applyFilters(list) {
  const search = document.getElementById('search') ? document.getElementById('search').value.toLowerCase() : '';
  const type = document.getElementById('filter-type') ? document.getElementById('filter-type').value : '';
  const sort = document.getElementById('sort') ? document.getElementById('sort').value : 'default';
  let out = list.slice();
  if (search) out = out.filter(p => (p.name||'').toLowerCase().includes(search) || (p.desc||'').toLowerCase().includes(search));
  if (type) out = out.filter(p => (p.type||'').toLowerCase() === type.toLowerCase());
  if (sort === 'price-asc') out.sort((a,b)=> (a.price||0)-(b.price||0));
  if (sort === 'price-desc') out.sort((a,b)=> (b.price||0)-(a.price||0));
  return out;
}

// Init across pages
document.addEventListener('DOMContentLoaded', async ()=>{
  await loadProducts();
  updateCartCount();
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  // nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.nav');
  navToggle && navToggle.addEventListener('click', ()=>nav.classList.toggle('show'));

  // render on index or products
  if (document.getElementById('product-grid')) {
    const filtered = applyFilters(products);
    renderGrid('product-grid', filtered);

    // bind filters
    const inputs = ['search','filter-type','sort'];
    inputs.forEach(id => { const el=document.getElementById(id); if(el) el.addEventListener('input', ()=>{ renderGrid('product-grid', applyFilters(products)); }); });

    // bind buy buttons
    document.getElementById('product-grid').addEventListener('click', (e)=>{
      const id = e.target.dataset.buy;
      if (id) { addToCart(id,1); alert('Added to cart'); }
    });
  }

  // product detail page
  if (document.getElementById('product-root')) {
    const id = location.hash.replace('#','') || new URLSearchParams(location.search).get('id');
    if (id) renderProductDetail(id);
  }

  // cart page
  if (document.getElementById('cart-root')) {
    renderCartPage();
    document.getElementById('clear-cart') && document.getElementById('clear-cart').addEventListener('click', ()=>{ clearCart(); renderCartPage(); });
    document.getElementById('checkout') && document.getElementById('checkout').addEventListener('click', ()=>{ alert('This is a mock checkout. No payment is taken.'); clearCart(); renderCartPage(); });
  }

  // admin
  if (document.getElementById('admin-list')) {
    initAdmin();
  }

});
