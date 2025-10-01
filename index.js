import Pomodoro from "./assets/js/pomodoro.js";
import PomodoroManager from "./assets/js/pomodoro_manager.js";
import utils from "./assets/js/utils.js";

//Creamos variable de temporizador
let timer = null;

//Variables globales
const manager = new PomodoroManager();
const formularioNuevoPomodoro = document.getElementById('formularioNuevoPomodoro');
const panelNuevoPomodoro = document.getElementById('panelNuevoPomodoro');
const panelEditarPomodoro = document.getElementById('panelEditarPomodoro');
const overlay = document.getElementById('overlay');

//Envío del formulario al guardar
formularioNuevoPomodoro.addEventListener('submit', (e)=>{
    //Evitamos que el botón haga sus operaciones por defecto para poner nuestra lógica
    e.preventDefault();

    /*Obtenemos todos los campos de nuestro formulario a través de su propiedad NAME*/
    const nombreSesion = formularioNuevoPomodoro.nombreSesion.value;
    const tiempoPomodoro = parseInt(formularioNuevoPomodoro.pomodoro.value);
    const tiempoDescansoCorto = parseInt(formularioNuevoPomodoro.descansoCorto.value);
    const tiempoDescansoLargo = parseInt(formularioNuevoPomodoro.descansoLargo.value);
    const fondoSeleccionado = panelNuevoPomodoro.querySelector(".miniaturaFondo.seleccionada")?.dataset.imagenId;

    //Metemos nuestros datos a nuestro objeto Pomodoro
    const nuevoPomodoro = new Pomodoro(nombreSesion, tiempoPomodoro, tiempoDescansoCorto, tiempoDescansoLargo, fondoSeleccionado);

    //Comprobamos que los inputs de tiempo tengan un valor distinto a 0
    if( tiempoPomodoro > 0  && tiempoDescansoCorto > 0 && tiempoDescansoLargo > 0 ){
        ///Instanciamos al manager para poder enviar nuestros datos al local storage
        manager.agregarPomodoro(nuevoPomodoro);
        //Regresamos todos los campos del formulario a su estado original
        formularioNuevoPomodoro.reset();
        resetearSelecciónFondoNuevoPomodoro();
        //Mostramos en el div contenedorSesiones la información correcta 
        mostrarOcultarSesiones();
        /*Cerramos el panel del formulario*/
        panelNuevoPomodoro.classList.add('animado');   // <- habilita transición
        panelNuevoPomodoro.classList.remove('abierto');
        //Desactivamos el overlay
        overlay.style.display='none';
    }
    
});

//Función para resetear la selección del fondo en el formulario 'Nuevo pomodoro'
function resetearSelecciónFondoNuevoPomodoro(){
    //Obtenemos todos los elementos que se llamen miniaturaFondo
    const miniaturasFondosNuevoPomodoro = panelNuevoPomodoro.querySelectorAll('.miniaturaFondo');
    miniaturasFondosNuevoPomodoro.forEach(div => {div.classList.remove('seleccionada')});
    const miniaturaPorDefecto = contenedorFondosNuevo.querySelector('.miniaturaFondo[data-imagen-id="1"]');
    if (miniaturaPorDefecto) miniaturaPorDefecto.classList.add('seleccionada');
}

mostrarOcultarSesiones();

function mostrarOcultarSesiones(){
    //Escogemos la información que se muestra en el contenedorSesiones
    let listaPomodoros = JSON.parse(localStorage.getItem('listaPomodoros')) || '';

    //Obtenemos del DOM los elementos para manipular alerta y sesiones
    const mensajeSinPomodoros = document.getElementById('mensajeSinPomodoros');
    const contenedorMiniaturasSesiones = document.getElementById('contenedorMiniaturasSesiones');

    if(listaPomodoros.length === 0){
        mensajeSinPomodoros.classList.remove('desactivado');
        contenedorMiniaturasSesiones.classList.add('desactivado')
    } else {
        mensajeSinPomodoros.classList.add('desactivado');
        contenedorMiniaturasSesiones.classList.remove('desactivado');
        cargarMiniaturasSesiones();
    }
}

