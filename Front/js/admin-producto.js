import {    getCategorias, agregarCategoria, getColores, agregarColor,getColorById} from "./catalogoService.js";
import {getProductos,getProductoById,crearProducto,actualizarProducto,cambiarEstado,getProductosAdmin} from "./productoService.js";
import {crearBloqueColor,leerDatosBloque,refrescarSelectoresColor} from "./colorBloque.js";

let _idEditando = null;

// Toast 
function mostrarToast(mensaje, tipo = "success") {
    const toast = document.getElementById("toastNotificacion");
    const body = document.getElementById("toastMensaje");
    if (!toast || !body) return;

    toast.classList.remove("bg-success", "bg-danger");
    toast.classList.add(tipo === "success" ? "bg-success" : "bg-danger");
    body.innerHTML = mensaje;
    bootstrap.Toast.getOrCreateInstance(toast).show();
}

// Cargar catálogos 
async function cargarCategorias() {

    const categorias =
        await getCategorias();

    const cmb =
        document.getElementById(
            "cmbCategoria"
        );

    if (!cmb) return;

    cmb.innerHTML =
        `<option value="" disabled selected>
            Selecciona una categoría
        </option>` +
        categorias.map(c =>
            `<option value="${c.id}">
                ${c.nombre}
            </option>`
        ).join("");

}

function getContenedor() {
    return document.getElementById("contenedorColores");
}

async function agregarBloqueColorUI(colorData = null) {
    const bloque = await crearBloqueColor(
        colorData,
        abrirModalColor
    );
    getContenedor().appendChild(bloque);
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btnEliminarColor");
    if (!btn) return;

    const bloques = document.querySelectorAll(".bloque-color");
    if (bloques.length === 1) {
        mostrarToast("Debe existir al menos un color.", "danger");
        return;
    }
    btn.closest(".bloque-color").remove();
});

// Modales para agregar 
function abrirModalCategoria() {
    const el = document.getElementById("modalCategoria");
    if (!el || !window.bootstrap) return;
    document.getElementById("nombreCategoria").value = "";
    new bootstrap.Modal(el).show();
}

function abrirModalColor(callback) {
    window._nuevoColorCallback = callback;
    const el = document.getElementById("modalColor");
    if (!el || !window.bootstrap) return;

    ["nombreColor", "codigoColorText"].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) inp.value = "";
    });
    const picker = document.getElementById("codigoColor");
    const preview = document.getElementById("previewColor");
    if (picker) picker.value = "#000000";
    if (preview) preview.style.backgroundColor = "#000000";

    new bootstrap.Modal(el).show();
}

function inicializarModales() {
    // --- Modal Categoría ---
    const btnGuardarCategoria = document.getElementById("guardarCategoriaBtn");
    if (btnGuardarCategoria) {
        btnGuardarCategoria.addEventListener("click", async () => {
            const input = document.getElementById("nombreCategoria");
            const nombre = input?.value.trim();
            if (!nombre) return mostrarToast("Ingresa un nombre válido.", "danger");

            const nueva = await agregarCategoria(nombre);   // ← catalogoService
            await cargarCategorias();
            document.getElementById("cmbCategoria").value = nueva.id;
            mostrarToast(`Categoría "${nueva.nombre}" agregada.`);
            bootstrap.Modal.getInstance(document.getElementById("modalCategoria"))?.hide();
            input.value = "";
        });
    }

    const picker = document.getElementById("codigoColor");
    const colorTx = document.getElementById("codigoColorText");
    const preview = document.getElementById("previewColor");

    if (picker && colorTx && preview) {
        picker.addEventListener("input", () => { colorTx.value = picker.value; preview.style.backgroundColor = picker.value; });
        colorTx.addEventListener("input", () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(colorTx.value)) {
                picker.value = colorTx.value;
                preview.style.backgroundColor = colorTx.value;
            }
        });
    }

    const btnGuardarColor = document.getElementById("guardarColorBtn");

