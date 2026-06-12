const API_URL_ADM_USU =
    "http://localhost:8080/api/usuarios/admin/clientes";

const API_URL_EST =
    "http://localhost:8080/api/usuarios/estadisticas";

// Obtener lista de clientes
async function getClientesAdmin() {

    const response =
        await fetch(API_URL_ADM_USU);

    if (!response.ok) {

        throw new Error(
            "Error al obtener clientes"
        );

    }

    return await response.json();

}

// Obtener estadísticas
async function getEstadisticas() {

    const response =
        await fetch(API_URL_EST);

    if (!response.ok) {

        throw new Error(
            "Error al obtener estadísticas"
        );

    }

    return await response.json();

}

async function cargarEstadisticas() {

    try {

        const est = await getEstadisticas();

        document.getElementById("totalUsuarios").textContent =
            est.usuariosTotales;

        document.getElementById("totalClientes").textContent =
            est.clientes;

        document.getElementById("totalAdmins").textContent =
            est.admins;

    } catch (error) {

        console.error(error);

    }

}

async function cargarClientes() {

    try {

        const clientes =
            await getClientesAdmin();

        const tbody =
            document.getElementById(
                "tbodyClientes"
            );

        tbody.innerHTML = "";

        clientes.forEach(cliente => {

            tbody.innerHTML += `
                <tr>
                    <td>${cliente.idUsuario}</td>
                    <td>${cliente.nombreCompleto}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.telefono ?? "-"}</td>
                    <td>${cliente.fechaRegistro}</td>
                    <td>${cliente.estado}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary">
                            Ver
                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await cargarEstadisticas();
        await cargarClientes();

    }
);