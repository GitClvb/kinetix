// ============================================================
// imagenService.js
// Responsabilidad: manejar la subida y liberación de imágenes.
//
// HOY: convierte File → ObjectURL en memoria (no llena localStorage).
// MAÑANA: hace POST a /api/uploads y devuelve la URL permanente.
// ============================================================

// Registro de ObjectURLs creadas para poder revocarlas al desmontar
const _objectURLs = new Set();

/**
 * Convierte un objeto File en una URL utilizable por <img>.
 * HOY: URL de objeto en memoria.
 * MAÑANA: reemplaza el cuerpo por un fetch a /api/uploads.
 *
 * @param {File} file
 * @returns {Promise<string>} URL de la imagen
 */
export async function subirImagen(file) {
    // ── MAÑANA (descomentar y borrar el bloque de abajo): ──────
    // const form = new FormData();
    // form.append('imagen', file);
    // const res = await fetch('/api/uploads', { method: 'POST', body: form });
    // const { url } = await res.json();
    // return url;
    // ──────────────────────────────────────────────────────────

    // HOY: object URL en memoria (no bloquea, no satura localStorage)
    const url = URL.createObjectURL(file);
    _objectURLs.add(url);
    return url;
}

/**
 * Libera todas las ObjectURLs creadas en esta sesión.
 * Llamar al desmontar la página si es una SPA, o ignorar en MPA.
 */
export function liberarImagenes() {
    _objectURLs.forEach(url => URL.revokeObjectURL(url));
    _objectURLs.clear();
}