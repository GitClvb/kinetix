//cartService.js
async function migrateCartToDB() {
    const cart = getLocalCart();
    const user = getUser();

    if (!user || !user.idUsuario) return;
    if (!cart || cart.length === 0) return;

    try {
        for (const item of cart) {
            if (!item.idVariante) continue;

            await fetch(`http://localhost:8080/api/carrito/${user.idUsuario}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idVariante: Number(item.idVariante),
                    cantidad: Number(item.cantidad),
                    precioUnitario: Number(item.precio)
                })
            });
        }

        localStorage.removeItem("kinetix_cart");
        console.log("Carrito migrado correctamente");
    } catch (error) {
        console.error("Error migrando carrito:", error);
    }
}