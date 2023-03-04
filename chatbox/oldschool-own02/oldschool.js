let voz = null;

/* La primera reproducción será inmediata */
window.listado = false;

/* Obtenemos los parámetros de la URL del marco padre */
var searchParams = new URLSearchParams((new URL(document.referrer)).search);
for (let p of searchParams) {
  console.log(p);
}

/* Si hemos proporcionado el parámetro adecuado activamos la voz */
if (searchParams.has("voz") === true) {
  switch(searchParams.get("voz")) {
    case "google":
      if (searchParams.has("key") === true) {
        var sonido = false;
        const google_key = searchParams.get("key");
        document.addEventListener('onEventReceived', function(obj) {
          console.log(obj);
          try {
            // obj will contain information about the event
            if (obj.detail) {
              let plataforma = obj.detail.platform && obj.detail.platform.split('_')[0];
              if (plataforma != obj.detail.platform) {
                plataforma = ' desde ' + plataforma;
              }
              console.log('Plataforma: ', plataforma);
              if (obj.detail.command == 'PRIVMSG' || obj.detail.command == 'ChatMessage' || obj.detail.command == 'youtube#liveChatMessage') {
                let mensaje = obj.detail.from.replace(/_/g, " ") + ' dice' + plataforma + '... ' + obj.detail.body;
                fetch(
                  "https://content-texttospeech.googleapis.com/v1beta1/text:synthesize?alt=json&key=" + google_key,
                  {
                    "body": JSON.stringify({
                      audioConfig: {
                        audioEncoding: "LINEAR16",
                        pitch: 0,
                        speakingRate: 1,
                      },
                      input: {
                        text: mensaje,
                      },
                      voice: {
                        languageCode: "es-ES",
                        name: "es-ES-Wavenet-C",
                      },
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    "method": "POST",
                  }
                )
                  .then(e => e.json())
                  .then(datos => {
		                sonido = new Audio("data:audio/wav;base64," + datos.audioContent);
                  	sonido.onended = () => {
                    	let siguiente = window.listado.shift();
                      /* Si hay elementos en cola reproducimos la siguiente canción */
                      if (siguiente !== undefined) {
                        siguiente.play();
                      } else {
                        /* Si no quedan más finalizamos la reproducción */
                        window.listado = false;
                      }
                    };
                  	/* Detectamos la primera reproducción */
                  	if (window.listado === false) {
                      /* Creamos una lista de espera vacía y reproducimos el sonido actual */
                      window.listado = [];
                      sonido.play();
                    } else {
                      /* Agregamos el sonido a la cola de reproducción */
                      window.listado.push(sonido);
                    }
                	});
                console.log('Leido', mensaje)
              } else {
                console.log(obj.detail);
              }
            }
          } catch(e) { document.write("<p style='color:red'>" + JSON.stringify(e.message) + "</p>"); console.log(e); }
        });
      }
      break;
        
    
    case "interna":
      function recargar_voces() {
        console.log(window.speechSynthesis.getVoices());
        //document.write("<p style='color: yellow'>" + window.speechSynthesis.getVoices().length + "</p>");
        window.speechSynthesis.getVoices().forEach((elem) => {
          //document.write("<p style='color: yellow'>" + elem.voiceURI + "</p>");
          if (elem.voiceURI == 'Google español') {
            voz = elem;
            console.log("Elegido", voz)
          }
        });
      }

      recargar_voces();
      window.speechSynthesis.cancel();
      speechSynthesis.onvoiceschanged = recargar_voces;

      document.addEventListener('onEventReceived', function(obj) {
        try {
          // obj will contain information about the event
          if (obj.detail) {
            let plataforma = obj.detail.platform && obj.detail.platform.split('_')[0];
            if (plataforma != obj.detail.platform) {
              plataforma = ' desde ' + plataforma;
            }
            console.log('Plataforma: ', plataforma);
            if (obj.detail.command == 'PRIVMSG' || obj.detail.command == 'ChatMessage' || obj.detail.command == 'youtube#liveChatMessage') {
              let mensaje = obj.detail.from + ' dice' + plataforma + '... ' + obj.detail.body;
              let leer = new SpeechSynthesisUtterance(mensaje);
              leer.volume = 1;
              if (voz) leer.voice = voz;
              window.speechSynthesis.speak(leer);
              console.log('Leido', mensaje)
            } else {
              console.log(obj.detail);
            }
          }
        } catch(e) { console.log(e); }
      });
      break;

    default:
      console.log("Voces implementadas: 'interna', 'google'");
  }
} else {
  console.log("Debe indicar una voz como parámetro de URL");
}
// Please use event listeners to run functions.
document.addEventListener('onLoad', function(obj) {
	// obj will be empty for chat widget
	// this will fire only once when the widget loads
});

let plataformas = {
  "twitch_account": 'desde Twitch',
  "youtube_account": 'desde YouTube',
  "facebook_account": 'desde Facebook',
};

/* Innecesario */
//document.addEventListener('onEventReceived', evento);

/* Evitamos fugas de memoria liberando los elementos que desaparecen */
document.addEventListener('animationend', (event) => {
  /* Apuntamos al objetivo del evento */
  let elem = event.target;
  /* Eliminamos el elemento si éste termina con la opacidad a 0 */
  if (window.getComputedStyle(elem).getPropertyValue("opacity") == 0) {
    /* Desvinculamos el DOM interno */
    elem.innerHTML = '';
    /* Desvinculamos el elemento del elemento padre */
    elem.parentNode.removeChild(elem);
  }
});