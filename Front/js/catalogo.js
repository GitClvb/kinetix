// Obtención de filtro genero si es que se dirige desde el index
const generoSeleccionado =
    localStorage.getItem("generoSeleccionado");

/* =========================
PRODUCTOS
========================= */

const productos = {
    hombre: [
        {
            nombre: "Playera Oversize Black", categoria: "Playera", precio: "$599",
            colores: [
                {
                    codigo: "#000000",
                    imagen: "./img/hombre1-negro.jpg",
                    talla: ["CH", "M"]
                },
                {
                    codigo: "#FFFFFF",
                    imagen: "./img/hombre1-blanco.webp",
                    talla: ["G"]
                }
            ],
            descripcion: "Descripcion del articulo numero 1. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda consequuntur voluptatibus eos non quis, quasi reprehenderit modi error quae quas voluptates ex, eveniet, a placeat optio asperiores atque temporibus quaerat!"
        },
        { nombre: "Short Performance", categoria: "Short", precio: "$499", imagen: "./img/hombre2.webp", talla: ["CH", "M"], color: ["#FFFFFF", "#000000"] },
        { nombre: "Sudadera Urban Fit", categoria: "Sudadera", precio: "$899", imagen: "./img/hombre3.webp", talla: ["CH"], color: ["#FFFFFF", "#ff0000"] },
        { nombre: "Tank Essential", categoria: "Tank", precio: "$450", imagen: "./img/hombre4.jpg", talla: ["M"], color: ["#FFFFFF"] },
        { nombre: "Jogger Elite", categoria: "Jogger", precio: "$799", imagen: "./img/hombre5.jpg", talla: ["G"], color: ["#000000"] },
        { nombre: "Hoodie Motion", categoria: "Sudadera", precio: "$999", imagen: "./img/hombre6.jpg", talla: ["CH", "M"], color: ["#FFFFFF", "#000000"] },
        { nombre: "Compression Tee", categoria: "Playera", precio: "$650", imagen: "./img/hombre7.jpg", talla: ["CH", "M"], color: ["#00ff44", "#5f1a1a"] },
        { nombre: "Short Alpha", categoria: "Short", precio: "$520", imagen: "./img/hombre8.jpg", talla: ["CH"], color: ["#FFFFFF", "#000000"] },
        { nombre: "Playera Kinetix Core", categoria: "Playera", precio: "$580", imagen: "./img/hombre9.jpg", talla: ["G"], color: ["#FFFFFF", "#000000"] },
        { nombre: "Pants Active", categoria: "Pants", precio: "$850", imagen: "./img/hombre10.jpg", talla: ["G"], color: ["#FFFFFF", "#000000"] }
    ],
    mujer: [
        { nombre: "Top Energy", categoria: "Top", precio: "$549", imagen: "./img/mujer1.jpg" },
        { nombre: "Leggings Sculpt", categoria: "Leggings", precio: "$799", imagen: "./img/mujer2.jpg" },
        { nombre: "Playera Fit Motion", categoria: "Playera", precio: "$599", imagen: "./img/mujer3.jpg" },
        { nombre: "Short Flex", categoria: "Short", precio: "$499", imagen: "./img/mujer4.jpg" },
        { nombre: "Sudadera Active", categoria: "Sudadera", precio: "$950", imagen: "./img/mujer5.jpg" },
        { nombre: "Top Seamless", categoria: "Top", precio: "$620", imagen: "./img/mujer6.jpg" },
        { nombre: "Leggings Motion", categoria: "Leggings", precio: "$850", imagen: "./img/mujer7.jpg" },
        { nombre: "Jogger Balance", categoria: "Jogger", precio: "$770", imagen: "./img/mujer8.jpg" },
        { nombre: "Playera Energy", categoria: "Playera", precio: "$560", imagen: "./img/mujer9.jpg" },
        { nombre: "Hoodie Premium", categoria: "Sudadera", precio: "$1050", imagen: "./img/mujer10.jpg" }
    ]
};

/* =========================
VARIABLES
========================= */

const grid = document.getElementById("catalogo-grid");
const contenedorCategorias = document.getElementById("contenedor-categorias");

let generoActual =
    generoSeleccionado || "hombre";

localStorage.removeItem(
    "generoSeleccionado"
);

let categoriaActual = "Todas";

/* =========================
OBTENER CATEGORIAS Y TALLAS
========================= */

function obtenerTallasSeleccionadas() {

    return [...document.querySelectorAll(".filtro-talla:checked")]
        .map(checkbox => checkbox.value);

}

function obtenerCategorias(genero) {
    const categorias = productos[genero].map(producto => producto.categoria);
    return ["Todas", ...new Set(categorias)];
}

/* =========================
RENDER CATEGORIAS
========================= */

function renderCategorias(genero) {
    const categorias = obtenerCategorias(genero);
    contenedorCategorias.innerHTML = "";

    categorias.forEach((categoria, index) => {
        contenedorCategorias.innerHTML += `
            <button
                class="categoria-producto ${index === 0 ? "active-btn" : ""}"
                data-categoria="${categoria}">
                ${categoria}
            </button>
        `;
    });

    const botonesCategoria = document.querySelectorAll(".categoria-producto");

    botonesCategoria.forEach(btn => {
        btn.addEventListener("click", () => {
            botonesCategoria.forEach(b => {
                b.classList.remove("active-btn");
            });

            btn.classList.add("active-btn");
            categoriaActual = btn.dataset.categoria;
            mostrarProductos(generoActual, categoriaActual);
        });
    });

    const checkboxesTalla = document.querySelectorAll(".filtro-talla");

    checkboxesTalla.forEach(checkbox => {

        checkbox.addEventListener("change", () => {

            mostrarProductos(
                generoActual,
                categoriaActual
            );

        });

    });
    setTimeout(actualizarFlechas, 50);
}

