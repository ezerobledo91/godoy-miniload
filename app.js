import { dibujarVistas } from './whjs/draw_elements.js'
import { seleccionLadoProf, seleccionNivel } from './js/functions.js'
import tablaProcesada from './js/tablas/tabla-procesada.js'

dibujarVistas()
seleccionNivel()
seleccionLadoProf()
tablaProcesada()


// Habilitar Tooltips en todo el documento 
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})