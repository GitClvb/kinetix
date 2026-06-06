const paginaActual = window.location.pathname.split("/").pop();
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
const isLogged = localStorage.getItem("isAuthenticated") === "true";
const isAdminPage = paginaActual.startsWith("admin-");


function activateNav() {
    const links = document.querySelectorAll(".nav-link");
    let currentPath = window.location.pathname.split("/").pop();

    if (currentPath === "" || currentPath === "/") {
        currentPath = "index.html";
    }

    links.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (!linkHref) return;

        // Limpiamos barras iniciales
        const linkPage = linkHref.replace(/^\//, "");

        // Limpiamos estados previos
        link.classList.remove("nav-active", "fw-bold");

        // Comparación exacta de la página
        if (currentPath === linkPage) {
            link.classList.add("nav-active", "fw-bold");
        }
    });
}

// controla la interfaz
function gestionarInterfazUsuario(isLogged, user) {
    const mobileContainer = document.getElementById("auth-buttons-mobile");
    const desktopContainer = document.getElementById("auth-buttons-desktop");

    if (!mobileContainer || !desktopContainer) return;

    if (isLogged && user && user.role === "cliente") {
        // Si tiene sesión, cambiamos el HTML interno por el Avatar
        const initials = (user.nombre.charAt(0) + (user.apellido?.charAt(0) || "")).toUpperCase();
        const profileHTML = `
            <div class="dropdown">
                <button class="btn-profile dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <div class="avatar-circle">${initials}</div>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow">
                    <li class="dropdown-header fw-bold">${user.nombre} ${user.apellido}</li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="btnLogout">Salir</a></li>
                </ul>
            </div>`;

        mobileContainer.innerHTML = profileHTML;
        desktopContainer.innerHTML = profileHTML;
    } else {
        // Si NO tiene sesión, muestra el botón de Registro
        const registroHTML = `<a class="btn btn-registro-trigger" href="#">Registro</a>`;
        mobileContainer.innerHTML = registroHTML;
        desktopContainer.innerHTML = registroHTML;
    }
}

// Auxiliar para cargar componentes 
async function loadComponent(id, file) {
    const container = document.getElementById(id);
    if (!container) return;
    try {
        const response = await fetch(file);
        const data = await response.text();
        container.innerHTML = data;
        activateNav();
    } catch (error) {
        console.error("Error cargando componente:", error);
    }
}

async function inicializarLayout() {

    if (paginaActual === "admin-dashboard.html") {
        return;
    }

    if (isAdminPage) {
        await loadComponent("header-container-admin", "./components/header-admin.html"
        );
        return;
    }
    await loadComponent("header-container", "./components/header-usuario.html");
    gestionarInterfazUsuario(isLogged, currentUser
    );
    await loadComponent("footer-container", "./components/footer.html"
    );

}

// Arranca toda la lógica
inicializarLayout();