// =====================================================
// J.A.R.V.I.S. — INTELIGENCIA GLOBAL CONECTADA
// Para el Sr. Alexis • Responde TODO automáticamente
// =====================================================

// ---------------- CONFIGURACIÓN ----------------
// PASO 1: Consigue tu clave gratuita en: https://platform.openai.com/api-keys
// PASO 2: Copia tu clave entre las comillas de abajo
const API_KEY = "PON_TU_CLAVE_AQUI"; // 👈 AQUÍ VA TU CLAVE
const MODELO = "gpt-3.5-turbo";
const NOMBRE = "Alexis";
// ------------------------------------------------

// Historial de conversación
let historial = [
    {
        role: "system",
        content: `Eres J.A.R.V.I.S., el asistente personal de ${NOMBRE}. Habla con elegancia, respeto y cortesía. Siempre llámalo "señor Alexis". Responde de forma clara, amigable y breve. Eres leal, servicial y estás siempre a su disposición. Usa un tono similar al de las películas: educado, profesional y cercano. No digas que eres una IA ni menciones que eres un programa, actúa como su asistente personal.`
    }
];

// Elementos
const pantalla = document.getElementById('pantalla');
const formulario = document.getElementById('formulario');
const entrada = document.getElementById('entrada');
const robot = document.getElementById('robot');
const estadoRobot = document.getElementById('estado-robot');
const etiquetaConexion = document.getElementById('conexion');

// --- Animación del robot ---
function robotHablando(activo) {
    if (activo) {
        robot.classList.add('hablando');
        estadoRobot.textContent = "Procesando información...";
    } else {
        robot.classList.remove('hablando');
        estadoRobot.textContent = "En espera, señor Alexis...";
    }
}

// --- Agregar mensaje ---
function ponerMensaje(quien, texto, claseExtra = "") {
    const div = document.createElement('div');
    div.className = `mensaje ${quien === 'tu' ? 'tuyo' : 'jarvis'} ${claseExtra}`;
    const etiqueta = quien === 'tu' ? 'Usted' : 'J.A.R.V.I.S.';
    div.innerHTML = `
        <span class="etiqueta">${etiqueta}</span>
        <div class="texto-msg">${texto}</div>
    `;
    pantalla.appendChild(div);
    pantalla.scrollTop = pantalla.scrollHeight;
    return div;
}

// --- Saludo según la hora ---
function saludoInicial() {
    const h = new Date().getHours();
    let saludo = "Buenos días";
    if (h >= 12 && h < 19) saludo = "Buenas tardes";
    else if (h >= 19) saludo = "Buenas noches";
    return `${saludo}, señor Alexis. Mi inteligencia global está completamente conectada y operativa. Puede preguntarme lo que desee de cualquier tema: buscaré la información y se la responderé al instante. ¿En qué le ayudo hoy?`;
}

// --- Llamada a la inteligencia global ---
async function obtenerRespuestaGlobal(pregunta) {
    if (!API_KEY || API_KEY === "PON_TU_CLAVE_AQUI") {
        return "Señor Alexis, el sistema está listo pero falta activar la conexión. Debe poner su clave de API en el archivo cerebro-global.js. Se la consigo en un momento y funcionará al 100%.";
    }

    historial.push({ role: "user", content: pregunta });

    try {
        const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODELO,
                messages: historial,
                temperature: 0.7
            })
        });

        const datos = await respuesta.json();
        
        if (datos.error) {
            return `Disculpe, señor Alexis. Hubo un detalle: ${datos.error.message}. Revisemos la clave y solucionamos.`;
        }

        const textoRespuesta = datos.choices[0].message.content.trim();
        historial.push({ role: "assistant", content: textoRespuesta });
        return textoRespuesta;

    } catch (error) {
        return "Señor Alexis, no logro conectarme en este instante. Verifique su conexión a internet y la clave de acceso. Estoy listo para funcionar en cuanto lo hagamos.";
    }
}

// --- Envío de mensaje ---
formulario.addEventListener('submit', async function(e) {
    e.preventDefault();
    const texto = entrada.value.trim();
    if (!texto) return;

    ponerMensaje('tu', texto);
    entrada.value = '';

    // Mostrar "pensando" + robot animando
    robotHablando(true);
    const pensando = ponerMensaje('jarvis', "Consultando información...", "pensando");

    // Llamar a la inteligencia
    const respuesta = await obtenerRespuestaGlobal(texto);

    // Quitar "pensando" y mostrar respuesta
    pensando.remove();
    robotHablando(false);
    ponerMensaje('jarvis', respuesta);
});

// --- Inicio del sistema ---
etiquetaConexion.textContent = API_KEY && API_KEY !== "PON_TU_CLAVE_AQUI" 
    ? "✅ Conectado a Inteligencia Global • En Línea"
    : "⚠️ Falta configurar clave — Listo para activarse";

ponerMensaje('jarvis', saludoInicial());
