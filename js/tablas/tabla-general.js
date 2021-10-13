// http://192.168.200.117:8080/pedidos

let mesAtras = `${(new Date(Date.now()).getFullYear())}-${(new Date(Date.now() - 30).getMonth()).toString().padStart(2, 0)}-01`
$('#min').val(mesAtras)


fetch('./pedidos/pedidos2.json').then(res => res.json()).then(resultado => {
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
                title: "Cantidad",
                data: "liberados"
            },

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

                return '<label><input type="checkbox" class="group-checkbox" data-group-name="'
                    + groupName + '"' + (isSelected ? ' checked' : '') + '> Número de Orden ' + group + ' (' + rows.count() + ')</label>';
            }
        },
        select: {
            style: 'multi'
        },
    });


    $(document).ready(function () {
        table.draw();
    });



    // --------------- Cuadro de Busqueda ------------------------------
    var table = $('#ordenes').DataTable();
    $('#searchField').keyup(function () {
        table.search($(this).val()).draw();
    })


    // --------------- filtros de fecha ------------------------------

    $('#min, #max').change(function () {
        $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
                let timeOffset = new Date(document.getElementById("min").value).getTimezoneOffset() * 60000
                let minim = (new Date(document.getElementById("min").value).getTime() + timeOffset) / 1000
                let maxim = (new Date(document.getElementById("max").value).getTime() + timeOffset) / 1000
                let date = new Date((data[5]).slice(0, 10).split('-').join('/')).getTime() / 1000
                if ((minim <= date && isNaN(maxim))
                    || (minim <= date && maxim >= date)) {
                    return true;
                }
                return false;
            }
        );


    })

    /*-------------------  fin de filtro fecha ---------------- */

    /*-------------------  filtro riesgo ---------------- */
    $('#filter-riesgo').on('change', function () {
        table.columns(6).search(this.value).draw();
    });
    /*-------------------  filtro cliente ---------------- */
    let clientes = table
        .columns(2)
        .data()
        .eq(0)      // Reduce the 2D array into a 1D array of data
        .sort()       // Sort data alphabetically
        .unique()  // Reduce the 2D array into a 1D array of data
        .each(function (value, index) {
            $('#filter-cliente').append('<option>' + value + '</option>')
        })

    $('#filter-cliente').on('change', function () {
        table.columns(2).search(this.value).draw();
    });



    /*-------------------  Borrar Filtros y Selecciones ---------------- */

    $("#borrar-filtros").on("click", function () {
        $('#filter-cliente option,#filter-riesgo option').prop('selected', function () {
            return this.defaultSelected;
        });
        $('#min').val(mesAtras) // volver a la fecha de inicio
        document.getElementById("max").valueAsDate = null // volver a null
        table.columns().checkboxes.deselectAll()
        table.columns().search("").draw() //redibujar la tabla sin filtros

    });

    // --------------- Check Box group ------------------------------

    // Handle click event on group checkbox
    $('#ordenes').on('click', '.group-checkbox', function (e) {
        // Get group class name
        var groupName = $(this).data('group-name');

        // Select all child rows
        table.cells('tr.' + groupName, 0).checkboxes.select(this.checked);
    });

    // Handle click event on "Select all" checkbox
    $('.dt-checkboxes-select-all').on('click', function (e) {
        var $selectAll = $('input[type="checkbox"]', this);
        setTimeout(function () {
            // Select group checkbox based on "Select all" checkbox state
            $('.group-checkbox').prop('checked', $selectAll.prop('checked'));
        }, 0);
    });




    /*-------------------  Obtener Datos Seleccionados ---------------- */

    $('#datos').on('click', function () {
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

    })








})

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

$('#printButton').on('click', function () {
    printData();
})


