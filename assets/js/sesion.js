import PomodoroManager from "./pomodoro_manager.js";
import utils from "./utils.js";

//Obtenemos el id de la sesión actual abierta
const idSesionActual = localStorage.getItem("sesionActual");

// 🔊 Setup del contexto de audio y almacenamiento de sonidos
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const sonidos = {
  alarm: { path: '../audios/Alarm_clock.wav' },
  water: { path: '../audios/Water_drop.wav' },
  wind:  { path: '../audios/Wind_shrine.wav' }
};

async function loadAudio(key) {
  const res = await fetch(sonidos[key].path);
  const arrayBuffer = await res.arrayBuffer();
  sonidos[key].buffer = await audioCtx.decodeAudioData(arrayBuffer);
}

// Precargamos todos
Promise.all(Object.keys(sonidos).map(loadAudio))
  .catch(err => console.error("Error cargando audio:", err));

function playSound(key) {
  const entry = sonidos[key];
  if (!entry || !entry.buffer) {
    console.warn("Sonido no cargado:", key);
    return;
  }
  const src = audioCtx.createBufferSource();
  src.buffer = entry.buffer;
  src.connect(audioCtx.destination);
  src.start();
}

//VARIABLES GLOBALES

//Lógica para que funcione el temporizador
const botonEstado = document.getElementById("botonEstado");
let estado = botonEstado.dataset.estado;
let timerId = null; // Guardar el interval
let tiempo = 0;     // Tiempo restante en segundos
let tiempoRestanteTemporizador = 0; //Variable auxiliar que guarda el valor restante en caso de pausar el temporizador


// Instanciamos el objeto manager y accedemos a la lista de sesiones
const manager = new PomodoroManager();
const listaSesiones = manager.lista;

// Buscamos la sesión con el id
const sesionActual = listaSesiones.find(
  (sesion) => sesion._id.toString() === idSesionActual
);

