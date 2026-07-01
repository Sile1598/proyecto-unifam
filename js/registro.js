let usuarios = [];

const nombre = document.getElementById("registroNombre");
const correo = document.getElementById("registroCorreo");
const password = document.getElementById("registroPassword");
const btnRegistro = document.getElementById("btnRegistro");
const registroMensaje = document.getElementById("registroMensaje");

function cargarUsuarios() {
    const datos = localStorage.getItem("usuariosUNIFAM");

    if (datos) {
        usuarios = JSON.parse(datos);
    }
}

function guardarUsuarios() {
    localStorage.setItem("usuariosUNIFAM", JSON.stringify(usuarios));
}

function mostrarError(id, campo) {
    document.getElementById(id).style.display = "block";
    campo.classList.add("login-invalid");
}

function limpiarError(id, campo) {
    document.getElementById(id).style.display = "none";
    campo.classList.remove("login-invalid");
}

function validarNombre() {
    const valor = nombre.value.trim();
    const valido = valor.length >= 3 && /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);

    if (!valido) {
        mostrarError("errRegistroNombre", nombre);
    } else {
        limpiarError("errRegistroNombre", nombre);
    }

    return valido;
}

function validarCorreo() {
    const valor = correo.value.trim();
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    if (!valido) {
        mostrarError("errRegistroCorreo", correo);
    } else {
        limpiarError("errRegistroCorreo", correo);
    }

    return valido;
}

function validarPassword() {
    const valor = password.value.trim();
    const valido = valor.length >= 6;

    if (!valido) {
        mostrarError("errRegistroPassword", password);
    } else {
        limpiarError("errRegistroPassword", password);
    }

    return valido;
}

function registrarUsuario() {
    if (!validarNombre() || !validarCorreo() || !validarPassword()) {
        return;
    }

    const correoExiste = usuarios.some(function (usuario) {
        return usuario.correo === correo.value.trim();
    });

    if (correoExiste) {
        registroMensaje.innerHTML = "Este correo ya se encuentra registrado.";
        registroMensaje.className = "login-warning";
        registroMensaje.style.display = "block";
        return;
    }

    const nuevoUsuario = {
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        password: password.value.trim(),
        fechaRegistro: new Date().toLocaleDateString("es-CR")
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios();

    registroMensaje.innerHTML = "Usuario registrado correctamente. Ahora puede iniciar sesión.";
    registroMensaje.className = "login-success";
    registroMensaje.style.display = "block";

    nombre.value = "";
    correo.value = "";
    password.value = "";
}

btnRegistro.addEventListener("click", registrarUsuario);
nombre.addEventListener("blur", validarNombre);
correo.addEventListener("blur", validarCorreo);
password.addEventListener("blur", validarPassword);

cargarUsuarios();