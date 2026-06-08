document.addEventListener("DOMContentLoaded", () => {

    // Creo un usuario admin predeterminado
    const demoUser = {
        nombre: "admin",
        password: "Admin123!",
        correo: "admin@gmail.com",
        role: "admin"
    };

    // Guardo en local storage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.find(user => user.role === "admin");

    if (!adminExists) {
        users.push(demoUser);
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Traer los elementos HTML
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const alertContainer = document.getElementById("alertContainer");

    // Función para mostrar alerta
    function showAlert(message, type = "danger") {
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const loginInput = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Validar campos vacíos - CORREGIDO: usar loginInput en lugar de nombre
            if (loginInput === "" || password === "") {
                showAlert("Todos los campos son obligatorios.");
                return;
            }

            // Obtener usuarios
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Buscar usuario por nombre o correo
            const userFound = users.find(user =>
                (user.nombre === loginInput || user.correo === loginInput) &&
                user.password === password
            );

            // Login exitoso
            if (userFound) {
                // MODIFICACIÓN PASO 1: Guarda la sesión global para desbloquear la compra
                localStorage.setItem("kinetix_user_logged", "true");

                // Tus banderas de sesión actuales
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("currentUser", JSON.stringify(userFound));

                showAlert("Inicio de sesión exitoso.", "success");

                // Redireccionar según el rol
                setTimeout(() => {
                    if (userFound.role === "admin") {
                        window.location.href = "admin-producto.html";
                    } else {
                        window.location.href = "index.html";
                    }
                }, 900);
            } else {
                showAlert("Usuario o contraseña inválidos.");
            }
        });
    }

    // Botón para salir
    document.addEventListener("click", (e) => {

        const btnLogout = e.target.closest("#btnLogout");
        if (!btnLogout) return;
        e.preventDefault();
        
        // Eliminar sesión completa al salir
        localStorage.removeItem("kinetix_user_logged"); // Quita el permiso de compra
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUser");
        
        // Redireccionar
        window.location.replace("index.html");
    });
});