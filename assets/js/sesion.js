import PomodoroManager from "./pomodoro_manager.js";
import utils from "./utils.js";

//Obtenemos el id de la sesión actual abierta
const idSesionActual = localStorage.getItem("sesionActual");
if(idSesionActual){
    console.log(`ESta es la sesión actual ${idSesionActual}`)
}

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
  
  seleccionarDeseleccionarBotones(faseActual);
  cargarReloj(faseActual, tiempoPomodoro, tiempoDescansoCorto, tiempoDescansoLargo);
  aplicarTema(faseActual);

  //Agregamos el event listener a los botones de fase
  const btnPomodoro = document.getElementById('btnPomodoro');
  const btnDescansoCorto = document.getElementById('btnDescansoCorto');
  const btnDescansoLargo = document.getElementById('btnDescansoLargo');

  btnPomodoro.addEventListener("click", () => { 
    const datosSesion = manager.getPomodoroActual();
    manager.actualizarFase(idSesionActual, "pomodoro");

    seleccionarDeseleccionarBotones(datosSesion._fase);
    cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
    aplicarTema(datosSesion._fase);

  });

  btnDescansoCorto.addEventListener("click", () => {
    const datosSesion = manager.getPomodoroActual();
    manager.actualizarFase(idSesionActual, "descansoCorto");

    seleccionarDeseleccionarBotones(datosSesion._fase);
    cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
    aplicarTema(datosSesion._fase);

  });

  btnDescansoLargo.addEventListener("click", () => {
    const datosSesion = manager.getPomodoroActual();
    manager.actualizarFase(idSesionActual, "descansoLargo");

    seleccionarDeseleccionarBotones(datosSesion._fase);
    cargarReloj(datosSesion._fase, datosSesion._tiempoPomodoro, datosSesion._tiempoDescanso, datosSesion._tiempoDescansoLargo);
    aplicarTema(datosSesion._fase);

  });

  let timerId = null;

  //Lógica para que funciones el temporizador
  const btnIniciar = document.getElementById("botonIniciar");
  btnIniciar.addEventListener('click', ()=>{
    const datosSesion = manager.getPomodoroActual();
    let minutosIniciales = 0;
    
    if (datosSesion._fase === 'pomodoro'){
      minutosIniciales = datosSesion._tiempoPomodoro;
    } else if (datosSesion._fase === 'descansoCorto'){
      minutosIniciales = datosSesion._tiempoDescanso;
    } else {
      minutosIniciales = datosSesion._tiempoDescansoLargo;
    }
    
    let tiempo = minutosIniciales * 60;

    //Mostrar inmediatamente
    actualizarTemporizador(tiempo);

    // Limpiar intervalos anteriores (por si vuelves a iniciarlo)
    if (timerId) clearInterval(timerId);

    // Arranca intervalo
    timerId = setInterval(() => {
      tiempo--;
      actualizarTemporizador(tiempo);

      if (tiempo <= 0) {
        clearInterval(timerId);
        timerId = null;
        console.log("⏰ Se acabó el tiempo");
        // aquí puedes cambiar fase automáticamente
      }
    }, 1000);

  });

} else {
  console.log("No se encontró la sesión con el id solicitado");
}






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

  if(fase === 'pomodoro'){
    reloj.style.color = 'var(--red-timer)';

  }else if(fase === 'descansoCorto'){
    reloj.style.color = 'var(--blue-timer)';

  } else {
    reloj.style.color = 'var(--purple-timer)';
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

}

function actualizarTemporizador(tiempo){
  console.log('pasó un segundo');
  const temporizadorSpan = document.getElementById('reloj');

  const minutos =  Math.floor(tiempo / 60);
  let segundos = tiempo % 60;

  temporizadorSpan.innerHTML = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  tiempo --;
}