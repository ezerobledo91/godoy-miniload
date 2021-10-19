
// ----------------------------- IMPRIMIR ------------------------------------------------
function printData(id) {
    let divToPrint = id;
    let newWin = window.open("");
    newWin.document.write('<html><head><title>Impresión de Comprobante de Descarga</title><link rel="stylesheet" href="css/bootstrap-icons.css"><link rel="stylesheet" href="./css/bootstrap.css"><link rel="stylesheet" type="text/css" href="css/style.css" media="print" ><link rel="stylesheet" type="text/css" href="DataTables/DataTables-1.11.3/css/jquery.dataTables.css"></head><body>');
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
        // newWin.close();
    }, 500)

}


// --------------- No permitir check de Ordenes ya Procesadas ------------------------------
function nonSelect(table) {
    let arrayGroups = []
    let inputsGroup = []

    table.column(9).data().each(function (value, index) {
        let comprobante = table.rows(index).data()[0].comprobante
        if (value == 2) {
            table.rows(index).nodes()[0].classList.add('en-proceso', 'no-select')
            arrayGroups.push(comprobante)
        }
    })
    arrayGroups = jQuery.unique(arrayGroups)
    arrayGroups.forEach(function (e) {
        inputsGroup.push(
            {
                checkbox: document.querySelector(`input[data-group-name="group-${e}"]`),
                inputs: document.querySelectorAll(`.group-${e}`),
                inputsEnProceso: document.querySelectorAll(`.group-${e}.en-proceso`),
                groupNumber: e
            }
        )
    })

    inputsGroup.forEach(object => {
        object.inputsEnProceso.forEach(element => {
            if (element.querySelector('input') != null) element.querySelector('input').remove()
        })
        if (object.inputs.length == object.inputsEnProceso.length && object.checkbox != null) {
            object.checkbox.remove()
        }
    })
}


// --------------- Activar el Check Box group ------------------------------
function groupCheck(table) {
    // Handle click event on group checkbox
    $('#ordenes').on('click', '.group-checkbox', function (e) {
        // Get group class name
        var groupName = $(this).data('group-name');
        // Select all child rows
        table.cells('tr.' + groupName, 0).checkboxes.select(this.checked);
        table.cells('tr.no-select', 0).checkboxes.deselect()  // NO PERMITE EN LA SELECCION DEL GRUPO GENERAL SELECCIONAR UN ROW QUE YA ESTE PROCESADO
    });

    // Handle click event on "Select all" checkbox
    $('.dt-checkboxes-select-all').on('click', function (e) {
        var $selectAll = $('input[type="checkbox"]', this);
        setTimeout(function () {
            // Select group checkbox based on "Select all" checkbox state
            $('.group-checkbox').prop('checked', $selectAll.prop('checked'));
            table.cells('tr.no-select', 0).checkboxes.deselect()

        }, 10);

    });
}




// ------------------------------------------------ Filtros y Busquedas ----------------------------------


