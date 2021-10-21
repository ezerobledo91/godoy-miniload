import { nonSelect, filtrosLoad, groupCheck, enviarDatos } from './tabla-functions.js'
import { printData, exportTableToExcel } from '../tablas/print-exports.js'
let mesAtras = `${(new Date(Date.now()).getFullYear())}-${(new Date(Date.now() - 30).getMonth()).toString().padStart(2, 0)}-01`
$('#min').val(mesAtras)


const URL = 'http://168.181.186.238:8080/pedidos'
//http://bnbandeo.com.ar:8080/liberar
//http://bnbandeo.com.ar:8080/liberartodas
//http://168.181.186.238:8080/pedidos
// ./pedidos/pedidos.json

tablaPrincipal(URL, mesAtras)
function tablaPrincipal(URL, mesAtras) {
    fetch(URL).then(res => res.json()).then(resultado => {
        resultado.forEach((linea, index) => {
            Object.assign(linea, { id_: index })
        })

        new DataTable('#ordenes', {
            paging: false,
            scrollY: 600,
            data: resultado,
            info: true,
            dom: 'lrti',
            infoCallback: function (settings, start, end, max, total, pre) {
                return 'Total de Artículos ' + total + " de " + max;
            },
            language: {
                info: 'Mostrando  _END_  de _TOTAL_ ',
                infoFiltered: 'filtrado de  _MAX_ ',
                select: {
                    rows: ""
                },
                search: "Buscar:"
            },

            columns: [
                {
                    'data': 'comprobante',
                    'checkboxes': {
                        'selectRow': true
                    }
                },
                {
                    title: "Comprobante",
                    data: "comprobante",
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
                    title: "Articulo",
                    data: "articulo"
                },
                {
                    title: "Fecha Aprobación",
                    data: "fecha_aprob",
                    render: {
                        display: function (data, type, row) {
                            return data.slice(0, 10).split('-').reverse().join('/')
                        },
                        sort: function (data, type, row) {
                            return new Date(data).getTime()
                        }
                    }
                },
                {
                    title: "Fecha Solicitado",
                    data: "fecha_solic",
                    render: {
                        display: function (data, type, row) {
                            return data.slice(0, 10).split('-').reverse().join('/')
                        },
                        sort: function (data, type, row) {
                            return new Date(data).getTime()
                        }
                    }
                },
                {
                    title: "Riesgo",
                    data: "riesgo"
                },
                {
                    title: "Liberados",
                    data: "liberados"
                },

                {
                    data: "estado",
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
                {
                    title: "Stock General",
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
                {
                    title: "Disponible post Operación",
                    data: null,
                    defaultContent: "",

                }

            ],

            rowGroup: {
                dataSrc: 'comprobante',
                startRender: function (rows, group) {
                    // Assign class name to all child rows
                    var groupName = 'group-' + group.toString().replace(/[^A-Za-z0-9]/g, '');
                    var rowNodes = rows.nodes();
                    rowNodes.to$().addClass(groupName);
                    // Get selected checkboxes
                    var checkboxesSelected = $('.dt-checkboxes:checked', rowNodes);
                    // Parent checkbox is selected when all child checkboxes are selected
                    var isSelected = (checkboxesSelected.length == rowNodes.length);
                    return '<label class="d-flex align-items-center justify-content-evenly" style="width:250px"><input type="checkbox" class="group-checkbox" data-group-name="'
                        + groupName + '"' + (isSelected ? ' checked' : '') + '> Número de Orden ' + group + ' <span class="badge bg-light text-dark">' + rows.count() + '</span></label>';
                }
            },
            select: {
                style: 'multi',
                selector: 'tr:not(.no-select)'
            },


        });

        let table = $('#ordenes').DataTable();

        // table.column(0).visible(false);
        table.column(9).visible(false); // -> Ocultar Columna Estado

        nonSelect(table)
        table.on('draw', function () {
            nonSelect(table)
        });

        groupCheck(table)
        filtrosLoad(table, mesAtras)

        //* -------- FIN LOAD TABLA DISPLAY QUITAR SPINER DIBUJAR ---------- */
        $('.spinner-border').remove()


    })
}


/*-------------------  Dibujado de Tabla con Datos Seleccionadas MODAL ---------------- */

$('#datos').on('click', function () {
    let table = $('#ordenes').DataTable();
    if ($.fn.DataTable.isDataTable('#procesada')) {
        data = table.rows({ selected: true }).data().toArray();
        $('#procesada').DataTable().rows.add(data); // Add new data
        $('#procesada').DataTable().columns.adjust().draw(); // Redraw the DataTable
        setTimeout(function () {
            $('#procesada').DataTable().draw()
        }, 200)

    } else {
        var data = table.rows({ selected: true }).data().toArray();
        new DataTable('#procesada', {
            paging: false,
            scrollY: 500,
            info: false,
            data: data,
            sort: false,
            bFilter: false,
            columns: [
                {
                    title: "Comprobante",
                    data: "comprobante",
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
                    title: "Articulo",
                    data: "articulo"
                },
                {
                    title: "Fecha",
                    data: "fecha_aprob",
                    render: {
                        display: function (data, type, row) {
                            return data.slice(0, 10).split('-').reverse().join('/')
                        },
                        sort: function (data, type, row) {
                            return new Date(data).getTime()
                        }
                    }
                },
                {
                    title: "Riesgo",
                    data: "riesgo"
                },
                {
                    title: "Liberados",
                    data: "liberados"
                },
                {
                    title: "Stock en Deposito",
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
                }

            ],

            rowGroup: {
                dataSrc: 'comprobante',
                startRender: function (rows, group) {
                    return '<label>Número de Orden ' + group + ' (' + rows.count() + ')</label>';
                }
            },
        })

        // Demorar dibujo para que carguen los estilos de columna 
        var tablaProcesada = $('#procesada').DataTable();
        setTimeout(function () {
            tablaProcesada.draw();
        }, 200)


    }

    // ----------------- Cancelar Orden ------------------

    $('#cancelarProceso').on('click', function () {
        $('#procesada').DataTable().clear()

    })

    //------  Enviar Orden POST ---------------------
    $('#enviarDatos').on('click', function () { enviarDatos(data) })
})


$("#excelExport").on("click", function () {
    exportTableToExcel("procesada")
});


$('#printButton').on('click', function () {
    const ID_TABLA = document.getElementById("procesada")
    printData(ID_TABLA);
})




