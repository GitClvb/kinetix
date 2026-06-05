/* ==========================================================================
   LOGIC AND VALIDATIONS FOR KINETIXFIT CHECKOUT
   ========================================================================== */

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

    // 1. Cargar datos usando la clave exacta de tu proyecto
    let miCarrito = JSON.parse(localStorage.getItem("kinetix_cart")) || [];

    // --- EXPRESIONES REGULARES PARA VALIDACIÓN AVANZADA ---
    // Permite letras (con acentos, diéresis y ñ) y espacios. Bloquea números de forma estricta.
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    // Valida exactamente 16 dígitos numéricos
    const regexTarjeta = /^\d{16}$/;
    // Valida formato MM/YY o MM/AA (2 dígitos, diagonal, 2 dígitos)
    const regexExpiracion = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    // Valida exactamente 3 o 4 dígitos numéricos para el CVV
    const regexCVV = /^\d{3,4}$/;

    // --- MAPEADO DE CAMPOS EXACTOS SEGÚN TU HTML ---
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

    // ==========================================================================
    // FILTROS EN TIEMPO REAL (Evitan la escritura de caracteres no deseados)
    // ==========================================================================

    // Bloquear números y caracteres especiales en los campos de texto mientras se teclea
    Object.values(camposTexto).forEach(campo => {
        if (campo) {
            campo.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/[0-9]/g, "");
            });
        }
    });

    // Bloquear letras en el número de tarjeta mientras se escribe
    if (camposNumeros.tarjetaNumero) {
        camposNumeros.tarjetaNumero.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, ""); // Borra todo lo que NO sea número
        });
    }

    // Bloquear letras en el código CVV mientras se escribe
    if (camposNumeros.tarjetaCVV) {
        camposNumeros.tarjetaCVV.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, ""); // Borra todo lo que NO sea número
        });
    }

    // Formatear automáticamente la expiración añadiendo la diagonal (MM/AA) y bloqueando letras
    if (camposNumeros.tarjetaExpiracion) {
        camposNumeros.tarjetaExpiracion.addEventListener("input", (e) => {
            let valor = e.target.value.replace(/\D/g, ""); // Limpia letras
            if (valor.length > 2) {
                valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
            }
            e.target.value = valor;
        });
    }

    // ==========================================================================
    // RENDERIZADO DEL RESUMEN DE COMPRA
    // ==========================================================================
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

    // Función auxiliar para mostrar las alertas estilizadas de Bootstrap
    function mostrarAlerta(mensaje, tipo) {
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i> ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        } else {
            alert(mensaje);
        }
    }

    // ==========================================================================
    // 4. VALIDACIÓN INTERNA Y CONTROL DE ENVÍO (SUBMIT)
    // ==========================================================================
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let formularioValido = true;
            let mensajeError = "";

            // Limpiar estados de error o validación previos
            checkoutForm.classList.remove("was-validated");
            Object.values({...camposTexto, ...camposNumeros}).forEach(campo => {
                if (campo) campo.classList.remove("is-invalid");
            });

            // --- VALIDACIÓN DE CAMPOS DE TEXTO (SÓLO LETRAS) ---
            for (const [key, campo] of Object.entries(camposTexto)) {
                if (campo) {
                    const valor = campo.value.trim();
                    if (valor === "" || !regexSoloLetras.test(valor)) {
                        campo.classList.add("is-invalid");
                        formularioValido = false;
                    }
                }
            }

            // --- VALIDACIÓN DE NÚMERO DE TARJETA (16 DÍGITOS) ---
            if (camposNumeros.tarjetaNumero) {
                const numero = camposNumeros.tarjetaNumero.value.replace(/\s/g, ""); 
                if (!regexTarjeta.test(numero)) {
                    camposNumeros.tarjetaNumero.classList.add("is-invalid");
                    formularioValido = false;
                    mensajeError += "* El Número de Tarjeta debe tener exactamente 16 dígitos numéricos.<br>";
                }
            }

            // --- VALIDACIÓN DE FECHA DE EXPIRACIÓN (MM/AA) ---
            if (camposNumeros.tarjetaExpiracion) {
                if (!regexExpiracion.test(camposNumeros.tarjetaExpiracion.value)) {
                    camposNumeros.tarjetaExpiracion.classList.add("is-invalid");
                    formularioValido = false;
                    mensajeError += "* La fecha de expiración debe tener el formato MM/AA (Ej: 12/26).<br>";
                }
            }

            // --- VALIDACIÓN DE CÓDIGO CVV (3 o 4 DÍGITOS) ---
            if (camposNumeros.tarjetaCVV) {
                if (!regexCVV.test(camposNumeros.tarjetaCVV.value)) {
                    camposNumeros.tarjetaCVV.classList.add("is-invalid");
                    formularioValido = false;
                    mensajeError += "* El código CVV debe tener 3 o 4 dígitos numéricos.<br>";
                }
            }

            // --- VERIFICACIÓN DE ATRIBUTOS REQUIRED GLOBALES ---
            if (!checkoutForm.checkValidity() || !formularioValido) {
                e.stopPropagation();
                checkoutForm.classList.add("was-validated");
                
                const errorTexto = mensajeError !== "" ? 
                    `Por favor, corrige las credenciales de pago:<br>${mensajeError}` : 
                    "Por favor, rellena todos los campos requeridos correctamente.";
                
                mostrarAlerta(errorTexto, "danger");
                return;
            }

            // CONTROL DE SEGURIDAD: Evitar transacciones sin artículos
            if (miCarrito.length === 0) {
                mostrarAlerta("No puedes procesar un pago con el carrito vacío.", "warning");
                return;
            }

            // Cambiar visualmente el botón "PAGAR AHORA" para denotar carga en la red
            const botonEnvio = checkoutForm.querySelector('button[type="submit"]');
            if (botonEnvio) {
                botonEnvio.disabled = true;
                botonEnvio.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO PAGO...';
            }

            // Simulación de pasarela bancaria segura (2.5 segundos)
            setTimeout(() => {
                // Vaciar persistencia del carrito tras la compra exitosa
                localStorage.removeItem("kinetix_cart");
                miCarrito = [];
                renderResumenCompra(); // Actualiza la UI de fondo a ceros

                // Desplegar de forma nativa el Modal de confirmación de Bootstrap
                const modalElement = document.getElementById('modalExitoPago');
                if (modalElement) {
                    const modalExito = bootstrap.Modal.getOrCreateInstance(modalElement);
                    modalExito.show();
                }

                // 3. Redirección forzada al hacer click al botón de cierre del modal
                const btnCerrarExito = document.getElementById('btn-cerrar-exito');
                if (btnCerrarExito) {
                    btnCerrarExito.addEventListener('click', () => {
                        window.location.href = "index.html";
                    });
                }

                // Respaldo de seguridad: si cierran el modal clickeando fuera de él
                modalElement.addEventListener('hidden.bs.modal', () => {
                    window.location.href = "index.html";
                });

                // Limpieza del formulario base
                checkoutForm.reset();
                checkoutForm.classList.remove("was-validated");

            }, 2500);
        });
    }

    // Ejecución inicial al montar el archivo
    renderResumenCompra();
});