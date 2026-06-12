import { getColores } from "./catalogoService.js";

export const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];

async function buildOpcionesColores(
    idSeleccionado = ""
) {

    const colores =
        await getColores();

    return `
        <option value="">
            Selecciona un color
        </option>
    ` +
        colores.map(c =>
            `
        <option
            value="${c.id}"
            ${Number(idSeleccionado) === c.id ? "selected" : ""}
        >
            ${c.nombre}
        </option>
        `
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


export async function refrescarSelectoresColor() {

    const selectores =
        document.querySelectorAll(
            ".color-select"
        );

    for (const sel of selectores) {

        const actual =
            sel.value;

        sel.innerHTML =
            await buildOpcionesColores(
                actual
            );

    }

}

/**
 * @param {Object} [colorData]  - datos para pre-cargar (edición)
 * @param {Function} onNuevoColor - callback para abrir modal nuevo color
 * @returns {HTMLElement}
 */
export async function crearBloqueColor(colorData = null, onNuevoColor) {
    const opcionesColores = await buildOpcionesColores(colorData?.idColor);
    const wrapper = document.createElement("div");
    wrapper.className = "card mb-3 bloque-color";
    wrapper.dataset.id = Date.now();

    wrapper.innerHTML = `
        <div class="card-body">

            <div class="row g-3 mb-3">

                <div class="col-md-4">

                    <label class="form-label">
                        Color
                        <span class="text-orange">*</span>
                    </label>

                    <div class="d-flex gap-2">

                        <select class="form-select color-select" required>
                            ${opcionesColores}
                        </select>

                        <button
                            type="button"
                            class="btn-add btn-nuevo-color"
                            style="padding:10px 14px;">

                            <i class="bi bi-plus"></i>

                        </button>

                    </div>

                </div>

                <div class="col-md-8">

                    <label class="form-label">
                        Imagen principal
                        <span class="text-orange">*</span>
                    </label>

                    <input
                        type="url"
                        class="form-control url-imagen"
                        placeholder="https://..."
                        value="${colorData?.imagen || ""}"
                    >

                    <div class="preview-container mt-2 text-center">

                        <img
                            class="image-preview"
                            src="${colorData?.imagen || ""}"
                            style="
                                max-width:150px;
                                max-height:150px;
                                object-fit:cover;
                                border-radius:8px;
                                border:2px solid #ddd;
                                display:${colorData?.imagen ? "block" : "none"};
                            "
                        >

                    </div>

                </div>

            </div>

            <hr>

            <div class="row g-3">
                ${buildTallas(colorData?.tallas)}
            </div>

            <div class="mt-3">

                <button
                    type="button"
                    class="btn btn-danger btn-sm btnEliminarColor">

                    <i class="bi bi-trash"></i>
                    Eliminar Color

                </button>

            </div>

        </div>
        `;

    const inputUrl =
        wrapper.querySelector(".url-imagen");

    const preview =
        wrapper.querySelector(".image-preview");

    inputUrl.addEventListener("input", () => {

        const url = inputUrl.value.trim();

        if (!url) {

            preview.src = "";
            preview.style.display = "none";

            return;
        }

        preview.src = url;

    });

    preview.addEventListener("load", () => {

        preview.style.display = "block";

    });

    preview.addEventListener("error", () => {

        preview.style.display = "none";

    });

    // Botón nuevo color
    wrapper.querySelector(".btn-nuevo-color").addEventListener("click", (e) => {
        e.preventDefault();
        onNuevoColor?.((nuevoColor) => {
            const sel = wrapper.querySelector(".color-select");
            const opt = document.createElement("option");
            opt.value = nuevoColor.id;
            opt.textContent = nuevoColor.nombre;
            sel.appendChild(opt);
            sel.value = nuevoColor.id;
        });
    });

    return wrapper;
}

export function leerDatosBloque(bloque) {

    const colorId =
        bloque.querySelector(".color-select")?.value;

    const imagen =
        bloque.querySelector(".url-imagen")?.value.trim();

    const tallas =
        Array.from(
            bloque.querySelectorAll(".stock-talla")
        ).map(input => ({
            talla: input.dataset.talla,
            stock: Number(input.value) || 0
        }));

    return {
        colorId,
        imagen,
        tallas
    };

}