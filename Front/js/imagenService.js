const _objectURLs = new Set();

/**
 * @param {File} file
 * @returns {Promise<string>} URL de la imagen
 */
export async function subirImagen(file) {

    const url = URL.createObjectURL(file);
    _objectURLs.add(url);
    return url;
}

export function liberarImagenes() {
    _objectURLs.forEach(url => URL.revokeObjectURL(url));
    _objectURLs.clear();
}