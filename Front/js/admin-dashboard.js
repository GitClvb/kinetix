const dashboardData = {
    productos: 125,
    categorias: 12,
    pedidosHoy: 8,
    ventasMes: 42350
};

const ultimosPedidos = [
    {
        id: 101,
        cliente: "Juan Pérez",
        total: 599,
        estado: "Pagado"
    },
    {
        id: 102,
        cliente: "Ana López",
        total: 1299,
        estado: "Pagado"
    },
    {
        id: 103,
        cliente: "Carlos Ruiz",
        total: 899,
        estado: "Pendiente"
    }
];

document.addEventListener("DOMContentLoaded", () => {

    cargarIndicadores();
    cargarUltimosPedidos();

});

function cargarIndicadores() {

    document.getElementById("totalProductos").textContent =
        dashboardData.productos;

    document.getElementById("totalCategorias").textContent =
        dashboardData.categorias;

    document.getElementById("pedidosHoy").textContent =
        dashboardData.pedidosHoy;

    document.getElementById("ventasMes").textContent =
        new Intl.NumberFormat(
            "es-MX",
            {
                style: "currency",
                currency: "MXN"
            }
        ).format(dashboardData.ventasMes);
}

function cargarUltimosPedidos() {

    const tbody = document.getElementById("tbodyUltimosPedidos");

    tbody.innerHTML = "";

    ultimosPedidos.forEach(pedido => {

        const estadoClass =
            pedido.estado === "Pagado"
                ? "estado-pagado"
                : "estado-pendiente";

        tbody.innerHTML += `
            <tr>
                <td>#${pedido.id}</td>
                <td>${pedido.cliente}</td>
                <td>$${pedido.total}</td>
                <td>
                    <span class="estado-pedido ${estadoClass}">
                        ${pedido.estado}
                    </span>
                </td>
            </tr>
        `;
    });
}