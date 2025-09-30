document.addEventListener("DOMContentLoaded", () => {
  const carrito = document.querySelector(".carrito-flotante");

  const toggleCarritoBtn = document.createElement("button");
  toggleCarritoBtn.classList.add("btn");
  toggleCarritoBtn.style.position = "fixed";
  toggleCarritoBtn.style.top = "40px";
  toggleCarritoBtn.style.right = "50px";
  toggleCarritoBtn.style.zIndex = "1002";

  const carritoImg = document.createElement("img");
  carritoImg.src = "../../../Imagenes/carrito.png"; // o ajusta según ruta relativa
  carritoImg.alt = "Carrito";
  carritoImg.style.width = "20px";
  carritoImg.style.height = "20px";

  toggleCarritoBtn.appendChild(carritoImg);
  document.body.appendChild(toggleCarritoBtn);

  let abierto = true;
  toggleCarritoBtn.addEventListener("click", () => {
    if (carrito) {
      if (abierto) {
        carrito.classList.add("carrito-cerrado");
      } else {
        carrito.classList.remove("carrito-cerrado");
      }
      abierto = !abierto;
    }
  });
});
