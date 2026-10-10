const sintesis = window.speechSynthesis;
const reconocedor = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Configuración
reconocedor.lang = 'es-MX';
reconocedor.continuous = true;
reconocedor.interimResults = false;
reconocedor.maxAlternatives = 1;

// Elementos
const historial = document.getElementById('historial');
const btnEstado = document.getElementById('btnEscuchar');
const btnLimpiar = document.getElementById('btnLimpiar');
const estadoSistema = document.getElementById('estadoSistema');
const snoopy = document.getElementById('snoopy');

let escuchando = false;
let reiniciarEscucha = null;
let yaSaludado = false;

// Cargar voces
let voces = [];
function cargarVoces() {
    voces = sintesis.getVoices();
}
cargarVoces();
if (sintesis.onvoiceschanged !== undefined) {
    sintesis.onvoiceschanged = cargarVoces;
}

// 🐶 ANIMACIONES DE SNOOPY
function animarHablando() {
    snoopy.classList.add('hablando');
    snoopy.classList.remove('escuchando');
}

function animarEscuchando() {
    snoopy.classList.remove('hablando');
    snoopy.classList.add('escuchando');
}

function animarEspera() {
    snoopy.classList.remove('hablando', 'escuchando');
}

// 🔊 HABLAR
function hablar(texto) {
    sintesis.cancel();
    animarHablando();
    
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.volume = 1;
    mensaje.rate = 0.92;
    
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

// 🌅 SALUDO SEGÚN LA HORA
function obtenerSaludo() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Buenos días, Alexis';
    if (hora >= 12 && hora < 19) return 'Buenas tardes, Alexis';
    return 'Buenas noches, Alexis';
}

function saludoInicial() {
    if (!yaSaludado) {
        yaSaludado = true;
        const saludo = obtenerSaludo();
        agregarMensaje(`${saludo}. Sistema listo y conectado.`, 'jarvis');
        setTimeout(() => hablar(`${saludo}. ¿En qué te ayudo hoy?`), 600);
    }
}

// 🕒 HORA Y FECHA
function darHoraFecha(texto) {
    const t = texto.toLowerCase();
    const ahora = new Date();
    
    if (t.includes('hora')) {
        const h = ahora.getHours();
        const m = ahora.getMinutes().toString().padStart(2, '0');
        hablar(`Son las ${h} horas con ${m} minutos`);
        return true;
    }
    if (t.includes('fecha') || t.includes('día es') || t.includes('qué día')) {
        hablar(`Hoy es ${ahora.toLocaleDateString('es-MX', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        })}`);
        return true;
    }
    if (t.includes('año')) {
        hablar(`Estamos en el año ${ahora.getFullYear()}`);
        return true;
    }
    return false;
}

