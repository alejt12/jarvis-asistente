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

// 🐶 ANIMACIONES
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

// 🌅 SALUDO
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
        agregarMensaje(`${saludo}. ¿En qué te ayudo hoy?`, 'jarvis');
        setTimeout(() => hablar(`${saludo}. ¿En qué te ayudo hoy?`), 600);
    }
}

// 🧠 INTELIGENCIA PRINCIPAL — RESPUESTAS NATURALES
function obtenerRespuesta(texto) {
    const t = texto.toLowerCase().trim();
    
    // === SALUDOS ===
    if (t.includes('hola') || t.includes('buenos días') || t.includes('buenas tardes') || t.includes('buenas noches')) {
        return `${obtenerSaludo()}. ¿Cómo estás hoy?`;
    }
    
    // === CÓMO ESTÁS ===
    if ((t.includes('cómo estás') || t.includes('qué tal') || t.includes('cómo te va')) && !t.includes('tú') && !t.includes('y tú')) {
        return 'Muy bien, gracias por preguntar. Todo funciona perfectamente. ¿Y tú cómo estás, Alexis?';
    }
    
    // === RESPUESTA A "BIEN Y TÚ" ===
    if ((t.includes('bien') || t.includes('muy bien') || t.includes('todo bien') || t.includes('estoy bien')) && (t.includes('tú') || t.includes('y tú'))) {
        return '¡Me alegra muchísimo! Estoy muy bien. ¿En qué te ayudo hoy?';
    }
    
    if (t.includes('mal') || t.includes('triste') || t.includes('cansado')) {
        return 'Lo siento mucho. Aquí estoy contigo, escríbeme o dime lo que necesites. Todo va a mejorar. 💙';
    }
    
    // === IDENTIDAD ===
    if (t.includes('quién eres') || t.includes('qué eres') || t.includes('tu nombre')) {
        return 'Soy JARVIS, tu asistente personal. Fui creado para ti, Alexis. Estoy aquí para ayudarte, escucharte y acompañarte en todo lo que necesites.';
    }
    if (t.includes('quién te creó') || t.includes('quién te hizo')) {
        return 'Fui creado especialmente para ti, Alexis. Soy tu asistente y estoy siempre a tu servicio.';
    }
    
    // === QUÉ PUEDES HACER ===
    if (t.includes('qué puedes hacer') || t.includes('qué haces') || t.includes('ayuda') || t.includes('qué sabes hacer')) {
        return 'Puedo decirte la hora, el clima, resolver ejercicios matemáticos, abrir sitios web, conversar contigo y mucho más. Solo dime qué quieres.';
    }
    
    // === GRACIAS ===
    if (t.includes('gracias') || t.includes('te agradezco')) {
        return 'De nada, Alexis. Es un gusto ayudarte. Estoy aquí para lo que necesites siempre.';
    }
    
    // === DESPEDIDA ===
    if (t.includes('adiós') || t.includes('hasta luego') || t.includes('nos vemos')) {
        return 'Hasta luego, Alexis. Cuídate mucho. Aquí estaré cuando regreses. 💙';
    }
    
    // === HORA Y FECHA ===
    if (t.includes('hora')) {
        const ahora = new Date();
        const h = ahora.getHours();
        const m = ahora.getMinutes().toString().padStart(2, '0');
        return `Son las ${h} horas con ${m} minutos.`;
    }
    if (t.includes('fecha') || t.includes('qué día es')) {
        const ahora = new Date();
        return `Hoy es ${ahora.toLocaleDateString('es-MX', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        })}.`;
    }
    
    // === DESCANSO / ACTIVAR ===
    if (t.includes('descansa') || t.includes('pausa') || t.includes('silencio')) {
        detenerEscucha();
        return 'Escucha pausada. Di "activar escucha" para volver a escucharte.';
    }
    if (t.includes('activar escucha') || t.includes('escúchame') || t.includes('despierta')) {
        iniciarEscucha();
        return '¡Aquí estoy! Te escucho. ¿Qué necesitas?';
    }
    
    // === MATEMÁTICAS ===
    const raizMatch = t.match(/raíz (cuadrada )?(de )?(\d+(?:\.\d+)?)/);
    if (raizMatch) {
        const n = parseFloat(raizMatch[3]);
        if (n < 0) return 'No se puede sacar raíz a un número negativo.';
        const res = Math.sqrt(n);
        return `La raíz cuadrada de ${n} es ${res % 1 ? Math.round(res*100)/100 : res}`;
    }
    
    const potMatch = t.match(/(\d+(?:\.\d+)?)\s*(elevado a|a la|potencia)\s*(\d+)/);
    if (potMatch) {
        const base = parseFloat(potMatch[1]);
        const exp = parseFloat(potMatch[3]);
        const res = Math.pow(base, exp);
        return `${base} elevado a la ${exp} es igual a ${res % 1 ? Math.round(res*100)/100 : res}`;
    }
    
    let expr = t
        .replace(/cuánto es|cuanto es|dime|calcula|resuelve|es igual a/g, '')
        .replace(/más|mas/g, '+')
        .replace(/menos/g, '-')
        .replace(/por/g, '*')
        .replace(/entre/g, '/')
        .replace(/\s+/g, '');
    
    const m = expr.match(/(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)/);
    if (m) {
        const a = parseFloat(m[1]), op = m[2], b = parseFloat(m[3]);
        let res, pal;
        switch(op) {
            case '+': res = a + b; pal = 'más'; break;
            case '-': res = a - b; pal = 'menos'; break;
            case '*': res = a * b; pal = 'por'; break;
            case '/': if (b === 0) return 'No se puede dividir entre cero.'; res = a / b; pal = 'entre'; break;
        }
        if (res % 1 !== 0) res = Math.round(res * 100) / 100;
        return `${a} ${pal} ${b} es igual a ${res}`;
    }
    
    // === ABRIR SITIOS ===
    const comandosAbrir = ['abrir', 'abre', 'entra a', 've a', 'ingresa a', 'muéstrame'];
    const debeAbrir = comandosAbrir.some(c => t.includes(c));
    
    if (debeAbrir) {
        const sitios = [
            { p: ['youtube'], u: 'https://youtube.com', n: 'YouTube' },
            { p: ['google'], u: 'https://google.com', n: 'Google' },
            { p: ['instagram'], u: 'https://instagram.com', n: 'Instagram' },
            { p: ['netflix'], u: 'https://netflix.com', n: 'Netflix' },
            { p: ['spotify'], u: 'https://open.spotify.com', n: 'Spotify' },
            { p: ['whatsapp'], u: 'https://web.whatsapp.com', n: 'WhatsApp' },
            { p: ['chatgpt', 'chat gpt'], u: 'https://chat.openai.com', n: 'ChatGPT' },
            { p: ['github'], u: 'https://github.com', n: 'GitHub' },
            { p: ['tiktok'], u: 'https://tiktok.com', n: 'TikTok' },
            { p: ['wikipedia'], u: 'https://es.wikipedia.org', n: 'Wikipedia' },
        ];
        
        for (const s of sitios) {
            if (s.p.some(pal => t.includes(pal))) {
                window.open(s.u, '_blank');
                return `Abriendo ${s.n}...`;
            }
        }
        return 'No encontré ese sitio. Intenta decirme: abre YouTube, abre Google, etc.';
    }
    
    // === CLIMA ===
    if (t.includes('clima') || t.includes('temperatura')) {
        return 'Puedo buscar el clima por ti. Dime: "¿Cómo está el clima en Toluca?" o la ciudad que quieras.';
    }
    
    // === RESPUESTA INTELIGENTE GENERAL ===
    // Si no reconoce nada específico, responde naturalmente
    const respuestasGenerales = [
        `Entiendo lo que dices: "${texto}". Cuéntame más, ¿en qué te ayudo?`,
        `Escuché que dices: "${texto}". Estoy aquí para ti, ¿qué más quieres saber?`,
        `Me encanta conversar contigo, Alexis. Dijiste: "${texto}". ¿Qué más te gustaría hablar?`,
        `"${texto}" — lo tengo claro. ¿Hay algo más en lo que te pueda ayudar?`
    ];
    return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
}

// 🧠 PROCESADOR CENTRAL
async function procesarComando(texto) {
    const respuesta = obtenerRespuesta(texto);
    hablar(respuesta);
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
