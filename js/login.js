let usuarios = [];

const correo = document.getElementById("loginCorreo");
const password = document.getElementById("loginPassword");
const btnLogin = document.getElementById("btnLogin");
const loginMensaje = document.getElementById("loginMensaje");

function cargarUsuarios() {
    const datos = localStorage.getItem("usuariosUNIFAM");

    if (datos) {
        usuarios = JSON.parse(datos);
    }
}

function mostrarError(id, campo) {
    document.getElementById(id).style.display = "block";
    campo.classList.add("login-invalid");
}

function limpiarError(id, campo) {
    document.getElementById(id).style.display = "none";
    campo.classList.remove("login-invalid");
}

function validarCorreo() {
    const valor = correo.value.trim();
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    if (!valido) {
        mostrarError("errLoginCorreo", correo);
    } else {
        limpiarError("errLoginCorreo", correo);
    }

    return valido;
}

function validarPassword() {
    const valor = password.value.trim();
    const valido = valor.length > 0;

    if (!valido) {
        mostrarError("errLoginPassword", password);
    } else {
        limpiarError("errLoginPassword", password);
    }

    return valido;
}

function iniciarSesion() {
    if (!validarCorreo() || !validarPassword()) {
        return;
    }

    const usuarioEncontrado = usuarios.find(function (usuario) {
        return usuario.correo === correo.value.trim() &&
               usuario.password === password.value.trim();
    });

    if (!usuarioEncontrado) {
        loginMensaje.innerHTML = "Correo o contraseña incorrectos.";
        loginMensaje.className = "login-error";
        loginMensaje.style.display = "block";
        return;
    }

    localStorage.setItem("usuarioActivoUNIFAM", JSON.stringify(usuarioEncontrado));

    loginMensaje.innerHTML = "Inicio de sesión exitoso.";
    loginMensaje.className = "login-success";
    loginMensaje.style.display = "block";

    setTimeout(function () {
        window.location.href = "index.html";
    }, 1200);
}

btnLogin.addEventListener("click", iniciarSesion);
correo.addEventListener("blur", validarCorreo);
password.addEventListener("blur", validarPassword);

cargarUsuarios();