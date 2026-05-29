document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkoutForm");
    const itemsContainer = document.getElementById("checkout-cart-items");
    const cartCountBadge = document.getElementById("checkout-cart-count");
    const alertContainer = document.getElementById("checkout-alert-container");

    // 1. Cargar datos del carrito desde LocalStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function renderResumenCompra() {
        itemsContainer.innerHTML = "";
        if (carrito.length === 0) {
            itemsContainer.innerHTML = `<li class="list-group-item text-center text-muted py-3">Tu carrito está vacío</li>`;
            return;
        }

        let total = 0;
        let totalProductos = 0;

        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad;
            totalProductos += producto.cantidad;

            itemsContainer.innerHTML += `
                <li class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 class="my-0 fw-bold">${producto.nombre}</h6>
                        <small class="text-muted">Cantidad: ${producto.cantidad}</small>
                    </div>
                    <span class="text-muted">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                </li>
            `;
        });

        // Fila del Total
        itemsContainer.innerHTML += `
            <li class="list-group-item d-flex justify-content-between bg-light">
                <span class="fw-bold">Total (MXN)</span>
                <strong class="text-orange">$${total.toFixed(2)}</strong>
            </li>
        `;

        cartCountBadge.textContent = totalProductos;
    }

    // 2. Validación y envío del formulario
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

        // Simulación de Pasarela de Pago Exitosa
        mostrarAlerta("¡Procesando pago... por favor espera!", "info");
        
        setTimeout(() => {
            // Vaciar carrito tras la compra exitosa
            localStorage.removeItem("carrito");
            
            alertContainer.innerHTML = `
                <div class="alert alert-success text-center py-4" role="alert">
                    <i class="bi bi-check-circle-fill display-4 d-block mb-2"></i>
                    <h4 class="alert-heading fw-bold">¡PAGO PROCESADO CON ÉXITO!</h4>
                    <p>Gracias por unirte al Team KinetixFit. Tu orden está en camino.</p>
                    <hr>
                    <a href="index.html" class="btn btn-dark rounded-pill px-4">Volver al inicio</a>
                </div>
            `;
            checkoutForm.reset();
            checkoutForm.classList.remove("was-validated");
            carrito = [];
            renderResumenCompra();
        }, 2500);
    });

    function mostrarAlerta(mensaje, tipo) {
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="dropdown" data-bs-bleed="true" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Ejecutar al cargar la página
    renderResumenCompra();
});