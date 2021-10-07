import { MODAL_CARGA } from "../js/modales/modal-carga.js"
import { MODAL_DESCARGA } from "../js/modales/modal-descarga.js"
import { genRandomPositions, positions } from "../js/random-pos.js"
import { GS, IZQUIERDO, DERECHO, FRENTE, miniload, deposito } from "../whjs/whconfig.js"

const V_ANTERIOR = document.getElementById('deposito-anterior')
const NIVELES = deposito.calles.niveles
const CALLES = deposito.calles.cantidad
const PROFUNDIDAD = deposito.calles.profundidad

const INDICADOR_NIVEL_A = document.getElementById('indicador-nivel-a')
const V_SUPERIOR_I = document.getElementById('deposito-superior-i')
const V_SUPERIOR_D = document.getElementById('deposito-superior-d')
const V_SUPERIOR = document.querySelector('.dibujo__deposito-sup')

let miniloadDraw = document.createElement('div')
miniloadDraw.innerHTML = `  <div class="miniload__anterior" id="mini-completo">
<img id="columna" src="./assets/columna-vAnterior.svg" width="157px" alt="Columna Miniload" />
<img id="cuna" src="./assets/cuna-vAnterior.svg" width="121.222px" alt="Cuna Miniload" />
</div>`

let miniloadDrawSup = document.createElement('div')
miniloadDrawSup.classList.add('miniload__superior')
miniloadDrawSup.innerHTML = `  <div id="mini-completo-sup">
<img id="mini-superior" src="./assets/mini-vSuperior.svg" width="157px" alt="Miniload Superior" />
</div>`


let POSICIONES_PANTALLA = {}


/* DIBUJAR VISTAS ANTERIOR */
const dibujarVistas = () => {
    genRandomPositions()
    indicadorNivelesA()
    dibujarVistaAnt()
    dibujarVistaSup()
    capacidadDeposito()
}


const indicadorNivelesA = () => {
    let fragment = document.createDocumentFragment()
    for (let nivel = NIVELES; nivel > 0; nivel--) {
        let indicadorNivel = document.createElement('div')
        indicadorNivel.classList.add('indicador__nivel-anterior')
        if (nivel == 1) indicadorNivel.classList.add('indicador__nivel-selecionado')
        indicadorNivel.textContent = nivel
        fragment.appendChild(indicadorNivel)
    }
    INDICADOR_NIVEL_A.appendChild(fragment)
}

const dibujarVistaAnt = (lado = 0, profundidad = 1) => {
    V_ANTERIOR.innerHTML = " "
    let fragment = document.createDocumentFragment()
    for (let calle = 1; calle <= CALLES; calle++) {
        let nuevaCalle = document.createElement('div')
        let contenedor = document.createElement('div')
        nuevaCalle.classList.add('rack__calle-anterior')
        for (let nivel = NIVELES; nivel > 0; nivel--) {
            let nuevaCuna = document.createElement('div')
            nuevaCuna.classList.add('rack__cuna-anterior')
            let nuevoBox = document.createElement('div')
            nuevoBox.classList.add('rack__box')
            let id = `L${lado}C${calle}N${nivel}P${profundidad}`
            nuevoBox.id = id
            if (positions[id].state == 0) {
                nuevoBox.classList.add('box__state-empty')
            } else {
                nuevoBox.classList.add('box__state-full')
            }
            nuevaCuna.appendChild(nuevoBox)
            nuevaCalle.appendChild(nuevaCuna)
        }

        let numeroCalle = document.createElement('div')
        numeroCalle.classList.add('numeros__calle-anterior')
        numeroCalle.textContent = calle
        contenedor.appendChild(nuevaCalle)
        contenedor.appendChild(numeroCalle)
        fragment.appendChild(contenedor)


    }

    V_ANTERIOR.appendChild(fragment)
    V_ANTERIOR.appendChild(miniloadDraw)

}

