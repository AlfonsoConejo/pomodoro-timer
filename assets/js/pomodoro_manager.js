export default class PomodoroManager {
    constructor(){
        this._lista = JSON.parse(localStorage.getItem('listaPomodoros')) || [];
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
}