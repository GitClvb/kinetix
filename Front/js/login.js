document.addEventListener("DOMContentLoaded", () => {

    const demoUser = {
        nombre: "admin",
        password: "Admin123!",
        correo: "admin@gmail.com",
        role: "admin"
    };

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    const adminExists =
        users.find(user => user.role === "admin");

    if (!adminExists) {

        users.push(demoUser);

        localStorage.setItem("users", JSON.stringify(users)
        );
    }

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
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const loginInput = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!loginInput || !password) {
            showAlert("Todos los campos son obligatorios.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const userFound = users.find(user =>
            (
                user.nombre === loginInput ||
                user.correo === loginInput
            ) &&
            user.password === password
        );

        if (!userFound) {
            showAlert("Usuario o contraseña inválidos.");
            return;
        }

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
            if (userFound.role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href =
                    "index.html";
            }
        }, 900);
    });
});