if (btnGuardarColor) {
    btnGuardarColor.addEventListener("click", async () => {

        const nombre = document.getElementById("nombreColor")?.value.trim();
        const codigo = document.getElementById("codigoColorText")?.value.trim();

        if (!nombre)
            return mostrarToast("Ingresa un nombre válido.", "danger");

        if (!codigo || !/^#[0-9A-Fa-f]{6}$/.test(codigo))
            return mostrarToast("Código hexadecimal inválido.", "danger");

        try {

            const nuevo = await agregarColor(
                nombre,
                codigo
            );

            await refrescarSelectoresColor();

            mostrarToast(
                `Color "${nuevo.nombre}" agregado.`,
                "success"
            );

            bootstrap.Modal
                .getInstance(
                    document.getElementById("modalColor")
                )
                ?.hide();

            window._nuevoColorCallback?.(nuevo);
            window._nuevoColorCallback = null;

        } catch (error) {

            mostrarToast(
                error.message,
                "danger"
            );

        }

    });
}
}

// Guardar / Actualizar producto 
async function onSubmitProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById("txtNombreProducto")?.value.trim();
    const precio = parseFloat(document.getElementById("txtPrecioProducto")?.value);
    const categoriaId = document.getElementById("cmbCategoria")?.value;
    const genero = document.getElementById("cmbGenero")?.value;
    const descripcion = document.getElementById("txtDescripcion")?.value.trim();

    // Validaciones
    if (!nombre) return mostrarToast("Completa el nombre.", "danger");
    if (!precio || precio <= 0) return mostrarToast("Ingresa un precio válido.", "danger");
    if (!categoriaId) return mostrarToast("Selecciona una categoría.", "danger");
    if (!genero) return mostrarToast("Selecciona el género.", "danger");
    if (!descripcion || descripcion.length < 20)
        return mostrarToast("La descripción debe tener al menos 20 caracteres.", "danger");

    const bloques = document.querySelectorAll(".bloque-color");
    if (!bloques.length) return mostrarToast("Agrega al menos un color.", "danger");

    const coloresProducto = [];
    for (const bloque of bloques) {

        const {
            colorId,
            imagen,
            tallas
        } = leerDatosBloque(bloque);

        if (!colorId) {
            return mostrarToast(
                "Selecciona un color para todas las variantes.",
                "danger"
            );
        }

        if (!imagen) {
            return mostrarToast(
                "Cada color debe tener una imagen.",
                "danger"
            );
        }

        coloresProducto.push({
            idColor: Number(colorId),
            imagen,
            tallas
        });

    }

    const datos = {
        nombre,
        descripcion,
        precio,
        idCategoria: Number(categoriaId),
        genero,
        colores: coloresProducto
    };

    if (_idEditando) {

        try {

            await actualizarProducto(
                _idEditando,
                datos
            );

            mostrarToast(
                "Producto actualizado correctamente."
            );

            _idEditando = null;

            document.getElementById(
                "btnGuardarProducto"
            ).innerHTML =
                '<i class="bi bi-check2-circle"></i> Crear Producto';

            await resetFormulario();

            await cargarProductos();

            mostrarTab("tabListado");

        } catch (error) {

            console.error(error);

            mostrarToast(
                error.message,
                "danger"
            );

        }

        return;

    }

    try {

        await crearProducto(datos);

        mostrarToast(
            "Producto creado correctamente."
        );

        await resetFormulario();

        await cargarProductos();

        mostrarTab("tabListado");

    } catch (error) {

        console.error(error);

        mostrarToast(
            error.message,
            "danger"
        );

    }
}

async function resetFormulario() {

    document.getElementById(
        "frmProducto"
    )?.reset();

    getContenedor().innerHTML = "";

    await agregarBloqueColorUI();

    _idEditando = null;

}

// Tabla de productos 
async function cargarProductos() {
    const productos =
        await getProductosAdmin();   // ← productoService
    console.log(productos);
    const tbody = document.getElementById("tbodyProductos");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!productos.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos registrados</td></tr>';
        return;
    }

    productos.forEach(p => {
        const inactivo = p.estado === "inactivo";
        const estadoBadge = inactivo
            ? `<span class="badge bg-secondary">Inactivo</span>`
            : `<span class="badge bg-success">Activo</span>`;

        const tr = document.createElement("tr");
        if (inactivo) tr.classList.add("producto-inactivo");

        tr.innerHTML = `
            
                <td>${p.idProducto}</td>
                <td>
                    <img
                        src="${p.imagenPrincipal}"
                        alt="${p.nombre}"
                        style="
                            width:60px;
                            height:60px;
                            object-fit:cover;
                            border-radius:8px;
                        "
                    >
                </td>
                <td>
                    <strong>${p.nombre}</strong><br>
                    <small class="text-muted">${p.totalColores} color(es)</small>
                </td>
                <td>${p.categoria}</td>
                <td>${p.genero}</td>
                <td>$${Number(p.precio).toFixed(2)}</td>
                <td>${estadoBadge}</td>
            
            <td class="text-end">
                <div class="btn-group">
                    <button class="btn btn-info btn-sm"
                            onclick="verStock(${p.idProducto})"
                            title="Ver stock"
                            ${inactivo ? "disabled" : ""}>
                        <i class="bi bi-boxes"></i>
                    </button>
                    <button class="btn btn-warning btn-sm"
                            onclick="editarProducto(${p.idProducto})"
                            title="Editar"
                            ${inactivo ? "disabled" : ""}>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-${inactivo ? "success" : "secondary"} btn-sm"
                            onclick="cambiarEstadoProducto(${p.idProducto})"
                            title="${inactivo ? "Activar" : "Dar de baja"}">
                        <i class="bi bi-${inactivo ? "arrow-repeat" : "archive"}"></i>
                    </button>
                </div>
            </td>`;
        tbody.appendChild(tr);
    });
}

