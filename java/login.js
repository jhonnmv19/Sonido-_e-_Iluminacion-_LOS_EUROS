// login.js
document.getElementById("formLogin").addEventListener("submit", function(event) { 
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  // Verifica si es administrador
  if (usuario === "aveizaga53@gmail.com" && clave === "Pred@tor7279") {
    alert("Bienvenido Administrador");
    window.location.href = "admin.html";
  } else {
    // Si no es admin, verifica si el usuario está registrado en localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioValido = usuariosRegistrados.find(u => u.correo === usuario && u.clave === clave);

    if (usuarioValido) {
      alert(`Bienvenido ${usuarioValido.nombre}`);
      window.location.href = "productos.html"; // Redirige a compras
    } else {
      alert("Credenciales incorrectas");
    }
  }
});
