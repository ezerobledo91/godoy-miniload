import { printData, exportTableToExcel } from "../tablas/print-exports.js"

/** ----------------- Opciones de Navegación por Menu 1,2,3  -----------------*/

function navOptions(e) {
    let buttonClick
    if (e == 2) {
        buttonClick = 'btn2'
    } else {
        buttonClick = e.target.id
    }

    if (buttonClick === "btn1") {
        $('#' + buttonClick).addClass('btn-primary').removeClass('btn-secondary')
        $('#btn2').removeClass('btn-primary').addClass('btn-secondary')
        $('#btn3').removeClass('btn-primary').addClass('btn-secondary')
        $('#section2').addClass('display-none')
        $('#section3').addClass('display-none')
        $('#section1').removeClass('display-none')
        $('#progressBar').css({ 'width': ' 0%' })


    }
    if (buttonClick === "btn2") {
        $('#' + buttonClick).addClass('btn-primary').removeClass('btn-secondary')
        $('#btn3').removeClass('btn-primary').addClass('btn-secondary')
        $('#section1').addClass('display-none')
        $('#section3').addClass('display-none')
        $('#section2').removeClass('display-none')
        $('#progressBar').css({ 'width': '50%' })


    }
    if (buttonClick === "btn3") {
        $('#' + buttonClick).addClass('btn-primary').removeClass('btn-secondary')
        $('#section1').addClass('display-none')
        $('#section2').addClass('display-none')
        $('#section3').removeClass('display-none')
        $('#progressBar').css({ 'width': '100%' })
    }

}


$('#buscarProducto').on('click', () => {
    const URL = 'http://168.181.186.238:8080/product/'
    let cod = $('#inputCodigoArticulo')[0].value
    findProduct(URL, cod)
})

$('#btn1,#btn2,#btn3').on('click', e => {
    navOptions(e)
})



//http://168.181.186.238:8080/product/ROD17SKF8
// boxes/codbar/

/**  --------------------- Buscar Producto en BD --------------------------------- */
let listaPedidos = []

function findProduct(URL, cod) {
    $('#addBoxes').off()
    $('#buscarProducto').html(` <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div> Buscando`)
    fetch(URL + cod).then(res => res.json()).then(articulo => {
        if (articulo[0] == undefined) {
            $('.table').css({ display: "" })
            $('#buscarProducto').html(`<i class="bi bi-search"></i> Buscar`)
            $('#tablaBusqueda').html(`
                    <tr>
                    <th colspan="4" ><i class="bi bi-file-earmark-x"></i> Articulo no encontrado.</th>
                    </tr>
            
            `)

        } else {
            const { cod, descr, linea, stock } = articulo[0]
            $('.table').css({ display: "" })
            $('#buscarProducto').html(`<i class="bi bi-search"></i> Buscar`)
            $('#tablaBusqueda').html(`
                    <tr style="font-size:14px">
                        <th scope="row">${cod}</th>
                        <td>${descr}</td>
                        <td>${linea}</td>
                        <td>${stock == null ? 0 : stock}</td>
                    </tr>
                    <tr>
                    <th colspan="4" >Gavetas con espacio disponible para almacenamiento</th>
                    </tr>
                    <tr>
                    <th colspan="3" id="boxInf"></th>
                    </tr>
                `)
            getInfoBox(articulo[0])
        }
    })
}




