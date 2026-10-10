const sintesis = window.speechSynthesis;
const reconocedor = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Configuración de escucha continua
reconocedor.lang = 'es-MX';
reconocedor.continuous = true;
reconocedor.interimResults = false;
reconocedor.maxAlternatives = 1;

// Elementos del DOM
const historial = document.getElementById('historial');
const btnEstado = document.getElementById('btnEscuchar');
const btnLimpiar = document.getElementById('btnLimpiar');
const estadoSistema = document.getElementById('estadoSistema');
const robotCabeza = document.querySelector('.robot-cabeza');

let escuchando = false;
let reiniciarEscucha = null;

// Cargar voces del sistema
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

// 🔊 FUNCIÓN PRINCIPAL: HABLAR
function hablar(texto) {
    sintesis.cancel();
    animarHablando();
    
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.volume = 1;
    mensaje.rate = 0.9;
    
    // Seleccionar voz en español
    const vozEspanol = voces.find(v => v.lang === 'es-MX' || v.lang.startsWith('es'));
    if (vozEspanol) mensaje.voice = vozEspanol;
    
    // Volver a estado de escucha al terminar de hablar
    mensaje.onend = () => {
        if (escuchando) animarEscuchando();
        else animarEspera();
    };
    
    sintesis.speak(mensaje);
    agregarMensaje(texto, 'jarvis');
}

// 📝 Mostrar mensaje en pantalla
function agregarMensaje(texto, quien) {
    const p = document.createElement('p');
    p.className = `mensaje ${quien}`;
    p.textContent = (quien === 'jarvis' ? 'JARVIS: ' : 'Tú: ') + texto;
    historial.appendChild(p);
    historial.scrollTop = historial.scrollHeight;
}

// 🕒 MÓDULO 1 — HORA Y FECHA
function darHoraFecha(texto) {
    const t = texto.toLowerCase();
    
    if (t.includes('hora')) {
        const ahora = new Date();
        const horas = ahora.getHours();
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        hablar(`Son las ${horas} horas con ${minutos} minutos`);
        return true;
    }
    
    if (t.includes('fecha') || t.includes('día es') || t.includes('qué día')) {
        const ahora = new Date();
        hablar(`Hoy es ${ahora.toLocaleDateString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}`);
        return true;
    }
    
    return false;
}

