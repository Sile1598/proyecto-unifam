// ── Datos de productos cargados desde productos.json ──
let productos = {};

async function cargarProductos() {
    try {
        const respuesta = await fetch('json/productos.json');
        const listaProductos = await respuesta.json();

        // Convertir array a objeto indexado por id
        listaProductos.forEach(p => {
            productos[p.id] = {
                nombre: p.nombre,
                tasa: p.tasa,
                plazo: `${p.plazoMeses} meses`,
                plazoN: p.plazoMeses,
                montoMin: p.montoMin,
                montoMax: p.montoMax,
                desc: p.desc
            };
        });

        // Poblar el dropdown dinámicamente
        const select = document.getElementById('sf-producto');
        select.innerHTML = '<option value="">Escoja una opción</option>';
        listaProductos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.nombre;
            select.appendChild(opt);
        });

    } catch (err) {
        console.error('Error al cargar productos.json:', err);
        document.getElementById('sf-producto').insertAdjacentHTML(
            'afterend',
            '<p style="color:#c0392b;font-size:0.8rem;margin-top:6px;">Error al cargar los productos. Recargue la página.</p>'
        );
    }
}

cargarProductos();

function fmt(n) { return n.toLocaleString('es-CR'); }

function sfOnProductChange() {
    const val = document.getElementById('sf-producto').value;
    const badge = document.getElementById('sf-interest-badge');
    const monto = document.getElementById('sf-monto');
    const hint = document.getElementById('sf-monto-hint');
    sfClearErr('err-producto', 'sf-producto');

    if (val && productos[val]) {
        const r = productos[val];
        badge.innerHTML =
            `<span class="interest-pill">Tasa: ${r.tasa}% anual &nbsp;|&nbsp; Plazo: ${r.plazo}</span>` +
            `<p class="interest-desc">${r.desc}</p>`;
        monto.min = r.montoMin;
        monto.max = r.montoMax;
        monto.placeholder = `₡${fmt(r.montoMin)} – ₡${fmt(r.montoMax)}`;
        hint.textContent = `Rango: ₡${fmt(r.montoMin)} hasta ₡${fmt(r.montoMax)}`;
        hint.style.display = 'block';
    } else {
        badge.innerHTML = '';
        monto.removeAttribute('min');
        monto.removeAttribute('max');
        monto.placeholder = 'Ingrese el monto';
        hint.style.display = 'none';
    }
    sfCalcCuota();
}

// ── Cálculo de cuota mensual ──
function sfCalcCuota() {
    const prod = document.getElementById('sf-producto').value;
    const monto = parseFloat(document.getElementById('sf-monto').value);
    const campo = document.getElementById('sf-cuota');

    if (!prod || !productos[prod] || isNaN(monto) || monto <= 0) {
        campo.value = '';
        campo.placeholder = 'Seleccione producto e ingrese monto';
        return;
    }

    const r = productos[prod];
    const plazoN = r.plazoN;                   // meses (número directo del JSON)
    const tasaM = r.tasa / 100 / 12;          // tasa mensual

    // Fórmula de cuota fija: M * [i(1+i)^n] / [(1+i)^n - 1]
    const cuota = monto * (tasaM * Math.pow(1 + tasaM, plazoN)) /
        (Math.pow(1 + tasaM, plazoN) - 1);

    campo.value = `₡${fmt(Math.round(cuota))}`;
}

// ── Utilidades ───────────────────────────────────────
function sfShowErr(errId, fieldId) {
    document.getElementById(errId).style.display = 'block';
    if (fieldId) document.getElementById(fieldId).classList.add('sf-invalid');
}

function sfClearErr(errId, fieldId) {
    const e = document.getElementById(errId);
    if (e) e.style.display = 'none';
    if (fieldId) {
        const f = document.getElementById(fieldId);
        if (f) f.classList.remove('sf-invalid');
    }
}

// ── Validadores ──────────────────────────────────────
function sfValidateNumId(mark) {
    const tipo = document.getElementById('sf-tipo-id').value;
    const val = document.getElementById('sf-num-id').value.trim().replace(/-/g, '');
    let ok = false;
    if (tipo === 'cedula') ok = /^\d{9}$/.test(val);
    else if (tipo === 'extranjero') ok = /^[A-Za-z0-9]{6,20}$/.test(val);
    else ok = val.length >= 5;
    if (!ok && mark) sfShowErr('err-num-id', 'sf-num-id');
    else if (ok) sfClearErr('err-num-id', 'sf-num-id');
    return ok;
}

