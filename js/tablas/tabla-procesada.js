import { printData } from "../functions.js";

// http://192.168.200.117:8080/pedidos


export default function (){ 
 fetch('./pedidos/pedidosreducidos.json').then(res => res.json()).then(resultado => {
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