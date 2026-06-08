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
        const boton =
            e.target.closest('.btn-agregar-carrito');
        const requiereSeleccion =
            boton.hasAttribute("data-producto-detalle");

        if (requiereSeleccion) {
            const talla =
                boton.getAttribute("data-talla");
            const color =
                boton.getAttribute("data-color");

            if (!talla) {
                mostrarToast(
                    "Selecciona una talla antes de continuar"
                );
                return;
            }

            if (!color) {
                mostrarToast(
                    "Selecciona un color antes de continuar"
                );
                return;
            }

        }

        const inputCantidad =
            document.getElementById('cantidad-producto');

        const producto = {
            nombre:
                boton.getAttribute('data-nombre'),
            precio:
                parseFloat(
                    boton.getAttribute('data-precio')
                ),
            imagen:
                boton.getAttribute('data-imagen'),
            talla:
                boton.getAttribute('data-talla'),
            color:
                boton.getAttribute('data-color'),
            cantidad:
                inputCantidad
                    ? parseInt(inputCantidad.value)
                    : 1
        };

        const productoExistente =
            miCarrito.find(item =>

                item.nombre === producto.nombre &&
                item.talla === producto.talla &&
                item.color === producto.color

            );

        if (productoExistente) {

            productoExistente.cantidad +=
                producto.cantidad;

        } else {

            miCarrito.push(producto);

        }

        localStorage.setItem(
            'kinetix_cart',
            JSON.stringify(miCarrito)
        );

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

    // MODIFICACIÓN PASO 2: Captura del botón "Finalizar Compra" con bloqueo de usuario invitado
    if (e.target.id === 'btn-pagar-carrito' || e.target.closest('#btn-pagar-carrito')) {
        e.preventDefault();

        // 1. Validar si el usuario ha iniciado sesión
        const isLogged = localStorage.getItem('kinetix_user_logged');

        if (!isLogged) {
            alert("¡Atención! Para finalizar tu compra en KinetixFit, necesitas iniciar sesión o registrarte.");
            window.location.href = "login.html"; // Redirección inmediata a la vista de acceso
            return; // Detiene la ejecución para bloquear la compra
        }

        // 2. Si está logueado, validar que tenga prendas en el carrito
        if (miCarrito.length === 0) {
            alert("Tu carrito está vacío. Agrega prendas antes de proceder al pago.");
            return;
        }

        // Redirección directa al formulario si el usuario está registrado y tiene productos
        window.location.href = "checkout.html";
    }
});

function mostrarToast(mensaje) {

    const toastElemento =
        document.getElementById("toastMensaje");
    const toastTexto =
        document.getElementById("toastTexto");

    toastTexto.textContent =
        mensaje;

    const toast =
        bootstrap.Toast.getOrCreateInstance(
            toastElemento
        );

    toast.show();

}

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
            total += prod.precio * prod.cantidad;
            listaCarrito.innerHTML += `
                <li class="list-group-item">
                    <div class="cart-item">
                        <img
                            src="${prod.imagen}"
                            alt="${prod.nombre}"
                            class="cart-item-img">

                        <div class="cart-item-info">
                            <h6 class="my-0 fw-bold">
                                ${prod.nombre}
                            </h6>

                            <small class="text-muted d-block">
                                Cantidad: ${prod.cantidad}
                            </small>

                            <small class="text-muted d-block">
                                $${prod.precio.toFixed(2)} MXN
                            </small>

                            ${prod.talla ? `
                                <small class="text-muted d-block">
                                    Talla: ${prod.talla}
                                </small>
                            ` : ""}

                            ${prod.color ? `
                                <small class="text-muted d-block">
                                    Color:
                                    <span
                                        class="cart-color-dot"
                                        style="background:${prod.color}">
                                    </span>
                                </small>
                            ` : ""}

                        </div>

                        <button
                            class="btn-eliminar-item"
                            data-index="${index}">
                            <i class="bi bi-x-lg"></i>
                        </button>

                    </div>

                </li>
            `;
        });
    }
    totalElemento.innerText = `$${total.toFixed(2)} MXN`;
}