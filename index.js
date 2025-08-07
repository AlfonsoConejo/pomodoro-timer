let listaPomodoros = JSON.parse(localStorage.getItem('listaPomodoros')) || '';

if(listaPomodoros === '' || listaPomodoros.length === 0){
    let mainDiv = document.getElementById('main');
    let mensajeSinPomodoros = document.getElementById("mensajeSinPomodoros");
} else {
    
}

//Obtenemos del DOM los valores para manipular la ventana modal de "Nueva sesión"
const botonNuevaSesion = document.getElementById('btnNuevaSesion');
const botonCerrarPanel = document.getElementById('cerrarPanel');
const panel = document.getElementById('formularioNuevoPomodoro');



//Ejecutamos una acción al hacer click sobre el botón de "Nueva sesión"
botonNuevaSesion.addEventListener('click', ()=>{
    panel.classList.add('abierto');
});

//Ejecutamos acción al cerrar la ventana modal de "Nueva sesión"
botonCerrarPanel.addEventListener('click', ()=>{
    panel.classList.remove('abierto');
});

//Cerramos la modal el presionar ESC
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
    panel.classList.remove('abierto');
  }
});