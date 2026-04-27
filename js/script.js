let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botones = document.querySelectorAll(".agregar-carrito");
const contador = document.getElementById("contador");

botones.forEach(boton => {
  boton.addEventListener("click", () => {

    const producto = {
      nombre: boton.dataset.nombre,
      precio: parseFloat(boton.dataset.precio)
    };

    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContador();

    // ANIMACIÓN
    contador.classList.add("pop");
    setTimeout(() => contador.classList.remove("pop"), 300);
  });
});

function actualizarContador() {
  if (contador) {
    contador.textContent = carrito.length;
  }
}

function mostrarCarrito() {
  const lista = document.getElementById("lista");
  const totalElemento = document.getElementById("total");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    li.innerHTML = `
      ${producto.nombre} - $${producto.precio}
      <button class="btn btn-sm btn-danger" onclick="eliminar(${index})">X</button>
    `;

    lista.appendChild(li);
    total += producto.precio;
  });

  totalElemento.textContent = "Total: $" + total.toFixed(2);
}

function eliminar(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  mostrarCarrito();
}

actualizarContador();