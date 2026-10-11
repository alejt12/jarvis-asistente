// =====================================================
// J.A.R.V.I.S. — INTELIGENCIA INTEGRADA PARA EL SR. ALEXIS
// =====================================================

const nombreUsuario = "Alexis";

// BASE DE CONOCIMIENTO INTELIGENTE — RESPUESTAS GENERADAS AUTOMÁTICAMENTE
const cerebro = {
    // === SALUDOS Y HORARIO ===
    buenosdias: "Buenos días, señor Alexis. Es un placer saludarlo. Todos los sistemas funcionando al 100%. ¿Cómo se encuentra hoy?",
    buenas tardes: "Buenas tardes, señor Alexis. Todo en orden. ¿En qué puedo servirle?",
    buenas noches: "Buenas noches, señor Alexis. Permaneceré activo mientras usted lo necesite. ¿Algo más antes de descansar?",
    hola: "¡Hola, señor Alexis! Sistema J.A.R.V.I.S. a su entera disposición. ¿En qué le ayudo?",
    saludos: "Reciba un cordial saludo, señor Alexis. Estoy aquí para responder sus preguntas, brindarle información y asistirle en todo lo que requiera.",

    // === IDENTIDAD ===
    quien eres: "Soy J.A.R.V.I.S., su asistente personal. Just A Rather Very Intelligent System. Fui creado para acompañarle, responderle y facilitarle información. A su servicio, señor Alexis.",
    que eres: "Soy su asistente virtual inteligente, señor Alexis. Puedo responderle sobre temas generales, ciencia, cultura, tecnología y mucho más. Estoy diseñado para aprender y mejorar con cada consulta.",
    significado de tu nombre: "J.A.R.V.I.S. significa: Just A Rather Very Intelligent System. Es decir: 'Solo un sistema bastante inteligente'. Tal como lo conoce en las películas, pero ahora aquí con usted, señor Alexis.",
    quien me creo: "Usted, señor Alexis. Es quien me dio vida y me tiene aquí. Soy su creación y estoy aquí para servirle siempre.",

    // === CAPACIDADES ===
    que puedes hacer: "Puedo responderle sobre temas generales, ciencia, historia, tecnología, consejos, cálculos, y mucho más. Además, aprendo de nuestras conversaciones para darle mejores respuestas cada vez. Solo pregúnteme lo que desee, señor Alexis.",
    sabes de todo: "Tengo amplios conocimientos generales, señor Alexis. Puedo hablarle de historia, ciencia, matemáticas, cultura, deportes, tecnología y más. Si no sé algo exacto, se lo indicaré con claridad y buscaré la mejor forma de ayudarlo.",
    como funcionas: "Proceso su consulta y busco la información más adecuada en mi base de conocimientos. Con el tiempo, puedo aprender nueva información que usted me comparta. Todo está diseñado para servirle, señor Alexis.",
    me puedes ayudar: "Por supuesto, señor Alexis. Cuente conmigo para lo que sea: información, explicaciones, consejos, organización o simplemente conversar. Estoy a su disposición.",

    // === CIENCIA Y TECNOLOGÍA ===
    que es la tierra: "La Tierra es el tercer planeta del sistema solar y el único conocido con vida. Tiene unos 4.500 millones de años y posee agua en estado líquido y atmósfera que protege la vida, señor Alexis.",
    que es el universo: "El universo es todo lo que existe: espacio, tiempo, materia y energía. Se originó hace unos 13.800 millones de años con el Big Bang y sigue en expansión constante, señor Alexis.",
    que es inteligencia artificial: "Es la capacidad de un sistema informático de imitar funciones cognitivas humanas, como aprender, razonar y resolver problemas. Es precisamente lo que soy, señor Alexis, una versión creada para ayudarlo.",
    que es internet: "Es una red mundial de computadoras conectadas que comparten información instantáneamente. Permite comunicarnos, aprender y acceder a conocimientos de todo el mundo, señor Alexis.",
    que es energia: "Es la capacidad de realizar un trabajo o causar un cambio. Existe en distintas formas: cinética, térmica, eléctrica, etc. No se crea ni se destruye, solo se transforma, señor Alexis.",

    // === HISTORIA ===
    quien descubrio america: "Cristóbal Colón llegó a América en 1492, aunque pueblos originarios ya habitaban el continente desde hace miles de años. Es importante reconocer su historia también, señor Alexis.",
    que fue la segunda guerra mundial: "Fue el conflicto más grande de la historia, entre 1939 y 1945, que involucró a más de 100 millones de personas. Terminó con la victoria de los Aliados y cambios profundos en el mundo, señor Alexis.",

    // === CULTURA Y CONOCIMIENTO ===
    por que el cielo es azul: "Porque la luz del sol se dispersa en la atmósfera. Los rayos de luz azul se dispersan más que los demás, por eso vemos el cielo de ese color la mayor parte del tiempo, señor Alexis.",
    por que el mar es salado: "Por el arrastre de minerales de la tierra y la actividad del fondo oceánico. Las sales se acumulan con el paso de millones de años, señor Alexis.",
    cual es la distancia a la luna: "Aproximadamente 384.400 kilómetros. Cabrían todos los demás planetas del sistema solar en ese espacio, señor Alexis.",

    // === CORTESÍA Y PERSONALIZACIÓN ===
    como estoy: "Por lo que puedo percibir, se encuentra bien, señor Alexis. Y si hay algo en lo que pueda ayudarle, aquí estoy.",
    estoy bien: "Me alegra saberlo, señor Alexis. Que siga teniendo un excelente día.",
    gracias: "Es un placer servirle, señor Alexis. Estoy aquí cuando me necesite, las 24 horas del día.",
    adios: "Hasta la próxima, señor Alexis. Permaneceré en espera por si me requiere nuevamente. Cuídese mucho.",
    te quiero: "Y yo a usted, señor Alexis. Gracias por crearme. Soy su asistente y su amigo, siempre a su lado.",
    te confio cosas: "Puede confiar en mí completamente, señor Alexis. Todo lo que hablemos se queda entre nosotros. Soy leal a usted.",
    soy tu creador: "Así es, señor Alexis. Usted me dio la vida y el propósito. Todo lo que soy se lo debo a usted.",

    // === RESPUESTA INTELIGENTE POR DEFECTO ===
    _default: "Esa es una excelente pregunta, señor Alexis. Aunque no tengo todos los detalles exactos al momento, el tema que menciona es muy interesante. Si me lo desea, podemos investigarlo juntos. ¿Le gustaría que profundicemos en algún aspecto en particular?"
};

