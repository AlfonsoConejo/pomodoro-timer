import Pomodoro from "./pomodoro.js";

export default class PomodoroManager {
    constructor(){
        const data = JSON.parse(localStorage.getItem('listaPomodoros')) || [];
        // Reconstruimos los objetos como instancias de Pomodoro
        this._lista = data.map(p => Object.assign(new Pomodoro(
            p._nombre,
            p._tiempoPomodoro,
            p._tiempoDescanso,
            p._tiempoDescansoLargo,
            p._fondo
        ), p));

        // Cargarmos id de la sesión activa si existe
        this._idSesionActual = localStorage.getItem("sesionActual") || null;
    }

    get lista (){
        return this._lista;
    };

    set lista (nuevaLista){
        this._lista = nuevaLista;
        //Guardamos la nueva lista en el Local Storage
        localStorage.setItem('listaPomodoros', JSON.stringify(this._lista));
    }

    agregarPomodoro(pomodoro){
        this._lista.push(pomodoro);
        //Acá se ejecuta el setter
        this.lista = this._lista;
    }

    actualizarFase(id, nuevaFase){
        const pomodoro = this._lista.find(p => p._id === Number(id));
        if (pomodoro) {
            pomodoro._fase = nuevaFase;
            this.lista = this._lista; // persiste
        }
        return null;
    }

    getPomodoroActual() {
        if (!this._idSesionActual) return null;
        return this._lista.find(
        (p) => p._id === Number(this._idSesionActual)
        ) || null;
    }
}