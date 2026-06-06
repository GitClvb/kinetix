// ============================================================
// colorBloque.js
// Responsabilidad: crear y gestionar UN bloque color/talla/imagen.
// Se importa desde admin-producto.js.
// ============================================================

import { getColores }    from "./catalogoService.js";
import { subirImagen }   from "./imagenService.js";

export const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];

// ── Crear HTML del bloque ────────────────────────────────────
function buildOpcionesColores(idSeleccionado = "") {
    return `<option value="">Selecciona un color</option>` +
        getColores().map(c =>
            `<option value="${c.id}" ${Number(idSeleccionado) === c.id ? "selected" : ""}>${c.nombre}</option>`
        ).join("");
}

function buildTallas(tallasGuardadas = []) {
    return TALLAS.map(t => {
        const stock = tallasGuardadas.find(x => x.talla === t)?.stock ?? 0;
        return `
            <div class="col-md-2">
                <label class="form-label">${t}</label>
                <input type="number" min="0" value="${stock}"
                       data-talla="${t}" class="form-control stock-talla">
            </div>`;
    }).join("");
}

// ── Agregar imagen a galería ─────────────────────────────────
function agregarImagenAGaleria(gallery, url) {
    const item = document.createElement("div");
    item.className = "image-item position-relative d-inline-block m-1";
    item.innerHTML = `
        <img src="${url}" class="image-preview"
             style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:2px solid #ddd;">
        <button type="button" class="btn-remove-image"
                style="position:absolute;top:-8px;right:-8px;background:#dc3545;color:white;
                       border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;">×</button>`;
    item.querySelector(".btn-remove-image").addEventListener("click", () => item.remove());
    gallery.appendChild(item);
}

// ── Actualizar selectores existentes cuando se agrega un color nuevo ──
export function refrescarSelectoresColor() {
    document.querySelectorAll(".color-select").forEach(sel => {
        const actual = sel.value;
        sel.innerHTML = buildOpcionesColores(actual);
    });
}

// ── Crear bloque completo ────────────────────────────────────
/**
 * @param {Object} [colorData]  - datos para pre-cargar (edición)
 * @param {Function} onNuevoColor - callback para abrir modal nuevo color
 * @returns {HTMLElement}
 */
export function crearBloqueColor(colorData = null, onNuevoColor) {
    const wrapper = document.createElement("div");
    wrapper.className = "card mb-3 bloque-color";
    wrapper.dataset.id = Date.now();

    const imagenesGuardadas = colorData?.imagenes || [];

    wrapper.innerHTML = `
        <div class="card-body">
            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <label class="form-label">Color <span class="text-orange">*</span></label>
                    <div class="d-flex gap-2">
                        <select class="form-select color-select" required>
                            ${buildOpcionesColores(colorData?.id_color)}
                        </select>
                        <button type="button" class="btn-add btn-nuevo-color" style="padding:10px 14px;" title="Agregar nuevo color">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-8">
                    <label class="form-label">Imágenes <span class="text-orange">*</span></label>
                    <input type="file" multiple accept="image/*" class="imagenes-color" style="display:none;">
                    <button type="button" class="btn btn-outline-primary btn-sm btn-subir-imagenes w-100">
                        <i class="bi bi-cloud-upload"></i> Subir imágenes
                    </button>
                    <div class="gallery-container mt-2 d-flex flex-wrap gap-2">
                        ${imagenesGuardadas.map(url => `
                            <div class="image-item position-relative d-inline-block">
                                <img src="${url}" class="image-preview"
                                     style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:2px solid #ddd;">
                                <button type="button" class="btn-remove-image"
                                        style="position:absolute;top:-8px;right:-8px;background:#dc3545;color:white;
                                               border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;">×</button>
                            </div>`).join("")}
                    </div>
                </div>
            </div>
            <hr>
            <div class="row g-3">${buildTallas(colorData?.tallas)}</div>
            <div class="mt-3">
                <button type="button" class="btn btn-danger btn-sm btnEliminarColor">
                    <i class="bi bi-trash"></i> Eliminar Color
                </button>
            </div>
        </div>`;

    // Borrar imágenes pre-cargadas (las que vienen de edición)
    wrapper.querySelectorAll(".btn-remove-image").forEach(btn =>
        btn.addEventListener("click", () => btn.closest(".image-item").remove())
    );

    // Subir imágenes
    const inputFile = wrapper.querySelector(".imagenes-color");
    const gallery   = wrapper.querySelector(".gallery-container");

    wrapper.querySelector(".btn-subir-imagenes").addEventListener("click", () => inputFile.click());

    inputFile.addEventListener("change", async (e) => {
        for (const file of Array.from(e.target.files)) {
            const url = await subirImagen(file);   // ← imagenService abstrae la lógica
            agregarImagenAGaleria(gallery, url);
        }
        inputFile.value = "";
    });

    // Botón nuevo color
    wrapper.querySelector(".btn-nuevo-color").addEventListener("click", (e) => {
        e.preventDefault();
        onNuevoColor?.((nuevoColor) => {
            const sel = wrapper.querySelector(".color-select");
            const opt = document.createElement("option");
            opt.value       = nuevoColor.id;
            opt.textContent = nuevoColor.nombre;
            sel.appendChild(opt);
            sel.value = nuevoColor.id;
        });
    });

    return wrapper;
}

// ── Leer datos del bloque (para guardar) ─────────────────────
export function leerDatosBloque(bloque) {
    const colorId  = bloque.querySelector(".color-select")?.value;
    const imagenes = Array.from(bloque.querySelectorAll(".image-preview")).map(img => img.src);
    const tallas   = Array.from(bloque.querySelectorAll(".stock-talla")).map(input => ({
        talla: input.dataset.talla,
        stock: Number(input.value) || 0
    }));
    return { colorId, imagenes, tallas };
}