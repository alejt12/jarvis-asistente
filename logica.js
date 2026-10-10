const sintesis = window.speechSynthesis;
const reconocedor = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

reconocedor.lang = 'es-MX';
reconocedor.continuous = true;
reconocedor.interimResults = false;
reconocedor.maxAlternatives = 1;

const historial = document.getElementById('historial');
const btnEstado = document.getElementById('btnEscuchar');
const btnLimpiar = document.getElementById('btnLimpiar');

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

function agregarMensaje(texto, quien) {
    const p = document.createElement('p');
    p.className = `mensaje ${quien}`;
    p.textContent = (quien === 'jarvis' ? 'JARVIS: ' : 'Tú: ') + texto;
    historial.appendChild(p);
    historial.scrollTop = historial.scrollHeight;
}

// 🕒 FUNCIÓN: HORA Y FECHA
function darHoraFecha(texto) {
    const t = texto.toLowerCase();
    if (t.includes('hora')) {
        const ahora = new Date();
        hablar(`Son las ${ahora.getHours()} horas con ${ahora.getMinutes()} minutos`);
        return true;
    }
    if (t.includes('fecha') || t.includes('día es') || t.includes('que dia')) {
        const ahora = new Date();
        hablar(`Hoy es ${ahora.toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}`);
        return true;
    }
    return false;
}

