// control de sesión
const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const paginaActual = window.location.pathname.split("/").pop();

// proteccion de rutas
if (paginaActual === "admin-producto.html") {
    // Si intenta entrar a admin pero no está logueado O no es admin, se manda al login
    if (!isAuthenticated || !currentUser || currentUser.role !== "admin") {
        window.location.replace("login.html"); 
    }
}

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

// 5. ESCUCHA GLOBAL DE EVENTOS (Logout único para toda la app)
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "globalBtnLogout") {
        e.preventDefault();
        
        // MODIFICACIÓN PASO 4: Limpiar bandera global de permisos de compra
        localStorage.removeItem("kinetix_user_logged");
        
        // Limpieza de banderas de autenticación nativas del sitio
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUser");
        
        // Redireccionar al usuario de forma segura a la Landing Page
        window.location.replace("index.html");
    }
});

// Arranca toda la lógica
inicializarLayout();