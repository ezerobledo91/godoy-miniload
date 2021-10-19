import { printData } from "../functions.js";

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
                    title: "Cantidad",
                    data: "liberados"
                },

            ],
            rowGroup: {
                dataSrc: 'comprobante',
                startRender: function (rows, group) {
                    // Assign class name to all child rows
                    return '<label>Número de Orden ' + group + ' (' + rows.count() + ')</label>';
                }
            },

        })



    })




    $('#printButton').on('click', function () {
        printData();
    })

}



$('#cancelarOrden').on('click', function () {
    let table = $('#procesada').DataTable();
    let data = table.rows().data().toArray()
    console.log(data)
    enviarDatos(data)
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
        alert("La orden fué cancelada")
        location.reload()
    }
}