if (sesionActual) {
  console.log("Sesión encontrada:", sesionActual);
  const idFondo = Number(sesionActual._fondo);
    
  // Buscamos el objeto cuyo id coincida con el seleccionado
  const fondoEncontrado = utils.arrayFondos.find(fondo => fondo.id === idFondo);
  // Obtenemos la dirección de la imagen, si encontramos el fondo
  const direccionImagen = fondoEncontrado ? fondoEncontrado.location : null;
  //Obtenemos el body y le asignamos el fondo correspondiente
  const cssBody = document.body;
  cssBody.style.backgroundImage = `url(../../${direccionImagen})`;
  cssBody.style.backgroundSize = "cover";      // o "cover" según lo que quieras
  cssBody.style.backgroundRepeat = "no-repeat";
  cssBody.style.backgroundPosition = "center";

  //Mostramos el nombre del pomodoro
  const tituloContainer = document.getElementById("titulo");
  const titulo = sesionActual._nombre;
  tituloContainer.innerHTML = titulo;

  //Obtenemos el día actual del mes
  const fechaActual = new Date();
  const diaDelMes = fechaActual.getDate();
  const fechaDiv = document.getElementById("fecha");

  // Obtener el nombre largo del mes (ej: "Agosto")
  const nombreMes = fechaActual.toLocaleString('es-ES', { month: 'long' });

  // Obtener el nombre corto del mes (ej: "Ago")
  const nombreMesCorto = fechaActual.toLocaleString('es-ES', { month: 'short' });

  fechaDiv.innerHTML = `${diaDelMes} de ${nombreMes}` ;

  //Actualizar hora
  actualizarHora();

  //Mostramos la fase correcta al cargar la página
  const faseActual = sesionActual._fase;
  const tiempoPomodoro = sesionActual._tiempoPomodoro;
  const tiempoDescansoCorto = sesionActual._tiempoDescanso;
  const tiempoDescansoLargo = sesionActual._tiempoDescansoLargo;
  const iteracion = sesionActual._iteracion;

  //Obtenemos el span donde se muestra la iteración
  const iteracionDiv = document.getElementById('iteracionActual');

  
  clearInterval(timerId);
  tiempoRestanteTemporizador = 0;

  //Iniciamos el estado del boton en INICIAR
  botonEstado.dataset.estado = 'iniciar';
  estado = 'iniciar';
  botonEstado.innerText = 'INICIAR';
  actualizarBotonEstadoUI();
  seleccionarDeseleccionarBotones(faseActual);
  cargarReloj(faseActual, tiempoPomodoro, tiempoDescansoCorto, tiempoDescansoLargo);
  aplicarTema(faseActual);
  iteracionDiv.innerHTML = iteracion;
  mostrarReinicioIteraciones(iteracion);

  //Agregamos el event listener a los botones de fase
  const btnPomodoro = document.getElementById('btnPomodoro');
  const btnDescansoCorto = document.getElementById('btnDescansoCorto');
  const btnDescansoLargo = document.getElementById('btnDescansoLargo');

  btnPomodoro.addEventListener("click", () => {
    
    //Si el botón no está seleccionado
    if (!btnPomodoro.classList.contains("activo")){
      const datosSesion = manager.getPomodoroActual();
      manager.actualizarFase(idSesionActual, "pomodoro");

      clearInterval(timerId);
      tiempoRestanteTemporizador = 0;
      botonEstado.dataset.estado = 'iniciar';
      estado = 'iniciar';
      botonEstado.innerText = 'INICIAR';
      actualizarBotonEstadoUI();
      seleccionarDeseleccionarBotones(datosSesion._fase);
      cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
      aplicarTema(datosSesion._fase);
      }

  });

  btnDescansoCorto.addEventListener("click", () => {

    //Si el botón no está seleccionado
    if (!btnDescansoCorto.classList.contains("activo")){
      const datosSesion = manager.getPomodoroActual();
      manager.actualizarFase(idSesionActual, "descansoCorto");

      clearInterval(timerId);
      tiempoRestanteTemporizador = 0;
      botonEstado.dataset.estado = 'iniciar';
      estado = 'iniciar';
      botonEstado.innerText = 'INICIAR';
      actualizarBotonEstadoUI();
      seleccionarDeseleccionarBotones(datosSesion._fase);
      cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
      aplicarTema(datosSesion._fase);
    }

  });

  btnDescansoLargo.addEventListener("click", () => {

    //Si el botón no está seleccionado
    if (!btnDescansoLargo.classList.contains("activo")){
      const datosSesion = manager.getPomodoroActual();
      manager.actualizarFase(idSesionActual, "descansoLargo");

      clearInterval(timerId);
      tiempoRestanteTemporizador = 0;
      botonEstado.dataset.estado = 'iniciar';
      estado = 'iniciar';
      botonEstado.innerText = 'INICIAR';
      actualizarBotonEstadoUI();
      seleccionarDeseleccionarBotones(datosSesion._fase);
      cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
      aplicarTema(datosSesion._fase);
    }

  });


  //Añadimos event listener al boton que controla los estados del temporizador
  botonEstado.addEventListener('click', () => {
    const datosSesion = manager.getPomodoroActual();
  
    if(tiempoRestanteTemporizador > 0){ //Si el tiempo restante es igual a cero
      tiempo = tiempoRestanteTemporizador;
    }else{
      // Determinar fase y tiempo del contador
      if (datosSesion._fase === 'pomodoro') {
        tiempo = datosSesion._tiempoPomodoro * 60;
      } else if (datosSesion._fase === 'descansoCorto') {
        tiempo = datosSesion._tiempoDescanso * 60;
      } else {
        tiempo = datosSesion._tiempoDescansoLargo * 60;
      }
    }

    //Cambiamos el estado y el funcionamiento del botón 'Iniciar'
    switch (estado) {
      case 'iniciar':
      estado = 'pausar';
      botonEstado.dataset.estado = 'pausar';
      botonEstado.innerText = 'PAUSAR';
      actualizarBotonEstadoUI();
      iniciartemporizador(tiempo, datosSesion._fase);
      break;

      case 'pausar':
        console.log(`Este es el tiempo restante ${tiempo}`);
        estado = 'reanudar';
        botonEstado.dataset.estado = 'reanudar';
        botonEstado.innerText = 'REANUDAR';
        actualizarBotonEstadoUI();
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
        break;

      case 'reanudar':
        estado = 'pausar';
        botonEstado.dataset.estado = 'pausar';
        botonEstado.innerText = 'PAUSAR'
        actualizarBotonEstadoUI();
        iniciartemporizador(tiempo, datosSesion._fase);
      break;
    }
  });

  //Añadimos event listener al evento que controla el reinicio del temporizador
  const botonReiniciar = document.getElementById('botonReiniciar');

  botonReiniciar.addEventListener('click', ()=>{

    const datosSesion = manager.getPomodoroActual();
    clearInterval(timerId);
    tiempoRestanteTemporizador = 0;
    botonEstado.dataset.estado = 'iniciar';
    estado = 'iniciar';
    botonEstado.innerText = 'INICIAR';
    seleccionarDeseleccionarBotones(datosSesion._fase);
    cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
    aplicarTema(datosSesion._fase);

    //Agregamos nuestra animación de girar
    botonReiniciar.classList.add('girar');
    //Al terminar la animación, eliminamos la clase
    setTimeout(()=>{
      botonReiniciar.classList.remove('girar');
    },500); //El tiempo del setTimeout sebe coincidar con la duración de la animación
  });
  

} else {
  console.log("No se encontró la sesión con el id solicitado");
}

