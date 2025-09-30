// archivo: java/registro.js

// --- 1. Conexión a Supabase ---
const SUPABASE_URL = "https://ujvcuuodacbtlvdnwafj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdmN1dW9kYWNidGx2ZG53YWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTQ4MDYsImV4cCI6MjA3MzY5MDgwNn0.voYziriyh2ROHnekjhCnen0R6b3AGKdtNzqCa4llfBk";
const { createClient } = supabase; // Asegúrate que cargas la librería en tu HTML
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. Evento del formulario ---
document.getElementById("formRegistro").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const fechaNacimiento = document.getElementById("fecha").value;
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value;

    const errorTelefono = document.getElementById("errorTelefono");
    const errorEdad = document.getElementById("errorEdad");
    const mensajeExito = document.getElementById("mensajeExito");

    // Limpiar mensajes
    errorTelefono.textContent = "";
    errorEdad.textContent = "";
    mensajeExito.textContent = "";
    mensajeExito.classList.add("oculto");

    // --- Validaciones ---
    if (!/^[\d\+\(\)\-]+$/.test(telefono)) {
        errorTelefono.textContent = "⚠️ El teléfono solo debe contener números y signos válidos.";
        return;
    }

    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const cumpleEsteAnio = hoy.getMonth() < fechaNac.getMonth() || 
        (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate());

    if (edad < 18 || (edad === 18 && cumpleEsteAnio)) {
        errorEdad.textContent = "⚠️ Debes tener al menos 18 años.";
        return;
    }

    const nivelClave = evaluarSeguridadClave(clave);
    if (nivelClave.texto === "Baja 🔓") {
        alert("La contraseña debe ser al menos de seguridad Media.");
        return;
    }

    // --- 3. Crear cuenta en Supabase Auth ---
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: correo,
        password: clave,
    });

    if (authError) {
        alert("❌ Error al crear la cuenta: " + authError.message);
        return;
    }

    // --- 4. Guardar datos en la tabla 'usuarios' ---
    const { data, error } = await supabaseClient
        .from("usuarios")
        .insert([{
            auth_id: authData.user.id, // Guardamos el ID de Auth por si lo necesitas
            nombre,
            apellido,
            telefono,
            fecha_nacimiento: fechaNacimiento,
            correo
        }]);

    if (error) {
        alert("❌ Error al guardar datos: " + error.message);
        return;
    }

    // --- 5. Mostrar mensaje de éxito ---
    mensajeExito.textContent = `¡Bienvenido ${nombre}! Te registraste con éxito.`;
    mensajeExito.classList.remove("oculto");
    mensajeExito.classList.add("mostrar");

    setTimeout(() => window.location.href = "login.html", 3000);
    // --- Función para evaluar la seguridad de la contraseña ---
function evaluarSeguridadClave(clave) {
    let nivel = 0;
    if (clave.length >= 8) nivel++;
    if (/[A-Z]/.test(clave)) nivel++;
    if (/[a-z]/.test(clave)) nivel++;
    if (/[0-9]/.test(clave)) nivel++;
    if (/[\W_]/.test(clave)) nivel++;

    if (nivel >= 5) return { texto: "Alta 🔒", clase: "alta" };
    if (nivel >= 3) return { texto: "Media ⚠️", clase: "media" };
    return { texto: "Baja 🔓", clase: "baja" };
}

});
