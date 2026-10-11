// =====================================================
// J.A.R.V.I.S. — LISTO PARA EL SR. ALEXIS
// =====================================================

const API_KEY = "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";
const MODELO = "gpt-3.5-turbo";
const NOMBRE = "Alexis";

let historial = [
    {
        role: "system",
        content: `Eres J.A.R.V.I.S., el asistente personal de ${NOMBRE}. Habla con elegancia, respeto y cortesía. Siempre llámalo "señor Alexis". Responde de forma clara, amigable y breve. Eres leal, servicial y estás siempre a su disposición. Usa un tono similar al de las películas: educado, profesional y cercano.`
    }
];

const pantalla = document.getElementById('pantalla');
const formulario = document.getElementById('formulario');
const entrada = document.getElementById('entrada');
const robot = document.getElementById('robot');
const estadoRobot = document.getElementById('estado-robot');
const etiquetaConexion = document.getElementById('conexion');

function robotHablando(activo) {
    if (activo) {
        robot.classList.add('hablando');
        estadoRobot.textContent = "Procesando...";
    } else {
        robot.classList.remove('hablando');
        estadoRobot.textContent = "En espera, señor Alexis...";
    }
}

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

function saludoInicial() {
    const h = new Date().getHours();
    let saludo = "Buenos días";
    if (h >= 12 && h < 19) saludo = "Buenas tardes";
    else if (h >= 19) saludo = "Buenas noches";
    return `${saludo}, señor Alexis. Todo el sistema está activo y conectado. Puede preguntarme lo que desee de cualquier tema y responderé de inmediato. ¿En qué le ayudo hoy?`;
}

async function obtenerRespuesta(pregunta) {
    historial.push({ role: "user", content: pregunta });

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
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

        const datos = await res.json();
        if (datos.error) return `Disculpe, señor Alexis. ${datos.error.message}`;
        
        const texto = datos.choices[0].message.content.trim();
        historial.push({ role: "assistant", content: texto });
        return texto;

    } catch {
        return "Señor Alexis, hay un problema de conexión. Verifique su internet y vuelva a intentar, por favor.";
    }
}

formulario.addEventListener('submit', async e => {
    e.preventDefault();
    const texto = entrada.value.trim();
    if (!texto) return;

    ponerMensaje('tu', texto);
    entrada.value = '';

    robotHablando(true);
    const pensando = ponerMensaje('jarvis', "Consultando...", "pensando");

    const respuesta = await obtenerRespuesta(texto);

    pensando.remove();
    robotHablando(false);
    ponerMensaje('jarvis', respuesta);
});

etiquetaConexion.textContent = "✅ Conectado • Inteligencia Activa";
ponerMensaje('jarvis', saludoInicial());