function sfValidateNombre(mark) {
    const val = document.getElementById('sf-nombre').value.trim();
    const ok = val.length >= 3 && /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(val);
    if (!ok && mark) sfShowErr('err-nombre', 'sf-nombre');
    else if (ok) sfClearErr('err-nombre', 'sf-nombre');
    return ok;
}

function sfValidateCorreo(mark) {
    const val = document.getElementById('sf-correo').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!ok && mark) sfShowErr('err-correo', 'sf-correo');
    else if (ok) sfClearErr('err-correo', 'sf-correo');
    return ok;
}

function sfValidateTelefono(mark) {
    const val = document.getElementById('sf-telefono').value.replace(/[-\s]/g, '');
    const ok = /^\d{8}$/.test(val);
    if (!ok && mark) sfShowErr('err-telefono', 'sf-telefono');
    else if (ok) sfClearErr('err-telefono', 'sf-telefono');
    return ok;
}

function sfValidateMonto(mark) {
    const producto = document.getElementById('sf-producto').value;
    const val = parseFloat(document.getElementById('sf-monto').value);
    let ok = !isNaN(val) && val > 0;
    if (ok && producto && productos[producto]) {
        const r = productos[producto];
        ok = val >= r.montoMin && val <= r.montoMax;
    }
    if (!ok && mark) sfShowErr('err-monto', 'sf-monto');
    else if (ok) sfClearErr('err-monto', 'sf-monto');
    return ok;
}

// ── Envío ────────────────────────────────────────────
function sfSubmit() {
    let ok = true;

    // Producto
    if (!document.getElementById('sf-producto').value) {
        sfShowErr('err-producto', 'sf-producto'); ok = false;
    } else sfClearErr('err-producto', 'sf-producto');

    // Tipo ID
    if (!document.getElementById('sf-tipo-id').value) {
        sfShowErr('err-tipo-id', 'sf-tipo-id'); ok = false;
    } else sfClearErr('err-tipo-id', 'sf-tipo-id');

    if (!sfValidateNumId(true)) ok = false;
    if (!sfValidateNombre(true)) ok = false;
    if (!sfValidateCorreo(true)) ok = false;
    if (!sfValidateTelefono(true)) ok = false;
    if (!sfValidateMonto(true)) ok = false;

    if (ok) {
        const prod = document.getElementById('sf-producto').value;
        const r = productos[prod];
        const cuota = document.getElementById('sf-cuota').value;
        const success = document.getElementById('sf-success');
        success.innerHTML =
            `<strong>¡Solicitud enviada con éxito!</strong><br>
                    <span style="font-size:0.88rem;font-weight:400;">
                        Producto: <strong>${r.nombre}</strong> &nbsp;|&nbsp;
                        Tasa: <strong>${r.tasa}% anual</strong> &nbsp;|&nbsp;
                        Plazo: <strong>${r.plazo}</strong><br>
                        Cuota mensual estimada: <strong>${cuota}</strong><br>
                        Un asesor se pondrá en contacto con usted pronto.
                    </span>`;
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth' });
        LimpiarCampos();
        
    }
    
}

// ── Limpiar formulario ───────────────────────────────
function LimpiarCampos() {
    // Selects
    document.getElementById('sf-producto').value = '';
    document.getElementById('sf-tipo-id').value = '';

    // Inputs
    ['sf-monto', 'sf-num-id', 'sf-nombre', 'sf-correo', 'sf-telefono']
        .forEach(id => { document.getElementById(id).value = ''; });

    // Cuota
    const cuota = document.getElementById('sf-cuota');
    cuota.value = '';
    cuota.placeholder = 'Seleccione producto e ingrese monto';

    // Badge e hints
    document.getElementById('sf-interest-badge').innerHTML = '';
    const hint = document.getElementById('sf-monto-hint');
    hint.style.display = 'none';
    hint.textContent = '';
    document.getElementById('sf-monto').placeholder = 'Ingrese el monto';

    // Quitar clases de error por si quedaron
    document.querySelectorAll('.sf-invalid')
        .forEach(el => el.classList.remove('sf-invalid'));
}