document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const alertContainer =
        document.getElementById("alertContainer");

    function showAlert(message, type = "danger") {

        if (!alertContainer) return;

        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginInput = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!loginInput || !password) {
            showAlert("Todos los campos son obligatorios.");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        correo: loginInput,
                        contrasena: password
                    })
                }
            );

           /* if (!response.ok) {
                showAlert("Usuario o contraseña inválidos.");
                return;
            }*/

            if (!response.ok) {

    const text = await response.text();

    console.error("Backend error:", text);

    showAlert("Error en login (ver consola)");
    return;
}

            const userFound = await response.json();

            localStorage.setItem(
                "kinetix_user_logged",
                "true"
            );

            localStorage.setItem(
                "isAuthenticated",
                "true"
            );

            localStorage.setItem(
                "currentUser",
                JSON.stringify(userFound)
            );

            showAlert(
                "Inicio de sesión exitoso.",
                "success"
            );

            setTimeout(() => {

                // OJO: en backend es "rol", no "role"
                if (userFound.rol === "admin") {
                    window.location.href =
                        "admin-dashboard.html";
                } else {
                    window.location.href =
                        "index.html";
                }

            }, 900);

        } catch (error) {

            showAlert(
                "Error de conexión con el servidor."
            );
        }
    });
});