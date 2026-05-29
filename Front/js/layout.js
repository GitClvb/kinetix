async function loadComponent(id, file) {

    const container = document.getElementById(id);

    // Verifica si el contenedor existe
    if (!container) return;

    const response = await fetch(file);
    const data = await response.text();

    container.innerHTML = data;

    // Activa nav
    activateNav();

    // navbar cliente
    if (id === "header-container") {

        renderClienteNavbar();

        // Evento para modal de registro
        document.dispatchEvent(
            new CustomEvent("headerCargado")
        );
    }
}

// Header cliente
loadComponent("header-container", "./components/header-usuario.html");

// Header admin
loadComponent("header-container-admin", "./components/header-admin.html");

// Footer
loadComponent("footer-container", "./components/footer.html");


// Activa nav
function activateNav() {

    const links = document.querySelectorAll(".nav-link");
    const currentPath = window.location.pathname;

    links.forEach(link => {

        const linkPath = link.getAttribute("href");

        if (currentPath.includes(linkPath)) {
            link.classList.add("nav-active", "fw-bold");
        }

    });
}


//Crea el boton salir aliniciar sesión un usuario
function renderClienteNavbar() {

    const authButtons =
        document.getElementById("auth-buttons");

    if (!authButtons) return;

    const isAuthenticated =
        localStorage.getItem("isAuthenticated");

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    // SOLO clientes autenticados
    if (
        isAuthenticated === "true" &&
        currentUser &&
        currentUser.role === "cliente"
    ) {

        authButtons.innerHTML = `
            <a class="btn-cta w-100 w-lg-auto" id="btnLogout" href="#"> SALIR </a>
        `;

        // Logout
        document
        .getElementById("btnLogout")
        .addEventListener("click", () => {

            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("currentUser");

            window.location.replace("index.html");

        });
    }
}