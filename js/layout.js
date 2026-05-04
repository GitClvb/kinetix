async function loadComponent(id, file) {
    const response = await fetch(file);
    const data = await response.text();
    document.getElementById(id).innerHTML = data;
}

// cargar header
loadComponent("header-container", "./components/header.html");

// cargar footer
loadComponent("footer-container", "./components/footer.html");

// ==========================
// ACTIVE NAV LINK
// ==========================
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