/* =========================
OBTENER PRODUCTO
========================= */

const producto = JSON.parse(
    localStorage.getItem("productoSeleccionado")
);

if (!producto) {
    window.location.href = "catalogo.html";
}

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
    producto.imagen;

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
    producto.imagen;

/* =========================
RENDER TALLAS
========================= */

if (producto.talla?.length) {

    contenedorTallas.innerHTML =
        producto.talla
            .map(talla => `
                <button
                    class="size-btn"
                    data-talla="${talla}">
                    ${talla}
                </button>
            `)
            .join("");

    const botonesTalla =
        document.querySelectorAll(".size-btn");

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

/* =========================
RENDER COLORES
========================= */

if (producto.colores?.length) {

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

            colorSeleccionado =
                color.dataset.color;

            botonCarrito.dataset.color =
                colorSeleccionado;

            imagenPrincipal.src =
                color.dataset.imagen;

            botonCarrito.dataset.imagen =
                color.dataset.imagen;

        });

    });

}

const primerColor =
    document.querySelector(".color-dot");

if (primerColor) {
    primerColor.click();
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