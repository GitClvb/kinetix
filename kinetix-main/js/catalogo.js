const productosCatalogo = [
    { id: 1, nombre: "Playera deportiva", precio: 500, img: "./img/playera.jpg", nuevo: true },

    { id: 2, nombre: "Sudadera técnica", precio: 850, img: "./img/sudadera.avif", nuevo: false },

    { id: 3, nombre: "Short de entrenamiento", precio: 400, img: "./img/sudadera.avif", nuevo: true },

    { id: 4, nombre: "Playera Pro Black", precio: 500, img: "./img/playera.jpg", nuevo: false },

    { id: 5, nombre: "Tank Top Elite", precio: 350, img: "./img/playera.jpg", nuevo: true },

    { id: 6, nombre: "Jogger Fit", precio: 700, img: "./img/sudadera.avif", nuevo: false },

    { id: 7, nombre: "Short Runner", precio: 450, img: "./img/sudadera.avif", nuevo: true },

    { id: 8, nombre: "Sudadera Oversize", precio: 950, img: "./img/sudadera.avif", nuevo: true },

    { id: 9, nombre: "Playera DryFit", precio: 550, img: "./img/playera.jpg", nuevo: false },

    { id: 10, nombre: "Conjunto Sport", precio: 1200, img: "./img/playera.jpg", nuevo: true }
];

function renderizarProductos() {
    const grid = document.getElementById('catalogo-grid');
    if (!grid) return;

    grid.innerHTML = productosCatalogo.map(prod => `
        <div class="col-6 col-md-4">
            <div class="product-card h-100">

                <div class="product-image-wrapper">
                    ${prod.nuevo ? '<span class="badge-new">NUEVO</span>' : ''}

                    <img src="${prod.img}" alt="${prod.nombre}">

                    <button class="add-to-cart-overlay btn-agregar" 
                            data-nombre="${prod.nombre}" 
                            data-precio="${prod.precio}">
                        + Añadir al carrito
                    </button>
                </div>

                <div class="product-info">
                    <h5>${prod.nombre}</h5>
                    <p class="product-price">$${prod.precio.toFixed(2)}</p>
                </div>

            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderizarProductos);