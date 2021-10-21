import { printData, exportTableToExcel } from "../tablas/print-exports.js";

// http://192.168.200.117:8080/pedidos


export default function () {
    fetch('http://168.181.186.238:8080/pedidos/procesados/1').then(res => res.json()).then(resultado => {
        let table = new DataTable('#procesada', {
            paging: false,
            scrollY: 300,
            info: false,
            data: resultado,
            sort: false,
            bFilter: false,

            columns: [
                {
                    title: "Comprobante",
                    data: "comprobante"
                },
                {
                    title: "Cliente",
                    data: "cliente"
                },
                {
                    title: "Codigo",
                    data: "cod_articulo"
                },
                {
                    title: "Liberados",
                    data: "liberados"
                },
                {
                    title: "Disponible en Deposito",
                    data: "quantity",
                    render: {
                        display: function (data, type, row) {
                            // console.log(row.liberados)
                            // console.log(data)
                            if (data <= 0 || data == null) {
                                return '<i class="bi bi-x-circle"></i>'
                            } else {
                                return data
                            }


                        }
                    }
                },

            ],
            rowGroup: {
                dataSrc: 'comprobante',
                startRender: function (rows, group) {
                    var groupName = 'group-' + group.toString().replace(/[^A-Za-z0-9]/g, '');
                    var rowNodes = rows.nodes();
                    rowNodes.to$().addClass(groupName);
                    // Assign class name to all child rows
                    return '<label class="cabecera-' + groupName + '">Número de Orden ' + group + ' (' + rows.count() + ')</label>';
                }
            },

        })



    })
}

$('#printButton').on('click', function () {
    const ID_TABLA = document.getElementById("procesada")
    printData(ID_TABLA);
})

$("#excelExport").on("click", function () {
    exportTableToExcel("procesada")
});


$('#cancelarOrden').on('click', function () {
    let table = $('#procesada').DataTable();
    let data = table.rows().data().toArray()
    console.log(data)
    enviarDatos(data)
})

$('#descargarOrden').on('click', function () {
    let table = $('#procesada').DataTable();
    let data = table.rows().data().toArray()
    document.querySelector("#descargarOrden").innerHTML = ' Descargando ... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
    data.forEach((e, index) => {
        setTimeout(() => {
            if ((data.length - 1) === index) {
                document.querySelector("#descargarOrden").innerHTML = "Descargar"
                enviarDatos(data)
            }


        }, 3000 * (index + 1));
    })
    table.rows().nodes().each((e, index) => {
        setTimeout(() => {
            e.style.background = "#22b9b9"
            e.style.color = "white"
        }, 3000 * (index + 1));

    })


})


async function enviarDatos(data) {
    let response = await fetch('http://168.181.186.238:8080/liberar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });

    let result = await response;
    console.log(result)
    if (result.status == 200) {
        alert("La orden Finalizó")
        location.reload()
    }
}