function cargarMiniaturasSesiones(){
    const contenedorMiniaturasSesiones = document.getElementById('contenedorMiniaturasSesiones');
    const listaSesiones = manager.lista;

    let allMiniaturasSesiones = ``;
    listaSesiones.forEach(elemento =>{
        const idSeleccionado = Number(elemento._fondo); // Convertimos a número para comparar
        // Buscamos el objeto cuyo id coincida con el seleccionado
        const fondoEncontrado = utils.arrayFondos.find(fondo => fondo.id === idSeleccionado);
        // Obtenemos la dirección de la imagen, si encontramos el fondo
        const direccionImagen = fondoEncontrado ? fondoEncontrado.location : null;

        const nuevaMinuaturaSesion = `
            <div class="miniaturaSesion" style="background-image: url('${direccionImagen}')">
                <div class="contenedorNombreSesion">
                    <h2>${elemento._nombre}</h2>
                    <div class="botonesAccion">
                        <div class="botonBorrar" data-idsesion="${elemento._id}">
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </div>
                        <div class="botonEditar" data-idsesion="${elemento._id}">
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </div>
                    </div>
                </div>

                <div class="contenedorDatosSesion">
                    <div class="mostrarTiempo">
                        <span class="material-symbols-outlined">
                            lightbulb_2
                        </span>
                        ${elemento._tiempoPomodoro}
                    </div> 
                    
                    <div class="mostrarTiempo">
                        <span class="material-symbols-outlined">
                            pause
                        </span>
                        ${elemento._tiempoDescanso}
                    </div>

                    <div class="mostrarTiempo">
                        <span class="material-symbols-outlined">
                            stop_circle
                        </span>
                        ${elemento._tiempoDescansoLargo}
                    </div>
                    
                    <div class="contenedorBotonIniciar">
                        <div class="abrirSesion" data-idsesion="${elemento._id}">
                            <p>Iniciar</p>
                            <span class="material-symbols-outlined">
                                play_arrow
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        allMiniaturasSesiones = allMiniaturasSesiones + nuevaMinuaturaSesion;

    });

    //Cargamos todas nuestras miniaturas a nuestro contenedor
    contenedorMiniaturasSesiones.innerHTML = allMiniaturasSesiones;

    //A todos los botones de "Iniciar" les añadimos sus eventListeners
    document.querySelectorAll('.abrirSesion').forEach((btn) =>{ 
        btn.addEventListener('click', ()=>{
            const idSesion = btn.dataset.idsesion;

            //Guardamos el id de la sesión en localStorage
            localStorage.setItem("sesionActual", idSesion);

            //Redireccionamos a la siguiente página
            window.location.href = `./assets/html/sesion.html`;
        });
    });

    //A todos los botones de "borrar" les agregamos el event listener
    document.querySelectorAll('.botonBorrar').forEach((btn) =>{
        btn.addEventListener('click', ()=>{
            const idSesion  = btn.dataset.idsesion;
            manager.eliminarPomodoro(idSesion);
            mostrarOcultarSesiones();
        });
    });

    //A todos los botones de "editar" les agregamos el event listener
    document.querySelectorAll('.botonEditar').forEach((btn) =>{
        btn.addEventListener('click', ()=>{
            const idSesion = btn.dataset.idsesion;
            console.log('Quieres editar este elemento');
            panelEditarPomodoro.classList.add('animado');   // <- habilita transición
            panelEditarPomodoro.classList.add('abierto');
            panelEditarPomodoro.dataset.idsesion=idSesion;
            overlay.style.display='block';
            cargarInformación(idSesion);
        });
    })
}

//VALIDACIONES DEL FORMULARIO (Nuevo pomodoro)

//Evitar que el nombre de la sesión sea muy largo
const campoNombreSesion = document.getElementById("nombreSesion");
campoNombreSesion.addEventListener('input', ()=>{
    eliminarExcesoCaracteres(campoNombreSesion);
});

//Evitar que el nombre de la sesión esté vacío
campoNombreSesion.addEventListener('blur', ()=>{
    if (campoNombreSesion.value.length == 0){
        campoNombreSesion.classList.add('campoRojo');
    }else{
        campoNombreSesion.classList.remove('campoRojo');
    }
});

//Validación al tiempo del pomodoro
const tiempoPomodoro = document.getElementById("pomodoro");
tiempoPomodoro.addEventListener('input', ()=>{
    formatoNumero(tiempoPomodoro);
});

tiempoPomodoro.addEventListener('blur', ()=>{
    validarNumeroIngresado(tiempoPomodoro);
});

//Validación al tiempo del descanso corto
const descansoCorto = document.getElementById("descansoCorto");
descansoCorto.addEventListener('input', ()=>{
    formatoNumero(descansoCorto);
});

descansoCorto.addEventListener('blur', ()=>{
    validarNumeroIngresado(descansoCorto);
});

//Validación al tiempo del descanso largo
const descansoLargo = document.getElementById("descansoLargo");
descansoLargo.addEventListener('input', ()=>{
    formatoNumero(descansoLargo);
});

descansoLargo.addEventListener('blur', ()=>{
    validarNumeroIngresado(descansoLargo);
});


//Obtenemos del DOM los valores para manipular la ventana modal de "Nueva sesión"
const botonNuevaSesion = document.getElementById('btnNuevaSesion');
const botonCerrarPanel = document.getElementById('cerrarPanel');
const contenedorFondos = document.querySelectorAll('.contenedorFondos');

let fondosCargados = '';
//recorremos el arreglo de fondos y los agregamos dentro de un div
utils.arrayFondos.forEach(imagen => {
    const nuevoFondoCargado = `
    
    <div class="miniaturaFondo" style="background-image: url('${imagen.location}')"  data-imagen-id='${imagen.id}'></div>

    </div>
    `;

    fondosCargados = fondosCargados + nuevoFondoCargado;

    
});
//Cargamos al DOM todos nuestros fondos
contenedorFondos.forEach((contenedor)=>{
    contenedor.innerHTML = fondosCargados;
});

//Delegación de eventos para saber si un elemento fue clickado
/*    contenedorFondos.addEventListener('click', (e)=>{
        if(e.target.classList = 'miniaturaFondo'){
            console.log(`Imagen seleccionada ${e.target.dataset.imagenId}`);
        }
    });
    */

//Obtenemos todos los elementos que se llamen miniaturaFondo en el formulario 'Nuevo pomodoro'
const miniaturasFondosNuevoPomodoro = panelNuevoPomodoro.querySelectorAll('.miniaturaFondo'); 
// Buscar la miniatura con id = 1
const miniaturaPorDefecto = [...miniaturasFondosNuevoPomodoro].find(
  m => m.dataset.imagenId === '1'
);

//Marcamos como seleccionada la miniatura por defecto (1)
if (miniaturaPorDefecto) {
  miniaturaPorDefecto.classList.add('seleccionada');
}

//Al hacer clic sobre un fondo del formulario 'Nuevo pomodoro' deseleccionamos todos y marcamos el nuevo fondo seleccionado
miniaturasFondosNuevoPomodoro.forEach(miniatura => {
    miniatura.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.imagenId;
        //Deseleccionamos todas las imágenes
        miniaturasFondosNuevoPomodoro.forEach(imagen => {
            imagen.classList.remove('seleccionada');
        });
        miniatura.classList.add('seleccionada');
    });
});

//Abrimos el panel al hacer click sobre el botón de "Nueva sesión"
botonNuevaSesion.addEventListener('click', ()=>{
    panelNuevoPomodoro.classList.add('animado');   // <- habilita transición
    panelNuevoPomodoro.classList.add('abierto');
    overlay.style.display='block';
    

    //Eliminamos el timer
    if (timer) {
    clearTimeout(timer);
    timer = null;
    }
});

//Cerramos el panel
botonCerrarPanel.addEventListener('click', ()=>{
    panelNuevoPomodoro.classList.add('animado');   // <- habilita transición
    panelNuevoPomodoro.classList.remove('abierto');
    overlay.style.display='none';
    iniciarTimeout();
});

//Event listener para eliminar la clase "animado" una vez ejecutada
panelNuevoPomodoro.addEventListener('transitionend', () => {
  panelNuevoPomodoro.classList.remove('animado');
});

//Timeout para restablecer el formulario en caso de cierre e inactividad
function iniciarTimeout(){
    timer = setTimeout(()=>{
        const form = document.getElementById('formularioNuevoPomodoro');
        //Regresamos todos los campos del formulario a su estado original
        form.reset();
        resetearSelecciónFondoNuevoPomodoro();

        //Eliminamos los bordes rojos en caso de que lo haya
        const campoNombreSesion = document.getElementById("nombreSesion");
        const tiempoPomodoro = document.getElementById("pomodoro");
        const descansoCorto = document.getElementById("descansoCorto");
        const descansoLargo = document.getElementById("descansoLargo");

        campoNombreSesion.classList.remove('campoRojo');
        tiempoPomodoro.classList.remove('campoRojo');
        descansoCorto.classList.remove('campoRojo');
        descansoLargo.classList.remove('campoRojo');

    }, 60_000);
}

//Evitar que los campos numéricos puedan contener letras o se queden vacíos
function formatoNumero(campo){
    //poner un 1 si el campo se queda vacío o un 999 si se excede de 999
    if (campo.value > 999){
        campo.value ='999';
    }

    // Solo mantener números
    const cadenaCompleta = campo.value.replace(/[^0-9]/g, '');
    campo.value = cadenaCompleta;
    //Muestra un 0 en caso de ser necesario
    
    //Si el valor es mayor a uno y empieza con 0 se remueve el 0
    if (campo.value.startsWith("0") && (campo.value.length > 1)) {
        const removerCero = campo.value.slice(1);
        campo.value = removerCero;
    }
}

//Función para borrar todos los caracteres más allá de los 30 permitidos
function eliminarExcesoCaracteres(campoNombreSesion){
    if(campoNombreSesion.value.length > 30){
        const nuevaCadena = cadena.slice(1,30);
        campoNombreSesion.value = nuevaCadena;
    }
};

//Validar que no se haya ingresado un 0
function validarNumeroIngresado(campo){
    if(campo.value == 0 || campo.value.length == 0){
        campo.classList.add('campoRojo');
    }else {
        campo.classList.remove('campoRojo');
    }
}

//Variables para el panel laterial (Editar Pomodoro)
const cerrarPanelEditar = document.getElementById("cerrarPanelEditar");

//Obtenemos todas la miniaturas del formulario "Editar pomodoro"
const miniaturasFondosEditarPomodoro = panelEditarPomodoro.querySelectorAll(".miniaturaFondo");

////Envío del formulario al guardar
panelEditarPomodoro.addEventListener('submit', (e)=>{
    e.preventDefault();

    /*Obtenemos todos los campos de nuestro formulario a través de su propiedad NAME*/
    const nombreSesionEditar = formularioEditarPomodoro.nombreSesionEditar.value;
    const tiempoPomodoroEditar = parseInt(formularioEditarPomodoro.pomodoroEditar.value);
    const tiempoDescansoCortoEditar = parseInt(formularioEditarPomodoro.descansoCortoEditar.value);
    const tiempoDescansoLargoEditar = parseInt(formularioEditarPomodoro.descansoLargoEditar.value);
    const fondoSeleccionadoEditar = panelEditarPomodoro.querySelector(".miniaturaFondo.seleccionada")?.dataset.imagenId;

    //Obtenemos el id de la sesión que está en el data set del panel
    const idSesion = panelEditarPomodoro.dataset.idsesion;

    //Comprobamos que los inputs de tiempo tengan un valor distinto a 0
    if( tiempoPomodoroEditar > 0  && tiempoDescansoCortoEditar > 0 && tiempoDescansoLargoEditar > 0 ){
        //Actualizamos los valores de nuestro pomodoro
        manager.editarPomodoro(idSesion, nombreSesionEditar, tiempoPomodoroEditar, tiempoDescansoCortoEditar, tiempoDescansoLargoEditar, fondoSeleccionadoEditar);
        //Regresamos todos los campos del formulario a su estado original
        formularioEditarPomodoro.reset();
        resetearSelecciónFondoEditarPomodoro();
        //Mostramos en el div contenedorSesiones la información correcta 
        mostrarOcultarSesiones();
        /*Cerramos el panel del formulario*/
        panelEditarPomodoro.classList.add('animado');   // <- habilita transición
        panelEditarPomodoro.classList.remove('abierto');
        //Desactivamos el overlay
        overlay.style.display='none';
    }
});

//Obtenemos información de la sesión actual y la mostramos en los campos correspondientes
function cargarInformación(idSesion){
    //Obtenemos la información de la sesiónActual
    const datosSesion = manager.buscarPomodoro(idSesion);

    //Colocamos la información en el campo correspondiente
    document.getElementById('nombreSesionEditar').value = datosSesion._nombre;
    document.getElementById('pomodoroEditar').value = datosSesion._tiempoPomodoro;
    document.getElementById('descansoCortoEditar').value = datosSesion._tiempoDescanso;
    document.getElementById('descansoLargoEditar').value = datosSesion._tiempoDescansoLargo;

    //Buscamos el div que contenga el id que necesitamos
    const miniaturaEncontrada= [...miniaturasFondosEditarPomodoro].find(
        m => m.dataset.imagenId === datosSesion._fondo
    );

    //Marcamos como seleccionada la miniatura por defecto (1)
    if (miniaturaEncontrada) {
    miniaturaEncontrada.classList.add('seleccionada');
    }

}

//Función para resetear la selección del fondo en el formulario 'Nuevo pomodoro'
function resetearSelecciónFondoEditarPomodoro(){    
    miniaturasFondosEditarPomodoro.forEach(div => {div.classList.remove('seleccionada')});
}

//Al hacer clic sobre un fondo del formulario 'Editar pomodoro' deseleccionamos todos y marcamos el nuevo fondo seleccionado
miniaturasFondosEditarPomodoro.forEach(miniatura => {
    miniatura.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.imagenId;
        //Deseleccionamos todas las imágenes
        miniaturasFondosEditarPomodoro.forEach(imagen => {
            imagen.classList.remove('seleccionada');
        });
        miniatura.classList.add('seleccionada');
    });
});

//Event listener para eliminar la clase "animado" una vez ejecutada
panelEditarPomodoro.addEventListener('transitionend', () => {
  panelEditarPomodoro.classList.remove('animado');
});

//Event listener al presionar el botón "cerrar"
cerrarPanelEditar.addEventListener('click', ()=>{
    panelEditarPomodoro.classList.add('animado');   // <- habilita transición
    panelEditarPomodoro.classList.remove('abierto');
    overlay.style.display='none';
    resetearSelecciónFondoEditarPomodoro();
});

//Cerramos el panel al presionar ESC
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        //Si el formulario de "editar pomodoro" está abiero
        if (panelEditarPomodoro.className === "panelDeslizable panelEditarPomodoro abierto") {
            panelEditarPomodoro.classList.add('animado');   // <- habilita transición
            panelEditarPomodoro.classList.remove('abierto');
            overlay.style.display='none';
            resetearSelecciónFondoEditarPomodoro();
        //Si el formulario de "nuevo pomodoro" está abierto
        } else if (panelNuevoPomodoro.className === "panelDeslizable panelNuevoPomodoro abierto"){
            panelNuevoPomodoro.classList.add('animado');   // <- habilita transición
            panelNuevoPomodoro.classList.remove('abierto');
            overlay.style.display='none';
            iniciarTimeout();
        }
  }
});

//Cerramos el panel si se hace clic en el overlay
overlay.addEventListener('click', ()=>{
    //Si el formulario de "editar pomodoro" está abiero
    if (panelEditarPomodoro.className === "panelDeslizable panelEditarPomodoro abierto") {
        panelEditarPomodoro.classList.add('animado');   // <- habilita transición
        panelEditarPomodoro.classList.remove('abierto');
        overlay.style.display='none';
        resetearSelecciónFondoEditarPomodoro();
    //Si el formulario de "nuevo pomodoro" está abierto
    } else if (panelNuevoPomodoro.className === "panelDeslizable panelNuevoPomodoro abierto"){
        panelNuevoPomodoro.classList.add('animado');   // <- habilita transición
        panelNuevoPomodoro.classList.remove('abierto');
        overlay.style.display='none';
        iniciarTimeout();
    }
});

//VALIDACIONES DEL FORMULARIO (Editar pomodoro)

//Evitar que el nombre de la sesión sea muy largo
const campoNombreSesionEditar = document.getElementById("nombreSesionEditar");
campoNombreSesionEditar.addEventListener('input', ()=>{
    eliminarExcesoCaracteres(campoNombreSesionEditar);
});

//Evitar que el nombre de la sesión esté vacío
campoNombreSesionEditar.addEventListener('blur', ()=>{
    if (campoNombreSesionEditar.value.length == 0){
        campoNombreSesionEditar.classList.add('campoRojo');
    }else{
        campoNombreSesionEditar.classList.remove('campoRojo');
    }
});

//Validación al tiempo del pomodoro
const tiempoPomodoroEditar = document.getElementById("pomodoroEditar");
tiempoPomodoroEditar.addEventListener('input', ()=>{
    formatoNumero(tiempoPomodoroEditar);
});

tiempoPomodoroEditar.addEventListener('blur', ()=>{
    validarNumeroIngresado(tiempoPomodoroEditar);
});

//Validación al tiempo del descanso corto
const descansoCortoEditar = document.getElementById("descansoCortoEditar");
descansoCortoEditar.addEventListener('input', ()=>{
    formatoNumero(descansoCortoEditar);
});

descansoCortoEditar.addEventListener('blur', ()=>{
    validarNumeroIngresado(descansoCortoEditar);
});

//Validación al tiempo del descanso largo
const descansoLargoEditar = document.getElementById("descansoLargoEditar");
descansoLargoEditar.addEventListener('input', ()=>{
    formatoNumero(descansoLargoEditar);
});

descansoLargoEditar.addEventListener('blur', ()=>{
    validarNumeroIngresado(descansoLargoEditar);
});