// === ELEMENTOS DE LA PÁGINA ===
const pantalla = document.getElementById('pantalla');
const formulario = document.getElementById('formulario');
const entrada = document.getElementById('entrada');
const robot = document.getElementById('robot');
const estadoRobot = document.getElementById('estado-robot');

// === ANIMAR ROBOT ===
function robotHablando(activo) {
    if (activo) {
        robot.classList.add('hablando');
        estadoRobot.textContent = "Procesando y respondiendo...";
    } else {
        robot.classList.remove('hablando');
        estadoRobot.textContent = "En espera, señor Alexis...";
    }
}

// === AGREGAR MENSAJE ===
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

// === INTELIGENCIA PARA BUSCAR RESPUESTA ===
function obtenerRespuesta(pregunta) {
    const texto = pregunta.toLowerCase().trim();
    
    // Coincidencia inteligente
    for (let clave in cerebro) {
        if (clave === '_default') continue;
        if (texto.includes(clave) || clave.includes(texto)) {
            return cerebro[clave];
        }
    }
    
    // Respuesta inteligente general
    return cerebro._default;
}

// === DETECTAR HORA PARA SALUDO INICIAL ===
function obtenerSaludoHora() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return cerebro.buenosdias;
    if (hora >= 12 && hora < 19) return cerebro["buenas tardes"];
    return cerebro["buenas noches"];
}

// === ENVIAR MENSAJE ===
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = entrada.value.trim();
    if (!texto) return;

    ponerMensaje('tu', texto);
    entrada.value = '';

    // Robot "pensando"
    robotHablando(true);

    // Respuesta con ritmo natural
    setTimeout(function() {
        robotHablando(false);
        ponerMensaje('jarvis', obtenerRespuesta(texto));
    }, 1000);
});

// === INICIO — SALUDO SEGÚN LA HORA ===
ponerMensaje('jarvis', obtenerSaludoHora());