//Event listener para el click momento de reiniciar las iteraciones del pomodoro
const btnReiniciarIteraciones = document.getElementById("botonReiniciarIteraciones");
btnReiniciarIteraciones.addEventListener('click', ()=>{
  manager.reiniciarIteracion(idSesionActual);
  //Guardamos el nuevo valor de la iteración en nuestro objeto
  const datosSesion = manager.getPomodoroActual();
  datosSesion._iteracion = 0;
  //Reiniciamos el iterador en la UI
  const iteracionDiv = document.getElementById('iteracionActual');
  iteracionDiv.innerHTML = datosSesion._iteracion;
  //Ocultamos el mensaje de reinicio de iteraciones
  mostrarReinicioIteraciones(datosSesion._iteracion);
});







function actualizarHora(){
  // Obtenemos la hora actual
  const d = new Date();
  let horas = d.getHours();
  let minutos = d.getMinutes();

  // Convertimos a formato 12 horas
  horas = horas % 12;
  horas = horas === 0 ? 12 : horas; // si es 0, mostrar 12

  // Aseguramos que los minutos tengan 2 dígitos
  horas = horas.toString().padStart(2, "0");
  minutos = minutos.toString().padStart(2, "0");

  // Construimos la cadena
  const horaActual = `${horas}:${minutos}`;

  // Mostramos en el div
  const horaDiv = document.getElementById("hora");
  horaDiv.innerHTML = horaActual;
}

  // Calculamos cuántos milisegundos faltan para el próximo minuto
  const ahora = new Date();
  const msParaSiguienteMinuto = (60 - ahora.getSeconds()) * 1000 - ahora.getMilliseconds();

  // Esperamos hasta el siguiente minuto
  setTimeout(() => {
    // Actualizamos justo al iniciar el minuto
    actualizarHora();

    // Luego ejecutamos cada minuto exacto
    setInterval(actualizarHora, 60 * 1000);
  }, msParaSiguienteMinuto);



  //El botón de regresar lleva a la pantalla de inicio
  const botonRegresar = document.getElementById("botonRegresar");
  botonRegresar.addEventListener('click', ()=>{
    console.log('Quieres regresar');
    //Redireccionamos a la página principal
    window.location.href = './../../index.html';
  });



function seleccionarDeseleccionarBotones(fase){
  if(fase === 'pomodoro'){
    //Modificamos el botón que está presionado
    btnPomodoro.classList.add("activo");
    btnDescansoCorto.classList.remove("activo");
    btnDescansoLargo.classList.remove("activo");
  }else if(fase === 'descansoCorto'){
    //Modificamos el botón que está presionado
    btnPomodoro.classList.remove("activo");
    btnDescansoCorto.classList.add("activo");
    btnDescansoLargo.classList.remove("activo");
  } else {
    //Modificamos el botón que está presionado
    btnPomodoro.classList.remove("activo");
    btnDescansoCorto.classList.remove("activo");
    btnDescansoLargo.classList.add("activo");
  }
}



//Aplica los colores correctos a los elementos dependiendo de la fase actual
function aplicarTema(fase){
  //Obtenemos los elementos que cambian de color
  const reloj = document.getElementById('reloj');
  const botonEstado = document.getElementById('botonEstado');
  const botonReiniciar = document.getElementById('botonReiniciar');

  if(fase === 'pomodoro'){
    reloj.style.color = 'var(--red-timer)';
    //botonEstado.style.backgroundColor = 'var(--red-timer)';
    botonReiniciar.style.border = '2px solid var(--red-timer)';

  }else if(fase === 'descansoCorto'){
    reloj.style.color = 'var(--blue-timer)';
    //botonEstado.style.backgroundColor = 'var(--blue-timer)';
    botonReiniciar.style.border = '2px solid var(--blue-timer)';
  } else {
    reloj.style.color = 'var(--purple-timer)';
    //botonEstado.style.backgroundColor = 'var(--purple-timer)';
    botonReiniciar.style.border = '2px solid var(--purple-timer)';
  }
};



//Muestra el tiempo inicial del reloj dependiendo de la fase actual
function cargarReloj(fase, tiempoPomodoro, tiempoDescansoCorto, tiempoDescansoLargo){
  let tiempo = 0;
  if(fase === 'pomodoro'){
    tiempo = tiempoPomodoro;
  } else if (fase === 'descansoCorto'){
    tiempo = tiempoDescansoCorto;
  } else {
    tiempo = tiempoDescansoLargo;
  }
  //Tiempo en el reloj
  const minutos = Number(tiempo);
  const segundos = 0;

  //Obtenemos el elemento de la cuenta regresiva.
  const relojSpan = document.getElementById("reloj");

  // Formato para que siempre aparezca 2 dígitos (ej: 05:09)
  let texto = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  relojSpan.textContent = texto;

  //Mostramos el tiempo en el título de la pestaña
  document.title = `(${texto}) Pomodoro | Sesión` ;
}

