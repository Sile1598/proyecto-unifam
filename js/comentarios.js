let comentarios = [];

const inputNombre = document.getElementById("comentarioNombre");
const inputComentario = document.getElementById("comentarioTexto");
const btnGuardarComentario = document.getElementById("btnGuardarComentario");

const listaComentarios = document.getElementById("listaComentarios");
const comentariosVacios = document.getElementById("comentariosVacios");
const comentarioSuccess = document.getElementById("comentarioSuccess");

function cargarComentarios() {

    const datosGuardados = localStorage.getItem("comentariosUNIFAM");

    if (datosGuardados) {
        comentarios = JSON.parse(datosGuardados);
    }

    mostrarComentarios();

}

function guardarEnLocalStorage() {

    localStorage.setItem("comentariosUNIFAM", JSON.stringify(comentarios));

}

function validarNombre() {

    const nombre = inputNombre.value.trim();

    const valido = nombre.length >= 3 && /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);

    if (!valido) {
        mostrarError("errComentarioNombre", inputNombre);
    } else {
        limpiarError("errComentarioNombre", inputNombre);
    }

    return valido;

}

function validarComentario() {

    const texto = inputComentario.value.trim();

    const valido = texto.length >= 10;

    if (!valido) {
        mostrarError("errComentarioTexto", inputComentario);
    } else {
        limpiarError("errComentarioTexto", inputComentario);
    }

    return valido;

}

function mostrarError(idError, campo) {

    document.getElementById(idError).style.display = "block";
    campo.classList.add("comentario-invalid");

}

function limpiarError(idError, campo) {

    document.getElementById(idError).style.display = "none";
    campo.classList.remove("comentario-invalid");

}

function obtenerFechaActual() {

    const fecha = new Date();

    return fecha.toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

}

function guardarComentario() {

    const nombreValido = validarNombre();
    const comentarioValido = validarComentario();

    if (!nombreValido || !comentarioValido) {
        return;
    }

    const nuevoComentario = {
        nombre: inputNombre.value.trim(),
        comentario: inputComentario.value.trim(),
        fecha: obtenerFechaActual()
    };

    comentarios.push(nuevoComentario);

    guardarEnLocalStorage();

    mostrarComentarios();

    inputNombre.value = "";
    inputComentario.value = "";

    comentarioSuccess.innerHTML = "Comentario guardado correctamente.";
    comentarioSuccess.style.display = "block";

    setTimeout(function () {
        comentarioSuccess.style.display = "none";
    }, 3000);

}

function mostrarComentarios() {

    listaComentarios.innerHTML = "";

    if (comentarios.length === 0) {
        comentariosVacios.style.display = "block";
        return;
    }

    comentariosVacios.style.display = "none";

    comentarios.forEach(function (item, index) {

        listaComentarios.innerHTML += `

            <article class="comentario-item">

                <div class="comentario-item-header">
                    <strong>${item.nombre}</strong>
                    <span>${item.fecha}</span>
                </div>

                <p>${item.comentario}</p>

                <button class="btn-eliminar-comentario" onclick="eliminarComentario(${index})">
                    Eliminar
                </button>

            </article>

        `;

    });

}

function eliminarComentario(index) {

    comentarios.splice(index, 1);

    guardarEnLocalStorage();

    mostrarComentarios();

}

btnGuardarComentario.addEventListener("click", guardarComentario);

inputNombre.addEventListener("blur", validarNombre);

inputComentario.addEventListener("blur", validarComentario);

cargarComentarios();