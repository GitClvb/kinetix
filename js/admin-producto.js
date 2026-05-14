document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // 1. Obtener referencias a los campos
    const nombre = document.getElementById('nombreProducto').value.trim();
    const categoria = document.getElementById('categoriaProducto').value;
    const precio = document.getElementById('precioProducto').value;
    const descripcion = document.getElementById('descripcionProducto').value.trim();
    const url = document.getElementById('urlImagen').value.trim();
    const alertContainer = document.getElementById('alert-container');

    // Limpiar alertas previas
    alertContainer.innerHTML = '';

    // 2. Validación (CA3)
    let errores = [];
    if (nombre.length < 3) errores.push("El nombre debe tener al menos 3 caracteres.");
    if (categoria === "") errores.push("Debes seleccionar una categoría.");
    if (precio <= 0) errores.push("El precio debe ser mayor a 0.");
    if (descripcion.length < 10) errores.push("La descripción es muy corta.");
    if (!url.startsWith('http')) errores.push("La URL de la imagen no es válida.");

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
            precio: parseFloat(precio),
            descripcion: descripcion,
            urlImagen: url,
            fechaCreacion: new Date().toISOString()
        };

        console.log("Producto Creado Exitosamente:", JSON.stringify(nuevoProducto, null, 2));
        
        // Alerta de éxito
        alertContainer.innerHTML = `
            <div class="alert alert-success" role="alert">
                ¡Producto creado y guardado en consola con éxito!
            </div>`;
        
        // Opcional: Limpiar formulario
        // document.getElementById('productForm').reset();
    }
});