function iniciartemporizador(tiempo, fase){
  if (timerId) clearInterval(timerId);
  
  timerId = setInterval(() => {
    tiempo--; // Restamos un segundo
    tiempoRestanteTemporizador = tiempo;//Actualizamos la variable global de tiempo restante

    if (tiempo <= 0) {
      clearInterval(timerId);
      timerId = null;
      tiempo = 0;
      actualizarTemporizadorUI(tiempo);

      //Reproducir con Web Audio según la fase
      if (fase === 'pomodoro') {
        playSound('alarm');

        //Aumentamos en una unidad la iteración actual.
        manager.incrementarIteracion(idSesionActual);
        //Mostramos la nueva iteración
        let datosSesion = manager.getPomodoroActual();
        const iteracionDiv = document.getElementById('iteracionActual');
        iteracionDiv.innerHTML = datosSesion._iteracion;

        //Activamos la siguiente fase
        datosSesion = manager.getPomodoroActual();

        if(datosSesion._iteracion < 4){
          manager.actualizarFase(idSesionActual, "descansoCorto");
        } else{
          manager.actualizarFase(idSesionActual, "descansoLargo");
        }


        clearInterval(timerId);
        tiempoRestanteTemporizador = 0;
        botonEstado.dataset.estado = 'iniciar';
        estado = 'iniciar';
        botonEstado.innerText = 'INICIAR';
        actualizarBotonEstadoUI();
        seleccionarDeseleccionarBotones(datosSesion._fase);
        cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
        aplicarTema(datosSesion._fase);
        mostrarReinicioIteraciones(datosSesion._iteracion);

      } else if (fase === 'descansoCorto') {
        playSound('water');

        //Activamos la siguiente fase
        const datosSesion = manager.getPomodoroActual();
        manager.actualizarFase(idSesionActual, "pomodoro");

        clearInterval(timerId);
        tiempoRestanteTemporizador = 0;
        botonEstado.dataset.estado = 'iniciar';
        estado = 'iniciar';
        botonEstado.innerText = 'INICIAR';
        actualizarBotonEstadoUI();
        seleccionarDeseleccionarBotones(datosSesion._fase);
        cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
        aplicarTema(datosSesion._fase);
      } else {
        playSound('wind');
        //Activamos la siguiente fase
        const datosSesion = manager.getPomodoroActual();
        manager.actualizarFase(idSesionActual, "pomodoro");

        clearInterval(timerId);
        tiempoRestanteTemporizador = 0;
        botonEstado.dataset.estado = 'iniciar';
        estado = 'iniciar';
        botonEstado.innerText = 'INICIAR';
        actualizarBotonEstadoUI();
        seleccionarDeseleccionarBotones(datosSesion._fase);
        cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
        aplicarTema(datosSesion._fase);
        }

    } else {
      actualizarTemporizadorUI(tiempo);
    }
  } , 1000);
}

//Cambia la tonalidad del color en caso de que se presiona pausa y lo regresa a la normalidad si se selecciona otro estado
function actualizarBotonEstadoUI(){
  const datosSesion = manager.getPomodoroActual();
  const fase = datosSesion._fase;
  const botonEstado = document.getElementById("botonEstado");
  const estadoActual = botonEstado.dataset.estado;

  if(estadoActual === 'pausar'){
    botonEstado.className = `botonEstado ${estadoActual} ${fase} `;
  } else{
    botonEstado.className = `botonEstado ${fase}`;
  }
}

//Actualizamos en la interfaz el número que contiene el temporizador
function actualizarTemporizadorUI(tiempo){
  const temporizadorSpan = document.getElementById('reloj');

  const minutos =  Math.floor(tiempo / 60);
  let segundos = tiempo % 60;
  const tiempoNormalizado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  temporizadorSpan.innerHTML = tiempoNormalizado;

  //Mostramos el tiempo restante en el título de la pestaña
  document.title = `(${tiempoNormalizado}) Pomodoro | Sesión`;

  tiempo --;
}

function nuevoTituloPestaña(){

};

//Mostramos u ocultamos el mensaje para reiniciar las iteraciones
function mostrarReinicioIteraciones(iteracion){
  const divReiniciarIteraciones = document.getElementById("reiniciarIteraciones");
  if(iteracion === 0){
    console.log('Se oculta');
    divReiniciarIteraciones.classList.remove('visible');
  }else{
    console.log('Se muestra');
    divReiniciarIteraciones.classList.add('visible');
  }
}