// 1. COMPROBACIÓN DE SESIÓN INMEDIATA (Antes de pintar algo)
const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const paginaActual = window.location.pathname.split("/").pop();

// 2. PROTECCIÓN DE RUTAS (Seguridad básica)
if (paginaActual === "admin-producto.html") {
    // Si intenta entrar a admin pero no está logueado O no es admin, se manda al login
    if (!isAuthenticated || !currentUser || currentUser.role !== "admin") {
        window.location.replace("login.html"); 
    }
}

// 3. FUNCIÓN DE CARGA OPTIMIZADA
async function inicializarLayout() {
    // Si es la página de administración, cargamos su header dedicado
    if (paginaActual === "admin-producto.html") {
        await loadComponent("header-container-admin", "./components/header-admin.html");
    } else {
        // Para todas las demás se carga el header de usuario
        await loadComponent("header-container", "./components/header-usuario.html");
        
        // Ejecutamos la lógica del cliente INMEDIATAMENTE después de que el header cargó
        gestionarInterfazUsuario(isAuthenticated, currentUser);
    }

    // El footer se carga para todos de manera independiente
    if (paginaActual !== "admin-producto.html") {
        await loadComponent("footer-container", "./components/footer.html");
    }
}

// 4. CONTROLADOR DE INTERFAZ (Une Login y Logout en un solo lugar)
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
                    <li><a class="dropdown-item text-danger" href="#" id="globalBtnLogout">Salir</a></li>
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

// 5. ESCUCHA GLOBAL DE EVENTOS (Logout único para toda la app)
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "globalBtnLogout") {
        e.preventDefault();
        localStorage.clear(); // Limpia todo 
        window.location.replace("index.html");
    }
});

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

// Arrancar toda la lógica
inicializarLayout();