// 🌤️ MÓDULO 2 — CLIMA
async function darClima(texto) {
    const t = texto.toLowerCase();
    if (!t.includes('clima') && !t.includes('temperatura') && !t.includes('tiempo')) return false;
    
    let ciudad = 'Toluca';
    const coincidenciaCiudad = t.match(/en\s+(.+)|de\s+(.+)/);
    if (coincidenciaCiudad) {
        ciudad = (coincidenciaCiudad[1] || coincidenciaCiudad[2])
            .trim()
            .replace(/\b(me|el|la|del|al|en|en el|en la)\b/g, '')
            .trim();
    }
    
    try {
        const respuesta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=bd5e3785039f359fa3b8ba4028d95a90&units=metric&lang=es`
        );
        const datos = await respuesta.json();
        
        if (datos.main) {
            const temp = Math.round(datos.main.temp);
            const desc = datos.weather[0].description;
            const max = Math.round(datos.main.temp_max);
            const min = Math.round(datos.main.temp_min);
            hablar(`En ${ciudad} hay ${temp} grados, ${desc}. Máxima ${max}, mínima ${min}`);
        } else {
            hablar(`No encontré información para ${ciudad}. El clima en Toluca ronda los 18 grados`);
        }
    } catch {
        hablar('No pude conectarme con el servicio del clima en este momento');
    }
    
    return true;
}

// 🧮 MÓDULO 3 — MATEMÁTICAS
function resolverMatematicas(texto) {
    const t = texto.toLowerCase();
    const palabrasClave = [
        'cuánto es', 'cuanto es', 'calcula', 'resuelve', 'suma', 'resta',
        'multiplica', 'divide', 'más', 'mas', 'menos', 'por', 'entre',
        'resultado de', 'igual a'
    ];
    
    const esOperacion = palabrasClave.some(palabra => t.includes(palabra)) 
                        || /\d+\s*[+\-*/]\s*\d+/.test(t);
    
    if (!esOperacion) return false;
    
    // Convertir palabras a símbolos
    let expresion = t
        .replace(/cuánto es|cuanto es|dime|calcula|resuelve|es igual a|el resultado de/g, '')
        .replace(/más|mas|suma/g, '+')
        .replace(/menos|resta/g, '-')
        .replace(/por|multiplica/g, '*')
        .replace(/entre|divide/g, '/')
        .replace(/\s+/g, '');
    
    // Extraer números y operador
    const coincidencia = expresion.match(/(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)/);
    
    if (!coincidencia) {
        hablar('No entendí la operación. Di por ejemplo: cuánto es 2 más 2');
        return true;
    }
    
    const a = parseFloat(coincidencia[1]);
    const operador = coincidencia[2];
    const b = parseFloat(coincidencia[3]);
    let resultado, palabraOperacion;
    
    switch (operador) {
        case '+':
            resultado = a + b;
            palabraOperacion = 'más';
            break;
        case '-':
            resultado = a - b;
            palabraOperacion = 'menos';
            break;
        case '*':
            resultado = a * b;
            palabraOperacion = 'por';
            break;
        case '/':
            if (b === 0) {
                hablar('No se puede dividir entre cero');
                return true;
            }
            resultado = a / b;
            palabraOperacion = 'entre';
            break;
    }
    
    // Redondear a 2 decimales si es necesario
    if (resultado % 1 !== 0) {
        resultado = Math.round(resultado * 100) / 100;
    }
    
    hablar(`${a} ${palabraOperacion} ${b} es igual a ${resultado}`);
    return true;
}

// 🚀 MÓDULO 4 — ABRIR SITIOS Y APLICACIONES
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
        { palabras: ['drive', 'archivos'], url: 'https://drive.google.com', nombre: 'Google Drive' },
        { palabras: ['calendario'], url: 'https://calendar.google.com', nombre: 'Calendario' },
        { palabras: ['netflix'], url: 'https://netflix.com', nombre: 'Netflix' },
        { palabras: ['spotify', 'música'], url: 'https://open.spotify.com', nombre: 'Spotify' },
        { palabras: ['amazon'], url: 'https://amazon.com.mx', nombre: 'Amazon México' },
        { palabras: ['traductor'], url: 'https://translate.google.com', nombre: 'Traductor de Google' },
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

// 💬 MÓDULO 5 — RESPUESTAS GENERALES
function respuestaGeneral(texto) {
    const t = texto.toLowerCase();
    
    if (t.includes('hola') || t.includes('buenos días') || t.includes('buenas tardes') || t.includes('buenas noches')) {
        hablar('¡Hola! Estoy listo. Dime qué necesitas.');
        return true;
    }
    if (t.includes('tu nombre') || t.includes('quién eres') || t.includes('qué eres')) {
        hablar('Soy JARVIS, tu asistente personal. Puedo decirte la hora, el clima, resolver operaciones matemáticas y abrir lo que me pidas.');
        return true;
    }
    if (t.includes('qué puedes hacer') || t.includes('qué haces') || t.includes('ayuda')) {
        hablar('Puedo decirte la hora, el clima, hacer cálculos y abrir sitios como YouTube, Instagram, Google y más. Solo dime qué quieres.');
        return true;
    }
    if (t.includes('descansa') || t.includes('pausa') || t.includes('silencio') || t.includes('silenciate')) {
        hablar('Pausando escucha. Di activar escucha para volver a escucharte.');
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

// 🧠 PROCESADOR CENTRAL
async function procesarComando(texto) {
    if (respuestaGeneral(texto)) return;
    if (darHoraFecha(texto)) return;
    if (await darClima(texto)) return;
    if (resolverMatematicas(texto)) return;
    
    const t = texto.toLowerCase();
    if (t.includes('abrir') || t.includes('metete') || t.includes('entra') || 
        t.includes('ingresa') || t.includes('busca') || t.includes('muéstrame')) {
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

// 📥 RECIBIR LO QUE DICES
reconocedor.onresult = (evento) => {
    const resultado = evento.results[evento.resultIndex];
    if (!resultado.isFinal) return;
    
    const texto = resultado[0].transcript;
    agregarMensaje(texto, 'usuario');
    procesarComando(texto);
};

// 🔄 REINICIAR ESCUCHA AUTOMÁTICA
reconocedor.onend = () => {
    if (escuchando) {
        reiniciarEscucha = setTimeout(() => reconocedor.start(), 500);
    }
};

// ⚠️ MANEJAR ERRORES
reconocedor.onerror = (error) => {
    console.log('Error de reconocimiento:', error.error);
    if (error.error === 'not-allowed') {
        hablar('Necesito permiso del micrófono para escucharte.');
    }
    if (escuchando) {
        reiniciarEscucha = setTimeout(() => reconocedor.start(), 1000);
    }
};

// 🖱️ ACTIVAR CON UN SOLO CLIC
window.addEventListener('click', () => {
    if (!escuchando) {
        iniciarEscucha();
    }
}, { once: true });

// Botón manual
btnEstado.addEventListener('click', () => {
    if (escuchando) detenerEscucha();
    else iniciarEscucha();
});

// Limpiar pantalla
btnLimpiar.addEventListener('click', () => {
    historial.innerHTML = '<p class="mensaje jarvis">Pantalla limpia. Sigo atento.</p>';
});
