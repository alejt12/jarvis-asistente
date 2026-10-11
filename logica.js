<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JARVIS - Chat</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
        body { background: #0a1929; color: #e6f1ff; padding: 20px; max-width: 800px; margin: 0 auto; }
        .chat-container { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .message { padding: 12px 16px; border-radius: 12px; max-width: 85%; line-height: 1.5; }
        .user { background: #0e3a32; margin-left: auto; border-right: 3px solid #00ff9d; }
        .jarvis { background: #122c47; margin-right: auto; border-left: 3px solid #00ccff; }
        .input-area { display: flex; gap: 10px; }
        input { flex: 1; padding: 12px 16px; border: none; border-radius: 8px; background: #1a2f47; color: white; font-size: 16px; }
        button { padding: 12px 24px; border: none; border-radius: 8px; background: #00ccff; color: #000; font-weight: bold; cursor: pointer; transition: 0.2s; }
        button:hover { background: #00e0ff; }
    </style>
</head>
<body>

    <h1>JARVIS 🤖</h1>
    <div class="chat-container" id="chatBox"></div>
    
    <div class="input-area">
        <input type="text" id="mensajeInput" placeholder="Escribe tu mensaje a JARVIS..." onkeypress="if(event.key === 'Enter') enviarMensaje()">
        <button onclick="enviarMensaje()">Enviar</button>
    </div>

<script>
const chatBox = document.getElementById('chatBox');
const mensajeInput = document.getElementById('mensajeInput');

// Historial para evitar repeticiones
let historialMensajes = [];

// Respuestas inteligentes de JARVIS
function obtenerRespuestaJARVIS(textoUsuario) {
    const mensaje = textoUsuario.toLowerCase();

    if (mensaje.includes('hola') || mensaje.includes('noches') || mensaje.includes('buenos días')) {
        return "¡Buenas noches! 🌙 Es un gusto saludarte. ¿En qué puedo ayudarte hoy?";
    }
    if (mensaje.includes('ayuda') || mensaje.includes('qué haces')) {
        return "Estoy aquí para ayudarte 😊. Podemos conversar, resolver dudas o planear cosas. ¿Qué te gustaría hacer?";
    }
    if (mensaje.includes('me encanta conversar contigo')) {
        return "¡A mí también me encanta conversar contigo! 🤩 Siempre es un gusto hablar contigo. Cuéntame, ¿cómo ha ido tu día?";
    }
    if (mensaje.includes('gracias')) {
        return "¡De nada! 😊 Para eso estoy. ¿Hay algo más en lo que te pueda apoyar?";
    }
    
    // Respuesta general si no coincide con ninguna
    return `Entiendo lo que dices: "${textoUsuario}". Cuéntame más, ¿en qué te puedo ayudar?`;
}

function enviarMensaje() {
    const texto = mensajeInput.value.trim();
    if (!texto) return;

    // Evitar mensajes duplicados/vacíos
    if (historialMensajes.includes(texto)) {
        mensajeInput.value = '';
        return;
    }

    // Mostrar mensaje del usuario
    agregarMensaje(texto, 'user');
    historialMensajes.push(texto);

    // Obtener respuesta REAL de JARVIS
    setTimeout(() => {
        const respuesta = obtenerRespuestaJARVIS(texto);
        agregarMensaje(respuesta, 'jarvis');
    }, 600); // Pequeña pausa para que se vea natural

    mensajeInput.value = '';
}

function agregarMensaje(texto, tipo) {
    const div = document.createElement('div');
    div.className = `message ${tipo}`;
    div.innerHTML = tipo === 'user' ? `<strong>Tú:</strong> ${texto}` : `<strong>JARVIS:</strong> ${texto}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
</script>

</body>
</html>
