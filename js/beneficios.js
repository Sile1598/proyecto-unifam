let beneficios = [];
let beneficiosFiltrados = [];

const contenedor = document.getElementById("contenedorBeneficios");
const mensaje = document.getElementById("mensajeBeneficios");

const txtBuscar = document.getElementById("buscarActividad");
const filtroCategoria = document.getElementById("filtroCategoria");
const btnLimpiar = document.getElementById("btnLimpiarFiltros");

async function cargarBeneficios() {

    try {

        const respuesta = await fetch("json/beneficios.json");
        beneficios = await respuesta.json();

        beneficiosFiltrados = beneficios;

        mostrarBeneficios(beneficiosFiltrados);

    } catch (error) {

        console.error(error);

    }

}

function mostrarBeneficios(lista) {

    contenedor.innerHTML = "";

    if (lista.length === 0) {

        mensaje.style.display = "block";
        return;

    }

    mensaje.style.display = "none";

    lista.forEach(beneficio => {

        contenedor.innerHTML += `

        <article class="beneficio-card">

            <span class="beneficio-label">UNIFAM</span>

            <div class="beneficio-card-content">

                <span class="beneficio-category">
                    ${beneficio.categoria}
                </span>

                <h3>${beneficio.nombre}</h3>

                <p><strong>Fecha:</strong> ${beneficio.fecha}</p>

                <p><strong>Lugar:</strong> ${beneficio.lugar}</p>

                <p>${beneficio.descripcion}</p>

            </div>

        </article>

        `;

    });

}

function aplicarFiltros() {

    const texto = txtBuscar.value.toLowerCase();

    const categoria = filtroCategoria.value;

    beneficiosFiltrados = beneficios.filter(function (beneficio) {

        const coincideTexto =

            beneficio.nombre.toLowerCase().includes(texto) ||

            beneficio.descripcion.toLowerCase().includes(texto);

        const coincideCategoria =

            categoria === "todos" ||

            beneficio.categoria === categoria;

        return coincideTexto && coincideCategoria;

    });

    mostrarBeneficios(beneficiosFiltrados);

}

txtBuscar.addEventListener("input", aplicarFiltros);

filtroCategoria.addEventListener("change", aplicarFiltros);

btnLimpiar.addEventListener("click", function () {

    txtBuscar.value = "";

    filtroCategoria.value = "todos";

    beneficiosFiltrados = beneficios;

    mostrarBeneficios(beneficiosFiltrados);

});

cargarBeneficios();