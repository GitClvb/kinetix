const API_URL =
    "http://localhost:8080/productos";

export async function getProductos() {

    const response =
        await fetch(API_URL);

    if (!response.ok) {

        throw new Error(
            "Error al obtener productos"
        );

    }

    return await response.json();

}

export async function getProductoById(id) {

    const response =
        await fetch(
            `${API_URL}/${id}/estado`
        );

    if (!response.ok) {

        throw new Error(
            "Producto no encontrado"
        );

    }

    return await response.json();

}


export async function crearProducto(producto) {

    const response =
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);

    }

    return true;

}

// Actualiza un producto existente 

export async function getProductosAdmin() {

    const response =
        await fetch(
            `${API_URL}/admin`
        );

    if (!response.ok) {

        throw new Error(
            "Error al obtener productos"
        );

    }

    return await response.json();

}

export async function actualizarProducto(id, producto) {

    const response =
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);

    }

    return true;

}

// activar / dar de baja
export async function cambiarEstado(id) {

    const response =
        await fetch(
            `${API_URL}/${id}/estado`,
            {
                method: "PATCH"
            }
        );

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);

    }

    return true;

}