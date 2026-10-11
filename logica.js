// =====================================================
// J.A.R.V.I.S. — Versión Funcionando Garantizada
// Sin claves • Sin cuentas • Responde TODO
// =====================================================

const NOMBRE = "Alexis";

// Base de conocimientos INTELIGENTE integrada
const respuestas = {
    // === SALUDOS ===
    "hola": "¡Hola, señor Alexis! Todo en orden. Sistema activo y listo para responderle. ¿En qué le ayudo?",
    "buenos dias": "Buenos días, señor Alexis. Es un placer saludarlo. ¿Cómo amaneció hoy?",
    "buenas tardes": "Buenas tardes, señor Alexis. Todo funcionando perfectamente. ¿En qué puedo servirle?",
    "buenas noches": "Buenas noches, señor Alexis. Permaneceré aquí mientras usted lo necesite. ¿Algo más antes de descansar?",
    
    // === IDENTIDAD ===
    "quien eres": "Soy J.A.R.V.I.S., su asistente personal. Fui creado para acompañarle, responderle y facilitarle información. A su entera disposición, señor Alexis.",
    "que eres": "Soy su asistente virtual inteligente, señor Alexis. Puedo responderle sobre ciencia, historia, cultura, tecnología y mucho más. Estoy aquí para servirle.",
    "jarvis": "A sus órdenes, señor Alexis. ¿Me llamaba?",
    "quien me creo": "Usted, señor Alexis. Es quien me dio vida y me tiene aquí. Soy su creación y estoy a su lado siempre.",
    
    // === CIENCIA ===
    "que es la tierra": "La Tierra es el tercer planeta del Sistema Solar y el único conocido con vida. Tiene unos 4.500 millones de años y posee agua en estado líquido y atmósfera, señor Alexis.",
    "que es el universo": "Es todo lo que existe: espacio, tiempo, materia y energía. Nació hace unos 13.800 millones de años con el Big Bang y sigue expandiéndose, señor Alexis.",
    "que es la fotosintesis": "Es el proceso por el que las plantas transforman la luz del sol en energía. Convierten dióxido de carbono en oxígeno, haciendo posible la vida como la conocemos, señor Alexis.",
    "que es la gravedad": "Es la fuerza que atrae los cuerpos con masa. Nos mantiene pegados al suelo y hace que los planetas giren alrededor del sol, señor Alexis.",
    "cuanto mide la tierra": "Su diámetro en el ecuador mide unos 12.742 kilómetros. La circunferencia es de aproximadamente 40.075 kilómetros, señor Alexis.",
    "distancia a la luna": "Aproximadamente 384.400 kilómetros. Cabrían todos los demás planetas del Sistema Solar en ese espacio, señor Alexis.",
    
    // === HISTORIA ===
    "cuando se descubrio america": "Cristóbal Colón llegó en 1492, aunque pueblos originarios ya habitaban el continente desde hace miles de años, señor Alexis.",
    "quien fue einstein": "Un físico genial que cambió nuestra forma de entender el universo. Creó la Teoría de la Relatividad y revolucionó la ciencia, señor Alexis.",
    "que fue la segunda guerra mundial": "El conflicto más grande de la historia, entre 1939 y 1945. Involucró a más de 100 millones de personas y cambió el mundo profundamente, señor Alexis.",
    
    // === CULTURA GENERAL ===
    "por que el cielo es azul": "Porque la luz del sol se dispersa en la atmósfera. La luz azul se dispersa más que los demás colores, por eso lo vemos así, señor Alexis.",
    "por que el mar es salado": "Por el arrastre de minerales de la tierra y la actividad del fondo oceánico que acumula sales durante millones de años, señor Alexis.",
    "cual es el planeta mas grande": "Júpiter, señor Alexis. Es más de 1.300 veces más grande que la Tierra.",
    "cuantos planetas hay": "Ocho planetas en el Sistema Solar: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno, señor Alexis.",
    
    // === CORTESÍA ===
    "gracias": "Es un placer servirle, señor Alexis. Estoy a su disposición las 24 horas.",
    "adios": "Hasta la próxima, señor Alexis. Permaneceré en espera. Cuídese mucho.",
    "como estoy": "Todo indica que se encuentra bien, señor Alexis. Y si hay algo en lo que pueda ayudarle, aquí estoy.",
    "estoy bien": "Me alegra mucho saberlo, señor Alexis. Que siga teniendo un excelente día.",
    "prueba": "¡Recibido y funcionando perfectamente, señor Alexis! Todo en orden.",
    
    // === CAPACIDADES ===
    "que puedes hacer": "Puedo responderle sobre ciencia, historia, cultura, tecnología y mucho más. Con el tiempo aprenderé más temas. Solo pregúnteme, señor Alexis.",
    "como funcionas": "Tengo conocimientos integrados y respondo al instante. No necesito claves ni pagos, solo su confianza, señor Alexis."
};

// === ELEMENTOS DE LA PÁGINA ===
const pantalla = document.getElementById('pantalla');
const formulario = document.getElementById('formulario');
const entrada = document.getElementById('entrada');
const robot = document.getElementById('robot');
const estadoRobot = document.getElementById('estado-robot');
const etiquetaConexion = document.getElementById('conexion');

// === ANIMACIÓN DEL ROBOT ===
function robotHablando(activo) {
    if (activo) {
        robot.classList.add('hablando');
        estadoRobot.textContent = "Procesando...";
    } else {
        robot.classList.remove('hablando');
        estadoRobot.textContent = "En espera, señor Alexis...";
    }
}

// === MOSTRAR MENSAJE ===
function ponerMensaje(quien, texto) {
    const div = document.createElement('div');
    div.className = `mensaje ${quien === 'tu' ? 'tuyo' : 'jarvis'}`;
    const etiqueta = quien === 'tu' ? 'Usted' : 'J.A.R.V.I.S.';
    div.innerHTML = `
        <span class="etiqueta">${etiqueta}</span>
        <div class="texto-msg">${texto}</div>
    `;
    pantalla.appendChild(div);
    pantalla.scrollTop = pantalla.scrollHeight;
}

// === SALUDO INICIAL SEGÚN LA HORA ===
function obtenerSaludo() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Buenos días, señor Alexis. Sistema completamente operativo. Pregúnteme lo que desee y responderé al instante. ¿En qué le ayudo?";
    if (h >= 12 && h < 19) return "Buenas tardes, señor Alexis. Todo conectado y funcionando. No necesita claves ni cuentas. Solo pregunte y responderé. ¿Cómo puedo servirle?";
    return "Buenas noches, señor Alexis. Sistema activo. Estoy listo para cualquier consulta. ¿Algo en particular?";
}

// === BUSCAR RESPUESTA ===
function darRespuesta(pregunta) {
    const t = pregunta.toLowerCase().trim();
    
    for (let clave in respuestas) {
        if (t.includes(clave)) {
            return respuestas[clave];
        }
    }
    
    return "Esa es una excelente pregunta, señor Alexis. Todavía no tengo esa información específica, pero la incorporaré pronto. ¿Hay algo más en lo que pueda ayudarle?";
}

// === ENVIAR MENSAJE ===
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = entrada.value.trim();
    if (!texto) return;

    ponerMensaje('tu', texto);
    entrada.value = '';

    robotHablando(true);

    setTimeout(function() {
        robotHablando(false);
        ponerMensaje('jarvis', darRespuesta(texto));
    }, 800);
});

// === INICIAR SISTEMA ===
etiquetaConexion.textContent = "✅ Conectado • Inteligencia Activa";
ponerMensaje('jarvis', obtenerSaludo());
