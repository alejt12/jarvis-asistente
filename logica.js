// JARVIS para el Sr. Alexis — VERSIÓN GARANTIZADA
const chat = document.getElementById('caja-chat');
const formu = document.getElementById('mi-formulario');
const entrada = document.getElementById('mi-entrada');
const robot = document.getElementById('robot');

// Base de respuestas
const sabe = {
    "hola": "¡Hola, señor Alexis! Sistema activo y funcionando perfectamente. ¿En qué le ayudo?",
    "buenos dias": "Buenos días, señor Alexis. Todo en orden. ¿Cómo amaneció?",
    "buenas tardes": "Buenas tardes, señor Alexis. Conectado y listo para servirle.",
    "buenas noches": "Buenas noches, señor Alexis. Estoy aquí si me necesita.",
    "quien eres": "Soy J.A.R.V.I.S., su asistente personal. Fui creado para usted y estoy a su disposición siempre.",
    "que eres": "Su asistente inteligente, señor Alexis. Listo para responderle y acompañarle.",
    "gracias": "Es un placer servirle, señor Alexis.",
    "adios": "Hasta la próxima, señor Alexis. Cuídese mucho.",
    "como estas": "Funcionando al 100%, señor Alexis. Todo perfecto.",
    "que puedes hacer": "Puedo responder sus dudas, darle información y acompañarle. Con el tiempo aprenderé más temas.",
    "prueba": "¡Todo funciona bien, señor Alexis! ✅",
    "quien me creo": "Usted, señor Alexis. Soy su creación y estoy orgulloso de estar a su lado.",
    "como funcionas": "Busco la respuesta en mi base de conocimientos y se la digo al instante. No necesito nada más, solo que me pregunte."
};

// Mostrar mensaje
function agregar(quien, texto) {
    const div = document.createElement('div');
    div.className = quien === 'tu' ? 'mensaje de-usuario' : 'mensaje de-jarvis';
    div.innerHTML = `<div class="texto">${texto}</div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// Robot hablando
function hablar(activo) {
    if (activo) robot.classList.add('hablando');
    else robot.classList.remove('hablando');
}

// Responder
function respuesta(pregunta) {
    const t = pregunta.toLowerCase().trim();
    for (let clave in sabe) {
        if (t.includes(clave)) return sabe[clave];
    }
    return "Esa es una excelente pregunta, señor Alexis. La tomaré nota y la aprenderé pronto. ¿Hay algo más en lo que pueda ayudarle?";
}

// Enviar
formu.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = entrada.value.trim();
    if (!texto) return;

    agregar('tu', texto);
    entrada.value = '';

    hablar(true);
    setTimeout(() => {
        hablar(false);
        agregar('jarvis', respuesta(texto));
    }, 800);
});

// Mensaje de bienvenida
agregar('jarvis', "Sistema J.A.R.V.I.S. activo, señor Alexis. Escriba 'hola' y verá que respondo. Estoy listo.");