/** Buscar infomacion de los box relacionados al articulo.  Añadir Eventos de seleccion despues de recibir la informacion.  */
function getInfoBox(articulo) {
    const { cod, descr, linea, stock } = articulo
    const URL = 'http://168.181.186.238:8080/boxes/codbar/'
    fetch(URL + articulo.cod).then(res => res.json()).then(gaveta => {
        if (gaveta[0] == undefined) {                            //  Si el articulo no contiene gavetas relacionadas 
            $('#boxInf').css({ "display": "none" })

            $('#addBoxes').on('click', () => {                                    // evento para añadir a la lista de pedido 
                let gavetasVacias = $('#inputCantidadCajas').val()
                if (gavetasVacias == 0 || gavetasVacias == null) {
                    $('#boxPedidos').html(`
                    <div class="alert alert-warning" style="width: inherit; display: flex;">
                     <span class="mx-4">Debe solicitar al menos 1 gaveta vacía para continuar.</span>
                    </div>
                           `)
                    setTimeout(() => { $('#boxPedidos').html('') }, 5000);

                } else {
                    listaPedidos.push({ cod: cod, descrip: descr, gavetas_relacionadas: " ", gavetas_vacias: gavetasVacias }) // creo el  array de objetos para la lista de carga sin gavetas relacionadas
                    createTable(listaPedidos)
                    $('#addBoxes').off()
                    $('input').val('')
                    $('#tablaBusqueda').html('')
                }

            })

        } else {
            const { crate_id, qty_of_mod, ubicacion, quantity, is_full } = gaveta[0]

            if (is_full == 1) {

            } else {
                $('#boxInf').append(`
              <ul class="list-group gavetas-select" style="font-size: 12px" id="${crate_id}">
                    <li class="list-group-item d-flex justify-content-between align-items-center p-1">
                        Codigo de Gaveta: ${crate_id}
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center p-1">
                        Tipo de Gaveta: ${qty_of_mod} div.
                     </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center p-1">
                        Ubicación del articulo: ${ubicacion}
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center p-1">
                    Stock: ${quantity} u
                    </li>
                </ul>
                    `)
            }

            let gavetasSelected = []
            $('.gavetas-select').on('click', (e) => {
                e.currentTarget.classList.toggle('gavetas-select-ok')
            })


            $('#addBoxes').on('click', () => {
                let gavetasVacias = $('#inputCantidadCajas').val()
                let gavetaSelect = $('.gavetas-select-ok') // gavetas disponibles para reposicion 
                if (gavetaSelect.length == 0) {
                    $('#boxPedidos').html(`
                    <div class="alert alert-warning" style="width: inherit; display: flex;">
                     <span class="mx-4">Debe solicitar al menos 1 gaveta vacía o 1 gaveta relacionada disponible para continuar.</span>
                    </div>
                           `)
                    setTimeout(() => { $('#boxPedidos').html('') }, 5000);
                } else {
                    for (let index = 0; index < gavetaSelect.length; index++) {
                        gavetasSelected.push(gavetaSelect[index].id)
                    }
                    listaPedidos.push({ cod: cod, descrip: descr, gavetas_relacionadas: gavetasSelected, gavetas_vacias: gavetasVacias }) // creo el  array de objetos para la lista de carga

                    createTable(listaPedidos)
                    $('#addBoxes').off()
                    $('input').val('')
                    $('#tablaBusqueda').html('')

                }


            })

        }
    })

}


/** ------------- Crear Tabla Pedidos----------------- */

function createTable(listaPedidos) {
    $('#tablaPedidos').html('')
    for (let pedido of listaPedidos) {
        $('#tablaPedidos').append(`
            <tr style="font-size:14px">
            <th scope="row">${pedido.cod}</th>
            <td>${pedido.descrip}</td>
            <td>${pedido.gavetas_relacionadas}</td>
            <td>${pedido.gavetas_vacias}</td>
            <td _id="${pedido.cod}"  class="btn__clear-table delete"><i class="bi bi-x-circle-fill"></i></td>
            </tr>
    `)

    }
    $('.delete').on('click', (e) => {
        let codProduct = e.currentTarget.getAttribute('_id')
        deleteArtic(codProduct)
        createTable(listaPedidos)

    })
}


/** -------------------------  Remover pedidos de la tabla  de pedidos ----------------- */
function deleteArtic(codProduct) {
    for (const [index, pedido] of listaPedidos.entries()) {
        if (pedido.cod == codProduct) {
            listaPedidos.splice(index, 1)
        }
    }
}

/** -------------------------  Eventos de Pedido de Cajas  ----------------- */

$('#pedirCajas').on('click', () => {
    if (listaPedidos.length > 0) {
        let pedidos = listaPedidos.slice()
        pedidos.forEach(pedido => { delete pedido.descrip })

        $('#boxPedidos').html(`
             <div class="alert alert-info" style="width: inherit; display: flex;">
                <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
                     <span class="mx-4">Procesando...   Buscando la gaveta Nº ----- . </span>
             </div>
                    `)

        enviarDatos(pedidos)
        pedidosEnProceso()

        setTimeout(() => { navOptions(2) }, 5000);
    } else {
        $('#boxPedidos').html(`
             <div class="alert alert-warning" style="width: inherit; display: flex;">
              <span class="mx-4">Debe añadir articulos a la Orden de Carga</span>
             </div>
                    `)

        setTimeout(() => { $('#boxPedidos').html('') }, 5000);

    }

})

