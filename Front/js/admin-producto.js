// ============================================================
// admin-producto.js  (refactorizado)
// Responsabilidad: coordinar UI, eventos y servicios.
// NO contiene lógica de persistencia ni construcción de datos.
// ============================================================

import {
    getCategorias, agregarCategoria,
    getColores,    agregarColor,
    getColorById
} from "./catalogoService.js";

import {
    getProductos,
    getProductoById,
    crearProducto,
    actualizarProducto,
    cambiarEstado
} from "./productoService.js";

import {
    crearBloqueColor,
    leerDatosBloque,
    refrescarSelectoresColor
} from "./colorBloque.js";

// ── Estado de edición ────────────────────────────────────────
// Guardamos el id del producto en edición para hacer PATCH, no DELETE+POST
let _idEditando = null;

// ── Toast ────────────────────────────────────────────────────
function mostrarToast(mensaje, tipo = "success") {
    const toast = document.getElementById("toastNotificacion");
    const body  = document.getElementById("toastMensaje");
    if (!toast || !body) return;

    toast.classList.remove("bg-success", "bg-danger");
    toast.classList.add(tipo === "success" ? "bg-success" : "bg-danger");
    body.innerHTML = mensaje;
    bootstrap.Toast.getOrCreateInstance(toast).show();
}

// ── Cargar catálogos en el formulario ────────────────────────
function cargarCategorias() {
    const cmb = document.getElementById("cmbCategoria");
    if (!cmb) return;
    cmb.innerHTML = `<option value="" disabled selected>Selecciona una categoría</option>` +
        getCategorias().map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");
}

// ── Contenedor de bloques color ──────────────────────────────
function getContenedor() {
    return document.getElementById("contenedorColores");
}

function agregarBloqueColorUI(colorData = null) {
    const bloque = crearBloqueColor(colorData, abrirModalColor);
    getContenedor().appendChild(bloque);
}

// ── Eliminar bloque (delegado) ───────────────────────────────
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

// ── Modales ──────────────────────────────────────────────────
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
    const picker  = document.getElementById("codigoColor");
    const preview = document.getElementById("previewColor");
    if (picker)  picker.value = "#000000";
    if (preview) preview.style.backgroundColor = "#000000";

    new bootstrap.Modal(el).show();
}

// ── Inicializar modales (se llama UNA VEZ tras inyección) ────
function inicializarModales() {
    // --- Modal Categoría ---
    const btnGuardarCategoria = document.getElementById("guardarCategoriaBtn");
    if (btnGuardarCategoria) {
        btnGuardarCategoria.addEventListener("click", () => {
            const input  = document.getElementById("nombreCategoria");
            const nombre = input?.value.trim();
            if (!nombre) return mostrarToast("Ingresa un nombre válido.", "danger");

            const nueva = agregarCategoria(nombre);   // ← catalogoService
            cargarCategorias();
            document.getElementById("cmbCategoria").value = nueva.id;
            mostrarToast(`Categoría "${nueva.nombre}" agregada.`);
            bootstrap.Modal.getInstance(document.getElementById("modalCategoria"))?.hide();
            input.value = "";
        });
    }

    // --- Modal Color ---
    const picker  = document.getElementById("codigoColor");
    const colorTx = document.getElementById("codigoColorText");
    const preview = document.getElementById("previewColor");

    if (picker && colorTx && preview) {
        picker.addEventListener("input",  () => { colorTx.value = picker.value; preview.style.backgroundColor = picker.value; });
        colorTx.addEventListener("input", () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(colorTx.value)) {
                picker.value = colorTx.value;
                preview.style.backgroundColor = colorTx.value;
            }
        });
    }

    const btnGuardarColor = document.getElementById("guardarColorBtn");
    if (btnGuardarColor) {
        btnGuardarColor.addEventListener("click", () => {
            const nombre = document.getElementById("nombreColor")?.value.trim();
            const codigo = document.getElementById("codigoColorText")?.value.trim();

            if (!nombre) return mostrarToast("Ingresa un nombre válido.", "danger");
            if (!codigo || !/^#[0-9A-Fa-f]{6}$/.test(codigo))
                return mostrarToast("Código hexadecimal inválido (ej: #FF0000).", "danger");

            const nuevo = agregarColor(nombre, codigo);   // ← catalogoService
            refrescarSelectoresColor();
            mostrarToast(`Color "${nuevo.nombre}" agregado.`);
            bootstrap.Modal.getInstance(document.getElementById("modalColor"))?.hide();

            // Invocar callback del bloque que abrió el modal
            window._nuevoColorCallback?.(nuevo);
            window._nuevoColorCallback = null;
        });
    }
}

