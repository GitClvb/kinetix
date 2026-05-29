document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkoutForm");
    const itemsContainer = document.getElementById("checkout-cart-items");
    const cartCountBadge = document.getElementById("checkout-cart-count");
    const alertContainer = document.getElementById("checkout-alert-container");

    // 1. Cargar datos usando la clave exacta de tu proyecto
    let miCarrito = JSON.parse(localStorage.getItem("kinetix_cart")) || [];

    function renderResumenCompra() {
        if (!itemsContainer || !cartCountBadge) return;
        
        itemsContainer.innerHTML = "";
        
        if (miCarrito.length === 0) {
            itemsContainer.innerHTML = `<li class="list-group-item text-center text-muted py-3">Tu carrito está vacío</li>`;
            cartCountBadge.textContent = "0";
            return;
        }

        // 2. Agrupar productos repetidos para contabilizar cantidades dinámicamente
        const productosAgrupados = {};
        let totalGeneral = 0;

        miCarrito.forEach(producto => {
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

        // 3. Renderizar los productos agrupados con sus datos correctos
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

        // Fila final del Total de la Orden
        itemsContainer.innerHTML += `
            <li class="list-group-item d-flex justify-content-between bg-light py-3 border-top">
                <span class="fw-bold text-dark">Total (MXN)</span>
                <strong style="color: #EA9230; font-size: 1.2rem;">$${totalGeneral.toFixed(2)} MXN</strong>
            </li>
        `;

        // Actualizar el contador superior del badge
        cartCountBadge.textContent = miCarrito.length;
    }

    // 4. Validación y procesamiento del formulario
    // 4. Validación y procesamiento del formulario en js/checkout.js
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Validación nativa de Bootstrap
            if (!checkoutForm.checkValidity()) {
                e.stopPropagation();
                checkoutForm.classList.add("was-validated");
                mostrarAlerta("Por favor, rellena todos los campos requeridos correctamente.", "danger");
                return;
            }

            if (miCarrito.length === 0) {
                mostrarAlerta("No puedes procesar un pago con el carrito vacío.", "warning");
                return;
            }

            // Cambiar visualmente el botón "PAGAR AHORA" para denotar carga
            const botonEnvio = checkoutForm.querySelector('button[type="submit"]');
            if (botonEnvio) {
                botonEnvio.disabled = true;
                botonEnvio.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO PAGO...';
            }

            // Simulación de pasarela segura (2.5 segundos)
            setTimeout(() => {
                // 1. Limpiar el carrito de la persistencia local
                localStorage.removeItem("kinetix_cart");
                miCarrito = [];
                renderResumenCompra(); // Actualiza la UI a ceros atrás del modal

                // 2. Levantar el modal de éxito de Bootstrap de forma nativa
                const modalElement = document.getElementById('modalExitoPago');
                if (modalElement) {
                    const modalExito = bootstrap.Modal.getOrCreateInstance(modalElement);
                    modalExito.show();
                }

                // 3. Capturar el botón de cierre del modal para forzar la redirección a index.html
                const btnCerrarExito = document.getElementById('btn-cerrar-exito');
                if (btnCerrarExito) {
                    btnCerrarExito.addEventListener('click', () => {
                        window.location.href = "index.html";
                    });
                }

                // Respaldo de seguridad: si cierran el modal de otra forma alternativa, redirigir
                modalElement.addEventListener('hidden.bs.modal', () => {
                    window.location.href = "index.html";
                });

                // Limpieza estética del formulario base
                checkoutForm.reset();
                checkoutForm.classList.remove("was-validated");

            }, 2500);
        });
    }

    // Ejecución inicial al montar el componente
    renderResumenCompra();
});