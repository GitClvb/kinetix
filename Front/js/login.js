document.addEventListener("DOMContentLoaded", () => {

    const loginForm      = document.getElementById("loginForm");
    const usernameInput  = document.getElementById("username");
    const passwordInput  = document.getElementById("password");
    const alertContainer = document.getElementById("alertContainer");

    function showAlert(message, type = "danger") {
        if (!alertContainer) return;
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
    }

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginInput = usernameInput.value.trim();
        const password   = passwordInput.value.trim();

        if (!loginInput || !password) {
            showAlert("Todos los campos son obligatorios.");
            return;
        }

        try {
            // Autenticar 
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: loginInput, contrasena: password })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Backend error:", text);
                showAlert("Usuario o contraseña inválidos.");
                return;
            }

            const userFound = await response.json();

            //Guarda sesión 
            localStorage.setItem("currentUser", JSON.stringify({
                idUsuario: userFound.idUsuario,
                nombre:    userFound.nombre,
                rol:       userFound.rol
            }));
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("kinetix_user_logged", "true");

            // migra carrito localStorage → BD 
            if (typeof migrarCarritoLocal === 'function') {
                try {
                    await migrarCarritoLocal();
                } catch (migErr) {
                    // Fallo silencioso: el login continúa igual
                    console.warn('No se pudo migrar el carrito:', migErr.message);
                }
            } else {
                console.warn('migrarCarritoLocal no disponible — verifica que carritoApi.js se carga antes de login.js');
            }

            // Redirigir
            showAlert("Inicio de sesión exitoso.", "success");

            setTimeout(() => {
                window.location.href =
                    userFound.rol === "admin" ? "admin-dashboard.html" : "index.html";
            }, 900);

        } catch (error) {
            console.error(error);
            showAlert("Error de conexión con el servidor.");
        }
    });
});