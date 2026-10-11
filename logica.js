// Base de conocimientos — aquí puedes agregar todo lo que quieras
const baseConocimientos = {
    // Ejemplos — agrega tus propias preguntas y respuestas abajo
    "hola": "¡Hola! 👋 Soy tu cerebro virtual. ¿En qué te ayudo hoy?",
    "quién eres": "Soy tu asistente inteligente 🧠, listo para responder cualquier cosa que me preguntes.",
    "qué puedes hacer": "Puedo responder tus dudas, explicarte temas, darte información de tu proyecto y mucho más. ¡Solo pregúntame!",
    "proyecto": "Este es tu proyecto 'Cerebro' — un asistente que responde tus preguntas con tu propia información.",
    "cómo funcionas": "Busco en mi base de conocimientos la mejor respuesta para tu pregunta. Puedes agregar toda la información que quieras editando el archivo logica.js 📝",
    
    // === AGREGA AQUÍ TUS PREGUNTAS Y RESPUESTAS ===
    // Formato:
    // "pregunta": "tu respuesta",
    
    "gracias": "¡De nada! 😊 Estoy aquí para ayudarte siempre que lo necesites.",
    "adiós": "¡Hasta luego! 👋 Vuelve cuando quieras, seguiré aquí listo."
};

// Elementos de la página
const cajaMensajes = document.getElementById('caja-mensajes');
const formulario = document.getElementById('formulario');
const entrada = document.getElementById('entrada');

// Función para agregar mensaje a la pantalla
function agregarMensaje(texto, tipo) {
    const div = document.createElement('div');
    div.className = `mensaje ${tipo}`;
    div.innerHTML = `<div class="contenido">${texto}</div>`;
    cajaMensajes.appendChild(div);
    cajaMensajes.scrollTop = cajaMensajes.scrollHeight;
    return div;
}

// Buscar respuesta
function obtenerRespuesta(pregunta) {
    const texto = pregunta.toLowerCase().trim();
    
    // Coincidencia exacta o parcial
    for (const [clave, respuesta] of Object.entries(baseConocimientos)) {
        if (texto.includes(clave) || clave.includes(texto)) {
            return respuesta;
        }
    }
    
    // Respuesta por defecto si no encuentra
    return "No tengo esa información todavía 🤔. Agrégala en el archivo logica.js y podré responderte. ¡Estoy listo para aprender! 📚";
}

// Enviar mensaje
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = entrada.value.trim();
    if (!texto) return;
    
    // Mensaje del usuario
    agregarMensaje(texto, 'usuario');
    entrada.value = '';
    
    // Pensando...
    const cargando = agregarMensaje('Pensando... 🧠', 'bot');
    cargando.querySelector('.contenido').classList.add('cargando');
    
    // Simular retraso natural
    setTimeout(() => {
        cargando.remove();
        const respuesta = obtenerRespuesta(texto);
        agregarMensaje(respuesta, 'bot');
    }, 600);
});

// Mensaje de bienvenida al abrir
agregarMensaje("¡Hola! 🧠 Soy tu cerebro virtual. Pregúntame lo que quieras y te responderé. 💡", "bot");
