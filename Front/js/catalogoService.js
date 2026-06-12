// Responsabilidad: gestionar colores y categorías.

const API_CATEGORIAS = "http://localhost:8080/categorias";
const API_CATEGORIAS_DTO = "http://localhost:8080/categorias/dto";
const API_COLORES = "http://localhost:8080/api/colores/obtener";
const API_COLORES_CAT = "http://localhost:8080/api/colores/catalogo";

// Categorías

export async function getCategorias() {

    const response =
        await fetch(API_CATEGORIAS_DTO);

    if (!response.ok) {

        throw new Error(
            "Error al obtener categorías"
        );

    }

    return await response.json();

}

export async function agregarCategoria(nombre) {

    const response =
        await fetch(API_CATEGORIAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre
            })
        });

    if (!response.ok) {

        throw new Error(
            "Error al crear categoría"
        );

    }

    return await response.json();

}

// Colores

export async function getColores() {

    const response =
        await fetch(API_COLORES);

    if (!response.ok) {

        throw new Error(
            "Error al obtener colores"
        );

    }

    return await response.json();

}

export async function agregarColor(nombre, codigo) {

    const response = await fetch(API_COLORES_CAT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            codigo
        })
    });

    if (response.status === 409) {

        const mensaje = await response.text();
        throw new Error(mensaje);
        return null;
    }

    if (!response.ok) {
        throw new Error("Error al crear color");
    }

    return await response.json();
}

export async function getColorById(id) {

    const colores =
        await getColores();

    return colores.find(
        c => c.id === Number(id)
    ) || null;

}