// 🌤️ FUNCIÓN: CLIMA
async function darClima(texto) {
    const t = texto.toLowerCase();
    if (!t.includes('clima') && !t.includes('temperatura') && !t.includes('tiempo')) return false;
    
    let ciudad = 'Toluca'; // Por defecto tu ciudad
    const coincidenciaCiudad = t.match(/en\s+(.+)|de\s+(.+)/);
    if (coincidenciaCiudad) {
        ciudad = coincidenciaCiudad[1] || coincidenciaCiudad[2];
        ciudad = ciudad.trim().replace(/me|el|la|del|al/g, '').trim();
    }
    
    try {
        hablar(`Buscando el clima en ${ciudad}...`);
        const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=bd5e3785039f359fa3b8ba4028d95a90&units=metric&lang=es`);
        const datos = await respuesta.json();
        
        if (datos.main) {
            const temp = Math.round(datos.main.temp);
            const descripcion = datos.weather[0].description;
            const maxima = Math.round(datos.main.temp_max);
            const minima = Math.round(datos.main.temp_min);
            hablar(`En ${ciudad} hay ${temp} grados, ${descripcion}. Máxima ${maxima}, mínima ${minima}`);
        } else {
            hablar(`No encontré el clima en ${ciudad}, pero te digo el de Toluca: alrededor de 18 grados`);
        }
    } catch {
        hablar(`No pude conectarme con el servicio del clima, pero en Toluca suele estar fresco`);
    }
    return true;
}

// 🧮 FUNCIÓN: OPERACIONES MATEMÁTICAS
function resolverMatematicas(texto) {
    const t = texto.toLowerCase();
    
    // Palabras clave de matemáticas
    const palabrasClave = ['cuánto es', 'cuanto es', 'calcula', 'resuelve', 'suma', 'resta', 'multiplica', 'divide', 'más', 'menos', 'por', 'entre', 'igual a', 'resultado de'];
    const esOperacion = palabrasClave.some(palabra => t.includes(palabra)) || /\d+\s*[+\-*/]\s*\d+/.test(t);
    
    if (!esOperacion) return false;
    
    // Convertir palabras a símbolos
    let expresion = t
        .replace(/cuánto es|cuanto es|dime|calcula|resuelve|es igual a|el resultado de/g, '')
        .replace(/más|mas|suma/g, '+')
        .replace(/menos|resta/g, '-')
        .replace(/por|multiplica/g, '*')
        .replace(/entre|divide/g, '/')
        .replace(/\s+/g, '');
    
    // Buscar operación: número + operador + número
    const match = expresion.match(/(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)/);
    if (!match) {
        hablar('No entendí la operación. Di por ejemplo: cuánto es 2 más 2');
        return true;
    }
    
    const a = parseFloat(match[1]);
    const op = match[2];
    const b = parseFloat(match[3]);
    let resultado, palabraOp;
    
    switch(op) {
        case '+': resultado = a + b; palabraOp = 'más'; break;
        case '-': resultado = a - b; palabraOp = 'menos'; break;
        case '*': resultado = a * b; palabraOp = 'por'; break;
        case '/':
            if (b === 0) { hablar('No se puede dividir entre cero'); return true; }
            resultado = a / b; palabraOp = 'entre'; break;
    }
    
    // Redondear si tiene muchos decimales
    if (resultado % 1 !== 0) resultado = Math.round(resultado * 100) / 100;
    
    hablar(`${a} ${palabraOp} ${b} es igual a ${resultado}`);
    return true;
}

// 🚀 FUNCIÓN: ABRIR APLICACIONES Y SITIOS
function abrirAplicacion(texto) {
    const t = texto.toLowerCase();
    
    const sitios = [
        { palabras: ['google'], url: 'https://google.com', nombre: 'Google' },
        { palabras: ['youtube'], url: 'https://youtube.com', nombre: 'YouTube' },
        { palabras: ['facebook'], url: 'https://facebook.com', nombre: 'Facebook' },
        { palabras: ['instagram'], url: 'https://instagram.com', nombre: 'Instagram' },
        { palabras: ['twitter', 'x '], url: 'https://x.com', nombre: 'X' },
        { palabras: ['whatsapp'], url: 'https://web.whatsapp.com', nombre: 'WhatsApp Web' },
        { palabras: ['github'], url: 'https://github.com', nombre: 'GitHub' },
        { palabras: ['tiktok'], url: 'https://tiktok.com', nombre: 'TikTok' },
        { palabras: ['gmail', 'correo'], url: 'https://mail.google.com', nombre: 'Gmail' },
        { palabras: ['mapas', 'google maps'], url: 'https://maps.google.com', nombre: 'Google Maps' },
        { palabras: ['docs', 'documentos', 'notas'], url: 'https://docs.google.com', nombre: 'Google Documentos' },
        { palabras: ['calendario'], url: 'https://calendar.google.com', nombre: 'Calendario' },
        { palabras: ['drive', 'archivos'], url: 'https://drive.google.com', nombre: 'Google Drive' },
        { palabras: ['amazon'], url: 'https://amazon.com.mx', nombre: 'Amazon México' },
        { palabras: ['netflix'], url: 'https://netflix.com', nombre: 'Netflix' },
        { palabras: ['spotify', 'música'], url: 'https://open.spotify.com', nombre: 'Spotify' },
        { palabras: ['traductor'], url: 'https://translate.google.com', nombre: 'Traductor' },
        { palabras: ['wikipedia'], url: 'https://es.wikipedia.org', nombre: 'Wikipedia' },
    ];
    
    for (const sitio of sitios) {
        if (sitio.palabras.some(palabra => t.includes(palabra))) {
            hablar(`Abriendo ${sitio.nombre}`);
            window.open(sitio.url, '_blank');
            return true;
        }
    }
    return false;
}

// 💬 RESPUESTAS GENERALES
function respuestaGeneral(texto) {
    const t = texto.toLowerCase();
    
    if (t.includes('hola') || t.includes('buenos días') || t.includes('buenas tardes') || t.includes('buenas noches')) {
        hablar('¡Hola! Aquí estoy, siempre escuchándote. Dime qué necesitas.');
        return true;
    }
    if (t.includes('tu nombre') || t.includes('quién eres') || t.includes('que eres')) {
        hablar('Soy JARVIS, tu asistente personal. Te escucho siempre. Puedo decirte la hora, el clima, hacer cálculos y abrir lo que me pidas.');
        return true;
    }
    if (t.includes('qué puedes hacer') || t.includes('que haces') || t.includes('ayuda')) {
        hablar('Puedo decirte la hora, el clima, resolver operaciones matemáticas y abrir sitios como YouTube, Instagram, Google y más. Solo dime qué quieres.');
        return true;
    }
    if (t.includes('descansa') || t.includes('pausa') || t.includes('silenciate')) {
        hablar('Pausando escucha. Dime "activar escucha" para volver a escucharte.');
        detenerEscucha();
        return true;
    }
    if (t.includes('activar escucha') || t.includes('escúchame') || t.includes('despierta')) {
        iniciarEscucha();
        return true;
    }
    if (t.includes('adiós') || t.includes('apagar') || t.includes('cerrar') || t.includes('hasta luego')) {
        hablar('Hasta luego, señor. Estoy aquí cuando me necesites.');
        detenerEscucha();
        return true;
    }
    return false;
}

// 🧠 PROCESAR TODO
async function procesarComando(texto) {
    // 1. Respuestas generales
    if (respuestaGeneral(texto)) return;
    
    // 2. Hora y fecha
    if (darHoraFecha(texto)) return;
    
    // 3. Clima
    if (await darClima(texto)) return;
    
    // 4. Matemáticas
    if (resolverMatematicas(texto)) return;
    
    // 5. Abrir aplicaciones
    const t = texto.toLowerCase();
    if (t.includes('abrir') || t.includes('metete') || t.includes('entra') || t.includes('ingresa') || t.includes('muéstrame') || t.includes('busca')) {
        if (abrirAplicacion(texto)) return;
    }
    
    // Si no reconoce nada
    hablar(`Entendido: ${texto}`);
}

function iniciarEscucha() {
    if (!escuchando) {
        escuchando = true;
        reconocedor.start();
        btnEstado.textContent = '🔴 SIEMPRE ESCUCHANDO';
        btnEstado.classList.add('escuchando');
        hablar('Estoy listo, te escucho siempre');
    }
}

function detenerEscucha() {
    escuchando = false;
    reconocedor.stop();
    btnEstado.textContent = '⏸️ Escucha Pausada';
    btnEstado.classList.remove('escuchando');
    if (reiniciarEscucha) clearTimeout(reiniciarEscucha);
}

reconocedor.onresult = (e) => {
    const resultado = e.results[e.resultIndex];
    if (!resultado.isFinal) return;
    
    const texto = resultado[0].transcript;
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
    historial.innerHTML = '<p class="mensaje jarvis">Pantalla limpia. Sigo escuchándote.</p>';
});