const dibujarVistaSup = (nivel = 1) => {
    V_SUPERIOR_I.innerHTML = " "
    let fragment = document.createDocumentFragment()
    for (let calle = 1; calle <= CALLES; calle++) {
        let nuevaCalle = document.createElement('div')
        let contenedor = document.createElement('div')
        contenedor.classList.add('rack__calle-div')
        nuevaCalle.classList.add('rack__calle-superior')
        for (let prof = PROFUNDIDAD; prof > 0; prof--) {
            let nuevaCuna = document.createElement('div')
            nuevaCuna.classList.add('rack__cuna-superior')
            let nuevoBox = document.createElement('div')
            nuevoBox.classList.add('rack__box-superior')
            let id = `L0C${calle}N${nivel}P${prof}`
            nuevoBox.id = id
            if (positions[id].state == 0) {
                nuevoBox.classList.add('box__state-empty')
            } else {
                nuevoBox.classList.add('box__state-full')
            }
            nuevaCuna.appendChild(nuevoBox)
            nuevaCalle.appendChild(nuevaCuna)
        }

        let numeroCalle = document.createElement('div')
        numeroCalle.classList.add('numeros__calle-superior')
        numeroCalle.textContent = calle
        contenedor.appendChild(nuevaCalle)
        contenedor.appendChild(numeroCalle)
        fragment.appendChild(contenedor)
    }

    V_SUPERIOR_I.appendChild(fragment)
    V_SUPERIOR_I.appendChild(miniloadDrawSup)

    V_SUPERIOR_D.innerHTML = " "
    fragment = document.createDocumentFragment()
    for (let calle = 1; calle <= CALLES; calle++) {
        let nuevaCalle = document.createElement('div')
        nuevaCalle.classList.add('rack__calle-superior')
        for (let prof = 1; prof <= PROFUNDIDAD; prof++) {
            let nuevaCuna = document.createElement('div')
            nuevaCuna.classList.add('rack__cuna-superior')
            let nuevoBox = document.createElement('div')
            nuevoBox.classList.add('rack__box-superior')
            let id = `L1C${calle}N${nivel}P${prof}`
            nuevoBox.id = id
            if (positions[id].state == 0) {
                nuevoBox.classList.add('box__state-empty')
            } else {
                nuevoBox.classList.add('box__state-full')
            }
            nuevaCuna.appendChild(nuevoBox)
            nuevaCalle.appendChild(nuevaCuna)
        }
        fragment.appendChild(nuevaCalle)
    }

    V_SUPERIOR_D.appendChild(fragment)

}



const capacidadDeposito = () => {
    const TOTAL_UBICACIONES = Object.keys(positions).length
    const BARRA_PROGRESO = document.getElementById('progress-bar')
    let libres = (Object.values(positions)).map(e => e.state).filter(value => value == 0).length
    let ocupados = (Object.values(positions)).map(e => e.state).filter(value => value == 1).length

    let porcentajeOcupado = ocupados * 100 / TOTAL_UBICACIONES
    let porcentajeVacio = libres * 100 / TOTAL_UBICACIONES
    BARRA_PROGRESO.innerHTML = `
    <div class="progress-bar bg-ocupado" role="progressbar" style="width: ${porcentajeOcupado}%" aria-valuenow="${porcentajeOcupado}" 
    aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" title="Ocupado: ${ocupados} Total: ${TOTAL_UBICACIONES}"></div>
    <div class="progress-bar bg-libre" role="progressbar" style="width: ${porcentajeVacio}%" aria-valuenow="${porcentajeVacio}" 
    aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" title="Libre: ${libres} Total: ${TOTAL_UBICACIONES}"></div>
    <div class="progress-bar bg-anulado" role="progressbar" style="width: 0%" aria-valuenow="" aria-valuemin="0" aria-valuemax="100"></div>
    `
}







export { dibujarVistas, INDICADOR_NIVEL_A, dibujarVistaSup, dibujarVistaAnt, V_ANTERIOR, V_SUPERIOR}