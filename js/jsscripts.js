// scripts.js - datos iniciales y funciones
(function init(){
  if(!localStorage.getItem('tn_services')) {
    const initial = [
      {id:1,name:'Desarrollo de aplicaciones web',price:1200,qty:10,desc:'Aplicaciones web a medida, front y backend.',promo:false},
      {id:2,name:'Soporte técnico remoto',price:300,qty:50,desc:'Soporte 24/7 remoto para incidencias.',promo:true},
      {id:3,name:'Consultoría en ciberseguridad',price:800,qty:8,desc:'Evaluación y mitigación de riesgos informáticos.',promo:false},
      {id:4,name:'Desarrollo de apps móviles',price:1500,qty:6,desc:'Apps iOS/Android híbridas o nativas.',promo:true},
      {id:5,name:'Implementación de servidores cloud',price:2000,qty:4,desc:'Infraestructura cloud en AWS/GCP/Azure.',promo:false},
      {id:6,name:'Administración de redes',price:1000,qty:12,desc:'Diseño y administración de redes LAN/WAN.',promo:false},
      {id:7,name:'Diseño UI/UX',price:600,qty:20,desc:'Prototipado, wireframes y diseño visual.',promo:false},
      {id:8,name:'Auditoría informática',price:700,qty:10,desc:'Auditorías y cumplimiento normativo.',promo:false},
      {id:9,name:'Integración de IoT',price:1800,qty:3,desc:'Soluciones IoT para monitoreo y control.',promo:false},
      {id:10,name:'Capacitación en software',price:500,qty:30,desc:'Cursos presenciales y virtuales por módulo.',promo:true}
    ];
    localStorage.setItem('tn_services', JSON.stringify(initial));
  }
  if(!localStorage.getItem('tn_users')) {
    const users = [
      {id:1,username:'admin',email:'admin@technova.com',password:'admin123',role:'admin'}
    ];
    localStorage.setItem('tn_users', JSON.stringify(users));
  }
})();

// util
function getServices(){
  return JSON.parse(localStorage.getItem('tn_services')||'[]');
}
function saveServices(arr){ localStorage.setItem('tn_services', JSON.stringify(arr)); }

// Renders
function renderHomeHighlights(){
  const arr = getServices().slice(0,4);
  const container = document.getElementById('home-cards');
  if(!container) return;
  container.innerHTML = '';
  arr.forEach(s=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${s.name}</strong><div class="muted">$ ${s.price}</div>`;
    container.appendChild(card);
  });
}

function renderServiceList(){
  const arr = getServices();
  const grid = document.getElementById('services-grid');
  if(!grid) return;
  grid.innerHTML = '';
  arr.forEach(s=>{
    const el = document.createElement('div');
    el.className = 'service-card card';
    el.innerHTML = `
      <div class="thumb">${abbr(s.name)}</div>
      <div style="flex:1">
        <div class="service-name"><a href="detalle.html?id=${s.id}">${s.name}</a></div>
        <div class="service-price">$ ${s.price}</div>
        <div class="muted">${s.desc.slice(0,60)}...</div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function renderDetailFromParam(){
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));
  const arr = getServices();
  const svc = arr.find(x=>x.id===id);
  const container = document.getElementById('service-detail');
  if(!container) return;
  if(!svc){
    container.innerHTML = '<div class="card"><h2>Servicio no encontrado</h2></div>';
    return;
  }
  container.innerHTML = `
    <div class="card" style="display:flex;gap:20px;align-items:flex-start">
      <div style="width:220px"><div class="thumb" style="width:100%;height:140px;border-radius:8px">${abbr(svc.name)}</div></div>
      <div>
        <h2>${svc.name}</h2>
        <div class="muted">$ ${svc.price} · ${svc.qty} disponibles</div>
        <p style="margin-top:12px">${svc.desc}</p>
        ${svc.promo?'<div class="status-pill status-promo">Promoción</div>':''}
      </div>
    </div>
  `;
}

