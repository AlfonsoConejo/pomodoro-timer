const arrayfondos= [
    {id:1 , location: "./assets/fondos/17018-4k.jpg"},
    {id:2 , location: "./assets/fondos/202797.jpg"},
    {id:3 , location: "./assets/fondos/202827.jpg"},
    {id:4 , location: "./assets/fondos/202833.jpg"},
    {id:5 , location: "./assets/fondos/202901.jpg"},
    {id:6 , location: "./assets/fondos/estructura-abstracta.jpg"},
    {id:7 , location: "./assets/fondos/fondo-cubos.jpg"},
    {id:8 , location: "./assets/fondos/mountains-fog-landscape.jpg"},
    {id:9 , location: "./assets/fondos/mountains-fog-trees.jpg"}
];

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
const contenedorFondos = document.getElementById('contenedorFondos');

let fondosCargados = '';
//recorremos el arreglo de fondos y los agregamos dentro de un div
arrayfondos.forEach(imagen => {
    const nuevoFondoCargado = `
    
    <div class="miniaturaFondo" style="background-image: url('${imagen.location}')"  data-imagen-id='${imagen.id}'></div>

    </div>
    `;

    fondosCargados = fondosCargados + nuevoFondoCargado;

    contenedorFondos.innerHTML= fondosCargados;
});

//Obtenemos todos los elementos que se llamen miniaturaFondo
const miniaturasFondos = document.querySelectorAll('.miniaturaFondo'); 


// Buscar la miniatura con id = 1 y marcarla como seleccionada
const miniaturaPorDefecto = [...miniaturasFondos].find(
  m => m.dataset.imagenId === '1'
);

//Marcamos como seleccionada la miniatura por defecto (1)
if (miniaturaPorDefecto) {
  miniaturaPorDefecto.classList.add('seleccionada');
}

miniaturasFondos.forEach(miniatura => {
    miniatura.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.imagenId;
        //Deseleccionamos todas las imágenes
        miniaturasFondos.forEach(imagen => {
            imagen.classList.remove('seleccionada');
        });
        console.log(`Hiciste clic en la imagen con ID: ${id}`);
        miniatura.classList.add('seleccionada');
    });
});

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