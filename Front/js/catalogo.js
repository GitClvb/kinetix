let productos = {
    hombre: [],
    mujer: []
};

const grid                  = document.getElementById("catalogo-grid");
const contenedorCategorias  = document.getElementById("contenedor-categorias");
const loader                = document.getElementById("loader-catalogo");

let generoActual    = "todos";
let categoriaActual = "Todas";
let isLoading       = false;

// Obtener género desde localStorage (si viene del index)
const generoSeleccionado = localStorage.getItem("generoSeleccionado");
if (generoSeleccionado === "hombre" || generoSeleccionado === "mujer") {
    generoActual = generoSeleccionado;
}
localStorage.removeItem("generoSeleccionado");

function toggleLoader(show) {
    if (show) {
        loader?.classList.remove("d-none");
        grid?.classList.add("grid-loading");
    } else {
        loader?.classList.add("d-none");
        grid?.classList.remove("grid-loading");
    }
}

function obtenerTallasSeleccionadas() {
    return [...document.querySelectorAll(".filtro-talla:checked")]
        .map(cb => cb.value);
}

function obtenerCategorias(genero) {
    const lista = genero === "todos"
        ? [...productos.hombre, ...productos.mujer]
        : (productos[genero] || []);
    return ["Todas", ...new Set(lista.map(p => p.categoria))];
}

function obtenerProductosPorGenero(genero) {
    if (genero === "todos") return [...productos.hombre, ...productos.mujer];
    return productos[genero] || [];
}

// ---------------------------
// 3. RENDERIZADO DE FILTROS
// ---------------------------

function renderCategorias(genero) {
    if (!contenedorCategorias) return;

    const categorias = obtenerCategorias(genero);
    contenedorCategorias.innerHTML = "";

    categorias.forEach((categoria, index) => {
        const button = document.createElement("button");
        button.className   = `categoria-producto ${index === 0 ? "active-btn" : ""}`;
        button.textContent = categoria;
        button.dataset.categoria = categoria;

        button.addEventListener("click", () => {
            document.querySelectorAll(".categoria-producto")
                .forEach(btn => btn.classList.remove("active-btn"));
            button.classList.add("active-btn");
            categoriaActual = categoria;
            mostrarProductos(generoActual, categoriaActual);
        });

        contenedorCategorias.appendChild(button);
    });

    setTimeout(actualizarFlechas, 50);
}

function renderTallas(genero) {
    const contenedor = document.getElementById("contenedor-tallas");
    if (!contenedor) return;

    const productosGenero = genero === "todos"
        ? [...productos.hombre, ...productos.mujer]
        : (productos[genero] || []);

    const tallasSet = new Set();
    productosGenero.forEach(p => {
        p.colores?.forEach(c => {
            // `talla` sigue siendo List<String> — sin cambios
            c.talla?.forEach(t => tallasSet.add(t));
        });
    });

    const ordenTallas = ["XS", "S", "M", "L", "XL", "XXL"];
    const tallas = [...tallasSet].sort(
        (a, b) => ordenTallas.indexOf(a) - ordenTallas.indexOf(b)
    );

    contenedor.innerHTML = tallas.map(talla => `
        <input type="checkbox" id="talla-${talla}" class="filtro-talla" value="${talla}">
        <label for="talla-${talla}">${talla}</label>
    `).join("");

    document.querySelectorAll(".filtro-talla").forEach(cb => {
        cb.addEventListener("change", () => mostrarProductos(generoActual, categoriaActual));
    });
}

//RENDERIZA PRODUC
function crearCardProducto(producto) {
    const imagenPrincipal = producto.colores?.[0]?.imagen || "";

    const tallas = producto.colores
        ? [...new Set(producto.colores.flatMap(c => c.talla || []))]
        : (producto.talla || []);

    return `
        <div class="col-6 col-lg-6 col-xl-4">
            <div class="product-card">
                <img src="${imagenPrincipal}" alt="${producto.nombre}" loading="lazy">
                <div class="product-info">
                    <span class="product-category">${producto.categoria}</span>
                    <h5 class="product-title">${producto.nombre}</h5>
                    <p class="product-price">${producto.precio}</p>

                    <div class="product-sizes">
                        <span class="product-label">Tallas</span>
                        <div class="sizes-container">
                            ${tallas.map(t => `<span class="size-chip">${t}</span>`).join("")}
                        </div>
                    </div>

                    <div class="product-colors">
                        <span class="product-label">Colores</span>
                        <div class="colors-container">
                            ${(producto.colores || []).map(c => `
                                <span class="color-dot"
                                      style="background:${c.codigo}"
                                      title="Color">
                                </span>
                            `).join("")}
                        </div>
                    </div>

                    <!-- FIX: solo guardamos el id, no el objeto completo -->
                    <button class="product-btn btn-ver-producto"
                            data-id-producto="${producto.idProducto}">
                        <i class="bi bi-eye"></i> Ver producto
                    </button>
                </div>
            </div>
        </div>
    `;
}

function mostrarEstadoVacio() {
    return `
        <div class="col-12">
            <div class="empty-state">
                <i class="bi bi-search"></i>
                <h4>No encontramos productos</h4>
                <p>Intenta cambiar los filtros seleccionados.</p>
            </div>
        </div>
    `;
}

