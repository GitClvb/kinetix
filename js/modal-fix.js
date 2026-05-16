(function () {

  // ─── 1. INYECTAR MODAL EN EL BODY ────────────────────────────────────────────
  // Crea el contenedor del modal y lo inyecta directo en el body.
  // No depende de re-modal.html ni de fetch; el HTML está embebido aquí.

  function inyectarModal() {
    if (document.getElementById("registroModal")) return; // ya existe

    var wrapper = document.createElement("div");
    wrapper.id = "kfModalWrapper";
    wrapper.innerHTML = [
      '<div class="modal fade" id="registroModal" tabindex="-1" aria-hidden="true">',
      '  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">',
      '    <div class="modal-content bg-dark text-white border-0 shadow-lg">',

      '      <div class="modal-header border-bottom border-secondary">',
      '        <h5 class="modal-title fw-bold text-uppercase" style="letter-spacing:1px;">',
      '          <span class="text-orange">Únete</span> al Team',
      '        </h5>',
      '        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>',
      '      </div>',

      '      <div class="modal-body p-4">',
      '        <div id="alertContainer"></div>',

      '        <form id="registerForm" autocomplete="off">',

      '          <div class="mb-3">',
      '            <input type="text" id="nombre" class="form-control input-kinetix"',
      '                   placeholder="Nombre completo">',
      '          </div>',

      '          <div class="mb-3">',
      '            <input type="tel" id="telefono" class="form-control input-kinetix"',
      '                   placeholder="Teléfono">',
      '          </div>',

      '          <div class="mb-3">',
      '            <input type="email" id="correo" class="form-control input-kinetix"',
      '                   placeholder="Correo electrónico">',
      '          </div>',

      '          <div class="mb-3">',
      '            <input type="password" id="password" class="form-control input-kinetix"',
      '                   placeholder="Contraseña" autocomplete="new-password">',
      '            <!-- El indicador de contraseña se inserta aquí dinámicamente -->',
      '          </div>',

      '          <div class="mb-4">',
      '            <input type="password" id="confirmPassword" class="form-control input-kinetix"',
      '                   placeholder="Confirmar contraseña" autocomplete="new-password">',
      '          </div>',

      '          <button type="button" id="btnCrearCuenta"',
      '                  class="btn btn-kinetix w-100 py-2 fw-bold text-uppercase">',
      '            Crear cuenta',
      '          </button>',

      '        </form>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("\n");

    document.body.appendChild(wrapper);
  }

  // ─── 2. CONECTAR BOTÓN DE REGISTRO ───────────────────────────────────────────
  // Busca #btn-registro en el documento (ya sea inline o inyectado por layout.js)
  // y le asigna la apertura del modal de Bootstrap.

  function conectarBotonRegistro() {
    var btn = document.getElementById("btn-registro");
    if (!btn) return false;

    // Quitar atributos data-bs previos para evitar duplicados
    btn.removeAttribute("data-bs-toggle");
    btn.removeAttribute("data-bs-target");

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      abrirModal();
    });

    return true;
  }

  function abrirModal() {
    var modalEl = document.getElementById("registroModal");
    if (!modalEl) return;

    // Bootstrap 5: obtener instancia existente o crear una nueva
    var modalInstance =
      (window.bootstrap && window.bootstrap.Modal.getInstance(modalEl)) ||
      (window.bootstrap && new window.bootstrap.Modal(modalEl));

    if (modalInstance) {
      modalInstance.show();
    }
  }

  // ─── 3. VALIDADOR DE CONTRASEÑA EN TIEMPO REAL ───────────────────────────────

  var REGLAS = [
    {
      texto: "Mínimo 6 caracteres",
      test: function (p) { return p.length >= 6; }
    },
    {
      texto: "Al menos una letra MAYÚSCULA",
      test: function (p) { return /[A-Z]/.test(p); }
    },
    {
      texto: "Al menos una letra minúscula",
      test: function (p) { return /[a-z]/.test(p); }
    },
    {
      texto: "Al menos un número",
      test: function (p) { return /\d/.test(p); }
    },
    {
      texto: "Al menos un carácter especial (@$!%*?&.#-)",
      test: function (p) { return /[@$!%*?&.#\-]/.test(p); }
    }
  ];

  function mostrarIndicador(password) {
    var campo = document.getElementById("password");
    if (!campo) return;

    var indicador = document.getElementById("kf-password-indicator");

    if (!indicador) {
      indicador = document.createElement("div");
      indicador.id = "kf-password-indicator";
      indicador.style.cssText =
        "font-size:0.82rem; margin-top:6px; padding:8px 10px;" +
        "background:rgba(255,255,255,0.07); border-radius:6px;" +
        "border:1px solid rgba(255,255,255,0.15);";
      campo.parentNode.insertBefore(indicador, campo.nextSibling);
    }

    if (!password) {
      indicador.style.display = "none";
      return;
    }

    indicador.style.display = "block";
    indicador.innerHTML = REGLAS.map(function (r) {
      var ok = r.test(password);
      return (
        '<div style="color:' + (ok ? "#4caf50" : "#ff6b6b") + ';line-height:1.7;">' +
        (ok ? "✅" : "❌") + " " + r.texto +
        "</div>"
      );
    }).join("");
  }

  // ─── 4. VALIDACIÓN AL ENVIAR ─────────────────────────────────────────────────

  function getPasswordErrors(password) {
    return REGLAS
      .filter(function (r) { return !r.test(password); })
      .map(function (r) { return r.texto; });
  }

  function mostrarAlerta(mensajes, tipo) {
    var container = document.getElementById("alertContainer");
    if (!container) return;

    var icono = tipo === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill";
    var titulo = tipo === "success" ? "¡Éxito!" : "Verifica lo siguiente:";

    container.innerHTML =
      '<div class="alert alert-' + tipo + ' alert-dismissible fade show shadow-lg" role="alert">' +
      '  <div class="d-flex align-items-center">' +
      '    <i class="bi ' + icono + ' me-2 fs-5"></i>' +
      '    <strong>' + titulo + '</strong>' +
      '  </div>' +
      '  <ul class="mb-0 mt-2">' +
      mensajes.map(function (m) { return "<li>" + m + "</li>"; }).join("") +
      '  </ul>' +
      '  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
      "</div>";
  }

  function registrarUsuario() {
    var nombre          = (document.getElementById("nombre")          || {}).value || "";
    var telefono        = (document.getElementById("telefono")        || {}).value || "";
    var correo          = (document.getElementById("correo")          || {}).value || "";
    var password        = (document.getElementById("password")        || {}).value || "";
    var confirmPassword = (document.getElementById("confirmPassword") || {}).value || "";

    nombre   = nombre.trim();
    telefono = telefono.trim();
    correo   = correo.trim();

    var errores = [];

    if (!nombre)   errores.push("Ingresa tu nombre");
    if (!telefono) errores.push("Ingresa tu teléfono");
    if (!correo)   errores.push("Ingresa tu correo");
    if (!password) errores.push("Ingresa una contraseña");

    if (password && password !== confirmPassword) {
      errores.push("Las contraseñas no coinciden");
    }

    if (password) {
      var pwErrors = getPasswordErrors(password);
      errores = errores.concat(pwErrors);
    }

    if (errores.length > 0) {
      mostrarAlerta(errores, "danger");
      return;
    }

    // Guardar usuario
    localStorage.setItem("user", JSON.stringify({ nombre: nombre, telefono: telefono, correo: correo }));
    mostrarAlerta(["¡Cuenta creada exitosamente! Bienvenido a KinetixFit, " + nombre + "."], "success");

    // Ocultar indicador y botón
    var indicador = document.getElementById("kf-password-indicator");
    if (indicador) indicador.style.display = "none";

    var btnCrear = document.getElementById("btnCrearCuenta");
    if (btnCrear) btnCrear.style.display = "none";

    // Cerrar modal y limpiar tras 2.5 s
    setTimeout(function () {
      var modalEl = document.getElementById("registroModal");
      if (modalEl && window.bootstrap) {
        var m = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        m.hide();
      }

      var form = document.getElementById("registerForm");
      if (form) form.reset();

      var ac = document.getElementById("alertContainer");
      if (ac) ac.innerHTML = "";

      if (btnCrear) btnCrear.style.display = "block";

      var ind2 = document.getElementById("kf-password-indicator");
      if (ind2) ind2.style.display = "none";
    }, 2500);
  }

  // ─── 5. ARRANQUE ─────────────────────────────────────────────────────────────

  function init() {
    // 5a. Inyectar modal
    inyectarModal();

    // 5b. Escuchar input de contraseña (delegación en document para capturar
    //     aunque el modal se abra después)
    document.addEventListener("input", function (e) {
      if (e.target && e.target.id === "password") {
        mostrarIndicador(e.target.value);
      }
    });

    // 5c. Escuchar clic en "Crear cuenta" (delegación)
    document.addEventListener("click", function (e) {
      if (e.target && e.target.id === "btnCrearCuenta") {
        registrarUsuario();
      }
    });

    // 5d. Conectar botón de registro.
    //     El header puede cargarse después (layout.js es async), así que
    //     intentamos varias veces con un pequeño polling.
    var intentos = 0;
    var maxIntentos = 20;   // 20 × 150 ms = 3 s máximo de espera

    function intentarConectar() {
      if (conectarBotonRegistro()) return; // ¡encontrado!
      intentos++;
      if (intentos < maxIntentos) {
        setTimeout(intentarConectar, 150);
      }
    }

    intentarConectar();

    // 5e. Escuchar el evento personalizado que layout.js puede emitir
    document.addEventListener("headerCargado", function () {
      conectarBotonRegistro();
    });

    // 5f. Delegación extra: cualquier elemento con data-bs-target="#registroModal"
    //     abrirá el modal aunque Bootstrap no lo haya inicializado todavía.
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest('[data-bs-target="#registroModal"]');
      if (trigger) {
        e.preventDefault();
        abrirModal();
      }
    });
  }

  // Ejecutar en cuanto el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();