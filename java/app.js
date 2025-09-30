const productos = {
  ofertas: [
    {
      nombre: "Micrófono Pro",
      img: "../../../imagenes/microfonoinalabricos.png",
      descripcion: "Micrófono inalámbrico de alta fidelidad.",
      precio: 2200,
      detalle: "detalles/Micrófono Pro.html"
    },
    {
      nombre: "Luces Beam 230",
      img: "../../../imagenes/lucesbeam.png",
      descripcion: "Luces profesionales para escenarios.",
      precio: 2850,
      detalle: "detalles/Luces Beam 230 .html"
    }
  ],
  vendidos: [
    {
      nombre: "NExo bajo",
      img: "../../../imagenes/nexobajo.png",
      descripcion: "Subwoofer Nexo de alto rendimiento.",
      precio: 3200,
      detalle: "detalles/NExo bajo.html"
    },
    {
      nombre: "Estudio Mixer",
      img: "../../../imagenes/estudiomixer.png",
      descripcion: "Mixer profesional para estudios y conciertos.",
      precio: 4100,
      detalle: "detalles/studio mixer.html"
    }
  ],
  nuevos: [
    {
      nombre: "Estructura Modular",
      img: "../../../imagenes/andamioslayer.png",
      descripcion: "Andamio modular ideal para eventos.",
      precio: 3600,
      detalle: "detalles/Andamio modular.html"
    },
    {
      nombre: "Mini Escenario",
      img: "../../../imagenes/escenario.png",
      descripcion: "Escenario compacto para presentaciones pequeñas.",
      precio: 2500,
      detalle: "detalles/Escenario compacto.html"
    }
  ]
};

let carruselIndex = 0;
let productosActuales = [];

function mostrarDestacados(categoria) {
  const contenedor = document.getElementById("destacados");
  productosActuales = productos[categoria];
  carruselIndex = 0;

  if (window.innerWidth <= 768) {
    document.getElementById("botones-carrusel").style.display = "flex";
    mostrarProductoActual(contenedor);
  } else {
    document.getElementById("botones-carrusel").style.display = "none";
    contenedor.innerHTML = "";
    productosActuales.forEach(producto => {
      const div = crearElementoProducto(producto);
      contenedor.appendChild(div);
    });
  }
}

function mostrarProductoActual(contenedor) {
  contenedor.innerHTML = "";
  const producto = productosActuales[carruselIndex];
  const div = crearElementoProducto(producto);
  contenedor.appendChild(div);
}

function moverCarrusel(direccion) {
  carruselIndex += direccion;
  if (carruselIndex < 0) carruselIndex = productosActuales.length - 1;
  if (carruselIndex >= productosActuales.length) carruselIndex = 0;

  const contenedor = document.getElementById("destacados");
  mostrarProductoActual(contenedor);
}