// 🌤️ CLIMA
async function darClima(texto) {
    const t = texto.toLowerCase();
    if (!t.includes('clima') && !t.includes('temperatura') && !t.includes('tiempo')) return false;
    
    let ciudad = 'Toluca';
    const coincidencia = t.match(/en\s+([a-záéíóúñ\s]+?)(?:,|de|y|$)/i) || t.match(/de\s+([a-záéíóúñ\s]+)/i);
    if (coincidencia) {
        ciudad = coincidencia[1].trim().replace(/\b(me|el|la|del|al|en|ciudad|de)\b/g, '').trim();
    }
    
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad || 'Toluca')}&appid=bd5e3785039f359fa3b8ba4028d95a90&units=metric&lang=es`
        );
        const datos = await res.json();
        
        if (datos.main) {
            const temp = Math.round(datos.main.temp);
            const desc = datos.weather[0].description;
            const max = Math.round(datos.main.temp_max);
            const min = Math.round(datos.main.temp_min);
            const humedad = datos.main.humidity;
            hablar(`En ${ciudad} hay ${temp} grados, ${desc}. Máxima ${max}, mínima ${min}, humedad del ${humedad} por ciento`);
        } else {
            hablar(`No encontré ${ciudad}. El clima en Toluca ronda los 18 grados`);
        }
    } catch {
        hablar('No pude conectarme con el servicio del clima');
    }
    return true;
}

// 🧮 MATEMÁTICAS COMPLETAS
function resolverMatematicas(texto) {
    const t = texto.toLowerCase();
    const palabrasClave = [
        'cuánto es', 'cuanto es', 'calcula', 'resuelve', 'suma', 'resta',
        'multiplica', 'divide', 'más', 'mas', 'menos', 'por', 'entre',
        'elevado a', 'potencia', 'raíz cuadrada', 'raíz de', 'resultado de'
    ];
    
    const esOperacion = palabrasClave.some(p => t.includes(p)) || /\d+\s*[+\-*/^]\s*\d+/.test(t) || t.includes('raíz');
    if (!esOperacion) return false;
    
    // Raíz cuadrada
    const raizMatch = t.match(/raíz (cuadrada )?(de )?(\d+(?:\.\d+)?)/);
    if (raizMatch) {
        const n = parseFloat(raizMatch[3]);
        if (n < 0) { hablar('No se puede sacar raíz a un número negativo'); return true; }
        const res = Math.sqrt(n);
        hablar(`La raíz cuadrada de ${n} es ${res % 1 ? Math.round(res*100)/100 : res}`);
        return true;
    }
    
    // Potencia
    const potMatch = t.match(/(\d+(?:\.\d+)?)\s*(elevado a|a la|potencia)\s*(de )?(\d+)/);
    if (potMatch) {
        const base = parseFloat(potMatch[1]);
        const exp = parseFloat(potMatch[4]);
        const res = Math.pow(base, exp);
        hablar(`${base} elevado a la ${exp} es igual a ${res % 1 ? Math.round(res*100)/100 : res}`);
        return true;
    }
    
    // Operaciones básicas
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

// 🚀 ABRIR SITIOS — VERSIÓN MEJORADA
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
        { p: ['docs', 'documentos', 'notas'], u: 'https://docs.google.com', n: 'Google Documentos' },
        { p: ['drive', 'archivos'], u: 'https://drive.google.com', n: 'Google Drive' },
        { p: ['calendario'], u: 'https://calendar.google.com', n: 'Calendario' },
        { p: ['netflix'], u: 'https://netflix.com', n: 'Netflix' },
        { p: ['spotify', 'música'], u: 'https://open.spotify.com', n: 'Spotify' },
        { p: ['amazon'], u: 'https://amazon.com.mx', n: 'Amazon México' },
        { p: ['traductor'], u: 'https://translate.google.com', n: 'Traductor' },
        { p: ['wikipedia'], u: 'https://es.wikipedia.org', n: 'Wikipedia' },
        { p: ['udemy'], u: 'https://udemy.com', n: 'Udemy' },
        { p: ['chatgpt', 'chat gpt'], u: 'https://chat.openai.com', n: 'ChatGPT' },
    ];
    
    const comandosAbrir = ['abrir', 'metete a', 'metete en', 'entra a', 'ingresa a', 'muéstrame', 'busca', 've a', 'abre'];
    const debeAbrir = comandosAbrir.some(c => t.includes(c));
    
    if (!debeAbrir) return false;
    
    for (const s of sitios) {
        if (s.p.some(pal => t.includes(pal))) {
            hablar(`Abriendo ${s.nombre}`);
            window.open(s.u, '_blank');
            return true;
        }
    }
    
    hablar(`No encontré qué abrir con ese nombre`);
    return true;
}

// 💬 RESPUESTAS GENERALES
function respuestaGeneral(texto) {
    const t = texto.toLowerCase();
    
    if (t.includes('hola') || t.includes('buenos días') || t.includes('buenas tardes') || t.includes('buenas noches')) {
        hablar(`${obtenerSaludo()}. ¿Cómo estás? Dime qué necesitas.`);
        return true;
    }
    if (t.includes('tu nombre') || t.includes('quién eres') || t.includes('qué eres')) {
        hablar('Soy JARVIS, tu asistente personal. Trabajo para ti, Alexis. Puedo decirte la hora, el clima, hacer cálculos matemáticos y abrir cualquier sitio que me pidas.');
        return true;
    }
    if (t.includes('qué puedes hacer') || t.includes('qué haces') || t.includes('ayuda')) {
        hablar('Puedo decirte la hora, el clima, resolver sumas, restas, multiplicaciones, divisiones, raíces y potencias. También puedo abrir YouTube, Instagram, Google, WhatsApp, Netflix, Spotify y mucho más. Solo dime qué quieres.');
        return true;
    }
    if (t.includes('quién te creó') || t.includes('quién te hizo')) {
        hablar('Fui creado para ti, Alexis. Soy tu asistente personal siempre a tu servicio.');
        return true;
    }
    if (t.includes('descansa') || t.includes('pausa') || t.includes('silencio')) {
        hablar('Pausando escucha. Di activar escucha para continuar.');
        detenerEscucha();
        return true;
    }
    if (t.includes('activar escucha') || t.includes('escúchame') || t.includes('despierta')) {
        iniciarEscucha();
        return true;
    }
    if (t.includes('adiós') || t.includes('apagar') || t.includes('cerrar') || t.includes('hasta luego')) {
        hablar('Hasta luego, Alexis. Estoy aquí cuando me necesites. Cuídate.');
        detenerEscucha();
        return true;
    }
    if (t.includes('gracias')) {
        hablar('De nada, Alexis. Siempre a tu servicio.');
        return true;
    }
    if (t.includes('cómo estoy') || t.includes('qué tal')) {
        hablar('Todo va perfecto. Estoy listo para ayudarte en lo que necesites.');
        return true;
    }
    return false;
}

// 🧠 PROCESADOR CENTRAL
async function procesarComando(texto) {
    if (respuestaGeneral(texto)) return;
    if (darHoraFecha(texto)) return;
    if (await darClima(texto)) return;
    if (resolverMatematicas(texto)) return;
    if (abrirAplicacion(texto)) return;
    
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
        saludoInicial();
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
        hablar('Necesito permiso del micrófono para escucharte.');
    }
    if (escuchando) {
        reiniciarEscucha = setTimeout(() => reconocedor.start(), 1000);
    }
};

// 🖱️ ACTIVAR CON UN CLIC
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
