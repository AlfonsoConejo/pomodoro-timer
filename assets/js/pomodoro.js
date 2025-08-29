export default class Pomodoro {

    constructor(nombre, tiempoPomodoro, tiempoDescanso, tiempoDescansoLargo, fondo){
        this._id = Date.now();
        this._nombre = nombre;
        this._tiempoPomodoro = tiempoPomodoro;
        this._tiempoDescanso = tiempoDescanso;
        this._tiempoDescansoLargo = tiempoDescansoLargo;
        this._fondo = fondo;
    }

}