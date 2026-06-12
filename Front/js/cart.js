let miCarrito = JSON.parse(localStorage.getItem('kinetix_cart') || '[]');

function estaLogueado() {
    return !!localStorage.getItem('currentUser');
}

//Inyectar moal
fetch('./components/cart-modal.html')
    .then(res => res.text())
    .then(html => {
        const contenedor = document.getElementById('cart-container');
        if (contenedor) {
            contenedor.innerHTML = html;
            if (estaLogueado()) {
                cargarCarritoDesdeDB();
            } else {
                actualizarCarritoUI(miCarrito, false);
            }
        }
    })
    .catch(err => console.error('Error al cargar modal:', err));

// Cargar carrito desde BD 
async function cargarCarritoDesdeDB() {
    try {
        const items = await fetchCarritoDB();
        actualizarCarritoUI(items, true);
    } catch (err) {
        console.error('Error cargando carrito:', err);
    }
}

document.addEventListener('click', async (e) => {

    // Abre modal
    if (e.target.closest('.cart-icon')) {
        e.preventDefault();
        if (estaLogueado()) await cargarCarritoDesdeDB();
        abrirModalCarrito();
    }

    // Agregar producto 
    if (e.target.closest('.btn-agregar-carrito')) {
        const boton = e.target.closest('.btn-agregar-carrito');

        const esVistaDetalle = boton.hasAttribute('data-producto-detalle');
        if (esVistaDetalle) {
            const talla = boton.getAttribute('data-talla');
            const color = boton.getAttribute('data-color');
            if (!talla && !color) { mostrarToast('Debes seleccionar talla y color'); return; }
            if (!talla)           { mostrarToast('Debes seleccionar una talla');      return; }
            if (!color)           { mostrarToast('Debes seleccionar un color');       return; }
        }

        const inputCantidad = document.getElementById('cantidad-producto');
        const cantidad      = inputCantidad ? parseInt(inputCantidad.value) || 1 : 1;

        if (estaLogueado()) {
            const idVariante = parseInt(boton.getAttribute('data-id-variante'));
            if (!idVariante || isNaN(idVariante)) {
                mostrarToast('Selecciona una talla para continuar');
                return;
            }
            try {
                await agregarItemDB(idVariante, cantidad);
                await cargarCarritoDesdeDB();
                abrirModalCarrito();
            } catch (err) {
                console.error('Error al agregar al carrito:', err);
                mostrarToast('Error al agregar al carrito. Intenta de nuevo.');
            }
        } else {
            const producto = {
                nombre:     boton.getAttribute('data-nombre'),
                precio:     parseFloat(boton.getAttribute('data-precio')),
                imagen:     boton.getAttribute('data-imagen'),
                talla:      boton.getAttribute('data-talla'),
                color:      boton.getAttribute('data-color'),
                idVariante: boton.getAttribute('data-id-variante'),
                cantidad
            };
            const existe = miCarrito.find(item => item.idVariante === producto.idVariante);
            if (existe) {
                existe.cantidad += producto.cantidad;
            } else {
                miCarrito.push(producto);
            }
            localStorage.setItem('kinetix_cart', JSON.stringify(miCarrito));
            actualizarCarritoUI(miCarrito, false);
            abrirModalCarrito();
        }
    }

    if (e.target.closest('.btn-eliminar-item')) {
        const botonEliminar = e.target.closest('.btn-eliminar-item');

        if (estaLogueado()) {
            const idItem = parseInt(botonEliminar.getAttribute('data-id-item'));
            try {
                await eliminarItemDB(idItem);      // → estado PROCESADO en BD
                await cargarCarritoDesdeDB();
            } catch (err) {
                mostrarToast('Error al eliminar el producto.');
            }
        } else {
            const index = parseInt(botonEliminar.getAttribute('data-index'));
            miCarrito.splice(index, 1);
            localStorage.setItem('kinetix_cart', JSON.stringify(miCarrito));
            actualizarCarritoUI(miCarrito, false);
        }
    }

    if (e.target.id === 'btn-vaciar-carrito') {
        if (estaLogueado()) {
            try {
                await finalizarCompraDB();        
                await cargarCarritoDesdeDB();
            } catch (err) {
                mostrarToast('Error al vaciar el carrito.');
            }
        } else {
            miCarrito = [];
            localStorage.removeItem('kinetix_cart');
            actualizarCarritoUI(miCarrito, false);
        }
    }

    if (e.target.id === 'btn-pagar-carrito' || e.target.closest('#btn-pagar-carrito')) {
        e.preventDefault();

        if (!estaLogueado()) {
            alert('Para finalizar tu compra necesitas iniciar sesión.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const items = await fetchCarritoDB();
            if (items.length === 0) {
                mostrarToast('Tu carrito está vacío.');
                return;
            }
            window.location.href = 'checkout.html';
        } catch (err) {
            console.error('Error al ir a checkout:', err);
            mostrarToast('Error al procesar tu compra. Intenta de nuevo.');
        }
    }
});

function actualizarCarritoUI(items, modoDb = false) {
    const lista   = document.getElementById('lista-carrito');
    const totalEl = document.getElementById('carrito-total');
    if (!lista || !totalEl) return;

    lista.innerHTML = '';
    let total = 0;

    if (!items || items.length === 0) {
        lista.innerHTML = `
            <li class="list-group-item text-center text-muted py-4">
                <i class="bi bi-cart3 fs-3 d-block mb-2"></i>
                El carrito está vacío
            </li>`;
        totalEl.innerText = '$0.00 MXN';
        actualizarBadgeCarrito(0);
        return;
    }

    items.forEach((item, index) => {
        const nombre   = modoDb ? item.nombreProducto : item.nombre;
        const precio   = modoDb ? item.precioUnitario  : item.precio;
        const cantidad = item.cantidad;
        const imagen   = item.imagen   || '';
        const talla    = item.talla    || '';
        const colorHex = modoDb ? (item.codigoColor || '') : (item.color || '');

        total += parseFloat(precio) * cantidad;

        const attrEliminar = modoDb
            ? `data-id-item="${item.idItem}"`
            : `data-index="${index}"`;

        lista.innerHTML += `
            <li class="list-group-item px-3 py-2">
                <div class="cart-item d-flex gap-3 align-items-start">
                    ${imagen
                        ? `<img src="${imagen}" alt="${nombre}" class="cart-item-img rounded"
                                style="width:64px;height:64px;object-fit:cover;flex-shrink:0">`
                        : `<div class="rounded bg-secondary"
                                style="width:64px;height:64px;flex-shrink:0"></div>`}
                    <div class="cart-item-info flex-grow-1">
                        <h6 class="my-0 fw-bold">${nombre}</h6>
                        <div class="d-flex align-items-center gap-2 mt-1 flex-wrap">
                            ${talla
                                ? `<span class="badge bg-light text-dark border">
                                       <i class="bi bi-rulers me-1"></i>${talla}
                                   </span>` : ''}
                            ${colorHex
                                ? `<span style="display:inline-block;width:16px;height:16px;
                                       border-radius:50%;background:${colorHex};
                                       border:1px solid rgba(0,0,0,.2);flex-shrink:0"></span>` : ''}
                        </div>
                        <small class="text-muted d-block mt-1">
                            ${cantidad} × $${parseFloat(precio).toFixed(2)} MXN
                        </small>
                    </div>
                    <button class="btn-eliminar-item btn btn-sm btn-outline-danger ms-auto"
                            ${attrEliminar} title="Eliminar">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </li>`;
    });

    totalEl.innerText = `$${total.toFixed(2)} MXN`;
    actualizarBadgeCarrito(items.length);
}

function actualizarBadgeCarrito(cantidad) {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    badge.textContent   = cantidad;
    badge.style.display = cantidad > 0 ? 'inline-block' : 'none';
}

function abrirModalCarrito() {
    const el = document.getElementById('carritoModal');
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
}

function mostrarToast(mensaje) {
    const el    = document.getElementById('toastMensaje');
    const texto = document.getElementById('toastTexto');
    if (!el || !texto) return;
    texto.textContent = mensaje;
    bootstrap.Toast.getOrCreateInstance(el).show();
}