//  J.A.R.V.I.S. — Sistema CORREGIDO y funcionando
const baseConocimientos = {
    // Saludos
    "hola": "Buenos días, señor. Sistema J.A.R.V.I.S. en línea. Todo funciona perfectamente. ¿En qué puedo asistirle?",
    "buenos dias": "Buenos días, señor. Es un placer saludarle. ¿Cómo se encuentra hoy?",
    "buenas tardes": "Buenas tardes, señor. Todo en orden. ¿En qué le ayudo?",
    "buenas noches": "Buenas noches, señor. Permaneceré activo mientras usted lo necesite.",
    
    // Identidad
    "quien eres": "Soy J.A.R.V.I.S., su asistente personal. Just A Rather Very Intelligent System. Estoy aquí para servirle, señor.",
    "que eres": "Soy su asistente virtual, señor. Diseñado para responder sus preguntas y brindarle apoyo en todo lo que necesite.",
    "jarvis": "A sus órdenes, señor. ¿Me llamaba?",
    
    // Capacidades
    "que puedes hacer": "Puedo responder sus dudas, recordar información, darle datos de su proyecto y aprender todo lo que usted me enseñe. Estoy listo para todo, señor.",
    "ayudame": "Por supuesto, señor. Indíqueme qué necesita y lo haré de inmediato.",
    "como funcionas": "Muy sencillo, señor. Usted me pregunta y yo busco la respuesta en mi base de conocimientos. Si me enseña cosas nuevas, las recuerdo para siempre.",
    
    // Proyecto
    "proyecto": "El proyecto avanza correctamente, señor. La interfaz está activa y lista para recibir instrucciones. Todo marcha según lo previsto.",
    "como te enseño": "Abra el archivo logica-jarvis.js y agregue sus preguntas y respuestas. Guarde el archivo, actualice la página y ya lo sabré. Así de simple, señor.",
    
    // Cortesía
    "gracias": "Es un placer servirle, señor. Estoy a su disposición las 24 horas.",
    "adios": "Hasta la próxima, señor. Permaneceré en espera por si me necesita nuevamente. Que tenga un excelente día.",
    "como estoy": "Todo indica que se encuentra bien, señor. Todo en orden desde mi perspectiva.",
    "estas listo": "Completamente operativo y listo, señor.",
    "prueba": "Recibido y procesado, señor. ¡Funciona perfectamente!"
};

// === ELEMENTOS DE LA PÁGINA ===
const pantalla = document.getElementById('pantalla-conversacion');
const formulario = document.getElementById('formulario-entrada');
const campo = document.getElementById('campo-pregunta');

// === AGREGAR MENSAJE A LA PANTALLA ===
function agregarMensaje(texto, tipo) {
    const div = document.createElement('div');
    div.className = `mensaje ${tipo}`;
    const etiqueta = tipo === 'usuario' ? 'Usted' : 'J.A.R.V.I.S.';
    div.innerHTML = `
        <div class="etiqueta-remitente">${etiqueta}</div>
        <div class="burbuja">${texto}</div>
    `;
    pantalla.appendChild(div);
    pantalla.scrollTop = pantalla.scrollHeight;
    return div;
}

// === BUSCAR RESPUESTA ===
function obtenerRespuesta(pregunta) {
    const texto = pregunta.toLowerCase().trim();
    
    // Coincidencia flexible
    for (const [clave, respuesta] of Object.entries(baseConocimientos)) {
        if (texto.includes(clave) || clave.includes(texto)) {
            return respuesta;
        }
    }
    
    // Respuesta por defecto
    return "Disculpe, señor. No cuento con esa información todavía. Si me la indica, la agrego de inmediato a mi base de conocimientos y la recordaré siempre.";
}

// === ENVIAR AL DAR CLIC O PRESIONAR ENTER ===
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = campo.value.trim();
    
    if (!texto) return;
    
    // Mostrar mensaje del usuario
    agregarMensaje(texto, 'usuario');
    campo.value = '';
    
    // Mostrar "pensando"
    const pensando = agregarMensaje("Procesando...", 'jarvis');
    pensando.querySelector('.burbuja').classList.add('pensando');
    
    // Dar respuesta
    setTimeout(function() {
        pensando.remove();
        const respuesta = obtenerRespuesta(texto);
        agregarMensaje(respuesta, 'jarvis');
    }, 800);
});

// === MENSAJE DE BIENVENIDA ===
agregarMensaje(
    "Sistema J.A.R.V.I.S. activo y funcionando al 100%. Todos los sistemas verificados. Es un gusto saludarlo, señor. ¿En qué puedo servirle hoy?",
    "jarvis"
);