/* =========================
MOSTRAR PRODUCTOS
========================= */

function crearCardProducto(producto) {

    const imagenPrincipal =
        producto.colores?.[0]?.imagen || producto.imagen || "";

    const tallas = producto.colores
        ? [...new Set(
            producto.colores.flatMap(color => color.talla || [])
        )]
        : (producto.talla || []);

    return `
        <div class="col-6 col-lg-6 col-xl-4">

            <div class="product-card">

                <img
                    src="${imagenPrincipal}"
                    alt="${producto.nombre}"
                    loading="lazy">

                <div class="product-info">

                    <span class="product-category">
                        ${producto.categoria}
                    </span>

                    <h5 class="product-title">
                        ${producto.nombre}
                    </h5>

                    <p class="product-price">
                        ${producto.precio}
                    </p>

                    <div class="product-sizes">

                        <span class="product-label">
                            Tallas
                        </span>

                        <div class="sizes-container">

                            ${tallas.map(talla => `
                                <span class="size-chip">
                                    ${talla}
                                </span>
                            `).join("")}

                        </div>

                    </div>

                    <div class="product-colors">

                        <span class="product-label">
                            Colores
                        </span>

                        <div class="colors-container">

                            ${(producto.colores || []).map(color => `
                                <span
                                    class="color-dot"
                                    style="background:${color.codigo}">
                                </span>
                            `).join("")}

                        </div>

                    </div>

                    <button
                        class="product-btn btn-ver-producto"
                        data-producto='${JSON.stringify(producto)}'>

                        <i class="bi bi-eye"></i>
                        Ver producto

                    </button>

                </div>

            </div>

        </div>
    `;
}

function crearEstadoVacio() {

    return `

        <div class="col-12">

            <div class="empty-state">

                <i class="bi bi-search"></i>

                <h4>
                    No encontramos productos
                </h4>

                <p>
                    Intenta cambiar los filtros seleccionados.
                </p>

            </div>

        </div>

    `;

}

function mostrarProductos(genero, categoria = "Todas") {
    const loader = document.getElementById("loader-catalogo");

    loader.classList.remove("d-none");
    grid.classList.add("grid-loading");

    setTimeout(() => {
        let productosFiltrados = productos[genero];

        if (categoria !== "Todas") {
            productosFiltrados = productosFiltrados.filter(producto => {
                return producto.categoria === categoria;
            });
        }

        const tallasSeleccionadas = obtenerTallasSeleccionadas();

        if (tallasSeleccionadas.length > 0) {

            productosFiltrados = productosFiltrados.filter(producto => {

                const tallasProducto = producto.colores
                    ? producto.colores.flatMap(color => color.talla || [])
                    : (producto.talla || []);

                return tallasProducto.some(talla =>
                    tallasSeleccionadas.includes(talla)
                );

            });

        }

        let html = "";

        if (productosFiltrados.length === 0) {

            html = crearEstadoVacio();

        } else {

            html = productosFiltrados
                .map(crearCardProducto)
                .join("");

        }

        grid.innerHTML = html;
        document.querySelectorAll(".btn-ver-producto")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    const producto =
                        JSON.parse(btn.dataset.producto);

                    localStorage.setItem(
                        "productoSeleccionado",
                        JSON.stringify(producto)
                    );

                    window.location.href =
                        "producto.html";

                });

            });

        loader.classList.add("d-none");
        grid.classList.remove("grid-loading");

    }, 350);
}

/* =========================
INICIALIZAR
========================= */

renderCategorias(generoActual);
mostrarProductos(generoActual);
const botonGeneroActivo =
    document.querySelector(
        `.categoria-btn[data-genero="${generoActual}"]`
    );

if (botonGeneroActivo) {
    botonGeneroActivo.classList.add(
        "active-genero"
    );
}
setTimeout(actualizarFlechas, 50);

/* =========================
BOTONES GENERO
========================= */

const botonesGenero = document.querySelectorAll(".categoria-btn");

botonesGenero.forEach(btn => {
    btn.addEventListener("click", () => {
        botonesGenero.forEach(b => {
            b.classList.remove("active-genero");
        });

        btn.classList.add("active-genero");

        generoActual = btn.dataset.genero;
        categoriaActual = "Todas";

        renderCategorias(generoActual);
        mostrarProductos(generoActual);
    });
});

const contenedor = document.getElementById("contenedor-categorias");

document.getElementById("scroll-right")
    ?.addEventListener("click", () => {

        contenedor.scrollBy({
            left: 250,
            behavior: "smooth"
        });

    });

document.getElementById("scroll-left")
    ?.addEventListener("click", () => {

        contenedor.scrollBy({
            left: -250,
            behavior: "smooth"
        });

    });

function actualizarFlechas() {

    const contenedor = document.getElementById("contenedor-categorias");
    const left = document.getElementById("scroll-left");
    const right = document.getElementById("scroll-right");

    if (!contenedor || !left || !right) return;

    // ocultar sólo en móvil real
    if (window.innerWidth <= 768) {
        left.style.display = "none";
        right.style.display = "none";
        return;
    }

    const maxScroll =
        contenedor.scrollWidth - contenedor.clientWidth;

    // si no hay overflow
    if (maxScroll <= 0) {
        left.style.display = "none";
        right.style.display = "none";
        return;
    }

    left.style.display =
        contenedor.scrollLeft > 5 ? "flex" : "none";

    right.style.display =
        contenedor.scrollLeft < maxScroll - 5 ? "flex" : "none";
}

window.addEventListener("resize", actualizarFlechas);
contenedor.addEventListener("scroll", actualizarFlechas);