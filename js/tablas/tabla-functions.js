


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
    $('.dt-checkboxes-select-all').on('click', function () {
        operationSelectRows()
    })

    table.on('click', 'tr', function () {
        operationSelectRows()
    })

    function operationSelectRows() {
        setTimeout(function () {
            let dataObject = table.rows({ selected: true }).data() // array de objetos seleccionados (rows)
            let allData = table.rows().data()  // Todos los datos de la seleccion actual
            function seleccionSimple() {
                dataObject.each(e => {
                    let valueOfDisponible = table.cell({ row: (e.id_), column: 10 }).data()  // celda seleccionada actual , columna 10 (disponible en stock)
                    let valueOfLiberado = table.cell({ row: (e.id_), column: 8 }).data()  // celda seleccionada actual , columna 8 (liberados)
                    let resultadoOf = valueOfDisponible - valueOfLiberado
                    if (resultadoOf < 0) {
                        table.cell({ row: (e.id_), column: 12 }).nodes()[0].innerHTML = '<i class="bi bi-x-circle"></i>'
                    } else {
                        table.cell({ row: (e.id_), column: 12 }).nodes()[0].innerHTML = resultadoOf
                    }
                })
            }

            allData.each(e => {
                table.row(e.id_).node().classList.contains("selected") ? 0 : table.cell({ row: (e.id_), column: 12 }).nodes()[0].innerHTML = ' '
            })

            seleccionSimple()

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

            // ----   Sumatoria de Cantidades de Articulos y Operación por cada Grupo, innerHTML en celda correspondiente al Index!  

            for (const property in result) {
                let grupoRepetidos = result[property]
                let sumatoria = 0
                grupoRepetidos.forEach(element => {
                    sumatoria += element.liberados
                })

                for (let index = 0; index < dataObject.length; index++) {
                    grupoRepetidos.forEach(element => {
                        if (dataObject[index].id_ === element.id_) {
                            let celda = table.cell({ row: (element.id_), column: 12 }).nodes()[0]
                            let valueOfDisponible = table.cell({ row: (element.id_), column: 10 }).data()
                            let operacion = valueOfDisponible - sumatoria
                            if (operacion < 0) {
                                celda.innerHTML = '<i class="bi bi-x-circle"></i>'
                            } else {
                                celda.innerHTML = operacion
                            }

                        }
                    })
                }

            }

        }, 10)
    }

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







export { nonSelect, groupCheck, filtrosLoad, filtroFecha, enviarDatos }