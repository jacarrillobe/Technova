// ===============================
// BASE DE DATOS SIMULADA - TECHNOVA SOLUTIONS
// ===============================

// Tabla de usuarios (para login del administrador)
const usuarios = [
  { id: 1, usuario: "admin", password: "admin", rol: "Administrador" },
  { id: 2, usuario: "soporte", password: "soporte", rol: "Técnico" },
  { id: 3, usuario: "Pedro", password: "1234", rol: "Usuario" },
  { id: 4, usuario: "Juan", password: "1234", rol: "Usuario" },
];

// Tabla de servicios
const servicios = [
  {
    id: 1,
    nombre: "💻 Desarrollo de aplicaciones web",
    precio: 1200000,
    cantidad: 20,
    descripcion: "Diseño y desarrollo de sitios web modernos y adaptables.",
    estado: "Activo",
    propietario: "admin"
  },
  {
    id: 2,
    nombre: "🔧 Soporte técnico remoto",
    precio: 300000,
    cantidad: 50,
    descripcion: "Atención remota para instalación y mantenimiento.",
    estado: "Promoción",
    propietario: "soporte"
  },
  {
    id: 3,
    nombre: "🎨 Diseño gráfico publicitario",
    precio: 500000,
    cantidad: 10,
    descripcion: "Creación de material visual para campañas publicitarias.",
    estado: "Activo",
    propietario: "Pedro"
  },
  {
    id: 4,
    nombre: "📱 Desarrollo de apps móviles",
    precio: 1500000,
    cantidad: 8,
    descripcion: "Aplicaciones móviles personalizadas para Android e iOS.",
    estado: "Activo",
    propietario: "Juan"
  }
];

// Función para cargar los servicios en el catálogo
function cargarServicios() {
  const contenedor = document.getElementById("lista-servicios");
  if (!contenedor) return;

  servicios.forEach(servicio => {
    const card = document.createElement("div");
    card.classList.add("col-md-3", "mb-4");
    card.innerHTML = `
      <div class="card h-100 text-center p-3">
        <h5>${servicio.nombre}</h5>
        <p><strong>Precio:</strong> $${servicio.precio.toLocaleString()} COP</p>
        <p><strong>Estado:</strong> <span class="badge bg-${servicio.estado === 'Activo' ? 'secondary' : 'success'}">${servicio.estado}</span></p>
        <a href="detalle.html" class="btn btn-outline-primary btn-sm">Ver detalle</a>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// Cargar automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", cargarServicios);
