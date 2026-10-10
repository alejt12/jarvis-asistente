const sintesis = window.speechSynthesis;
const reconocedor = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Configuración: SIEMPRE escuchando en español México
reconocedor.lang = 'es-MX';
reconocedor.continuous = true;        // Escucha continua ✅
reconocedor.interimResults = true;    // Detecta mientras hablas
reconocedor.maxAlternatives = 1;

const historial = document.getElementById('historial');
const btnEstado = document.getElementById('btnEscuchar');
const btnLimpiar = document.getElementById('btnLimpiar');

let escuchando = false;
let reiniciarEscucha = null;

// Cargar voces disponibles
let voces = [];
function cargarVoces() {
    voces = sintesis.getVoices();
}
cargarVoces();
if (sintesis.onvoiceschanged !== undefined) {
    sintesis.onvoiceschanged = cargarVoces;
}

// 🔊 Función para hablar
function hablar(texto) {
    sintesis.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.volume = 1;
    mensaje.rate = 0.9;
    
    const vozEspanol = voces.find(v => v.lang === 'es-MX' || v.lang.startsWith('es'));
    if (vozEspanol) mensaje.voice = vozEspanol;
    
    sintesis.speak(mensaje);
    agregarMensaje(texto, 'jarvis');
}

// 📝 Mostrar en pantalla
function agregarMensaje(texto, quien) {
    const p = document.createElement('p');
    p.className = `mensaje ${quien}`;
    p.textContent = (quien === 'jarvis' ? 'JARVIS: ' : 'Tú: ') + texto;
    historial.appendChild(p);
    historial.scrollTop = historial.scrollHeight;
}

// 🚀 ABRIR APLICACIONES / SITIOS
function abrirAplicacion(texto) {
    const t = texto.toLowerCase();
    
    // === REDES SOCIALES Y SITIOS ===
    if (t.includes('google')) {
        hablar('Abriendo Google');
        window.open('https://google.com', '_blank');
        return true;
    }
    if (t.includes('youtube')) {
        hablar('Abriendo YouTube');
        window.open('https://youtube.com', '_blank');
        return true;
    }
    if (t.includes('facebook')) {
        hablar('Abriendo Facebook');
        window.open('https://facebook.com', '_blank');
        return true;
    }
    if (t.includes('instagram')) {
        hablar('Abriendo Instagram');
        window.open('https://instagram.com', '_blank');
        return true;
    }
    if (t.includes('twitter') || t.includes('x ')) {
        hablar('Abriendo X');
        window.open('https://x.com', '_blank');
        return true;
    }
    if (t.includes('whatsapp')) {
        hablar('Abriendo WhatsApp Web');
        window.open('https://web.whatsapp.com', '_blank');
        return true;
    }
    if (t.includes('github')) {
        hablar('Abriendo GitHub');
        window.open('https://github.com', '_blank');
        return true;
    }
    if (t.includes('tiktok')) {
        hablar('Abriendo TikTok');
        window.open('https://tiktok.com', '_blank');
        return true;
    }
    if (t.includes('correo') || t.includes('gmail')) {
        hablar('Abriendo Gmail');
        window.open('https://mail.google.com', '_blank');
        return true;
    }
    if (t.includes('mapas') || t.includes('google maps')) {
        hablar('Abriendo Google Maps');
        window.open('https://maps.google.com', '_blank');
        return true;
    }
    if (t.includes('notas') || t.includes('bloc') || t.includes('documentos')) {
        hablar('Abriendo Google Documentos');
        window.open('https://docs.google.com', '_blank');
        return true;
    }
    if (t.includes('calendario')) {
        hablar('Abriendo Calendario');
        window.open('https://calendar.google.com', '_blank');
        return true;
    }
    
    return false;
}

// 🧠 PROCESAR TODO LO QUE DICES
function procesarComando(texto) {
    const t = texto.toLowerCase();
    
    // Primero: ¿quiere abrir algo?
    if (t.includes('abrir') || t.includes('metete') || t.includes('entra') || t.includes('ingresa')) {
        if (abrirAplicacion(t)) return;
    }
    
    // Comandos generales
    if (t.includes('hola')) {
        hablar('¡Hola! Aquí estoy, siempre escuchándote. ¿Qué necesitas?');
    }
    else if (t.includes('hora')) {
        const h = new Date();
        hablar(`Son las ${h.getHours()} horas con ${h.getMinutes()} minutos`);
    }
    else if (t.includes('tu nombre') || t.includes('quién eres')) {
        hablar('Soy JARVIS, tu asistente personal. Te escucho siempre que hables.');
    }
    else if (t.includes('fecha') || t.includes('día es')) {
        const f = new Date();
        hablar(`Hoy es ${f.toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}`);
    }
    else if (t.includes('descansa') || t.includes('pausa') || t.includes('silenciate')) {
        hablar('Pausando escucha. Dime "activar escucha" para volver a escucharte.');
        detenerEscucha();
    }
    else if (t.includes('activar escucha') || t.includes('escúchame')) {
        iniciarEscucha();
    }
    else if (t.includes('adiós') || t.includes('apagar') || t.includes('cerrar')) {
        hablar('Hasta luego, señor. Sistema en pausa.');
        detenerEscucha();
    }
    else {
        hablar(`Entendido: ${texto}`);
    }
}

// 🎤 INICIAR ESCUCHA CONTINUA
function iniciarEscucha() {
    if (!escuchando) {
        escuchando = true;
        reconocedor.start();
        btnEstado.textContent = '🔴 ESCUCHANDO SIEMPRE';
        btnEstado.classList.add('escuchando');
        hablar('Estoy listo, te escucho siempre');
    }
}

// ⏹️ DETENER ESCUCHA
function detenerEscucha() {
    escuchando = false;
    reconocedor.stop();
    btnEstado.textContent = '⏸️ Escucha Pausada';
    btnEstado.classList.remove('escuchando');
    if (reiniciarEscucha) clearTimeout(reiniciarEscucha);
}

// 🔄 RESULTADOS DE VOZ
reconocedor.onresult = (e) => {
    const resultado = e.results[e.resultIndex];
    const texto = resultado[0].transcript;
    
    // Solo procesar cuando termina de hablar
    if (resultado.isFinal) {
        agregarMensaje(texto, 'usuario');
        procesarComando(texto);
    }
};

// 🔁 REINICIAR ESCUCHA SI SE DETIENE
reconocedor.onend = () => {
    if (escuchando) {
        // Reiniciar automáticamente en 0.5 segundos
        reiniciarEscucha = setTimeout(() => {
            reconocedor.start();
        }, 500);
    }
};

reconocedor.onerror = (e) => {
    console.log('Error de reconocimiento:', e.error);
    if (e.error === 'not-allowed') {
        hablar('Necesito permiso del micrófono para escucharte.');
    }
    // Si está activo, reiniciar
    if (escuchando) {
        reiniciarEscucha = setTimeout(() => reconocedor.start(), 1000);
    }
};

// 🖱️ INICIAR TODO CON UN CLIC (requerido por seguridad del navegador)
window.addEventListener('click', () => {
    if (!escuchando) {
        iniciarEscucha();
    }
}, { once: true });

// Botón manual por si lo necesitas
btnEstado.addEventListener('click', () => {
    if (escuchando) detenerEscucha();
    else iniciarEscucha();
});

btnLimpiar.addEventListener('click', () => {
    historial.innerHTML = '<p class="mensaje jarvis">Pantalla limpia. Sigo escuchándote.</p>';
});
