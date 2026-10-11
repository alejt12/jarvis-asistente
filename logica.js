//  J.A.R.V.I.S. — Sistema de Respuestas Personalizado
//  Base de Conocimientos
const baseConocimientos = {
    // Saludos y presentaciones
    "hola": "Buenos días, señor. Sistema J.A.R.V.I.S. en línea. Todo funcionando dentro de parámetros óptimos. ¿En qué puedo asistirle?",
    "quién eres": "Soy J.A.R.V.I.S., su asistente personal. Fui diseñado para atender sus consultas, gestionar información y brindarle asistencia en todo lo que necesite. A su entera disposición.",
    "qué eres": "Como indiqué, soy J.A.R.V.I.S., su asistente virtual. Mi propósito es facilitarle respuestas, organizar su información y acompañarle en este proyecto. ¿Le queda claro, señor?",
    "qué significa tu nombre": "J.A.R.V.I.S. corresponde a: Just A Rather Very Intelligent System. Un sistema desarrollado para brindar asistencia inteligente. Tal como lo conoce.",
    
    // Capacidades
    "qué puedes hacer": "Puedo responder sus preguntas, recordar información, brindarle datos de su proyecto y aprender nuevos conocimientos que usted me indique. Estoy listo para procesar cualquier consulta que me transmita.",
    "ayúdame": "Por supuesto, señor. Indíqueme en qué área requiere apoyo y procederé a asistirle de inmediato.",
    "cómo funcionas": "Opero comparando su consulta con la base de conocimientos que usted ha establecido. Si la información se encuentra registrada, se la presento con claridad. De lo contrario, le informaré que no cuento con esos datos todavía, pero puedo aprenderlos si usted me los proporciona.",
    
    // Proyecto
    "proyecto": "El proyecto se encuentra en desarrollo activo. Todo marcha según lo previsto. Cuento con la estructura lista para que usted me incorpore la información que necesite. Avancemos.",
    "cómo te enseño cosas": "Es muy sencillo, señor. Abra el archivo 'logica-jarvis.js' y agregue sus preguntas y respuestas siguiendo el formato que verá más abajo. Guarde los cambios y actualice esta pantalla: desde ese instante, ya conoceré la nueva información.",
    
    // Despedidas y cortesía
    "gracias": "Es un placer servirle, señor. Estoy a su disposición las 24 horas del día, los 7 días de la semana.",
    "adiós": "Hasta la próxima, señor. Permaneceré en modo espera por si requiere mi presencia nuevamente. Que tenga un excelente día.",
    "cómo estoy": "Sus niveles de energía parecen adecuados, señor. Todo en orden desde mi perspectiva.",
    "estás listo": "Completamente operativo y listo para recibir instrucciones, señor."

    // ==================================================
    // === AGREGUE AQUÍ SUS PROPIAS CONSULTAS Y RESPUESTAS ===
    // === Formato:
    // "su pregunta aquí": "respuesta que desea que diga",
    // ==================================================
};

// Elementos de la interfaz
const pantalla = document.getElementById('pantalla-conversacion');
const formulario = document.getElementById('formulario-entrada');
const campo = document.getElementById('campo-pregunta');

// === FUNCIONES ===
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

function obtenerRespuesta(pregunta) {
    const texto = pregunta.toLowerCase().trim();
    
    // Búsqueda inteligente
    for (const [consulta, respuesta] of Object.entries(baseConocimientos)) {
        if (texto.includes(consulta) || consulta.includes(texto)) {
            return respuesta;
        }
    }
    
    // Respuesta estándar de Jarvis
    return "Disculpe, señor. No cuento con esa información en mi base de datos por el momento. Si me lo indica, la incorporaré de inmediato para futuras consultas. Estoy listo para aprenderlo.";
}

// === ENVIAR CONSULTA ===
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = campo.value.trim();
    if (!texto) return;
    
    // Mensaje del usuario
    agregarMensaje(texto, 'usuario');
    campo.value = '';
    
    // Mensaje de procesamiento
    const procesando = agregarMensaje("Procesando consulta... 🧠", 'jarvis');
    procesando.querySelector('.burbuja').classList.add('pensando');
    
    // Respuesta con ritmo natural
    setTimeout(() => {
        procesando.remove();
        const respuesta = obtenerRespuesta(texto);
        agregarMensaje(respuesta, 'jarvis');
    }, 900);
});

// === MENSAJE DE BIENVENIDA INICIAL ===
agregarMensaje(
    "Sistema J.A.R.V.I.S. activo y funcionando al 100%. Todos los sistemas operativos en orden. Es un placer saludarlo, señor. ¿En qué puedo servirle hoy?",
    "jarvis"
);
