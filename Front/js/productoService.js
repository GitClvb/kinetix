// ============================================================
// productoService.js
// Responsabilidad: CRUD de productos.
// HOY usa localStorage. MAÑANA solo cambia cada función marcada.
// ============================================================

const STORAGE_KEY = "kf_productos";

function leer() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function guardar(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// ── READ ─────────────────────────────────────────────────────
export function getProductos() {
    // TODO (backend): return fetch('/api/productos').then(r => r.json());
    return leer();
}

export function getProductoById(id) {
    // TODO (backend): return fetch(`/api/productos/${id}`).then(r => r.json());
    return leer().find(p => p.id_producto === Number(id)) || null;
}

// ── CREATE ───────────────────────────────────────────────────
export function crearProducto(datos) {
    // TODO (backend):
    // return fetch('/api/productos', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(datos)
    // }).then(r => r.json());

    const lista = leer();
    const nuevo = {
        ...datos,
        id_producto: Date.now(),   // El servidor generará el ID real
        estado: "activo",
        fecha_creacion: new Date().toISOString()
    };
    lista.push(nuevo);
    guardar(lista);
    return nuevo;
}

// ── UPDATE ───────────────────────────────────────────────────
/**
 * Actualiza un producto existente SIN eliminarlo primero.
 * Recibe el id y los campos a actualizar (parcial o total).
 */
export function actualizarProducto(id, cambios) {
    // TODO (backend):
    // return fetch(`/api/productos/${id}`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(cambios)
    // }).then(r => r.json());

    const lista = leer();
    const idx   = lista.findIndex(p => p.id_producto === Number(id));
    if (idx === -1) throw new Error(`Producto ${id} no encontrado`);

    lista[idx] = { ...lista[idx], ...cambios };
    guardar(lista);
    return lista[idx];
}

// ── ESTADO (activar / dar de baja) ──────────────────────────
export function cambiarEstado(id) {
    // TODO (backend):
    // return fetch(`/api/productos/${id}/estado`, { method: 'PATCH' }).then(r => r.json());

    const producto = getProductoById(id);
    if (!producto) throw new Error(`Producto ${id} no encontrado`);

    const nuevoEstado = producto.estado === "activo" ? "inactivo" : "activo";
    return actualizarProducto(id, { estado: nuevoEstado });
}