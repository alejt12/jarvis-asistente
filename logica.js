const sintesis = window.speechSynthesis;
const reconocedor = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

reconocedor.lang = 'es-MX';
reconocedor.continuous = true;
reconocedor.interimResults = false;
reconocedor.maxAlternatives = 1;

const historial = document.getElementById('historial');
const btnEstado = document.getElementById('btnEscuchar');
const btnLimpiar = document.getElementById('btnLimpiar');
const estadoSistema = document.getElementById('estadoSistema');
const robotCabeza = document.querySelector('.robot-cabeza');

let escuchando = false;
let reiniciarEscucha = null;

// Cargar voces
let voces = [];
function cargarVoces() {
    voces = sintesis.getVoices();
}
cargarVoces();
if (sintesis.onvoiceschanged !== undefined) {
    sintesis.onvoiceschanged = cargarVoces;
}

// 🤖 ANIMACIONES DEL ROBOT
function animarHablando() {
    robotCabeza.classList.add('hablando');
    robotCabeza.classList.remove('escuchando');
}

function animarEscuchando() {
    robotCabeza.classList.remove('hablando');
    robotCabeza.classList.add('escuchando');
}

function animarEspera() {
    robotCabeza.classList.remove('hablando', 'escuchando');
}

// 🔊 HABLAR
function hablar(texto) {
    sintesis.cancel();
    animarHablando(); // Ojos y boca se mueven
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.volume = 1;
    mensaje.rate = 0.9;
    
    const vozEspanol = voces.find(v => v.lang === 'es-MX' || v.lang.startsWith('es'));
    if (vozEspanol) mensaje.voice = vozEspanol;
    
    mensaje.onend = () => {
        if (escuchando) animarEscuchando();
        else animarEspera();
    };
    
    sintesis.speak(mensaje);
    agregarMensaje(texto, 'jarvis');
}

function agregarMensaje(texto, quien) {
    const p = document.createElement('p');
    p.className = `mensaje ${quien}`;
    p.textContent = (quien === 'jarvis' ? 'JARVIS: ' : 'Tú: ') + texto;
    historial.appendChild(p);
    historial.scrollTop = historial.scrollHeight;
}

// 🕒 HORA Y FECHA
function darHoraFecha(texto) {
    const t = texto.toLowerCase();
    if (t.includes('hora')) {
        const ahora = new Date();
        hablar(`Son las ${ahora.getHours()} horas con ${ahora.getMinutes()} minutos`);
        return true;
    }
    if (t.includes('fecha') || t.includes('día es') || t.includes('qué día')) {
        const ahora = new Date();
        hablar(`Hoy es ${ahora.toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}`);
        return true;
    }
    return false;
}

