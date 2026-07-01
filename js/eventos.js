// ── Datos de eventos desde eventos.json ─────────────
let EVENTOS = { presencial: [], virtual: [] };

async function asistCargarEventos() {
    try {
        const res = await fetch('json/eventos.json');
        EVENTOS = await res.json();
    } catch (err) {
        console.error('Error al cargar eventos.json:', err);
    }
}

asistCargarEventos();

// ── Abrir / cerrar panel ─────────────────────────────
function asistToggle() {
    const panel = document.getElementById('asistencia-panel');
    const visible = panel.style.display === 'block';
    panel.style.display = visible ? 'none' : 'block';
    if (!visible) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function asistCerrar() {
    asistReset();
    document.getElementById('asistencia-panel').style.display = 'none';
}

// ── Al cambiar tipo de evento ────────────────────────
function asistOnTipo() {
    const tipo = document.getElementById('asist-tipo').value;
    const wrap = document.getElementById('asist-eventos-wrap');
    const lista = document.getElementById('asist-eventos-lista');
    const label = document.getElementById('asist-eventos-label');

    asistClearErr('asist-err-tipo', 'asist-tipo');
    asistClearErr('asist-err-evento');
    lista.innerHTML = '';

    if (!tipo) { wrap.style.display = 'none'; return; }

    const eventos = EVENTOS[tipo] || [];
    label.textContent = tipo === 'presencial'
        ? 'Seleccione el evento presencial:'
        : 'Seleccione el evento virtual:';

    eventos.forEach(ev => {
        const card = document.createElement('label');
        card.className = 'evento-card';
        card.htmlFor = `ev-${ev.id}`;

        let detalle = '';
        if (tipo === 'presencial') {
            detalle = `${ev.fecha} &nbsp;|&nbsp; ${ev.hora}<br>
                               ${ev.lugar} — ${ev.direccion}`;
        } else {
            detalle = `${ev.fecha} &nbsp;|&nbsp; ${ev.hora}<br>
                               <a class="ev-link" href="${ev.link}" target="_blank">${ev.link}</a>`;
        }

        card.innerHTML = `
                    <input type="radio" name="asist-evento" id="ev-${ev.id}" value="${ev.id}">
                    <div class="ev-titulo">${ev.titulo}</div>
                    <div class="ev-detalle">${detalle}</div>`;

        // Resaltar card al seleccionar
        card.addEventListener('click', () => {
            document.querySelectorAll('.evento-card').forEach(c => c.classList.remove('seleccionado'));
            card.classList.add('seleccionado');
            asistClearErr('asist-err-evento');
        });

        lista.appendChild(card);
    });

    wrap.style.display = 'block';
}

// ── Validadores ──────────────────────────────────────
function asistValidarNombre(mark) {
    const val = document.getElementById('asist-nombre').value.trim();
    const ok = val.length >= 3 && /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(val);
    if (!ok && mark) asistShowErr('asist-err-nombre', 'asist-nombre');
    else if (ok) asistClearErr('asist-err-nombre', 'asist-nombre');
    return ok;
}

function asistValidarCedula(mark) {
    const val = document.getElementById('asist-cedula').value.trim().replace(/-/g, '');
    const ok = /^\d{9}$/.test(val);
    if (!ok && mark) asistShowErr('asist-err-cedula', 'asist-cedula');
    else if (ok) asistClearErr('asist-err-cedula', 'asist-cedula');
    return ok;
}

// ── Utilidades de error ──────────────────────────────
function asistShowErr(errId, fieldId) {
    document.getElementById(errId).style.display = 'block';
    if (fieldId) document.getElementById(fieldId).classList.add('asist-invalid');
}

function asistClearErr(errId, fieldId) {
    const el = document.getElementById(errId);
    if (el) el.style.display = 'none';
    if (fieldId) {
        const f = document.getElementById(fieldId);
        if (f) f.classList.remove('asist-invalid');
    }
}

// ── Enviar ───────────────────────────────────────────
function asistEnviar() {
    let ok = true;

    // Tipo
    const tipo = document.getElementById('asist-tipo').value;
    if (!tipo) { asistShowErr('asist-err-tipo', 'asist-tipo'); ok = false; }
    else asistClearErr('asist-err-tipo', 'asist-tipo');

    // Nombre
    if (!asistValidarNombre(true)) ok = false;

    // Cédula
    if (!asistValidarCedula(true)) ok = false;

    // Evento seleccionado
    const eventoSel = document.querySelector('input[name="asist-evento"]:checked');
    if (!eventoSel) { asistShowErr('asist-err-evento'); ok = false; }
    else asistClearErr('asist-err-evento');

    if (!ok) return;

    // Buscar datos del evento
    const ev = EVENTOS[tipo].find(e => e.id === eventoSel.value);
    const nombre = document.getElementById('asist-nombre').value.trim();
    const detalle = tipo === 'presencial'
        ? `📌 ${ev.lugar} — ${ev.direccion}`
        : `🔗 ${ev.link}`;

    const success = document.getElementById('asist-success');
    success.innerHTML = `
                ✅ <strong>¡Asistencia confirmada!</strong><br>
                <span style="font-size:0.82rem;font-weight:400;">
                    <strong>${nombre}</strong> confirmó para:<br>
                    📋 ${ev.titulo}<br>
                    📅 ${ev.fecha} &nbsp;|&nbsp; 🕐 ${ev.hora}<br>
                    ${detalle}
                </span>`;
    success.style.display = 'block';

    // Limpiar después de 5 segundos y cerrar
    setTimeout(() => {
        asistReset();
        document.getElementById('asistencia-panel').style.display = 'none';
    }, 5000);
}

// ── Reset ────────────────────────────────────────────
function asistReset() {
    document.getElementById('asist-tipo').value = '';
    document.getElementById('asist-nombre').value = '';
    document.getElementById('asist-cedula').value = '';
    document.getElementById('asist-eventos-lista').innerHTML = '';
    document.getElementById('asist-eventos-wrap').style.display = 'none';
    document.getElementById('asist-success').style.display = 'none';
    document.querySelectorAll('.asist-invalid').forEach(el => el.classList.remove('asist-invalid'));
    ['asist-err-tipo', 'asist-err-nombre', 'asist-err-cedula', 'asist-err-evento']
        .forEach(id => asistClearErr(id));
}