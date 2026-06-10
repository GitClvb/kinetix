// ============================================
// CATÁLOGO DE PRODUCTOS - VERSIÓN MEJORADA
// ============================================

// ---------------------------
// 1. ESTADO Y VARIABLES GLOBALES
// ---------------------------
let productos = {
    hombre: [],
    mujer: []
};

let todosLosProductos = []; // Para la vista inicial (hasta 10 productos)

const grid = document.getElementById("catalogo-grid");
const contenedorCategorias = document.getElementById("contenedor-categorias");
const loader = document.getElementById("loader-catalogo");

let generoActual = "todos"; // Cambiado: "todos" como valor inicial
let categoriaActual = "Todas";
let isLoading = false;

// Obtener género desde localStorage (si viene del index)
const generoSeleccionado = localStorage.getItem("generoSeleccionado");
if (generoSeleccionado && (generoSeleccionado === "hombre" || generoSeleccionado === "mujer")) {
    generoActual = generoSeleccionado;
}
localStorage.removeItem("generoSeleccionado");

// ---------------------------
// 2. FUNCIONES DE UTILERÍA
// ---------------------------

/**
 * Muestra u oculta el loader
 */
function toggleLoader(show) {
    if (show) {
        loader?.classList.remove("d-none");
        grid?.classList.add("grid-loading");
    } else {
        loader?.classList.add("d-none");
        grid?.classList.remove("grid-loading");
    }
}

/**
 * Obtiene las tallas seleccionadas en los filtros
 */
function obtenerTallasSeleccionadas() {
    return [...document.querySelectorAll(".filtro-talla:checked")]
        .map(checkbox => checkbox.value);
}

/**
 * Obtiene las categorías únicas para un género específico
 */
function obtenerCategorias(genero) {
    if (genero === "todos") {
        const todasLasCategorias = [...productos.hombre, ...productos.mujer];
        const categorias = todasLasCategorias.map(p => p.categoria);
        return ["Todas", ...new Set(categorias)];
    }
    
    const categorias = productos[genero]?.map(p => p.categoria) || [];
    return ["Todas", ...new Set(categorias)];
}

/**
 * Obtiene todos los productos según el género seleccionado
 */
function obtenerProductosPorGenero(genero) {
    if (genero === "todos") {
        return [...productos.hombre, ...productos.mujer];
    }
    return productos[genero] || [];
}

// ---------------------------
// 3. RENDERIZADO DE FILTROS
// ---------------------------

/**
 * Renderiza los botones de categorías
 */
function renderCategorias(genero) {
    if (!contenedorCategorias) return;
    
    const categorias = obtenerCategorias(genero);
    contenedorCategorias.innerHTML = "";
    
    categorias.forEach((categoria, index) => {
        const button = document.createElement("button");
        button.className = `categoria-producto ${index === 0 && categoria === "Todas" ? "active-btn" : ""}`;
        button.textContent = categoria;
        button.dataset.categoria = categoria;
        
        button.addEventListener("click", () => {
            // Actualizar UI de botones
            document.querySelectorAll(".categoria-producto").forEach(btn => {
                btn.classList.remove("active-btn");
            });
            button.classList.add("active-btn");
            
            // Actualizar filtro y mostrar productos
            categoriaActual = categoria;
            mostrarProductos(generoActual, categoriaActual);
        });
        
        contenedorCategorias.appendChild(button);
    });
    
    setTimeout(actualizarFlechas, 50);
}

/**
 * Renderiza los checkboxes de tallas
 */
function renderTallas(genero) {
    const contenedor = document.getElementById("contenedor-tallas");
    if (!contenedor) return;
    
    // Obtener productos según género
    const productosGenero = genero === "todos" 
        ? [...productos.hombre, ...productos.mujer]
        : productos[genero];
    
    // Extraer tallas únicas
    const tallasSet = new Set();
    productosGenero.forEach(producto => {
        producto.colores?.forEach(color => {
            color.talla?.forEach(talla => tallasSet.add(talla));
        });
    });
    
    const tallas = [...tallasSet];
    const ordenTallas = ["XS", "S", "M", "L", "XL", "XXL"];
    tallas.sort((a, b) => ordenTallas.indexOf(a) - ordenTallas.indexOf(b));
    
    // Renderizar checkboxes
    contenedor.innerHTML = tallas.map(talla => `
        <input type="checkbox" id="talla-${talla}" class="filtro-talla" value="${talla}">
        <label for="talla-${talla}">${talla}</label>
    `).join("");
    
    // Agregar event listeners
    document.querySelectorAll(".filtro-talla").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            mostrarProductos(generoActual, categoriaActual);
        });
    });
}

