const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

if (!idProducto) {
    window.location.href = "catalogo.html";
}

let producto = null;
let tallaSeleccionada = null;
let colorSeleccionado = null;

// Mapeo { nombreTalla → idVariante } para el color seleccionado
let mapaVariantes = {};

const nombreProducto = document.getElementById("nombre-producto");
const categoriaProducto = document.getElementById("categoria-producto");
const precioProducto = document.getElementById("precio-producto");
const imagenPrincipal = document.getElementById("imagen-principal");
const contenedorTallas = document.getElementById("contenedor-tallas");
const contenedorColores = document.getElementById("contenedor-colores");
const descripcionProducto = document.getElementById("descripcion-producto");
const botonCarrito = document.querySelector(".btn-agregar-carrito");

/* Carga de productos*/
async function cargarProducto() {
    try {
        const response = await fetch(
            `http://localhost:8080/productos/detalle/${idProducto}`
        );
        if (!response.ok) throw new Error("Error al cargar producto");

        producto = await response.json();
        inicializarProducto();

    } catch (error) {
        console.error(error);
        window.location.href = "catalogo.html";
    }
}

function inicializarProducto() {

    nombreProducto.textContent = producto.nombre;
    categoriaProducto.textContent = producto.categoria;
    precioProducto.textContent = producto.precio;
    imagenPrincipal.src = producto.colores[0].imagen;
    imagenPrincipal.alt = producto.nombre;
    descripcionProducto.textContent = producto.descripcion || "";

    botonCarrito.dataset.nombre = producto.nombre;
    botonCarrito.dataset.precio = producto.precio.replace("$", "");
    botonCarrito.dataset.imagen = producto.colores[0].imagen;

    botonCarrito.setAttribute("data-producto-detalle", "true");

    renderColores();
}

function renderTallas(colorData) {
    tallaSeleccionada = null;

    // Limpia idVariante previo para que la validación en cart.js funcione
    botonCarrito.removeAttribute("data-id-variante");
    mapaVariantes = {};
    if (Array.isArray(colorData.variantes)) {
        colorData.variantes.forEach(v => {
            mapaVariantes[v.nombreTalla] = v.idVariante;
        });
    }

    // Render de botones de talla
    contenedorTallas.innerHTML = (colorData.talla || [])
        .map(talla => `
            <button class="size-btn" data-talla="${talla}">
                ${talla}
            </button>
        `)
        .join("");

    const botonesTalla = contenedorTallas.querySelectorAll(".size-btn");

    botonesTalla.forEach(btn => {
        btn.addEventListener("click", () => {
            botonesTalla.forEach(b => b.classList.remove("active-size"));
            btn.classList.add("active-size");

            tallaSeleccionada = btn.dataset.talla;
            botonCarrito.dataset.talla = tallaSeleccionada;

            // Se crea ID variante para que sea la combinación de los IDS de la talla y color
            const idVariante = mapaVariantes[tallaSeleccionada];
            if (idVariante) {
                botonCarrito.dataset.idVariante = idVariante;
            } else {
                console.warn(`No se encontró idVariante para talla "${tallaSeleccionada}"`);
                botonCarrito.removeAttribute("data-id-variante");
            }
        });
    });
}

function renderColores() {
    if (!producto.colores?.length) return;

    contenedorColores.innerHTML = producto.colores
        .map(color => `
            <span
                class="color-dot"
                data-color="${color.codigo}"
                data-imagen="${color.imagen}"
                style="background:${color.codigo}">
            </span>
        `)
        .join("");

    const puntosColor = document.querySelectorAll(".color-dot");

    puntosColor.forEach(dot => {
        dot.addEventListener("click", () => {
            puntosColor.forEach(c => c.classList.remove("active-color"));
            dot.classList.add("active-color");

            const colorActual = producto.colores.find(
                c => c.codigo === dot.dataset.color
            );

            colorSeleccionado = colorActual.codigo;
            botonCarrito.dataset.color = colorSeleccionado;
            botonCarrito.dataset.imagen = colorActual.imagen;
            imagenPrincipal.src = colorActual.imagen;
            renderTallas(colorActual);
        });
    });

    // Selecciona el primer color automáticamente
    const primerColor = document.querySelector(".color-dot");
    if (primerColor) primerColor.click();
}


const inputCantidad = document.getElementById("cantidad-producto");

document.getElementById("btn-sumar-cantidad")
    .addEventListener("click", () => {
        inputCantidad.value = Number(inputCantidad.value) + 1;
    });

document.getElementById("btn-restar-cantidad")
    .addEventListener("click", () => {
        if (Number(inputCantidad.value) > 1) {
            inputCantidad.value = Number(inputCantidad.value) - 1;
        }
    });

cargarProducto();