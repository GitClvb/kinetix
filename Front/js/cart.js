// 1. Aislamos la variable llamándola 'miCarrito'
let miCarrito = JSON.parse(localStorage.getItem('kinetix_cart')) || [];

// 2. Inyectar el modal directamente al cargar el script
fetch('./components/cart-modal.html') 
    .then(response => response.text())
    .then(data => {
        const contenedorCarrito = document.getElementById('cart-container');
        if (contenedorCarrito) {
            contenedorCarrito.innerHTML = data;
            actualizarCarritoUI(); 
        }
    })
    .catch(error => console.error('Error al cargar el modal del carrito:', error));

// 3. Lógica de clics unificada para todo el sitio
document.addEventListener('click', (e) => {
    
    // Abrir modal desde el Header
    if (e.target.closest('.cart-icon')) {
        e.preventDefault();
        abrirModalCarrito();
    }

    // Agregar producto al carrito
    if (e.target.closest('.btn-agregar-carrito')) {
        const boton = e.target.closest('.btn-agregar-carrito');
        const producto = {
            nombre: boton.getAttribute('data-nombre'),
            precio: parseFloat(boton.getAttribute('data-precio')),
            imagen: boton.getAttribute('data-imagen')
        };
        
        miCarrito.push(producto);
        localStorage.setItem('kinetix_cart', JSON.stringify(miCarrito));
        actualizarCarritoUI();
        
        abrirModalCarrito();
    }

    // Eliminar un producto específico
    if (e.target.closest('.btn-eliminar-item')) {
        const index = e.target.closest('.btn-eliminar-item').getAttribute('data-index');
        miCarrito.splice(index, 1);
        localStorage.setItem('kinetix_cart', JSON.stringify(miCarrito));
        actualizarCarritoUI();
    }

    // Vaciar el carrito completo
    if (e.target.id === 'btn-vaciar-carrito') {
        miCarrito = [];
        localStorage.removeItem('kinetix_cart');
        actualizarCarritoUI();
    }
});

function abrirModalCarrito() {
    const modalElement = document.getElementById('carritoModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
}

function actualizarCarritoUI() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalElemento = document.getElementById('carrito-total');
    
    if (!listaCarrito || !totalElemento) return;

    listaCarrito.innerHTML = '';
    let total = 0;

    if (miCarrito.length === 0) {
        listaCarrito.innerHTML = '<li class="list-group-item text-center text-muted">El carrito está vacío</li>';
    } else {
        miCarrito.forEach((prod, index) => {
            total += prod.precio;
            listaCarrito.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="my-0 fw-bold">${prod.nombre}</h6>
                        <small class="text-muted">$${prod.precio.toFixed(2)} MXN</small>
                    </div>
                    <button class="btn btn-sm btn-danger btn-eliminar-item" data-index="${index}">X</button>
                </li>
            `;
        });
    }
    totalElemento.innerText = `$${total.toFixed(2)} MXN`;

    // Conexion con formulario de pago
    btnPagarCarrito.addEventListener("click", () => {
    window.location.href = "checkout.html";
});
}