import { deposito } from "../whjs/whconfig.js"
const NIVELES = deposito.calles.niveles
const CALLES = deposito.calles.cantidad
const PROFUNDIDAD = deposito.calles.profundidad

let positions = {}

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomBoolean = () => {
    return randomInt(0, 1)
}


const genRandomPositions = () => {
    // genera todas las IDs del objeto JSON 
    // Aleatoriamente asigna posiciones ocupadas con tiempo de alm.
    let state = 0
    let time = null
    for (let l = 0; l < 2; l++) {
        for (let j = 0; j < NIVELES; j++) {
            for (let p = 0; p < PROFUNDIDAD; p++) {
                for (let i = 0; i < CALLES; i++) {
                    let id = `L${l}C${i + 1}N${j + 1}P${p + 1}`
                    if (randomBoolean()) {
                        state = 1;
                        time = Number((Date.now() - Math.random() * 30 * 86400000).toFixed())
                    } else {
                        state = 0
                        time = null
                    }
                    let pos = {
                        state,
                        time,
                    };
                    positions[id] = pos
                }
            }
        }
    }
}


export {genRandomPositions, positions}