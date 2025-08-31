import PomodoroManager from "./pomodoro_manager.js";

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

    // Imprimir valores individuales
    console.log("Nombre:", sesionActual._nombre);
    console.log("Tiempo Pomodoro:", sesionActual._tiempoPomodoro);
    console.log("Tiempo Descanso:", sesionActual._tiempoDescanso);
    console.log("Tiempo Descanso Largo:", sesionActual._tiempoDescansoLargo);
    console.log("Fondo:", sesionActual._fondo);
  } else {
    console.log("No se encontró la sesión con ese id");
  }

//Obtenemos el body y le asignamos el fondo correspondiente
const cssBody = document.body;