// mostrar stock 
async function verStock(id) {

    try {

        const producto =
            await getProductoById(id);

        const colores =
            await getColores();

        const html =
            producto.colores.map(c => {

                const info =
                    colores.find(
                        color => color.id === c.idColor
                    );

                const tallasDisponibles =
                    c.tallas.filter(
                        t => t.stock > 0
                    );

                const stock =
                    tallasDisponibles.length
                        ? tallasDisponibles
                            .map(t =>
                                `${t.talla}: ${t.stock}`
                            )
                            .join(", ")
                        : "Sin stock";

                return `
                    <div class="stock-item mb-3 p-2"
                        style="
                            border-left:4px solid ${info?.codigo || "#ccc"};
                            background:rgba(255,255,255,0.05);
                            border-radius:8px;
                        ">

                        <strong>
                            ${info?.nombre || "Color"}
                        </strong>

                        <br>

                        <small>${stock}</small>

                    </div>
                `;
            }).join("");

        document.getElementById(
            "stockModalBody"
        ).innerHTML = html;

        new bootstrap.Modal(
            document.getElementById(
                "modalStock"
            )
        ).show();

    } catch (error) {

        console.error(error);

        mostrarToast(
            "Error al obtener stock",
            "danger"
        );

    }

}

async function editarProducto(id) {

    const producto =
        await getProductoById(id);

    if (!producto) {
        return;
    }

    _idEditando =
        producto.idProducto;

    mostrarTab("tabAgregar");

    document.getElementById(
        "txtNombreProducto"
    ).value =
        producto.nombre;

    document.getElementById(
        "txtPrecioProducto"
    ).value =
        producto.precio;

    document.getElementById(
        "cmbCategoria"
    ).value =
        producto.idCategoria;

    document.getElementById(
        "cmbGenero"
    ).value =
        producto.genero;

    document.getElementById(
        "txtDescripcion"
    ).value =
        producto.descripcion;

    getContenedor().innerHTML = "";

    producto.colores.forEach(
        c => agregarBloqueColorUI(c)
    );

    document.getElementById(
        "btnGuardarProducto"
    ).innerHTML =
        '<i class="bi bi-pencil-square"></i> Actualizar Producto';

    mostrarToast(
        "Editando producto — guarda los cambios cuando termines."
    );

}

// Cambiar estado 
async function cambiarEstadoProducto(id) {

    try {

        await cambiarEstado(id);

        await cargarProductos();

        mostrarToast(
            "Estado actualizado correctamente."
        );

    } catch (error) {

        console.error(error);

        mostrarToast(
            error.message,
            "danger"
        );

    }

}

function mostrarTab(tabId) {
    const el = document.getElementById(tabId);
    if (el && window.bootstrap) new bootstrap.Tab(el).show();
}

async function inicializarTodo() {
    await cargarCategorias();
    await agregarBloqueColorUI();
    await cargarProductos();

    document.getElementById("btnAgregarColor")
        ?.addEventListener("click", () => agregarBloqueColorUI());

    document.getElementById("frmProducto")
        ?.addEventListener("submit", onSubmitProducto);

    document.getElementById("btnNuevaCategoria")
        ?.addEventListener("click", abrirModalCategoria);
}

document.addEventListener("modalesListos", () => {
    inicializarModales();
}, { once: true });

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarTodo);
} else {
    inicializarTodo();
}

window.editarProducto = editarProducto;
window.cambiarEstadoProducto = cambiarEstadoProducto;
window.verStock = verStock;