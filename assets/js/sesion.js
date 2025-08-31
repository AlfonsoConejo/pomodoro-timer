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
    // Imprimir valores individuales
    console.log("Nombre:", sesionActual._nombre);
    console.log("Tiempo Pomodoro:", sesionActual._tiempoPomodoro);
    console.log("Tiempo Descanso:", sesionActual._tiempoDescanso);
    console.log("Tiempo Descanso Largo:", sesionActual._tiempoDescansoLargo);
    console.log("Fondo:", sesionActual._fondo);
    console.log("Sesión Actual:", sesionActual._iteracion);
    console.log("Fase:", sesionActual._fase);
    
    // Buscamos el objeto cuyo id coincida con el seleccionado
    const fondoEncontrado = utils.arrayFondos.find(fondo => fondo.id === idFondo);
    // Obtenemos la dirección de la imagen, si encontramos el fondo
    const direccionImagen = fondoEncontrado ? fondoEncontrado.location : null;
    console.log(`Dirección de imagen = ${direccionImagen}`)
    //Obtenemos el body y le asignamos el fondo correspondiente
    const cssBody = document.body;
    cssBody.style.backgroundImage = `url(../../${direccionImagen})`;
    cssBody.style.backgroundSize = "cover";     // hace que la imagen se escale a todo el body
  cssBody.style.backgroundRepeat = "no-repeat"; // evita que se repita

  } else {
    console.log("No se encontró la sesión con ese id");
  }
