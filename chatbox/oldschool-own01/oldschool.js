// Please use event listeners to run functions.
document.addEventListener('onLoad', function(obj) {
	// obj will be empty for chat widget
	// this will fire only once when the widget loads
});

/* Inicialmente no hablamos */
let voz = null;

/* Buscamos la voz que deseamos (la de Google) */
function recargar_voces() {
	console.log(window.speechSynthesis.getVoices());
  window.speechSynthesis.getVoices().forEach((elem) => {
    /* Si es la señorita de Google entonces la elegimos */
    if (elem.voiceURI == 'Google español') {
      voz = elem;
    }
  });
}

/* Intentamos obtener las voces disponible y agregamos un gestor para cuando cambien */
recargar_voces();
speechSynthesis.onvoiceschanged = recargar_voces;

/* Cada vez que recibamos un mensaje lo procesaremos para que sea leído */
document.addEventListener('onEventReceived', function(obj) {
  if (obj.detail) {
    /* Obtenemos el nombre de la plataforma de la primera parte del atributo "platform" */
    let plataforma = obj.detail.platform && obj.detail.platform.split('_')[0];
    /* Le agregamos la palabra "desde" antes del nombre de la plataforma */
    if (plataforma != obj.detail.platform) {
      plataforma = ' desde ' + plataforma;
    }
    /* Solo leemos los mensajes de usuarios, no las suscripciones, me gusta, etc */
    if (obj.detail.command == 'PRIVMSG' || obj.detail.command == 'ChatMessage' || obj.detail.command == 'youtube#liveChatMessage') {
      /* Montamos la frase que va a ser leída */
      let mensaje = obj.detail.from + ' dice' + plataforma + '... ' + obj.detail.body;
			let leer = new SpeechSynthesisUtterance(mensaje);
      //leer.volume = 0.3;
      if (voz) leer.voice = voz;
      window.speechSynthesis.speak(leer);
      console.log('Leido', mensaje)
    }
  }
});

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