// ── Guardar / Actualizar producto ────────────────────────────
function onSubmitProducto(e) {
    e.preventDefault();

    const nombre      = document.getElementById("txtNombreProducto")?.value.trim();
    const precio      = parseFloat(document.getElementById("txtPrecioProducto")?.value);
    const categoriaId = document.getElementById("cmbCategoria")?.value;
    const genero      = document.getElementById("cmbGenero")?.value;
    const descripcion = document.getElementById("txtDescripcion")?.value.trim();

    // Validaciones
    if (!nombre)                        return mostrarToast("Completa el nombre.", "danger");
    if (!precio || precio <= 0)         return mostrarToast("Ingresa un precio válido.", "danger");
    if (!categoriaId)                   return mostrarToast("Selecciona una categoría.", "danger");
    if (!genero)                        return mostrarToast("Selecciona el género.", "danger");
    if (!descripcion || descripcion.length < 20)
        return mostrarToast("La descripción debe tener al menos 20 caracteres.", "danger");

    const bloques = document.querySelectorAll(".bloque-color");
    if (!bloques.length) return mostrarToast("Agrega al menos un color.", "danger");

    const coloresProducto = [];
    for (const bloque of bloques) {
        const { colorId, imagenes, tallas } = leerDatosBloque(bloque);
        if (!colorId)         return mostrarToast("Selecciona un color para todas las variantes.", "danger");
        if (!imagenes.length) return mostrarToast("Cada color debe tener al menos una imagen.", "danger");
        coloresProducto.push({ id_color: Number(colorId), imagenes, tallas });
    }

    const datos = {
        nombre, descripcion, precio,
        id_categoria: Number(categoriaId),
        genero,
        colores: coloresProducto
    };

    if (_idEditando) {
        // ── ACTUALIZACIÓN: PATCH, no DELETE+POST ─────────────
        actualizarProducto(_idEditando, datos);   // ← productoService
        mostrarToast("Producto actualizado correctamente.");
        _idEditando = null;
        document.getElementById("btnGuardarProducto").innerHTML =
            '<i class="bi bi-check2-circle"></i> Crear Producto';
    } else {
        // ── CREACIÓN ─────────────────────────────────────────
        crearProducto(datos);   // ← productoService
        mostrarToast("Producto registrado correctamente.");
    }

    resetFormulario();
    cargarProductos();
    mostrarTab("tabListado");
}

function resetFormulario() {
    document.getElementById("frmProducto")?.reset();
    getContenedor().innerHTML = "";
    agregarBloqueColorUI();
    _idEditando = null;
}

// ── Tabla de productos ───────────────────────────────────────
function cargarProductos() {
    const productos = getProductos();   // ← productoService
    const tbody     = document.getElementById("tbodyProductos");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!productos.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos registrados</td></tr>';
        return;
    }

    const categorias = getCategorias();

    productos.forEach(p => {
        const cat       = categorias.find(c => c.id === p.id_categoria);
        const inactivo  = p.estado === "inactivo";
        const estadoBadge = inactivo
            ? `<span class="badge bg-secondary">Inactivo</span>`
            : `<span class="badge bg-success">Activo</span>`;

        const tr = document.createElement("tr");
        if (inactivo) tr.classList.add("producto-inactivo");

        tr.innerHTML = `
            <td>${p.id_producto}</td>
            <td>
                <strong>${p.nombre}</strong><br>
                <small class="text-muted">${p.colores.length} color(es)</small>
            </td>
            <td>${cat?.nombre || "-"}</td>
            <td>${p.genero}</td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>${estadoBadge}</td>
            <td class="text-end">
                <div class="btn-group">
                    <button class="btn btn-info btn-sm"
                            onclick="verStock(${p.id_producto})"
                            title="Ver stock"
                            ${inactivo ? "disabled" : ""}>
                        <i class="bi bi-boxes"></i>
                    </button>
                    <button class="btn btn-warning btn-sm"
                            onclick="editarProducto(${p.id_producto})"
                            title="Editar"
                            ${inactivo ? "disabled" : ""}>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-${inactivo ? "success" : "secondary"} btn-sm"
                            onclick="cambiarEstadoProducto(${p.id_producto})"
                            title="${inactivo ? "Activar" : "Dar de baja"}">
                        <i class="bi bi-${inactivo ? "arrow-repeat" : "archive"}"></i>
                    </button>
                </div>
            </td>`;
        tbody.appendChild(tr);
    });
}

