/* =========================
OBTENER PRODUCTO
========================= */

const params =
    new URLSearchParams(window.location.search);

const idProducto =
    params.get("id");

if (!idProducto) {

    window.location.href =
        "catalogo.html";

}

let producto = null;
let tallaSeleccionada = null;
let colorSeleccionado = null;

/* =========================
REFERENCIAS DOM
========================= */

const nombreProducto =
    document.getElementById("nombre-producto");
const categoriaProducto =
    document.getElementById("categoria-producto");
const precioProducto =
    document.getElementById("precio-producto");
const imagenPrincipal =
    document.getElementById("imagen-principal");
const contenedorTallas =
    document.getElementById("contenedor-tallas");
const contenedorColores =
    document.getElementById("contenedor-colores");
const descripcionProducto =
    document.getElementById("descripcion-producto");
const botonCarrito =
    document.querySelector(".btn-agregar-carrito");

async function cargarProducto() {

    try {

        const response = await fetch(
            `http://localhost:8080/productos/detalle/${idProducto}`
        );

        if (!response.ok) {

            throw new Error(
                "Error al cargar producto"
            );

        }

        producto =
            await response.json();

        inicializarProducto();

    } catch (error) {

        console.error(error);

        window.location.href =
            "catalogo.html";

    }

}

function inicializarProducto() {


    /* =========================
    RENDER DATOS
    ========================= */

    nombreProducto.textContent =
        producto.nombre;

    categoriaProducto.textContent =
        producto.categoria;

    precioProducto.textContent =
        producto.precio;

    imagenPrincipal.src =
        producto.colores[0].imagen;

    imagenPrincipal.alt =
        producto.nombre;

    descripcionProducto.textContent =
        producto.descripcion || "";

    //Boton
    botonCarrito.dataset.nombre =
        producto.nombre;

    botonCarrito.dataset.precio =
        producto.precio.replace("$", "");

    botonCarrito.dataset.imagen =
        producto.colores[0].imagen;

    renderColores();
}

/* =========================
RENDER TALLAS
========================= */

function renderTallas(color) {

    tallaSeleccionada = null;

    contenedorTallas.innerHTML =
        color.talla
            .map(talla => `
                <button
                    class="size-btn"
                    data-talla="${talla}">
                    ${talla}
                </button>
            `)
            .join("");

    const botonesTalla =
        contenedorTallas.querySelectorAll(".size-btn");

    botonesTalla.forEach(btn => {

        btn.addEventListener("click", () => {

            botonesTalla.forEach(b =>
                b.classList.remove("active-size")
            );

            btn.classList.add("active-size");

            tallaSeleccionada =
                btn.dataset.talla;

            botonCarrito.dataset.talla =
                tallaSeleccionada;

        });

    });

}

// Render colores

function renderColores() {

    if (!producto.colores?.length) {
        return;
    }

    contenedorColores.innerHTML =
        producto.colores
            .map(color => `
                <span
                    class="color-dot"
                    data-color="${color.codigo}"
                    data-imagen="${color.imagen}"
                    style="background:${color.codigo}">
                </span>
            `)
            .join("");

    const colores =
        document.querySelectorAll(".color-dot");

    colores.forEach(color => {

        color.addEventListener("click", () => {

            colores.forEach(c =>
                c.classList.remove("active-color")
            );

            color.classList.add("active-color");

            const colorActual =
                producto.colores.find(
                    c => c.codigo === color.dataset.color
                );

            colorSeleccionado =
                colorActual.codigo;

            botonCarrito.dataset.color =
                colorSeleccionado;

            imagenPrincipal.src =
                colorActual.imagen;

            botonCarrito.dataset.imagen =
                colorActual.imagen;

            renderTallas(colorActual);

        });

    });

    const primerColor =
        document.querySelector(".color-dot");

    if (primerColor) {
        primerColor.click();
    }

}

const inputCantidad =
    document.getElementById("cantidad-producto");

document
    .getElementById("btn-sumar-cantidad")
    .addEventListener("click", () => {

        inputCantidad.value =
            Number(inputCantidad.value) + 1;

    });

document
    .getElementById("btn-restar-cantidad")
    .addEventListener("click", () => {

        if (Number(inputCantidad.value) > 1) {

            inputCantidad.value =
                Number(inputCantidad.value) - 1;

        }

    });

cargarProducto();