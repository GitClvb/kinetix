const ADMIN_PAGES = [
    "admin-dashboard.html",
    "admin-producto.html",
    "admin-clientes.html",
    "admin-pedidos.html"
];

function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem("currentUser")
    );
}

function isAuthenticated() {
    return localStorage.getItem(
        "isAuthenticated"
    ) === "true";
}

// PROTEGER RUTAS ADMIN
function protectAdminRoutes() {

    const paginaActual =
        window.location.pathname.split("/").pop();

    if (!ADMIN_PAGES.includes(paginaActual)) {
        return;
    }

    const user = getCurrentUser();

    if (
        !isAuthenticated() ||
        !user ||
        user.role !== "admin"
    ) {
        window.location.replace("login.html");
    }
}

// LOGOUT GLOBAL
function logout() {

    localStorage.removeItem(
        "kinetix_user_logged"
    );

    localStorage.removeItem(
        "isAuthenticated"
    );

    localStorage.removeItem(
        "currentUser"
    );

    window.location.replace("index.html");
}

document.addEventListener("click", (e) => {

    const btnLogout =
        e.target.closest("#btnLogout");

    if (!btnLogout) return;

    e.preventDefault();

    logout();
});

protectAdminRoutes();