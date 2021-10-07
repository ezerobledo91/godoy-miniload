import { dibujarVistas} from './whjs/draw_elements.js'
import { seleccionLadoProf, seleccionNivel } from './js/functions.js'

dibujarVistas()
seleccionNivel()
seleccionLadoProf()



// Habilitar Tooltips en todo el documento 
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})