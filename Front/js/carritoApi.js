const API_BASE        = 'http://localhost:8080/api/carrito';
const API_PEDIDOS     = 'http://localhost:8080/api/pedidos';

function getIdUsuario() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user ? user.idUsuario : null;
}

// Carrito 
async function fetchCarritoDB() {
    const idUsuario = getIdUsuario();
    if (!idUsuario) return [];
    const response = await fetch(`${API_BASE}/${idUsuario}`);
    if (!response.ok) throw new Error('Error al obtener carrito');
    return await response.json();
}

async function agregarItemDB(idVariante, cantidad) {
    const idUsuario = getIdUsuario();
    if (!idUsuario) return null;
    const response = await fetch(`${API_BASE}/${idUsuario}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idVariante, cantidad })
    });
    if (!response.ok) {
        const msg = await response.text().catch(() => 'Error desconocido');
        throw new Error(msg);
    }
    return await response.json();
}

async function eliminarItemDB(idItem) {
    const response = await fetch(`${API_BASE}/items/${idItem}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar ítem');
}

async function finalizarCompraDB() {
    const idUsuario = getIdUsuario();
    if (!idUsuario) throw new Error('Usuario no autenticado');
    const response = await fetch(`${API_BASE}/${idUsuario}/finalizar`, { method: 'POST' });
    if (!response.ok) throw new Error('Error al finalizar compra');
    return await response.text();
}

async function migrarCarritoLocal() {
    const idUsuario    = getIdUsuario();
    const carritoLocal = JSON.parse(localStorage.getItem('kinetix_cart') || '[]');
    if (!idUsuario || carritoLocal.length === 0) return;

    const itemsValidos = carritoLocal
        .filter(item => item.idVariante != null && item.idVariante !== '')
        .map(item => ({
            idVariante: Number(item.idVariante),
            cantidad:   Number(item.cantidad) || 1
        }));

    if (itemsValidos.length === 0) {
        localStorage.removeItem('kinetix_cart');
        return;
    }

    const response = await fetch(`${API_BASE}/${idUsuario}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemsValidos)
    });

    if (!response.ok) {
        const msg = await response.text().catch(() => 'Error desconocido');
        throw new Error(`Error al sincronizar carrito: ${msg}`);
    }

    localStorage.removeItem('kinetix_cart');
    console.log(`✅ ${itemsValidos.length} ítem(s) migrado(s) a la BD.`);
}

/**
 * @param {Object} formData 
 */
async function crearPedidoDB(formData) {
    const idUsuario = getIdUsuario();
    if (!idUsuario) throw new Error('Usuario no autenticado');

    const response = await fetch(`${API_PEDIDOS}/${idUsuario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const msg = await response.text().catch(() => 'Error desconocido');
        throw new Error(`Error al crear pedido: ${msg}`);
    }

    return await response.json(); 
}