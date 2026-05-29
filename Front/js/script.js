// ==========================================
// 1. ESTADO GLOBAL (Motor de Olaf)
// ==========================================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==========================================
// 2. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // Funciones de interfaz de Javier
  navegacionFija();
  scrollNav();
  
  // Renderizamos los datos al cargar la página
  actualizarContador();
  actualizarCarritoUI(); 
});

// ==========================================
// 3. UI Y NAVEGACIÓN (Código de Javier)
// ==========================================
function navegacionFija() {
  const header = document.querySelector(".header");
  const productos = document.querySelector(".productos");

  // Validamos que existan para no causar errores en la página de carrito.html
  if (!header || !productos) return; 

  document.addEventListener("scroll", function () {
    const datos = productos.getBoundingClientRect();
    if (datos.bottom < 1) {
      header.classList.add("fixed-top");
    } else {
      header.classList.remove("fixed-top");
    }
  });
}

function scrollNav() {
  const btnVerMas = document.querySelector('#boton-ver-mas');
  if (btnVerMas) {
    btnVerMas.addEventListener('click', () => {
      const seccionTienda = document.querySelector('.ver-productos');
      if (seccionTienda) {
        seccionTienda.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}

// ==========================================
// 4. EVENTOS DE CLIC (Código de Javier + Animación de Olaf)
// ==========================================
document.addEventListener('click', (e) => {
  // --- AGREGAR AL CARRITO ---
  if (e.target.classList.contains('btn-agregar')) {
    const nombre = e.target.getAttribute('data-nombre');
    const precio = parseFloat(e.target.getAttribute('data-precio'));

    agregarAlCarrito(nombre, precio);

    // Animación "pop" de Olaf
    const contadorBadge = document.getElementById("contador-badge");
    if (contadorBadge) {
      contadorBadge.classList.add("pop");
      setTimeout(() => contadorBadge.classList.remove("pop"), 300);
    }

    // Abrir el carrito automáticamente (Javier)
    const offcanvasEl = document.getElementById('carritoMenu');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.show();
    }
  }

  // --- ELIMINAR DEL MENÚ LATERAL (Javier) ---
  if (e.target.classList.contains('btn-eliminar')) {
    const index = e.target.getAttribute('data-index');
    eliminar(index);
  }
});

// ==========================================
// 5. LÓGICA DE DATOS Y ALMACENAMIENTO (Mezcla de ambos)
// ==========================================
function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardado de Olaf
  
  actualizarContador();
  actualizarCarritoUI();
}

function eliminar(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  
  actualizarContador();
  actualizarCarritoUI();
  mostrarCarrito(); // Por si estamos en carrito.html
}

function vaciarCarrito() {
  localStorage.removeItem("carrito"); // Función original de Olaf
  carrito = [];
  
  actualizarContador();
  actualizarCarritoUI();
  mostrarCarrito();
}

// ==========================================
// 6. RENDERIZADO VISUAL
// ==========================================

// Actualiza los globitos rojos con el número (Olaf/Javier)
function actualizarContador() {
  const contadorBadge = document.getElementById("contador-badge");
  const contadorCheckout = document.getElementById("contador-productos");
  
  if (contadorBadge) contadorBadge.textContent = carrito.length;
  if (contadorCheckout) contadorCheckout.textContent = carrito.length;
}

// Renderiza el Menú Lateral Offcanvas (Javier)
function actualizarCarritoUI() {
  const listaCarrito = document.querySelector('#lista-carrito');
  const totalElemento = document.querySelector('#carrito-total');

  if (!listaCarrito || !totalElemento) return;

  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<li class="list-group-item text-center text-muted">El carrito está vacío</li>';
  }

  let totalAcumulado = 0;

  carrito.forEach((producto, index) => {
    totalAcumulado += producto.precio;

    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn';

    item.innerHTML = `
      <div class="me-auto">
        <h6 class="my-0 fw-bold">${producto.nombre}</h6>
        <small class="text-muted">$${producto.precio.toLocaleString()} MXN</small>
      </div>
      <button class="btn btn-outline-danger btn-sm btn-eliminar" data-index="${index}">
        &times;
      </button>
    `;

    listaCarrito.appendChild(item);
  });

  totalElemento.innerText = `$${totalAcumulado.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
}

// Renderiza la lista en la página de pago carrito.html (Olaf)
function mostrarCarrito() {
  const lista = document.getElementById("lista");
  const totalElemento = document.getElementById("total");

  if (!lista) return;

  // Nos aseguramos de tener la versión más fresca del localStorage
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    li.innerHTML = `
      ${producto.nombre} - $${producto.precio}
      <button class="btn btn-sm btn-danger" onclick="eliminar(${index})">X</button>
    `;

    lista.appendChild(li);
    total += producto.precio;
  });

  if (totalElemento) totalElemento.textContent = "Total: $" + total.toFixed(2);
}