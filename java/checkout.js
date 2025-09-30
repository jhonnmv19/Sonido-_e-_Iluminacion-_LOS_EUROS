// =====================
// 1. CONFIGURACIÓN SUPABASE
// =====================
const SUPABASE_URL = "https://ujvcuuodacbtlvdnwafj.supabase.co"; // <-- Reemplaza con tu URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdmN1dW9kYWNidGx2ZG53YWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTQ4MDYsImV4cCI6MjA3MzY5MDgwNn0.voYziriyh2ROHnekjhCnen0R6b3AGKdtNzqCa4llfBk"; // <-- Reemplaza con tu ANON KEY
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// 2. FUNCIONES CARRITO
// =====================
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarListaCarrito() {
    const carrito = obtenerCarrito();
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";
    let subtotalCarrito = 0;
    const totalElemento = document.getElementById("total-checkout");

    if (carrito.length === 0) {
        document.getElementById("mensaje-carrito").style.display = "block";
        if (totalElemento) totalElemento.textContent = "$0.00";
        return;
    }

    document.getElementById("mensaje-carrito").style.display = "none";

    carrito.forEach(item => {
        const precioTotalItem = item.precio * item.cantidad;
        subtotalCarrito += precioTotalItem;

        const li = document.createElement("li");
        li.classList.add("item-carrito");
        li.innerHTML = `
            <span class="carrito-nombre">${item.nombre}</span>
            <span class="carrito-precio">$${item.precio.toFixed(2)}</span>
            <span class="carrito-cantidad">${item.cantidad}</span>
            <span class="carrito-accion">
                <button onclick="disminuirCantidad('${item.nombre}')" class="boton-x">-</button>
                <button onclick="aumentarCantidad('${item.nombre}')" class="boton-plus">+</button>
            </span>
        `;
        lista.appendChild(li);
    });

    if (totalElemento) {
        totalElemento.textContent = `$${subtotalCarrito.toFixed(2)}`;
    }
}

function disminuirCantidad(nombre) {
    let carrito = obtenerCarrito();
    let producto = carrito.find(item => item.nombre === nombre);

    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad -= 1;
        } else {
            carrito = carrito.filter(item => item.nombre !== nombre);
        }
    }

    guardarCarrito(carrito);
    actualizarListaCarrito();
}

function aumentarCantidad(nombre) {
    let carrito = obtenerCarrito();
    let producto = carrito.find(item => item.nombre === nombre);

    if (producto) {
        producto.cantidad += 1;
    }

    guardarCarrito(carrito);
    actualizarListaCarrito();
}

function vaciarCarrito() {
    guardarCarrito([]);
    actualizarListaCarrito();
}

// =====================
// 3. GUARDAR PEDIDO EN SUPABASE Y GENERAR PDF
// =====================
async function realizarPedido(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const metodoPago = document.getElementById("metodoPago").value;

    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("El carrito está vacío. No se puede realizar el pedido.");
        return;
    }

    // Calcular totales
    const subtotal = carrito.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    const impuestos = subtotal * 0.13;
    const totalFinal = subtotal + impuestos;
    const fecha = new Date().toISOString();

    // 1️⃣ Guardar pedido en Supabase
    const { data: pedido, error: errorPedido } = await supabase
        .from("pedidos")
        .insert([{
            nombre,
            apellido,
            direccion,
            telefono,
            correo,
            metodo_pago: metodoPago,
            subtotal,
            impuestos,
            total: totalFinal,
            fecha
        }])
        .select()
        .single();

    if (errorPedido) {
        console.error("Error al guardar pedido:", errorPedido.message);
        alert("Error al guardar el pedido. Revisa la consola.");
        return;
    }

    // 2️⃣ Guardar detalle del pedido
    const detalle = carrito.map(item => ({
        pedido_id: pedido.id,
        producto: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio
    }));

    const { error: errorDetalle } = await supabase
        .from("detalle_pedido")
        .insert(detalle);

    if (errorDetalle) {
        console.error("Error al guardar detalle:", errorDetalle.message);
        alert("Error al guardar los productos. Revisa la consola.");
        return;
    }

    // 3️⃣ Generar la factura PDF
    generarFacturaPDF(nombre, direccion, telefono, correo, metodoPago, carrito, subtotal, impuestos, totalFinal);

    // Limpiar datos
    vaciarCarrito();
    document.getElementById("formCheckout").reset();
    alert("Pedido guardado y factura generada correctamente.");
}

