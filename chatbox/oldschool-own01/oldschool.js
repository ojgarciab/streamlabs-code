// Please use event listeners to run functions.
document.addEventListener('onLoad', function(obj) {
  // obj will be empty for chat widget
  // this will fire only once when the widget loads
});

document.addEventListener('onEventReceived', function(obj) {
  // obj will contain information about the event
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
