document.addEventListener("DOMContentLoaded", async () => {

    if (!localStorage.getItem('kinetix_user_logged')) {
        window.location.href = "login.html";
        return;
    }

    const checkoutForm = document.getElementById("checkoutForm");
    const itemsContainer = document.getElementById("checkout-cart-items");
    const cartCountBadge = document.getElementById("checkout-cart-count");
    const alertContainer = document.getElementById("checkout-alert-container");

    const estaLogueado = () => !!localStorage.getItem('currentUser');

    let itemsCarrito = [];
    let modoDb = false;

    if (estaLogueado() && typeof fetchCarritoDB === 'function') {
        try {
            itemsCarrito = await fetchCarritoDB();
            modoDb = true;
        } catch (err) {
            console.error('Error cargando carrito desde BD:', err);
        }
    }
    if (!modoDb) {
        itemsCarrito = JSON.parse(localStorage.getItem('kinetix_cart') || '[]');
    }

    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    const regexTarjeta = /^\d{16}$/;
    const regexExpiracion = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const regexCVV = /^\d{3,4}$/;

    const camposTexto = {
        nombre: document.getElementById("firstName"),
        apellidos: document.getElementById("lastName"),
        ciudad: document.getElementById("city"),
        estado: document.getElementById("state"),
        tarjetaNombre: document.getElementById("cc-name")
    };
    const camposNumeros = {
        tarjetaNumero: document.getElementById("cc-number"),
        tarjetaExpiracion: document.getElementById("cc-expiration"),
        tarjetaCVV: document.getElementById("cc-cvv")
    };

    Object.values(camposTexto).forEach(c => {
        c?.addEventListener("input", e => {
            e.target.value = e.target.value.replace(/[0-9]/g, "");
        });
    });
    camposNumeros.tarjetaNumero?.addEventListener("input",
        e => { e.target.value = e.target.value.replace(/\D/g, ""); });
    camposNumeros.tarjetaCVV?.addEventListener("input",
        e => { e.target.value = e.target.value.replace(/\D/g, ""); });
    camposNumeros.tarjetaExpiracion?.addEventListener("input", e => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 2) v = v.substring(0, 2) + "/" + v.substring(2, 4);
        e.target.value = v;
    });

    function renderResumenCompra() {
        if (!itemsContainer || !cartCountBadge) return;
        itemsContainer.innerHTML = "";

        if (itemsCarrito.length === 0) {
            itemsContainer.innerHTML = `
                <li class="list-group-item text-center text-muted py-3">
                    Tu carrito está vacío
                </li>`;
            cartCountBadge.textContent = "0";
            return;
        }

        let totalGeneral = 0, totalArticulos = 0;

        itemsCarrito.forEach(item => {
            const nombre = modoDb ? item.nombreProducto : item.nombre;
            const precio = parseFloat(modoDb ? item.precioUnitario : item.precio);
            const cantidad = item.cantidad || 1;
            const imagen = item.imagen || 'img/default-product.png';
            const talla = item.talla || '';
            const colorHex = modoDb ? (item.codigoColor || '') : (item.color || '');
            const subtotal = precio * cantidad;

            totalGeneral += subtotal;
            totalArticulos += cantidad;

            itemsContainer.innerHTML += `
                <li class="list-group-item checkout-item">
                    <img src="${imagen}" alt="${nombre}" class="checkout-product-image">
                    <div class="checkout-product-info">
                        <h6 class="fw-bold mb-1">${nombre}</h6>
                        <small class="text-muted d-block">Cantidad: ${cantidad}</small>
                        ${talla ? `<small class="text-muted d-block">Talla: ${talla}</small>` : ''}
                        ${colorHex ? `<small class="text-muted d-flex align-items-center gap-2">
                                          Color:
                                          <span class="checkout-color-dot"
                                                style="background:${colorHex}"></span>
                                      </small>` : ''}
                    </div>
                    <div class="checkout-subtotal">$${subtotal.toFixed(2)}</div>
                </li>`;
        });

        itemsContainer.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center bg-light py-3">
                <span class="fw-bold">Total</span>
                <strong class="total-pagar">$${totalGeneral.toFixed(2)} MXN</strong>
            </li>`;

        cartCountBadge.textContent = totalArticulos;
    }

    function mostrarAlerta(mensaje, tipo) {
        if (!alertContainer) {
            alert(mensaje);
            return;
        }

        alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

        setTimeout(() => {
            const alerta = alertContainer.querySelector('.alert');

            if (alerta) {
                alerta.classList.remove('show');

                setTimeout(() => {
                    alertContainer.innerHTML = '';
                }, 300); // espera la animación fade
            }
        }, 4000);
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Validación
            let valido = true, mensajeError = "";
            checkoutForm.classList.remove("was-validated");
            Object.values({ ...camposTexto, ...camposNumeros })
                .forEach(c => c?.classList.remove("is-invalid"));

            for (const [, campo] of Object.entries(camposTexto)) {
                if (campo && (!campo.value.trim() || !regexSoloLetras.test(campo.value.trim()))) {
                    campo.classList.add("is-invalid");
                    valido = false;
                }
            }
            const numTarjeta = camposNumeros.tarjetaNumero?.value.replace(/\s/g, "");
            if (!regexTarjeta.test(numTarjeta)) {
                camposNumeros.tarjetaNumero?.classList.add("is-invalid");
                valido = false;
                mensajeError += "* El número de tarjeta debe tener 16 dígitos.<br>";
            }
            if (!regexExpiracion.test(camposNumeros.tarjetaExpiracion?.value)) {
                camposNumeros.tarjetaExpiracion?.classList.add("is-invalid");
                valido = false;
                mensajeError += "* Fecha de expiración inválida (MM/AA).<br>";
            }
            if (!regexCVV.test(camposNumeros.tarjetaCVV?.value)) {
                camposNumeros.tarjetaCVV?.classList.add("is-invalid");
                valido = false;
                mensajeError += "* El CVV debe tener 3 o 4 dígitos.<br>";
            }

            if (!checkoutForm.checkValidity() || !valido) {
                e.stopPropagation();
                checkoutForm.classList.add("was-validated");
                mostrarAlerta(
                    mensajeError
                        ? `Por favor, corrige los datos de pago:<br>${mensajeError}`
                        : "Por favor, rellena todos los campos correctamente.",
                    "danger"
                );
                return;
            }

            if (itemsCarrito.length === 0) {
                mostrarAlerta("No puedes procesar un pago con el carrito vacío.", "warning");
                return;
            }

            // Spinner
            const botonEnvio = checkoutForm.querySelector('button[type="submit"]');
            if (botonEnvio) {
                botonEnvio.disabled = true;
                botonEnvio.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status"></span>
                    PROCESANDO PAGO...`;
            }

            // Simulación de pasarela (2.5 s) → luego registrar en BD
            setTimeout(async () => {
                try {
                    // ── Construir PedidoRequest desde el formulario ───────────
                    const nombre = document.getElementById("firstName")?.value.trim() || '';
                    const apellidos = document.getElementById("lastName")?.value.trim() || '';

                    const calle = document.getElementById("calle")?.value.trim() || '';
                    const numExt = document.getElementById("numeroExterior")?.value.trim() || '';
                    const numInt = document.getElementById("numeroInterior")?.value.trim() || '';
                    const colonia = document.getElementById("colonia")?.value.trim() || '';
                    const ciudad = document.getElementById("city")?.value.trim() || '';
                    const estado = document.getElementById("state")?.value.trim() || '';
                    const zip = document.getElementById("zip")?.value.trim() || '';

                    const pedidoRequest = {
                        nombreDestinatario: `${nombre} ${apellidos}`.trim(),

                        calle: calle,
                        numeroExterior: numExt,
                        numeroInterior: numInt,

                        colonia: colonia,
                        ciudad: ciudad,
                        estado: estado,
                        codigoPostal: zip,

                        pais: "México",
                        metodoPago: document.querySelector('input[name="metodoPago"]:checked')?.value
                    };

                    // crearPedidoDB crea: dirección → pedido → pedido_productos
                    const pedidoResponse = await crearPedidoDB(pedidoRequest);
                    console.log('✅ Pedido creado:', pedidoResponse);

                    // Limpiar localStorage
                    localStorage.removeItem('kinetix_cart');
                    itemsCarrito = [];
                    renderResumenCompra();

                } catch (err) {
                    console.error('Error al crear pedido:', err);
                    mostrarAlerta(
                        'Hubo un problema al confirmar tu pedido. Contacta soporte.',
                        'danger'
                    );
                    if (botonEnvio) {
                        botonEnvio.disabled = false;
                        botonEnvio.textContent = 'PAGAR AHORA';
                    }
                    return;
                }

                // Modal de éxito
                const modalElement = document.getElementById('modalExitoPago');
                if (modalElement) {
                    bootstrap.Modal.getOrCreateInstance(modalElement).show();
                    document.getElementById('btn-cerrar-exito')
                        ?.addEventListener('click', () => {
                            window.location.href = "index.html";
                        });
                    modalElement.addEventListener('hidden.bs.modal', () => {
                        window.location.href = "catalogo.html";
                    });
                }

                checkoutForm.reset();
                checkoutForm.classList.remove("was-validated");

            }, 2500);
        });
    }

    renderResumenCompra();
});