// 🌤️ CLIMA
async function darClima(texto) {
    const t = texto.toLowerCase();
    if (!t.includes('clima') && !t.includes('temperatura') && !t.includes('tiempo')) return false;
    
    let ciudad = 'Toluca';
    const coincidenciaCiudad = t.match(/en\s+(.+)|de\s+(.+)/);
    if (coincidenciaCiudad) {
        ciudad = (coincidenciaCiudad[1] || coincidenciaCiudad[2]).trim().replace(/\b(me|el|la|del|al|en)\b/g, '').trim();
    }
    
    try {
        const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=bd5e3785039f359fa3b8ba4028d95a90&units=metric&lang=es`);
        const datos = await respuesta.json();
        
        if (datos.main) {
            const temp = Math.round(datos.main.temp);
            const desc = datos.weather[0].description;
            const max = Math.round(datos.main.temp_max);
            const min = Math.round(datos.main.temp_min);
            hablar(`En ${ciudad} ${temp} grados, ${desc}. Máxima ${max}, mínima ${min}`);
        } else {
            hablar(`No encontré ${ciudad}. El clima en Toluca ronda los 18 grados`);
        }
    } catch {
        hablar(`No pude conectarme con el servicio del clima`);
    }
    return true;
}

// 🧮 MATEMÁTICAS
function resolverMatematicas(texto) {
    const t = texto.toLowerCase();
    const palabrasClave = ['cuánto es', 'cuanto es', 'calcula', 'resuelve', 'suma', 'resta', 'multiplica', 'divide', 'más', 'menos', 'por', 'entre'];
    const esOperacion = palabrasClave.some(p => t.includes(p)) || /\d+\s*[+\-*/]\s*\d+/.test(t);
    
    if (!esOperacion) return false;
    
    let expr = t
        .replace(/cuánto es|cuanto es|dime|calcula|resuelve|es igual a|el resultado de/g, '')
        .replace(/más|mas|suma/g, '+')
        .replace(/menos|resta/g, '-')
        .replace(/por|multiplica/g, '*')
        .replace(/entre|divide/g, '/')
        .replace(/\s+/g, '');
    
    const m = expr.match(/(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)/);
    if (!m) {
        hablar('No entendí la operación. Di por ejemplo: cuánto es 2 más 2');
        return true;
    }
    
    const a = parseFloat(m[1]), op = m[2], b = parseFloat(m[3]);
    let res, pal;
    
    switch(op) {
        case '+': res = a + b; pal = 'más'; break;
        case '-': res = a - b; pal = 'menos'; break;
        case '*': res = a * b; pal = 'por'; break;
        case '/':
            if (b === 0) { hablar('No se puede dividir entre cero'); return true; }
            res = a / b; pal = 'entre'; break;
    }
    
    if (res % 1 !== 0) res = Math.round(res * 100) / 100;
    hablar(`${a} ${pal} ${b} es igual a ${res}`);
    return true;
}

// 🚀 ABRIR SITIOS
function abrirAplicacion(texto) {
    const t = texto.toLowerCase();
    const sitios = [
        { p: ['google'], u: 'https://google.com', n: 'Google' },
        { p: ['youtube'], u: 'https://youtube.com', n: 'YouTube' },
        { p: ['facebook'], u: 'https://facebook.com', n: 'Facebook' },
        { p: ['instagram'], u: 'https://instagram.com', n: 'Instagram' },
        { p: ['twitter', 'x '], u: 'https://x.com', n: 'X' },
        { p: ['whatsapp'], u: 'https://web.whatsapp.com', n: 'WhatsApp Web' },
        { p: ['github'], u: 'https://github.com', n: 'GitHub' },
        { p: ['tiktok'], u: 'https://tiktok.com', n: 'TikTok' },
        { p: ['gmail', 'correo'], u: 'https://mail.google.com', n: 'Gmail' },
        { p: ['mapas', 'google maps'], u: 'https://maps.google.com', n: 'Google Maps' },
        { p: ['docs', 'documentos'], u: 'https://docs.google.com', n: 'Documentos' },
        { p: ['drive'], u: 'https://drive.google.com', n: 'Drive' },
        { p: ['netflix'], u: 'https://netflix.com', n: 'Netflix' },
        { p: ['spotify', 'música'], u: 'https://open.spotify.com', n: 'Spotify' },
        { p: ['traductor'], u: 'https://translate.google.com', n: 'Traductor' },
        { p: ['wikipedia'], u: 'https://es.wikipedia.org', n: 'Wikipedia' },
    ];
    
    for (const s of sitios) {
        if (s.p.some(pal => t.includes(pal))) {
            hablar(`Abriendo ${s.n}`);
            window.open(s.u, '_blank');
            return true;
        }
    }
    return false;
}

// 💬 RESPUESTAS GENERALES
function respuestaGeneral(texto) {
    const t = texto.toLowerCase();
    
    if (t.includes('hola') || t.includes('buenos días') || t.includes('buenas tardes') || t.includes('buenas noches')) {
        hablar('¡Hola! Estoy listo, dime qué necesitas.');
        return true;
    }
    if (t.includes('tu nombre') || t.includes('quién eres') || t.includes('qué eres')) {
        hablar('Soy JARVIS, tu asistente. Puedo decirte la hora, el clima, hacer cálculos y abrir lo que pidas.');
        return true;
    }
    if (t.includes('qué puedes hacer') || t.includes('qué haces') || t.includes('ayuda')) {
        hablar('Dime la hora, el clima, una operación matemática o abrir algo como YouTube. Te escucho.');
        return true;
    }
    if (t.includes('descansa') || t.includes('pausa') || t.includes('silencio')) {
        hablar('Pausando. Di activar escucha para continuar.');
        detenerEscucha();
        return true;
    }
    if (t.includes('activar escucha') || t.includes('escúchame') || t.includes('despierta')) {
        iniciarEscucha();
        return true;
    }
    if (t.includes('adiós') || t.includes('apagar') || t.includes('cerrar') || t.includes('hasta luego')) {
        hablar('Hasta luego. Estoy aquí cuando me necesites.');
        detenerEscucha();
        return true;
    }
    return false;
}

// 🧠 PROCESAR TODO
async function procesarComando(texto) {
    if (respuestaGeneral(texto)) return;
    if (darHoraFecha(texto)) return;
    if (await darClima(texto)) return;
    if (resolverMatematicas(texto)) return;
    
    const t = texto.toLowerCase();
    if (t.includes('abrir') || t.includes('metete') || t.includes('entra') || t.includes('ingresa') || t.includes('busca') || t.includes('muéstrame')) {
        if (abrirAplicacion(texto)) return;
    }
    
    hablar(`Entendido: ${texto}`);
}

// 🎤 CONTROL DE ESCUCHA
function iniciarEscucha() {
    if (!escuchando) {
        escuchando = true;
        reconocedor.start();
        btnEstado.textContent = '🔴 SIEMPRE ESCUCHANDO';
        btnEstado.classList.add('escuchando');
        estadoSistema.textContent = 'Sistema Activo — Escuchando...';
        animarEscuchando();
        // Ya no repite "te escucho siempre" al iniciar ✅
    }
}

function detenerEscucha() {
    escuchando = false;
    reconocedor.stop();
    btnEstado.textContent = '⏸️ Escucha Pausada';
    btnEstado.classList.remove('escuchando');
    estadoSistema.textContent = 'Sistema en Pausa';
    animarEspera();
    if (reiniciarEscucha) clearTimeout(reiniciarEscucha);
}

reconocedor.onresult = (e) => {
    const res = e.results[e.resultIndex];
    if (!res.isFinal) return;
    
    const texto = res[0].transcript;
    agregarMensaje(texto, 'usuario');
    procesarComando(texto);
};

reconocedor.onend = () => {
    if (escuchando) {
        reiniciarEscucha = setTimeout(() => reconocedor.start(), 500);
    }
};

reconocedor.onerror = (e) => {
    console.log('Error:', e.error);
    if (e.error === 'not-allowed') {
        hablar('Necesito permiso del micrófono.');
    }
    if (escuchando) {
        reiniciarEscucha = setTimeout(() => reconocedor.start(), 1000);
    }
};

// Activar con un clic
window.addEventListener('click', () => {
    if (!escuchando) {
        iniciarEscucha();
    }
}, { once: true });

btnEstado.addEventListener('click', () => {
    if (escuchando) detenerEscucha();
    else iniciarEscucha();
});

btnLimpiar.addEventListener('click', () => {
    historial.innerHTML = '<p class="mensaje jarvis">Pantalla limpia. Sigo atento.</p>';
});