// =====================
// 4. FUNCIÓN PARA FACTURA PDF
// =====================
function generarFacturaPDF(nombre, direccion, telefono, correo, metodoPago, carrito, subtotal, impuestos, totalFinal) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fecha = new Date().toLocaleDateString('es-ES');
    const numFactura = Math.floor(Math.random() * 900000) + 100000;
    let y = 25;

    doc.addImage('imagenes/logo Los euros_facturas.png', 'PNG', 20, 10, 30, 30);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("LOS EUROS DE BOLIVIA", 105, y, null, null, "center");
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("FACTURA DE COMPRA", 105, y, null, null, "center");
    y = Math.max(y, 45);
    doc.line(20, y, 190, y);
    y += 5;

    doc.setFontSize(10);
    doc.text(`Factura N°: ${numFactura}`, 20, y);
    doc.text(`Fecha: ${fecha}`, 190, y, null, null, "right");
    y += 6;
    doc.text("CI/NIT: 9437714", 20, y);
    doc.text("WhatsApp: +591 72793459", 190, y, null, null, "right");
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Cliente:", 20, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${nombre}`, 20, y);
    doc.text(`Teléfono: ${telefono}`, 110, y);
    y += 5;
    doc.text(`Dirección: ${direccion}`, 20, y);
    doc.text(`Correo: ${correo}`, 110, y);
    y += 10;

    // Tabla de productos
    const productosData = carrito.map((item, index) => [
        index + 1,
        item.nombre,
        item.cantidad,
        `$${item.precio.toFixed(2)}`,
        `$${(item.cantidad * item.precio).toFixed(2)}`
    ]);

    doc.autoTable({
        startY: y + 2,
        head: [["#", "Producto", "Cant.", "P. Unitario (USD)", "P. Total (USD)"]],
        body: productosData,
        styles: { halign: "left", fontSize: 10 },
        headStyles: { fillColor: [254, 250, 226], halign: "center", textColor: [0, 0, 0] },
        columnStyles: { 0: { halign: 'center', cellWidth: 10 }, 2: { halign: 'center', cellWidth: 15 }, 3: { halign: 'right' }, 4: { halign: 'right' } },
        margin: { left: 20, right: 20 },
    });

    const finalY = doc.autoTable.previous.finalY + 5;
    doc.setFontSize(10);
    doc.text("Subtotal:", 150, finalY);
    doc.text(`$${subtotal.toFixed(2)}`, 190, finalY, null, null, "right");

    doc.text("Impuestos (13%):", 150, finalY + 5);
    doc.text(`$${impuestos.toFixed(2)}`, 190, finalY + 5, null, null, "right");
    doc.line(145, finalY + 7, 190, finalY + 7);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL A PAGAR:", 125, finalY + 13);
    doc.text(`$${totalFinal.toFixed(2)}`, 190, finalY + 13, null, null, "right");

    doc.save(`factura_${numFactura}.pdf`);
}

// =====================
// 5. INICIALIZACIÓN
// =====================
function mostrarInfoPago() {
    const metodo = document.getElementById("metodoPago").value;
    const infoTransferencia = document.getElementById("infoTransferencia");
    const infoEfectivo = document.getElementById("infoEfectivo");

    if (infoTransferencia) infoTransferencia.style.display = metodo === "transferencia" ? "block" : "none";
    if (infoEfectivo) infoEfectivo.style.display = metodo === "efectivo" ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarListaCarrito();
    const metodoPagoElement = document.getElementById("metodoPago");
    if (metodoPagoElement) {
        metodoPagoElement.addEventListener('change', mostrarInfoPago);
        mostrarInfoPago();
    }
});
