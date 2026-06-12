document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("masVendidosContainer");
    if (!container) return;

    try {
        const res = await fetch("http://localhost:8080/api/productos/mas-vendidos?limit=2");
        if (!res.ok) throw new Error("Error HTTP: " + res.status);

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-muted text-center">
                    Aún no hay productos vendidos.
                </div>`;
            return;
        }

        container.innerHTML = data.map(prod => `
    <div class="col-6 col-md-6">
    <div class="card card-producto shadow-sm h-100">

        <div class="img-wrapper">
            ${
                prod.imagen
                ? `<img src="${prod.imagen}"
                        alt="${prod.nombre}"
                        loading="lazy">`
                : `<div class="bg-secondary h-100"></div>`
            }
        </div>

        <div class="p-3 text-center d-flex flex-column flex-grow-1">
            <h5>${prod.nombre}</h5>

            <small class="text-muted">
                ${prod.totalVendidos} vendidos
            </small>

            <p class="precio my-3">
                $${prod.precio.toFixed(2)} MXN
            </p>

            <div class="mt-auto">
                <button
                    class="btn btn-dark px-4 fw-bold"
                    onclick="window.location.href='producto.html?id=${prod.idProducto}'">
                    Ver producto
                </button>
            </div>
        </div>

    </div>
</div>
`).join("");

    } catch (error) {
        console.error("Error cargando más vendidos:", error);
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    No se pudieron cargar los productos.
                </p>
            </div>`;
    }
});