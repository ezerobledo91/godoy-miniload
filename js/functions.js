import { INDICADOR_NIVEL_A, dibujarVistaSup, dibujarVistaAnt, V_ANTERIOR, V_SUPERIOR } from '../whjs/draw_elements.js'



const seleccionNivel = () => {
    let niveles = INDICADOR_NIVEL_A.childNodes
    INDICADOR_NIVEL_A.addEventListener(('click'), (e) => {
        if (e.target.classList.contains('indicador__nivel-anterior')) {
            niveles.forEach(element => {
                if (element.classList.contains('indicador__nivel-selecionado')) element.classList.remove('indicador__nivel-selecionado')
            });
            dibujarVistaSup(e.target.textContent)
            e.target.classList.add('indicador__nivel-selecionado')
        }
    })
}

const seleccionLadoProf = () => {
    const INDICADOR_LADO_PROF = document.getElementById('columna-lateral-s')
    let indicadorLadoProf = INDICADOR_LADO_PROF.querySelectorAll('i')
    const CONTROLES = {
        "control-izq-prof-2": () => { dibujarVistaAnt(0, 2) },
        "control-izq-prof-1": () => { dibujarVistaAnt(0, 1) },
        "control-der-prof-2": () => { dibujarVistaAnt(1, 2) },
        "control-der-prof-1": () => { dibujarVistaAnt(1, 1) }
    }

    INDICADOR_LADO_PROF.addEventListener(('click'), (e) => {
        if (e.target.classList.contains('icons__control-s')) {
            indicadorLadoProf.forEach(element => {
                if (element.classList.contains('icon__seleccionado')) element.classList.remove('icon__seleccionado')
            });
            CONTROLES[`${e.target.id}`]()
            e.target.classList.add('icon__seleccionado')
        }
    })
}

// CONTROLES DE MOVIMIENTO GRILLA
document.addEventListener("mousedown", function (e) {
    if (e.target.id == 'control-right') {
        let timer = setInterval(function () {
            V_ANTERIOR.scrollLeft += 3
        }, 20);

        document.addEventListener("mouseup", function () {
            if (timer) clearInterval(timer)
        })
    }

    if (e.target.id == "control-left") {
        let timer = setInterval(function () {
            V_ANTERIOR.scrollLeft -= 3
        }, 20);

        document.addEventListener("mouseup", function () {
            if (timer) clearInterval(timer)
        })
    }
})

V_ANTERIOR.addEventListener('scroll', function (e) {
    let horizontal = e.currentTarget.scrollLeft;
    V_SUPERIOR.scrollLeft = horizontal
});
V_SUPERIOR.addEventListener('scroll', function (e) {
    let horizontal = e.currentTarget.scrollLeft;
    V_ANTERIOR.scrollLeft = horizontal
});



/* MOVIMIENTOS DEL MINILOAD  */
const moverMiniX = (x) => {
    let c = 112
    let miniloadDraw = document.getElementById('mini-completo')
    miniloadDraw.style.left = `${x - c}px`
    miniloadDraw.style.transition = 'left , 1s'
    let miniloadDrawSup = document.getElementById('mini-completo-sup')
    miniloadDrawSup.style.left = `${x - c}px`
    miniloadDrawSup.style.transition = 'left , 1s'

}

const moverMiniY = (y) => {
    let c = 11
    let miniloadDraw = document.getElementById('cuna')
    miniloadDraw.style.top = `${y - c}px`
    miniloadDraw.style.transition = 'top , 1s'
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('rack__box')) {
        let x = e.target.offsetLeft
        moverMiniX(x)
        let y = e.target.offsetTop
        moverMiniY(y)
        let c = parseID('C', e.target.id)
        resaltarCalle(c)
    }

    if (e.target.classList.contains('rack__box-superior')) {
        let x = e.target.offsetLeft
        moverMiniX(x - 86) // 86 corrección vista superior.
        let c = parseID('C', e.target.id)
        resaltarCalle(c)
    }
})



const parseID = (query, id) => {
    switch (query) {
        case 'L':
            return (id.slice(id.indexOf('L') + 1, id.indexOf('C')))
        case 'C':
            return (id.slice(id.indexOf('C') + 1, id.indexOf('N')))
        case 'N':
            return (id.slice(id.indexOf('N') + 1, id.indexOf('P')))
        case 'P':
            return (id.slice(id.indexOf('P') + 1))
    }
}


const resaltarCalle = (c) => {
    const CALLES = document.querySelectorAll('.numeros__calle-anterior')
    const CALLES_S = document.querySelectorAll('.numeros__calle-superior')
    CALLES.forEach(calle => {
        calle.classList.remove('box__state-full')
        if (calle.textContent === c) {
            calle.classList.add('box__state-full')
        }

    })
    CALLES_S.forEach(calle => {
        calle.classList.remove('box__state-full')
        if (calle.textContent === c) {
            calle.classList.add('box__state-full')
        }

    })
}


function printData() {
    let divToPrint = document.getElementById("procesada");
    let newWin = window.open("");
    newWin.document.write('<html><head><title>Impresión de Comprobante de Descarga</title> <link rel="stylesheet" href="./css/bootstrap.css"><link rel="stylesheet" type="text/css" href="css/style.css" media="print" ><link rel="stylesheet" type="text/css" href="DataTables/DataTables-1.11.3/css/jquery.dataTables.css"></head><body>');
    newWin.document.write(divToPrint.outerHTML);
    newWin.document.body.querySelectorAll('.dataTables_sizing').forEach((index) => {
        index.style = ''
    })
    newWin.document.body.querySelectorAll('.sorting_disabled').forEach((index) => {
        index.style = ''
    })
    newWin.document.write('</body></html>');

    setTimeout(function () {
        newWin.print();
        newWin.close();
    }, 500)

}


export { seleccionNivel, seleccionLadoProf, printData }