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
    cssBody.style.backgroundSize = "cover";      // o "cover" según lo que quieras
    cssBody.style.backgroundRepeat = "no-repeat";
    cssBody.style.backgroundPosition = "center";

    //Obtenemos el día actual del mes
    const fechaActual = new Date();
    const diaDelMes = fechaActual.getDate();
    const fechaDiv = document.getElementById("fecha");

    // Obtener el nombre largo del mes (ej: "Agosto")
    const nombreMes = fechaActual.toLocaleString('es-ES', { month: 'long' });

    // Obtener el nombre corto del mes (ej: "Ago")
    const nombreMesCorto = fechaActual.toLocaleString('es-ES', { month: 'short' });
    console.log(nombreMesCorto);

    fechaDiv.innerHTML = `${diaDelMes} de ${nombreMes}` ;

    //Actualizar hora
    actualizarHora();


  } else {
    console.log("No se encontró la sesión con ese id");
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