export default class Pomodoro {

    constructor(nombre, tiempoPomodoro, tiempoDescanso, tiempoDescansoLargo, fondo,){
        this._id = Date.now();
        this._nombre = nombre;
        this._tiempoPomodoro = tiempoPomodoro;
        this._tiempoDescanso = tiempoDescanso;
        this._tiempoDescansoLargo = tiempoDescansoLargo;
        this._fondo = fondo;
        //Estado de la sesión
        this._iteracion = 0; 
        this._fase = "pomodoro"; //"pomodoro", "descansoCorto", "descansoLargo" 
        this._finalizado = "false";
    }

    cambiarFase(nuevaFase) {
    this._fase = nuevaFase; // "pomodoro", "descansoCorto", "descansoLargo"
  }
}