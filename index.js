console.log('El código está funcionando');

let listaPomodoros = JSON.parse(localStorage.getItem('listaPomodoros')) || '';

if(listaPomodoros === '' || listaPomodoros.length === 0){
    let mainDiv = document.getElementById('main');
    let mensajeSinPomodoros = document.getElementById("mensajeSinPomodoros");
} else {
    
}


const botonNuevaSesion = document.getElementById('');