(async function () {
  const REGLAS = [
    // Se definen las reglas de validación para la contraseña que usara el formulario de registro
    // Cada regla tiene un texto descriptivo y una función de prueba (test)
    //.test() es un método de los objetos RegExp (Expresiones Regulares) en JavaScript que verifica si existe una coincidencia en un texto y retorna true o false.
    { texto: "Mínimo 6 caracteres", test: p => p.length >= 6 },
    { texto: "Al menos una letra MAYÚSCULA", test: p => /[A-Z]/.test(p) },
    { texto: "Al menos una letra minúscula", test: p => /[a-z]/.test(p) },
    { texto: "Al menos un número", test: p => /\d/.test(p) },
    { texto: "Al menos un carácter especial (@$!%*?&.#-)", test: p => /[@$!%*?&.#\-]/.test(p) }
  ];

  // Inyección de modal desde re-modal.html
  async function inyectarModal() {
    if (document.getElementById("registroModal") && document.getElementById("modalCategoria")) {
      console.log("Los modales ya están inyectados");
      return;
    }

    try {
      const response = await fetch("./components/re-modal.html");
      const html = await response.text();

      let wrapper = document.getElementById("kfModalWrapper");
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "kfModalWrapper";
        document.body.appendChild(wrapper);
      }
      wrapper.innerHTML = html;

      requestAnimationFrame(() => {
        console.log("Modales inyectados — disparando modalesListos");
        document.dispatchEvent(new CustomEvent("modalesListos"));
      });

    } catch (err) {
      console.error("Error cargando los modales:", err);
    }
  }

  // control del modal
  function gestionarModal(accion) {
    const modalEl = document.getElementById("registroModal");
    if (!modalEl || !window.bootstrap) return;
    const instance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
    // Ejecuto la acción solicitada (show = mostrar, hide = ocultar)
    if (accion === "show") instance.show();
    if (accion === "hide") instance.hide();
  }

  // Función que conecta el botón de registro del header con el modal
  function conectarBotonRegistro() {
    const btns = document.querySelectorAll(".btn-registro-trigger");
    if (!btns.length) return false;

    btns.forEach(btn => {

      btn.removeAttribute("data-bs-toggle");
      btn.removeAttribute("data-bs-target");

      btn.addEventListener("click", e => {
        e.preventDefault();
        gestionarModal("show");
      });

    });

    return true;
  }

  // validaciones de registro
  function mostrarIndicador(password) {
    // Buscamos el campo de contraseña
    const campo = document.getElementById("password");
    if (!campo) return;
    // Buscamos si ya existe, si no, se crea
    let indicador = document.getElementById("kf-password-indicator");

    if (!indicador) {
      indicador = document.createElement("div");
      indicador.id = "kf-password-indicator";
      indicador.style.cssText = "font-size:0.82rem; margin-top:6px; padding:8px 10px; background:rgba(255,255,255,0.07); border-radius:6px; border:1px solid rgba(255,255,255,0.15);";
      campo.parentNode.insertBefore(indicador, campo.nextSibling);
    }

    // Si no hay contraseña, ocultamos el indicador
    if (!password) return indicador.style.display = "none";

    // Semuestra el indicador y genera el HTML con cada requisito
    indicador.style.display = "block";
    indicador.innerHTML = REGLAS.map(r => {
      const ok = r.test(password); // Verificamos si cumple la regla actual
      return `<div style="color:${ok ? '#4caf50' : '#ff6b6b'}; line-height:1.7;">${ok ? '✅' : '❌'} ${r.texto}</div>`;
    }).join("");
  }

  // Función que muestra mensajes de alerta al usuario (éxito o error)
  function mostrarAlerta(mensajes, tipo) {
    const container = document.getElementById("alertContainer");
    if (!container) return;
    //Se muestra el ícono según el tipo de alerta (éxito o error)
    const icono = tipo === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill";
    container.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show shadow-lg" role="alert">
        <div class="d-flex align-items-center"><i class="bi ${icono} me-2 fs-5"></i><strong>${tipo === 'success' ? '¡Éxito!' : 'Verifica:'}</strong></div>
        <ul class="mb-0 mt-2">${mensajes.map(m => `<li>${m}</li>`).join("")}</ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
  }

  // procesa el registro de usuarios
  async function registrarUsuario() {
    const campos = ["nombre", "apellido", "telefono", "correo", "password", "confirmPassword"];
    const val = id => (document.getElementById(id)?.value || "").trim();
    let errores = [];

    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(val("nombre"))) errores.push("El nombre solo debe contener letras");
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(val("apellido"))) errores.push("El apellido solo debe contener letras");
    if (!/^\d{10}$/.test(val("telefono"))) errores.push("El teléfono debe contener exactamente 10 números");

    campos.slice(0, 4).forEach(c => { if (!val(c)) errores.push(`Ingresa tu ${c}`); });

    if (val("password") && val("password") !== val("confirmPassword")) errores.push("Las contraseñas no coinciden");

    if (val("password")) {
      const pwErrors = REGLAS.filter(r => !r.test(val("password"))).map(r => r.texto);
      errores = [...errores, ...pwErrors];
    }

    if (errores.length > 0) return mostrarAlerta(errores, "danger");

    // mandamos a traer la api para procesar el registro
    try {
      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: val("nombre"),
          apellido: val("apellido"),
          telefono: val("telefono"),
          correo: val("correo"),
          contrasena: val("password"),
          rol: "cliente",
          estado: "activo"
        })
      });

      if (response.status === 409) return mostrarAlerta(["Este correo ya está registrado"], "danger");
      if (!response.ok) return mostrarAlerta(["Error al crear la cuenta. Intenta de nuevo."], "danger");

      mostrarAlerta([`¡Cuenta creada exitosamente! Bienvenido, ${val("nombre")}.`], "success");
      document.getElementById("kf-password-indicator")?.remove();
      document.getElementById("btnCrearCuenta").style.display = "none";

      setTimeout(() => {
        gestionarModal("hide");
        window.location.href = "./login.html";
      }, 1300);

    } catch (err) {
      mostrarAlerta(["Error de conexión con el servidor."], "danger");
    }
  }

  // inicialización 
  async function init() {
    await inyectarModal();

    document.addEventListener("input", e => {
      if (e.target?.id === "password") mostrarIndicador(e.target.value);
    });

    document.addEventListener("click", e => {
      const targetId = e.target?.id;
      if (targetId === "btnCrearCuenta") registrarUsuario();
      if (targetId === "linkIrALogin") { e.preventDefault(); gestionarModal("hide"); window.location.href = "./login.html"; }

      const trigger = e.target.closest('[data-bs-target="#registroModal"]');
      if (trigger) { e.preventDefault(); gestionarModal("show"); }
    });

    let intentos = 0;
    const comprobar = setInterval(() => {
      if (conectarBotonRegistro() || ++intentos >= 20) clearInterval(comprobar);
    }, 150);

    document.addEventListener("headerCargado", conectarBotonRegistro);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();