// admin CRUD functions
function isLoggedIn(){
  const li = localStorage.getItem('tn_logged');
  return !!li;
}
function loginAdmin(user, pass){
  const users = JSON.parse(localStorage.getItem('tn_users')||'[]');
  const u = users.find(x => (x.username === user || x.email === user) && x.password === pass);
  if(u){
    localStorage.setItem('tn_logged', JSON.stringify({id:u.id,username:u.username}));
    return true;
  }
  return false;
}
function logout(){
  localStorage.removeItem('tn_logged');
}

// helper abbr
function abbr(text){
  return text.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}

/* Admin page setup */
function setupAdminPage(){
  // elements
  const tableBody = document.querySelector('#admin-table tbody');
  const formCard = document.getElementById('admin-form');
  const btnNew = document.getElementById('btn-new');
  const form = document.getElementById('service-form');
  const btnCancel = document.getElementById('btn-cancel');
  const svcId = document.getElementById('svc-id');

  function refreshTable(){
    const arr = getServices();
    tableBody.innerHTML = '';
    arr.forEach(s=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.id}</td>
        <td>${s.name}</td>
        <td>$ ${s.price}</td>
        <td>${s.qty}</td>
        <td>${s.promo?'<span class="status-pill status-promo">Promoción</span>':'<span class="status-pill">Activo</span>'}</td>
        <td class="actions">
          <button class="btn" data-act="edit" data-id="${s.id}">✏️</button>
          <button class="btn muted" data-act="del" data-id="${s.id}">🗑️</button>
        </td>`;
      tableBody.appendChild(tr);
    });
    // attach events
    tableBody.querySelectorAll('button[data-act]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = parseInt(e.currentTarget.dataset.id);
        if(e.currentTarget.dataset.act === 'edit') openEdit(id);
        else if(e.currentTarget.dataset.act === 'del') doDelete(id);
      });
    });
  }

  function openNew(){
    svcId.value = '';
    document.getElementById('svc-name').value = '';
    document.getElementById('svc-price').value = '';
    document.getElementById('svc-qty').value = '';
    document.getElementById('svc-desc').value = '';
    document.getElementById('svc-promo').checked = false;
    document.getElementById('form-title').textContent = 'Crear Servicio';
    formCard.classList.remove('hidden');
  }
  function openEdit(id){
    const arr = getServices();
    const s = arr.find(x=>x.id===id);
    if(!s) return;
    svcId.value = s.id;
    document.getElementById('svc-name').value = s.name;
    document.getElementById('svc-price').value = s.price;
    document.getElementById('svc-qty').value = s.qty;
    document.getElementById('svc-desc').value = s.desc;
    document.getElementById('svc-promo').checked = s.promo;
    document.getElementById('form-title').textContent = 'Editar Servicio';
    formCard.classList.remove('hidden');
  }
  function doDelete(id){
    if(!confirm('¿Eliminar servicio?')) return;
    const arr = getServices().filter(x=>x.id!==id);
    saveServices(arr);
    refreshTable();
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const arr = getServices();
    const id = svcId.value ? parseInt(svcId.value) : (Math.max(0,...arr.map(x=>x.id))+1);
    const newSvc = {
      id,
      name: document.getElementById('svc-name').value.trim(),
      price: Number(document.getElementById('svc-price').value),
      qty: Number(document.getElementById('svc-qty').value),
      desc: document.getElementById('svc-desc').value.trim(),
      promo: document.getElementById('svc-promo').checked
    };
    const idx = arr.findIndex(x=>x.id===id);
    if(idx>=0) arr[idx] = newSvc; else arr.push(newSvc);
    saveServices(arr);
    formCard.classList.add('hidden');
    refreshTable();
  });
  btnNew.addEventListener('click', openNew);
  btnCancel.addEventListener('click', ()=> formCard.classList.add('hidden'));
  refreshTable();
}
