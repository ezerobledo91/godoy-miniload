
// Escala global
const GS = 18
//
const IZQUIERDO = 0
const DERECHO = 1
const FRENTE = 2

const miniload = {
    alto: 6377,
    largo: 2850.5,
    ancho: 594,
    carro: {
        ancho: 1250,
        largo: 1400
    }
}


const habitacion = {
    ancho: 6570,
    largo: 42600,

}

const deposito = {
    sectores: 2,
    ancho: 4050,
    largo: 34898,
    pasillo: 1450,
    riel: {
        x: 0,
        y: 7000,
        ancho: 120,
        largo: 34898
    },
    bandas: {
        x1: 0,
        x2: 0,
        y1: 6880,
        y2: 7120,
        largo: 34898,
        ancho: 120
    },
    alto: {
        total: 6607,
        vanoInferior: 1000,
        vanoSuperior: 1280,
        nivel: 353.3,
        eficaz: 4453
    },

    calles: {
        frente: 520,
        fondoCalle: 1300,
        niveles: 13,
        cantidad: 67,
        profundidad:2,
        //Lugar donde se encuetran transportadores
        transportadores: [
            { calle: 20, nivel: 2, lado: DERECHO },
            { calle: 25, nivel: 2, lado: DERECHO },
            { calle: 34, nivel: 2, lado: DERECHO },
            { calle: 39, nivel: 2, lado: DERECHO }]
    },
    columna: 60,

    caja: {
        ancho: 400,
        largo: 600,
        alto: 220
    },

    //Cotas, distancias, offsets
    lucesCaja: {
        // Luz de caja vs columna - columna mide 60
        lateral: 30,
        fondoRack: 100,
        entreCajas: 50
    },

    //Ubicaciones de los sectores relativo a las paredes de la habitacion
    sectores: [
        { lado: IZQUIERDO, x: 4061, y: 1200, frente: 34840, fondo: 6000 },
        { lado: DERECHO, x: 4061, y: 3950, frente: 34840, fondo: 6000 }
    ]
}

export { GS, IZQUIERDO, DERECHO, FRENTE, miniload, deposito }