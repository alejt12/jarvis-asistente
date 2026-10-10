const sintesis = window.speechSynthesis;
const reconocedor = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocedor.lang = 'es-MX';
reconocedor.continuous = false;
reconocedor.interimResults = false;

const historial = document.getElementById('historial');
const btnEscuchar = document.getElementById('btnEscuchar');
const btnLimpiar = document.getElementById('btnLimpiar');
let escuchando = false;

function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-MX';
    mensaje.volume = 1;
    mensaje.rate = 0.9;
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

function procesarComando(texto) {
    const t = texto.toLowerCase();
    
    if (t.includes('hola')) {
        hablar('¡Hola! Soy JARVIS. ¿En qué te ayudo hoy?');
    }
    else if (t.includes('hora')) {
        const h = new Date();
        hablar(`Son las ${h.getHours()} horas con ${h.getMinutes()} minutos`);
    }
    else if (t.includes('tu nombre') || t.includes('quién eres')) {
        hablar('Soy JARVIS, tu asistente personal. Diseñado para ayudarte.');
    }
    else if (t.includes('fecha') || t.includes('día es')) {
        const f = new Date();
        hablar(`Hoy es ${f.toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}`);
    }
    else if (t.includes('adiós') || t.includes('apagar') || t.includes('cerrar')) {
        hablar('Hasta luego, señor. Sistema en pausa.');
    }
    else if (t.includes('abrir') && t.includes('google')) {
        hablar('Abriendo Google');
        window.open('https://google.com', '_blank');
    }
    else {
        hablar(`Entendido: ${texto}`);
    }
}

reconocedor.onresult = (e) => {
    const texto = e.results[0][0].transcript;
    agregarMensaje(texto, 'usuario');
    procesarComando(texto);
};

reconocedor.onend = () => {
    escuchando = false;
    btnEscuchar.classList.remove('escuchando');
    btnEscuchar.textContent = '🎙️ Escuchar';
};

reconocedor.onerror = () => {
    hablar('No entendí, repite por favor.');
    escuchando = false;
    btnEscuchar.classList.remove('escuchando');
};

btnEscuchar.addEventListener('click', () => {
    if (!escuchando) {
        escuchando = true;
        reconocedor.start();
        btnEscuchar.classList.add('escuchando');
        btnEscuchar.textContent = '🔴 Escuchando...';
    }
});

btnLimpiar.addEventListener('click', () => {
    historial.innerHTML = '<p class="mensaje jarvis">Pantalla limpia. Sistema listo.</p>';
});

window.addEventListener('load', () => {
    setTimeout(() => {
        hablar('JARVIS activado. Todo funcionando correctamente.');
    }, 500);
});