function crearElementoProducto(producto) {
  const div = document.createElement("div");
  div.classList.add("productoOVN");

  const precioFormateado = `$${producto.precio.toLocaleString("en-US")}`;

  div.innerHTML = `
    <a href="${producto.detalle}">
      <img src="${producto.img}" alt="${producto.nombre}">
    </a>
    <h3>${producto.nombre}</h3>
    <p class="descripcion">${producto.descripcion}</p>
    <p class="precio"><strong>${precioFormateado}</strong></p>
    <button onclick="agregarAlCarrito('${producto.nombre}')" class="boton-agregar">Agregar</button>
  `;
  return div;
}
function agregarProductoDetalle(nombre, img, precio) {
  const mensaje = document.getElementById("mensaje-carrito");
  if (mensaje) mensaje.style.display = "none";

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const productoExistente = carrito.find(item => item.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, img, precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarListaCarrito();
}


// Agregar producto al carrito
function agregarAlCarrito(nombre) {
  const mensaje = document.getElementById("mensaje-carrito");
  mensaje.style.display = "none";
  
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  const productoExistente = carrito.find(item => item.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarListaCarrito();
}

function actualizarListaCarrito() {
  const lista = document.getElementById("lista-carrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  lista.innerHTML = "";

  if (carrito.length === 0) {
    document.getElementById("mensaje-carrito").style.display = "block";
  } else {
    document.getElementById("mensaje-carrito").style.display = "none";

    carrito.forEach(item => {
      let productoCompleto = null;

      // Intentamos encontrarlo en productos
      for (const categoria in productos) {
        productoCompleto = productos[categoria].find(p => p.nombre === item.nombre);
        if (productoCompleto) break;
      }

      // Si no está en los productos predefinidos, usamos lo que viene en el carrito
      const img = productoCompleto ? productoCompleto.img : item.img;
      const precio = productoCompleto ? productoCompleto.precio : item.precio;

      const li = document.createElement("li");
      li.classList.add("item-carrito");
      li.innerHTML = `
        <img src="${img}" alt="${item.nombre}" class="carrito-img">
        <span class="carrito-nombre">${item.nombre}</span>
        <span class="carrito-precio">$${precio.toLocaleString("en-US")}</span>
        <span class="carrito-cantidad">${item.cantidad}</span>
        <span class="carrito-accion">
          <button onclick="disminuirCantidad('${item.nombre}')" class="boton-x">✖</button>
        </span>
      `;
      lista.appendChild(li);
    });
  }
}


function disminuirCantidad(nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find(item => item.nombre === nombre);
  
  if (producto) {
    if (producto.cantidad > 1) {
      producto.cantidad -= 1;
    } else {
      carrito = carrito.filter(item => item.nombre !== nombre);
    }
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarListaCarrito();
}

function vaciarCarrito() {
  localStorage.setItem("carrito", JSON.stringify([]));
  actualizarListaCarrito();
}

function eliminarCarrito() {
  localStorage.removeItem("carrito");
  actualizarListaCarrito();
}

function verNuevos() {
  mostrarDestacados('nuevos');
}

function ajustarAnchoCarrito() {
  const carrito = document.getElementById("carrito");
  if (window.innerWidth <= 600) {
    carrito.style.width = "350px";
  } else {
    carrito.style.width = "450px";
  }
}

window.addEventListener("load", ajustarAnchoCarrito);
window.addEventListener("resize", ajustarAnchoCarrito);

// Iniciar cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  mostrarDestacados('ofertas');
  actualizarListaCarrito();

  const carrito = document.querySelector(".carrito-flotante");

  const toggleCarritoBtn = document.createElement("button");
  toggleCarritoBtn.classList.add("btn");
  toggleCarritoBtn.style.position = "fixed";
  toggleCarritoBtn.style.zIndex = "1002";

  const carritoImg = document.createElement("img");
  carritoImg.src = "Imagenes/carrito.png";
  carritoImg.alt = "Carrito";
  carritoImg.style.width = "30px";
  carritoImg.style.height = "30px";

  toggleCarritoBtn.appendChild(carritoImg);
  document.body.appendChild(toggleCarritoBtn);

  function ajustarPosicionCarrito() {
    if (window.innerWidth <= 600) {
      toggleCarritoBtn.style.left = "345px";
      toggleCarritoBtn.style.right = "auto";
      toggleCarritoBtn.style.top = "50px";
    } else {
      toggleCarritoBtn.style.right = "50px";
      toggleCarritoBtn.style.left = "auto";
      toggleCarritoBtn.style.top = "40px";
    }
  }

  ajustarPosicionCarrito();
  window.addEventListener("resize", ajustarPosicionCarrito);

  let abierto = true;
  toggleCarritoBtn.addEventListener("click", () => {
    if (abierto) {
      carrito.classList.add("carrito-cerrado");
    } else {
      carrito.classList.remove("carrito-cerrado");
    }
    abierto = !abierto;
  });
});
document.addEventListener("DOMContentLoaded", () => {
  actualizarListaCarrito(); // carga los productos desde localStorage
});
document.addEventListener("DOMContentLoaded", () => {
  const botonToggle = document.getElementById("toggleCarrito");
  const carrito = document.getElementById("carrito");

  if (botonToggle && carrito) {
    botonToggle.addEventListener("click", () => {
      carrito.classList.toggle("carrito-cerrado");
    });
  }

  actualizarListaCarrito();
});
const producto = {
  id: idProducto,
  nombre: nombreProducto,
  precio: precioProducto,
  imagen: imagenProducto.src, // <<-- aquí
  cantidad: 1
};
productoHTML.innerHTML = `
  <li>
    <img src="${producto.imagen}" style="width:50px;height:50px;" alt="${producto.nombre}">
    <span>${producto.nombre}</span>
    <span>${producto.precio}</span>
    <span>${producto.cantidad}</span>
    <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
  </li>
`;


function agregarProductoDetalle(nombre, imagen, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const productoExistente = carrito.find(item => item.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, imagen, precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarListaCarrito();
}
const productosExtra = [
  {
    nombre: "DB Technologies DVA S30 N Sub Bajo Activo 2x18",
    img: "../Imagenes/dba-s30.jpg",
    precio: 3999000
  }
];

function agregarProductoDetalle(nombre, img, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, img, precio, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarListaCarrito();
}

// Agregar producto al carrito
function agregarAlCarrito(nombre) {
  const mensaje = document.getElementById("mensaje-carrito");
  mensaje.style.display = "none";
  
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  const productoExistente = carrito.find(item => item.nombre === nombre);
  if (productoExistente) {
      productoExistente.cantidad += 1;
  } else {
      const producto = productos.ofertas.find(p => p.nombre === nombre) || 
                       productos.vendidos.find(p => p.nombre === nombre) || 
                       productos.nuevos.find(p => p.nombre === nombre);
                       
      carrito.push({ nombre: producto.nombre, img: producto.img, precio: producto.precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarListaCarrito();
}

// Actualizar la lista del carrito
function actualizarListaCarrito() {
  const lista = document.getElementById("lista-carrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  lista.innerHTML = "";

  if (carrito.length === 0) {
      document.getElementById("mensaje-carrito").style.display = "block";
  } else {
      document.getElementById("mensaje-carrito").style.display = "none";

      carrito.forEach(item => {
          const li = document.createElement("li");
          li.classList.add("item-carrito");
          li.innerHTML = `
              <img src="${item.img}" alt="${item.nombre}" class="carrito-img">
              <span class="carrito-nombre">${item.nombre}</span>
              <span class="carrito-precio">$${item.precio.toLocaleString("en-US")}</span>
              <span class="carrito-cantidad">${item.cantidad}</span>
              <span class="carrito-accion">
                  <button onclick="disminuirCantidad('${item.nombre}')" class="boton-x">✖</button>
              </span>
          `;
          lista.appendChild(li);
      });
  }
}

// Disminuir cantidad de producto en el carrito
function disminuirCantidad(nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find(item => item.nombre === nombre);
  
  if (producto) {
      if (producto.cantidad > 1) {
          producto.cantidad -= 1;
      } else {
          carrito = carrito.filter(item => item.nombre !== nombre);
      }
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarListaCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
  localStorage.setItem("carrito", JSON.stringify([]));
  actualizarListaCarrito();
}

// Realizar pedido
function realizarPedido(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;
  const correo = document.getElementById("correo").value;

  // Obtener carrito
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
  }

  // Aquí puedes realizar la lógica de envío del pedido a tu backend o mostrar un mensaje de confirmación
  alert(`¡Pedido realizado con éxito!\nNombre: ${nombre}\nDirección: ${direccion}\nTeléfono: ${telefono}\nCorreo: ${correo}`);
  
  // Vaciar carrito después de realizar el pedido
  localStorage.setItem("carrito", JSON.stringify([]));
  actualizarListaCarrito();
}



document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.querySelector('.navbar');
    const submenus = document.querySelectorAll('.submenu');
    const submenuItems = document.querySelectorAll('.submenu-item');

    if (menuToggle) {
        menuToggle.addEventListener('change', function() {
            navbar.classList.toggle('open');
        });
    }

    submenus.forEach(function(submenu) {
        const submenuLink = submenu.querySelector('a');
        if (submenuLink) {
            submenuLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    submenu.classList.toggle('open');
                }
            });
        }
    });

    submenuItems.forEach(function(item) {
      const itemLink = item.querySelector('a');
  
      itemLink.addEventListener('click', function(e) {
          if (window.innerWidth <= 768 && item.querySelector('.sub-submenu')) {
              e.preventDefault();
  
              // Cierra todos los submenus
              submenuItems.forEach(function(otherItem) {
                  if (otherItem !== item) {
                      otherItem.classList.remove('open');
                  }
              });
  
              // Alterna el actual
              item.classList.toggle('open');
          }
      });
  });
  const carrito = document.getElementById("listaCarrito");
if (carrito) {
   carrito.innerHTML = "Carrito vacío";
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistro");
    if (form) {
        form.addEventListener("submit", async function (event) {
            // tu código aquí
        });
    }
});

  
});
