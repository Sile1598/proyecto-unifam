async function cargarLayout() {

    try {

        const header = await fetch("partials/header.html");
        document.getElementById("header").innerHTML =
            await header.text();

        const footer = await fetch("partials/footer.html");
        document.getElementById("footer").innerHTML =
            await footer.text();

        const usuario = JSON.parse(localStorage.getItem("usuarioActivoUNIFAM"));

        const btnLogin = document.getElementById("btnLoginHeader");
        const usuarioSesion = document.getElementById("usuarioSesion");
        const usuarioNombre = document.getElementById("usuarioNombre");
        const btnCerrar = document.getElementById("btnCerrarSesion");

        if (usuario) {

            btnLogin.style.display = "none";

            usuarioSesion.style.display = "flex";

            usuarioNombre.textContent = usuario.nombre;

        } else {

            btnLogin.style.display = "inline-flex";

            usuarioSesion.style.display = "none";

        }

        btnCerrar.addEventListener("click", function () {

            localStorage.removeItem("usuarioActivoUNIFAM");

            window.location.href = "Login.html";

        });

    }
    catch (error) {

        console.error(error);

    }

}

cargarLayout();
