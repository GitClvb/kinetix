const form = document.getElementById("contactForm");

form.addEventListener("submit", function (event) {

    let valido = true;

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorTelefono.textContent = "";
    errorMensaje.textContent = "";

    if (nombre.length < 3) {
        errorNombre.textContent = "Nombre inválido";
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {
        errorCorreo.textContent = "Correo inválido";
        valido = false;
    }

    if (!/^[0-9]{10}$/.test(telefono)) {
        errorTelefono.textContent = "Teléfono inválido";
        valido = false;
    }

    if (mensaje.length < 10) {
        errorMensaje.textContent = "Mensaje muy corto";
        valido = false;
    }

    // ❌ evita envío si falla
    if (!valido) {
        event.preventDefault();
    }
});