document.addEventListener("DOMContentLoaded", () => {
    // Filtro pára saber si un user esta loggeado
    const isLogged = localStorage.getItem('kinetix_user_logged');
    
    if (!isLogged) {
        // Redirección inmediata al login si un invitado intenta entrar directo por URL
        window.location.href = "login.html";
        return; // Frena por completo el resto del script
    }

    const checkoutForm = document.getElementById("checkoutForm");
    const itemsContainer = document.getElementById("checkout-cart-items");
    const cartCountBadge = document.getElementById("checkout-cart-count");
    const alertContainer = document.getElementById("checkout-alert-container");

    // Sincronizado con la clave exacta de tu carrito
    let carrito = JSON.parse(localStorage.getItem("kinetix_cart")) || [];

    function renderResumenCompra() {
        if (!itemsContainer || !cartCountBadge) return;
        itemsContainer.innerHTML = "";
        
        if (carrito.length === 0) {
            itemsContainer.innerHTML = `<li class="list-group-item text-center text-muted py-3">Tu carrito está vacío</li>`;
            cartCountBadge.textContent = "0";
            return;
        }

        // Agrupación dinámica en caliente para corregir cantidades "undefined" y errores NaN
        const productosAgrupados = {};
        let totalGeneral = 0;

        carrito.forEach(producto => {
            totalGeneral += producto.precio;
            
            if (productosAgrupados[producto.nombre]) {
                productosAgrupados[producto.nombre].cantidad += 1;
                productosAgrupados[producto.nombre].subtotal += producto.precio;
            } else {
                productosAgrupados[producto.nombre] = {
                    precio: producto.precio,
                    cantidad: 1,
                    subtotal: producto.precio
                };
            }
        });

        // Renderizado estético de productos agrupados
        Object.keys(productosAgrupados).forEach(nombre => {
            const item = productosAgrupados[nombre];
            itemsContainer.innerHTML += `
                <li class="list-group-item d-flex justify-content-between lh-sm py-3">
                    <div>
                        <h6 class="my-0 fw-bold text-dark">${nombre}</h6>
                        <small class="text-muted">Cantidad: ${item.cantidad}</small>
                    </div>
                    <span class="text-muted fw-semibold">$${item.subtotal.toFixed(2)} MXN</span>
                </li>
            `;
        });

        // Fila del Total General de la Orden
        itemsContainer.innerHTML += `
            <li class="list-group-item d-flex justify-content-between bg-light py-3 border-top">
                <span class="fw-bold text-dark">Total (MXN)</span>
                <strong style="color: #EA9230; font-size: 1.2rem;">$${totalGeneral.toFixed(2)} MXN</strong>
            </li>
        `;

        // Setea el total de artículos en el badge contador
        cartCountBadge.textContent = carrito.length;
    }

    // 2. Validación y envío del formulario
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Si el formulario no es válido ante las reglas de Bootstrap
            if (!checkoutForm.checkValidity()) {
                e.stopPropagation();
                checkoutForm.classList.add("was-validated");
                mostrarAlerta("Por favor, rellena todos los campos requeridos correctamente.", "danger");
                return;
            }

            if (carrito.length === 0) {
                mostrarAlerta("No puedes procesar un pago con el carrito vacío.", "warning");
                return;
            }

            // Cambiar visualmente el botón de pago para denotar procesamiento seguro
            const botonEnvio = checkoutForm.querySelector('button[type="submit"]');
            if (botonEnvio) {
                botonEnvio.disabled = true;
                botonEnvio.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO PAGO...';
            }

            // Simulación de Pasarela de Pago Exitosa (2.5 Segundos)
            setTimeout(() => {
                // Vaciar persistencia del carrito tras la compra exitosa
                localStorage.removeItem("kinetix_cart");
                carrito = [];
                renderResumenCompra(); // Actualiza la vista detrás a $0.00 de manera limpia

                // Desplegar de forma nativa el Modal de confirmación de Bootstrap
                const modalElement = document.getElementById('modalExitoPago');
                if (modalElement) {
                    const modalExito = bootstrap.Modal.getOrCreateInstance(modalElement);
                    modalExito.show();
                }

                // Evento al dar clic al botón naranja "VOLVER AL INICIO" dentro del modal
                const btnCerrarExito = document.getElementById('btn-cerrar-exito');
                if (btnCerrarExito) {
                    btnCerrarExito.addEventListener('click', () => {
                        window.location.href = "index.html";
                    });
                }

                // Respaldo secundario: si se cierra el modal por cualquier otro medio alterno
                modalElement.addEventListener('hidden.bs.modal', () => {
                    window.location.href = "index.html";
                });

                // Limpieza del formulario base
                checkoutForm.reset();
                checkoutForm.classList.remove("was-validated");

            }, 2500);
        });
    }

    function mostrarAlerta(mensaje, tipo) {
        if (!alertContainer) return;
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Ejecutar al cargar la página
    renderResumenCompra();
});