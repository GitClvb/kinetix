const inputURL = document.getElementById('urlImagen');
const inputArchivoGlobal = document.getElementById('imagenArchivo');
const previewImagen = document.getElementById('previewImagen');
const btnEliminarImagen = document.getElementById('btnEliminarImagen');
const precioInput = document.getElementById('precioProducto');

let imagenBase64 = "";

// Si escribe URL → bloquear archivo
inputURL.addEventListener('input', function () {

    const url = this.value.trim();

    const alertContainer = document.getElementById('alert-container');

    // Limpiar alertas anteriores
    alertContainer.innerHTML = "";

    // Si está vacío
    if (url === "") {

        inputArchivoGlobal.disabled = false;

        previewImagen.src = "";

        previewImagen.classList.add('d-none');
        btnEliminarImagen.classList.add('d-none');

        return;
    }

    // Bloquear archivo
    inputArchivoGlobal.disabled = true;

    // Validar formato URL
    try {

        new URL(url);

    } catch {

        previewImagen.classList.add('d-none');
        btnEliminarImagen.classList.add('d-none');

        alertContainer.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                La URL ingresada no es válida.

                <button 
                    type="button" 
                    class="btn-close" 
                    data-bs-dismiss="alert"
                    aria-label="Close">
                </button>
            </div>
        `;

        return;
    }

    // Verificar si carga imagen
    const imgTest = new Image();

    imgTest.onload = function () {

        previewImagen.src = url;

        previewImagen.classList.remove('d-none');
        btnEliminarImagen.classList.remove('d-none');
    };

    imgTest.onerror = function () {

        previewImagen.src = "";

        previewImagen.classList.add('d-none');
        btnEliminarImagen.classList.add('d-none');

        alertContainer.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                No se pudo cargar la imagen desde la URL proporcionada.

                <button 
                    type="button" 
                    class="btn-close" 
                    data-bs-dismiss="alert"
                    aria-label="Close">
                </button>
            </div>
        `;
    };

    imgTest.src = url;
});

// Si selecciona archivo → bloquear URL
inputArchivoGlobal.addEventListener('change', function () {

    const archivo = this.files[0];

    if (!archivo) {

        inputURL.disabled = false;

        previewImagen.classList.add('d-none');
        btnEliminarImagen.classList.add('d-none');

        imagenBase64 = "";

        return;
    }

    // Bloquear URL
    inputURL.disabled = true;

    const reader = new FileReader();

    reader.onload = function (event) {

        imagenBase64 = event.target.result;

        // Mostrar preview
        previewImagen.src = imagenBase64;

        previewImagen.classList.remove('d-none');
        btnEliminarImagen.classList.remove('d-none');
    };

    reader.readAsDataURL(archivo);
});