// ── Ver stock ────────────────────────────────────────────────
function verStock(id) {
    const producto = getProductoById(id);
    if (!producto || producto.estado === "inactivo") return;

    const html = producto.colores.map(c => {
        const info  = getColorById(c.id_color);
        const stock = c.tallas.map(t => `${t.talla}: ${t.stock}`).join(", ");
        return `
            <div class="stock-item mb-3 p-2"
                 style="border-left:4px solid ${info?.codigo || "#ccc"};
                        background:rgba(255,255,255,0.05);border-radius:8px;">
                <strong style="color:${info?.codigo || "#fff"}">${info?.nombre || "Color"}</strong><br>
                <small>${stock}</small>
            </div>`;
    }).join("") || '<p class="text-muted">Sin información de stock</p>';

    const modalBody = document.getElementById("stockModalBody");
    if (modalBody) {
        modalBody.innerHTML = html;
        new bootstrap.Modal(document.getElementById("modalStock")).show();
    }
}

// ── Editar producto ──────────────────────────────────────────
function editarProducto(id) {
    const producto = getProductoById(id);
    if (!producto || producto.estado === "inactivo") return;

    // Guardamos el id en memoria — NO eliminamos el producto
    _idEditando = producto.id_producto;

    mostrarTab("tabAgregar");

    document.getElementById("txtNombreProducto").value = producto.nombre;
    document.getElementById("txtPrecioProducto").value = producto.precio;
    document.getElementById("cmbCategoria").value      = producto.id_categoria;
    document.getElementById("cmbGenero").value         = producto.genero;
    document.getElementById("txtDescripcion").value    = producto.descripcion;

    getContenedor().innerHTML = "";
    producto.colores.forEach(c => agregarBloqueColorUI(c));

    document.getElementById("btnGuardarProducto").innerHTML =
        '<i class="bi bi-pencil-square"></i> Actualizar Producto';

    mostrarToast("Editando producto — guarda los cambios cuando termines.");
}

// ── Cambiar estado ───────────────────────────────────────────
function cambiarEstadoProducto(id) {
    const actualizado = cambiarEstado(id);   // ← productoService
    cargarProductos();
    mostrarToast(`Producto ${actualizado.estado === "activo" ? "activado" : "desactivado"} correctamente.`);
}

// ── Helpers de navegación ────────────────────────────────────
function mostrarTab(tabId) {
    const el = document.getElementById(tabId);
    if (el && window.bootstrap) new bootstrap.Tab(el).show();
}

// ── Bootstrap: inicialización principal ─────────────────────
function inicializarTodo() {
    cargarCategorias();
    agregarBloqueColorUI();
    cargarProductos();

    document.getElementById("btnAgregarColor")
        ?.addEventListener("click", () => agregarBloqueColorUI());

    document.getElementById("frmProducto")
        ?.addEventListener("submit", onSubmitProducto);

    document.getElementById("btnNuevaCategoria")
        ?.addEventListener("click", abrirModalCategoria);
}

// Espera a que modal-fix.js inyecte los modales y dispare el evento
// { once: true } garantiza que el listener se ejecute exactamente una vez
document.addEventListener("modalesListos", () => {
    inicializarModales();
}, { once: true });

// Inicializa la UI cuando el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarTodo);
} else {
    inicializarTodo();
}

// ── Exponer funciones llamadas desde HTML (onclick="...") ────
window.editarProducto       = editarProducto;
window.cambiarEstadoProducto = cambiarEstadoProducto;
window.verStock             = verStock;