/** --------------- Atributos de Tabla para pedidos cuando se encuentren en Proceso ----------- */

function pedidosEnProceso() {
    const buttonsRemove = $('.btn__clear-table')
    for (let index = 0; index < buttonsRemove.length; index++) {
        buttonsRemove[index].remove()
    }

    $('#tablaPedidos').css({ 'color': '#767676' })
    $('#pedirCajas').prop('disabled', true)
}


// ------------  Procesar Orden Seleccionada. -----------------------

// async 
function enviarDatos(data) {
    // let response = await fetch('http://168.181.186.238:8080/procesados/generar/1', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json;charset=utf-8'
    //     },
    //     body: JSON.stringify(data)
    // });

    // let result = await response;
    // console.log(result)
    console.log(JSON.stringify(data))
}




/**  --------------------    Configurar Disposición de Gaveta  ---------------------------*/

$('#selectDivisiones').on('change', (e) => {
    let optionsBox = {
        4: `
        <div class="row"  style="height: 70px;">
            <div class="col" celda="1">
                1
            </div>
            <div class="col" celda="2">
                2
            </div>
        </div>
        <div class="row"  style="height: 70px;">
            <div class="col" celda="3">
                3
            </div>
            <div class="col" celda="4">
                4
            </div>
        </div>`
        ,
        2: `
        <div class="row"  style="height: 140px;">
            <div class="col" celda="1">
                1
            </div>
            <div class="col" celda="2">
                2
            </div>
        </div>
        `,
        1: ' '
    }

    $('#gavetaDraw').html(optionsBox[e.target.value])
})



$('#gavetaDraw').on('click', (e) => {
    document.querySelector('.selected-cell') != null ? document.querySelector('.selected-cell').classList.remove('selected-cell') : ' '
    e.target.classList.toggle('selected-cell')
})



/** -----------  Obtener Datos de Form Configuración de Box y Enviar al Deposito -------- */

$('#despacharBox').on('click', () => {

    let cellSelected = document.querySelector('.selected-cell')
    let cantidad = $('#inputCantidadArt').val()
    let divisiones = $('#selectDivisiones').val()
    let cell = divisiones != 1 ? (cellSelected != null ? cellSelected.getAttribute('celda') : 0) : 1
    let rotacion = $('#selectRotacion').val()
    let full = $('#boxClose').prop('checked')
    const configBox = {
        cantidad: cantidad,
        divisiones: divisiones,
        celda: cell,
        rotacion: rotacion,
        full: full == true ? 1 : 0
    }



    /** Error Mensajes */
    if (cantidad == 0) {
        $('#boxPedidos').html(`
    <div class="alert alert-warning" style="width: inherit; display: flex;">
     <span class="mx-4">Debe añadir una cantidad. Si no necesita realizar la carga, por favor devolver la misma al deposito.</span>
    </div>
           `)
        setTimeout(() => { $('#boxPedidos').html('') }, 5000);
    } else if (cell == 0) {
        $('#boxPedidos').html(`
        <div class="alert alert-warning" style="width: inherit; display: flex;">
         <span class="mx-4">Debe seleccionar un celda de la gaveta para continuar.</span>
        </div>
               `)
        setTimeout(() => { $('#boxPedidos').html('') }, 5000);

    } else {
        console.log(configBox)
        $('#boxPedidos').html(`
        <div class="alert alert-info" style="width: inherit; display: flex;">
           <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
                <span class="mx-4">Enviando la gaveta al deposito. </span>
        </div>
               `)
        setTimeout(() => { $('#boxPedidos').html('') }, 3000)
        $('#gavetaDraw').html('')                               // Reset Draw
        document.getElementById('configuracionBox').reset(); // Reset Form

    }




})



/**  ---------------------- Print Exports Buttons ------------------ */

$('#printButton').on('click', () => {
    const ID_TABLA = document.getElementById('ordenCarga')
    printData(ID_TABLA)

})

$("#excelExport").on("click", function () {
    exportTableToExcel("ordenCarga")
});