document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // 1. Obtener referencias a los campos
    const nombre = document.getElementById('nombreProducto').value.trim();
    const categoria = document.getElementById('categoriaProducto').value;
    const precio = document.getElementById('precioProducto').value;
    const descripcion = document.getElementById('descripcionProducto').value.trim();
    const url = document.getElementById('urlImagen').value.trim();
    const inputArchivo = document.getElementById('imagenArchivo');
    const alertContainer = document.getElementById('alert-container');
    const genero = document.querySelector('input[name="generoProducto"]:checked')?.value;

    // Limpiar alertas previas
    alertContainer.innerHTML = '';

    // 2. Validación (CA3)
    let errores = [];
    if (!genero) errores.push("Debes seleccionar un género.");
    if (nombre.length < 3) errores.push("El nombre debe tener al menos 3 caracteres.");
    if (categoria === "") errores.push("Debes seleccionar una categoría.");
    if (precio <= 0) errores.push("El precio debe ser mayor a 0.");
    if (descripcion.length < 10) errores.push("La descripción es muy corta.");
    const tieneURL = url !== "";
    const tieneArchivo = inputArchivo.files.length > 0;

    // Debe existir una opción
    if (!tieneURL && !tieneArchivo) {
        errores.push("Debes agregar una imagen por URL o archivo.");
    }

    // Validar URL solo si existe
    if (tieneURL && !url.startsWith('http')) {
        errores.push("La URL de la imagen no es válida.");
    }

    if (errores.length > 0) {
        // Mostrar Alertas de Bootstrap
        errores.forEach(msg => {
            const alert = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i> ${msg}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
            alertContainer.innerHTML += alert;
        });
    } else {
        // 3. Crear Objeto JSON (CA5)
        const nuevoProducto = {
            id: Date.now(), // Genera un ID único basado en tiempo
            nombre: nombre,
            categoria: categoria,
            genero: genero,
            precio: parseFloat(precio).toFixed(2),
            descripcion: descripcion,
            imagen: tieneArchivo ? imagenBase64 : url,
            tipoImagen: tieneArchivo ? "archivo" : "url",
            fechaCreacion: new Date().toISOString()
        };

        console.log("Producto Creado Exitosamente:", JSON.stringify(nuevoProducto, null, 2));

        // Alerta de éxito
        alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>¡Producto creado exitosamente!</strong><br>
                    Los campos se limpiarán automáticamente en 3 segundos...
                </div>`;


        // Esperar 3 segundos antes de limpiar
        setTimeout(() => {

            // Limpiar formulario
            document.getElementById('productForm').reset();

            // Limpiar preview
            previewImagen.src = "";
            previewImagen.classList.add('d-none');
            btnEliminarImagen.classList.add('d-none');

            // Reactivar inputs
            inputURL.disabled = false;
            inputArchivoGlobal.disabled = false;

            // Reiniciar Base64
            imagenBase64 = "";

            // Limpiar radio buttons
            document.querySelectorAll('input[name="generoProducto"]').forEach(radio => {
                radio.checked = false;
            });

            // Limpiar alertas
            alertContainer.innerHTML = `
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        El formulario ha sido limpiado correctamente.
                        
                        <button 
                            type="button" 
                            class="btn-close" 
                            data-bs-dismiss="alert" 
                            aria-label="Close">
                        </button>
                    </div>
                    `;

        }, 3000);

        // Opcional: Limpiar formulario
        // document.getElementById('productForm').reset();
    }
});

btnEliminarImagen.addEventListener('click', function () {

    // Limpiar URL
    inputURL.value = "";

    // Limpiar archivo
    inputArchivoGlobal.value = "";

    // Limpiar preview
    previewImagen.src = "";

    previewImagen.classList.add('d-none');

    // Ocultar botón
    btnEliminarImagen.classList.add('d-none');

    // Reactivar inputs
    inputURL.disabled = false;

    inputArchivoGlobal.disabled = false;

    // Reiniciar Base64
    imagenBase64 = "";

    // Limpiar alertas
    document.getElementById('alert-container').innerHTML = "";
});

precioInput.addEventListener('input', function () {

    // Reemplazar comas por punto
    let valor = this.value.replace(/,/g, '.');

    // Eliminar caracteres inválidos
    valor = valor.replace(/[^0-9.]/g, '');

    // Permitir solo un punto decimal
    valor = valor.replace(/(\..*?)\..*/g, '$1');

    // Permitir máximo 2 decimales
    valor = valor.replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');

    this.value = valor;
});

// Detectar recarga o salida
window.addEventListener('beforeunload', function (e) {

    const generoSeleccionado =
        document.querySelector('input[name="generoProducto"]:checked');

    // Verificar si hay información escrita
    const formularioTieneDatos =
        document.getElementById('nombreProducto').value.trim() !== "" ||
        document.getElementById('categoriaProducto').value !== "" ||
        generoSeleccionado ||
        document.getElementById('precioProducto').value.trim() !== "" ||
        document.getElementById('descripcionProducto').value.trim() !== "" ||
        document.getElementById('urlImagen').value.trim() !== "" ||
        document.getElementById('imagenArchivo').files.length > 0;

    if (formularioTieneDatos) {

        // Mensaje estándar del navegador
        e.preventDefault();

        e.returnValue = '';
    }
});

// Limpiar formulario al recargar
window.addEventListener('load', function () {

    document.getElementById('productForm').reset();

    previewImagen.src = "";

    // Limpiar radio buttons
    document.querySelectorAll('input[name="generoProducto"]').forEach(radio => {
        radio.checked = false;
    });

    previewImagen.classList.add('d-none');

    btnEliminarImagen.classList.add('d-none');

    imagenBase64 = "";

    inputURL.disabled = false;

    inputArchivoGlobal.disabled = false;
});