function filtrosLoad(table, mesAtras) {
    // --------------- Cuadro de Busqueda ------------------------------
    $('#searchField').keyup(function () {
        table.search($(this).val()).draw();
    })

    /*-------------------  filtro riesgo ---------------- */
    $('#filter-riesgo').on('change', function () {
        table.columns(7).search(this.value).draw();
    });

    /*-------------------  filtro cliente ---------------- */
    let filterCliente = "#filter-cliente"
    count(table.columns(2).data().eq(0).sort(), filterCliente)
    // table
    //     .columns(2)
    //     .data()
    //     .eq(0)      // Reduce the 2D array into a 1D array of data
    //     .sort()       // Sort data alphabetically
    //     .unique()  // Reduce the 2D array into a 1D array of data
    //     .each(function (value, index) {
    //         $('#filter-cliente').append('<option>' + value + '</option>')
    //     })

    $('#filter-cliente').on('change', function () {
        table.columns(2).search(this.value.replace(/ *\([^)]*\) */g, "")).draw();
    });
    /*-------------------  filtro código (count cuenta los repetidos en array) ------- */
    let filterCodigo = "#filter-codigo"
    count(table.columns(3).data().eq(0).sort(), filterCodigo)

    function count(array, filterId) {
        var current = null;
        var cnt = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] != current) {
                if (cnt > 0) {
                    $(filterId).append(`<option>${current}  (${cnt})</option>`)
                }
                current = array[i];
                cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 0) {
            $(filterId).append(`<option>${current}  (${cnt})</option>`)
        }

    }

    $('#filter-codigo').on('change', function () {
        table.columns(3).search(this.value.replace(/ *\([^)]*\) */g, "")).draw(); // replace valores entre ()
    });


    /*-------------------  filtro fecha listener ---------------- */
    document.querySelector(".filtros").addEventListener("change", (e) => {
        if (e.target.id == "max" || e.target.id == "min") filtroFecha(table)
    })


    /*-------------------  Borrar Filtros y Selecciones ---------------- */

    $("#borrar-filtros").on("click", function () {
        $('#filter-cliente option,#filter-riesgo option,#filter-codigo option').prop('selected', function () {
            return this.defaultSelected;
        });
        $('#min').val(mesAtras) // volver a la fecha de inicio
        document.getElementById("max").valueAsDate = null // volver a null
        table.columns().checkboxes.deselectAll()
        table.columns().search("").draw() //redibujar la tabla sin filtros

    });

    // --------------- Cambio de Color según stock ------------------------------
    table.column(10).data().each(function (value, index) {
        let stock = table.rows(index).data()[0].liberados
        if (value < stock) {
            table.rows(index).nodes()[0].style.color = "#959595"
            // table.rows(index).nodes()[0].lastChild.innerHTML = '<i class="bi bi-x-circle"></i>'
        }
    })


    //----------------------------- Conversión en tiempo real de disponible en cada operación ---------------------------
    table.on('click', 'tr', function () {
        let object = this
        setTimeout(function () {
            let dataObject = table.rows().data() // array de objetos seleccionados (rows)
            let indexOfData = table.row(object).index()   // index de la seleccion actual
            let valueOfDisponible = table.cell({ row: indexOfData, column: 10 }).data()      // celda seleccionada actual , columna 10 (disponible en stock)
            let valueOfLiberado = table.cell({ row: indexOfData, column: 8 }).data()        // celda seleccionada actual , columna 8 (liberados)
            let cellOfOperacion = table.cell({ row: indexOfData, column: 12 }).nodes()[0]   // celda seleccionada actual , columna 12 (Lo que va quedando disponible en cada operación)
            let resultadoOf = 0

            if (object.classList.contains("selected")) {
                resultadoOf = valueOfDisponible - valueOfLiberado
                if (resultadoOf < 0) {
                    cellOfOperacion.innerHTML = '<i class="bi bi-x-circle"></i>'
                } else {
                    cellOfOperacion.innerHTML = resultadoOf
                }

            } else {
                cellOfOperacion.innerHTML = ""
            }



            // ------  Busca y deja solo los objetos repetidos por cod_articulo  -------
            function searchObject(array) {
                const busqueda = array.reduce((acc, array) => {
                    acc[array.cod_articulo] = ++acc[array.cod_articulo] || 0;
                    return acc;
                }, {});

                const duplicados = array.filter((array) => {
                    return busqueda[array.cod_articulo];
                });
                return duplicados.sort(compare)
            }

            // ------   Compare ordena elementos -------
            function compare(a, b) {
                if (a.cod_articulo < b.cod_articulo) {
                    return -1;
                }
                if (a.cod_articulo > b.cod_articulo) {
                    return 1;
                }
                return 0;
            }

            let artRepetidos = searchObject(dataObject)

            // ------  Agrupa Articulos Repetidos   -------
            let result = artRepetidos.reduce(function (h, obj) {
                h[obj.cod_articulo] = (h[obj.cod_articulo] || []).concat(obj);
                return h;
            }, {})

            // ----   Sumatoria de Cantidades de Articulos y Operación por cada Grupo  

            for (const property in result) {
                let grupoRepetidos = result[property]
                let sumatoria = 0
                grupoRepetidos.forEach(element => {
                    sumatoria += element.liberados
                })

                for (let index = 0; index < dataObject.length; index++) {
                    grupoRepetidos.forEach(element => {
                        if (dataObject[index].id === element.id) {
                            let celda = table.cell({ row: index, column: 12 }).nodes()[0]
                            celda.innerHTML = sumatoria
                        }
                    })
                }

            }



            // let sumatoria = 0
            // let resultado = 0
            // if (objectRepeat.length > 1) {
            //     objectRepeat.forEach(element => {
            //         sumatoria += element.liberado
            //     })
            //     resultado = valueOfDisponible - sumatoria
            //     cellOfOperacion.innerHTML = resultado
            //     if (resultado < 0) {
            //         alert("La cantidad que desea descargar no puede ser cubierta con el stock disponible de toda la operacion seleccionada")
            //     }
            // }

        }, 10)
    })
}


// ------------------- Filtro de Fecha ----------------------------
function filtroFecha(table) {
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

    table.draw()
}




// ------------  Procesar Orden Seleccionada. -----------------------

async function enviarDatos(data) {
    let response = await fetch('http://168.181.186.238:8080/procesados/generar/1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });

    let result = await response;
    console.log(result)
    if (result.status == 200) {
        alert("La orden fué procesada correctamente, debe visualizarlo desde la pantalla Principal")
        location.reload()
    }
}







export { printData, nonSelect, groupCheck, filtrosLoad, filtroFecha, enviarDatos }