// ---------------------------
// 4. RENDERIZADO DE PRODUCTOS
// ---------------------------

/**
 * Crea el HTML de una tarjeta de producto
 */
function crearCardProducto(producto) {
    const imagenPrincipal = producto.colores?.[0]?.imagen || producto.imagen || "";
    
    // Obtener tallas únicas
    const tallas = producto.colores
        ? [...new Set(producto.colores.flatMap(color => color.talla || []))]
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
                            ${tallas.map(talla => `<span class="size-chip">${talla}</span>`).join("")}
                        </div>
                    </div>
                    
                    <div class="product-colors">
                        <span class="product-label">Colores</span>
                        <div class="colors-container">
                            ${(producto.colores || []).map(color => `
                                <span class="color-dot" style="background:${color.codigo}" title="Color"></span>
                            `).join("")}
                        </div>
                    </div>
                    
                    <button class="product-btn btn-ver-producto" data-producto='${JSON.stringify(producto)}'>
                        <i class="bi bi-eye"></i> Ver producto
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Muestra mensaje cuando no hay productos
 */
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

/**
 * Filtra y muestra productos según género, categoría y tallas
 */
function mostrarProductos(genero, categoria = "Todas") {
    if (isLoading) return;
    isLoading = true;
    toggleLoader(true);
    
    // Pequeño retraso para mostrar el loader
    setTimeout(() => {
        let productosFiltrados = obtenerProductosPorGenero(genero);
        
        // Filtrar por categoría
        if (categoria !== "Todas") {
            productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
        }
        
        // Filtrar por tallas seleccionadas
        const tallasSeleccionadas = obtenerTallasSeleccionadas();
        if (tallasSeleccionadas.length > 0) {
            productosFiltrados = productosFiltrados.filter(producto => {
                const tallasProducto = producto.colores
                    ? producto.colores.flatMap(color => color.talla || [])
                    : (producto.talla || []);
                return tallasProducto.some(talla => tallasSeleccionadas.includes(talla));
            });
        }
        
        // Renderizar productos
        const html = productosFiltrados.length === 0 
            ? mostrarEstadoVacio()
            : productosFiltrados.map(crearCardProducto).join("");
        
        if (grid) grid.innerHTML = html;
        
        // Agregar event listeners a los botones "Ver producto"
        document.querySelectorAll(".btn-ver-producto").forEach(btn => {
            btn.addEventListener("click", () => {
                const producto = JSON.parse(btn.dataset.producto);
                window.location.href = `producto.html?id=${producto.idProducto}`;
            });
        });
        
        toggleLoader(false);
        isLoading = false;
    }, 200); // Reducido de 350ms a 200ms para mejor UX
}

/**
 * Muestra los primeros 10 productos (vista inicial)
 */
function mostrarPrimeros10Productos() {
    if (isLoading) return;
    isLoading = true;
    toggleLoader(true);
    
    setTimeout(() => {
        // Mezclar productos de hombre y mujer y tomar primeros 10
        const todos = [...productos.hombre, ...productos.mujer];
        const primeros10 = todos.slice(0, 10);
        
        const html = primeros10.length === 0 
            ? mostrarEstadoVacio()
            : primeros10.map(crearCardProducto).join("");
        
        if (grid) grid.innerHTML = html;
        
        // Agregar event listeners
        document.querySelectorAll(".btn-ver-producto").forEach(btn => {
            btn.addEventListener("click", () => {
                const producto = JSON.parse(btn.dataset.producto);
                window.location.href = `producto.html?id=${producto.idProducto}`;
            });
        });
        
        toggleLoader(false);
        isLoading = false;
    }, 200);
}

// ---------------------------
// 5. CARGA DE DATOS Y FILTROS DE GÉNERO
// ---------------------------

/**
 * Actualiza la UI cuando se cambia el género
 */
function actualizarPorGenero(genero) {
    categoriaActual = "Todas";
    
    // Actualizar botones de categorías
    document.querySelectorAll(".categoria-producto").forEach(btn => {
        btn.classList.remove("active-btn");
        if (btn.dataset.categoria === "Todas") {
            btn.classList.add("active-btn");
        }
    });
    
    renderTallas(genero);
    renderCategorias(genero);
    
    if (genero === "todos") {
        mostrarPrimeros10Productos();
    } else {
        mostrarProductos(genero);
    }
}

/**
 * Carga el catálogo desde el backend
 */
async function cargarCatalogo() {
    try {
        toggleLoader(true);
        
        const response = await fetch("http://localhost:8080/productos/catalogo");
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        productos = {
            hombre: data.hombre || [],
            mujer: data.mujer || []
        };
        
        console.log(`✅ Cargados: ${productos.hombre.length} productos hombre, ${productos.mujer.length} productos mujer`);
        
        // Configurar UI según género actual
        if (generoActual === "todos") {
            // Vista inicial: mostrar primeros 10 productos
            actualizarPorGenero("todos");
        } else {
            renderTallas(generoActual);
            renderCategorias(generoActual);
            mostrarProductos(generoActual);
        }
        
        // Marcar botón de género activo
        const botonActivo = document.querySelector(`.categoria-btn[data-genero="${generoActual}"]`);
        if (botonActivo) {
            document.querySelectorAll(".categoria-btn").forEach(btn => {
                btn.classList.remove("active-genero");
            });
            botonActivo.classList.add("active-genero");
        }
        
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
                        <button onclick="location.reload()" class="btn btn-primary mt-3">Reintentar</button>
                    </div>
                </div>
            `;
        }
    }
}

// ---------------------------
// 6. CONFIGURACIÓN DE BOTONES DE GÉNERO
// ---------------------------

const botonesGenero = document.querySelectorAll(".categoria-btn");

botonesGenero.forEach(btn => {
    btn.addEventListener("click", () => {
        const genero = btn.dataset.genero;
        if (genero === generoActual) return;
        
        // Actualizar UI de botones
        botonesGenero.forEach(b => b.classList.remove("active-genero"));
        btn.classList.add("active-genero");
        
        // Actualizar género actual
        generoActual = genero;
        
        // Actualizar productos mostrados
        actualizarPorGenero(generoActual);
    });
});

// ---------------------------
// 7. FUNCIONES DE SCROLL (CATEGORÍAS)
// ---------------------------

function actualizarFlechas() {
    const contenedor = document.getElementById("contenedor-categorias");
    const left = document.getElementById("scroll-left");
    const right = document.getElementById("scroll-right");
    
    if (!contenedor || !left || !right) return;
    
    // Ocultar en móvil
    if (window.innerWidth <= 768) {
        left.style.display = "none";
        right.style.display = "none";
        return;
    }
    
    const maxScroll = contenedor.scrollWidth - contenedor.clientWidth;
    
    if (maxScroll <= 0) {
        left.style.display = "none";
        right.style.display = "none";
        return;
    }
    
    left.style.display = contenedor.scrollLeft > 5 ? "flex" : "none";
    right.style.display = contenedor.scrollLeft < maxScroll - 5 ? "flex" : "none";
}

// Event listeners para botones de scroll
document.getElementById("scroll-right")?.addEventListener("click", () => {
    const contenedor = document.getElementById("contenedor-categorias");
    if (contenedor) {
        contenedor.scrollBy({ left: 250, behavior: "smooth" });
    }
});

document.getElementById("scroll-left")?.addEventListener("click", () => {
    const contenedor = document.getElementById("contenedor-categorias");
    if (contenedor) {
        contenedor.scrollBy({ left: -250, behavior: "smooth" });
    }
});

// Event listeners para actualizar flechas
window.addEventListener("resize", actualizarFlechas);
if (contenedorCategorias) {
    contenedorCategorias.addEventListener("scroll", actualizarFlechas);
}

// ---------------------------
// 8. INICIALIZAR
// ---------------------------
cargarCatalogo();