function adjuntarListenersVerProducto() {
    document.querySelectorAll(".btn-ver-producto").forEach(btn => {
        btn.addEventListener("click", () => {
            const idProducto = btn.dataset.idProducto;
            window.location.href = `producto.html?id=${idProducto}`;
        });
    });
}

function mostrarProductos(genero, categoria = "Todas") {
    if (isLoading) return;
    isLoading = true;
    toggleLoader(true);

    setTimeout(() => {
        let filtrados = obtenerProductosPorGenero(genero);

        if (categoria !== "Todas") {
            filtrados = filtrados.filter(p => p.categoria === categoria);
        }

        const tallasSeleccionadas = obtenerTallasSeleccionadas();
        if (tallasSeleccionadas.length > 0) {
            filtrados = filtrados.filter(p => {
                const tallasProducto = p.colores
                    ? p.colores.flatMap(c => c.talla || [])
                    : (p.talla || []);
                return tallasProducto.some(t => tallasSeleccionadas.includes(t));
            });
        }

        if (grid) {
            grid.innerHTML = filtrados.length === 0
                ? mostrarEstadoVacio()
                : filtrados.map(crearCardProducto).join("");
        }

        adjuntarListenersVerProducto();
        toggleLoader(false);
        isLoading = false;
    }, 200);
}

function mostrarPrimeros10Productos() {
    if (isLoading) return;
    isLoading = true;
    toggleLoader(true);

    setTimeout(() => {
        const primeros10 = [...productos.hombre, ...productos.mujer].slice(0, 10);

        if (grid) {
            grid.innerHTML = primeros10.length === 0
                ? mostrarEstadoVacio()
                : primeros10.map(crearCardProducto).join("");
        }

        adjuntarListenersVerProducto();
        toggleLoader(false);
        isLoading = false;
    }, 200);
}

function actualizarPorGenero(genero) {
    categoriaActual = "Todas";

    document.querySelectorAll(".categoria-producto").forEach(btn => {
        btn.classList.remove("active-btn");
        if (btn.dataset.categoria === "Todas") btn.classList.add("active-btn");
    });

    renderTallas(genero);
    renderCategorias(genero);

    if (genero === "todos") {
        mostrarPrimeros10Productos();
    } else {
        mostrarProductos(genero);
    }
}

async function cargarCatalogo() {
    try {
        toggleLoader(true);

        const response = await fetch("http://localhost:8080/productos/catalogo");
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        productos = {
            hombre: data.hombre || [],
            mujer:  data.mujer  || []
        };

        console.log(`✅ ${productos.hombre.length} hombre, ${productos.mujer.length} mujer`);

        actualizarPorGenero(generoActual);

        // Marcar botón de género activo
        document.querySelectorAll(".categoria-btn").forEach(btn => {
            btn.classList.toggle("active-genero", btn.dataset.genero === generoActual);
        });

        setTimeout(actualizarFlechas, 50);
        toggleLoader(false);

    } catch (error) {
        console.error("Error cargando catálogo:", error);
        toggleLoader(false);

        if (grid) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="bi bi-exclamation-triangle"></i>
                        <h4>Error de conexión</h4>
                        <p>No se pudo cargar el catálogo. Verifica que el servidor esté funcionando.</p>
                        <button onclick="location.reload()" class="btn btn-primary mt-3">
                            Reintentar
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// ---------------------------
// 6. BOTONES DE GÉNERO
// ---------------------------

document.querySelectorAll(".categoria-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const genero = btn.dataset.genero;
        if (genero === generoActual) return;

        document.querySelectorAll(".categoria-btn")
            .forEach(b => b.classList.remove("active-genero"));
        btn.classList.add("active-genero");

        generoActual = genero;
        actualizarPorGenero(generoActual);
    });
});

// ---------------------------
// 7. SCROLL DE CATEGORÍAS
// ---------------------------

function actualizarFlechas() {
    const contenedor = document.getElementById("contenedor-categorias");
    const left  = document.getElementById("scroll-left");
    const right = document.getElementById("scroll-right");
    if (!contenedor || !left || !right) return;

    if (window.innerWidth <= 768) {
        left.style.display = right.style.display = "none";
        return;
    }

    const maxScroll = contenedor.scrollWidth - contenedor.clientWidth;
    if (maxScroll <= 0) {
        left.style.display = right.style.display = "none";
        return;
    }

    left.style.display  = contenedor.scrollLeft > 5             ? "flex" : "none";
    right.style.display = contenedor.scrollLeft < maxScroll - 5 ? "flex" : "none";
}

document.getElementById("scroll-right")?.addEventListener("click", () => {
    document.getElementById("contenedor-categorias")
        ?.scrollBy({ left: 250, behavior: "smooth" });
});

document.getElementById("scroll-left")?.addEventListener("click", () => {
    document.getElementById("contenedor-categorias")
        ?.scrollBy({ left: -250, behavior: "smooth" });
});

window.addEventListener("resize", actualizarFlechas);
contenedorCategorias?.addEventListener("scroll", actualizarFlechas);

cargarCatalogo();