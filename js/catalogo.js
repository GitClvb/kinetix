/* =========================
PRODUCTOS
========================= */

const productos = {

    hombre: [

        {
            nombre: "Playera Oversize Black",
            categoria: "Playera",
            precio: "$599",
            imagen: "./img/hombre1.jpg"
        },

        {
            nombre: "Short Performance",
            categoria: "Short",
            precio: "$499",
            imagen: "./img/hombre2.jpg"
        },

        {
            nombre: "Sudadera Urban Fit",
            categoria: "Sudadera",
            precio: "$899",
            imagen: "./img/hombre3.jpg"
        },

        {
            nombre: "Tank Essential",
            categoria: "Tank",
            precio: "$450",
            imagen: "./img/hombre4.jpg"
        },

        {
            nombre: "Jogger Elite",
            categoria: "Jogger",
            precio: "$799",
            imagen: "./img/hombre5.jpg"
        },

        {
            nombre: "Hoodie Motion",
            categoria: "Sudadera",
            precio: "$999",
            imagen: "./img/hombre6.jpg"
        },

        {
            nombre: "Compression Tee",
            categoria: "Playera",
            precio: "$650",
            imagen: "./img/hombre7.jpg"
        },

        {
            nombre: "Short Alpha",
            categoria: "Short",
            precio: "$520",
            imagen: "./img/hombre8.jpg"
        },

        {
            nombre: "Playera Kinetix Core",
            categoria: "Playera",
            precio: "$580",
            imagen: "./img/hombre9.jpg"
        },

        {
            nombre: "Pants Active",
            categoria: "Pants",
            precio: "$850",
            imagen: "./img/hombre10.jpg"
        }

    ],

    mujer: [

        {
            nombre: "Top Energy",
            categoria: "Top",
            precio: "$549",
            imagen: "./img/mujer1.jpg"
        },

        {
            nombre: "Leggings Sculpt",
            categoria: "Leggings",
            precio: "$799",
            imagen: "./img/mujer2.jpg"
        },

        {
            nombre: "Playera Fit Motion",
            categoria: "Playera",
            precio: "$599",
            imagen: "./img/mujer3.jpg"
        },

        {
            nombre: "Short Flex",
            categoria: "Short",
            precio: "$499",
            imagen: "./img/mujer4.jpg"
        },

        {
            nombre: "Sudadera Active",
            categoria: "Sudadera",
            precio: "$950",
            imagen: "./img/mujer5.jpg"
        },

        {
            nombre: "Top Seamless",
            categoria: "Top",
            precio: "$620",
            imagen: "./img/mujer6.jpg"
        },

        {
            nombre: "Leggings Motion",
            categoria: "Leggings",
            precio: "$850",
            imagen: "./img/mujer7.jpg"
        },

        {
            nombre: "Jogger Balance",
            categoria: "Jogger",
            precio: "$770",
            imagen: "./img/mujer8.jpg"
        },

        {
            nombre: "Playera Energy",
            categoria: "Playera",
            precio: "$560",
            imagen: "./img/mujer9.jpg"
        },

        {
            nombre: "Hoodie Premium",
            categoria: "Sudadera",
            precio: "$1050",
            imagen: "./img/mujer10.jpg"
        }

    ]
};

/* =========================
GRID
========================= */

const grid = document.getElementById("catalogo-grid");

/* =========================
MOSTRAR PRODUCTOS
========================= */

function mostrarProductos(genero){

    grid.innerHTML = "";

    productos[genero].forEach(producto => {

        grid.innerHTML += `

        <div class="col-md-6 col-xl-4">

            <div class="product-card">

                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="product-info">

                    <span class="product-category">
                        ${producto.categoria}
                    </span>

                    <h5 class="product-title">
                        ${producto.nombre}
                    </h5>

                    <p class="product-price">
                        ${producto.precio}
                    </p>

                    <button class="product-btn">

                        <i class="bi bi-bag-plus"></i>

                        Agregar al carrito

                    </button>

                </div>

            </div>

        </div>

        `;
    });

}

/* =========================
MOSTRAR HOMBRE AL INICIO
========================= */

mostrarProductos("hombre");

/* =========================
BOTONES GENERO
========================= */

const botonesGenero = document.querySelectorAll(".categoria-btn");

botonesGenero.forEach(btn => {

    btn.addEventListener("click", () => {

        botonesGenero.forEach(b => {

            b.classList.remove("active-genero");

        });

        btn.classList.add("active-genero");

        mostrarProductos(btn.dataset.genero);

    });

});