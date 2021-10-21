
// ----------------------------- IMPRIMIR ------------------------------------------------
function printData(id) {
    let divToPrint = id;
    let newWin = window.open("");
    newWin.document.write(`
    <html>
        <head>
        <title>Impresión de Comprobante de Descarga</title>
        <link rel="stylesheet" href="css/bootstrap-icons.css">
        <link rel="stylesheet" href="./css/bootstrap.css">
        <link rel="stylesheet" type="text/css" href="css/style.css" media="print" >
        <link rel="stylesheet" type="text/css" href="DataTables/DataTables-1.11.3/css/jquery.dataTables.css">
        </head>
        <body>
    <div class="head">
        <div><img src="./assets/logo-godoy.svg"></div>
                <div><h5>Comprobante de descarga</h5></div>
                <div>
                    <div>Orden Nº: XXX-XXXX</div>
                    <div>Fecha: ${new Date(Date.now()).getDate().toString().padStart(2, 0)}-${(new Date(Date.now()).getMonth() + 1).toString().padStart(2, 0)}-${(new Date(Date.now()).getFullYear())}</div>
                    <div>Puesto Nº: </div>
                </div>
    </div>
   
     `)
    newWin.document.write(divToPrint.outerHTML);
    newWin.document.body.querySelectorAll('.dataTables_sizing').forEach((index) => {
        index.style = ''
    })
    newWin.document.body.querySelectorAll('.sorting_disabled').forEach((index) => {
        index.style = ''
    })
    newWin.document.write('<span class = "footerPage">Crosetto Software</span></body></html>');

    setTimeout(function () {
        newWin.print();
        newWin.close();
    }, 500)

}


/*  -------------------- Exportar a Excel ------------------------------ */

var exportTableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table><thead><tr><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 155.016px;">Comprobante</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 88.3125px;">Cliente</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 89.9688px;">Codigo</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 95.625px;">Articulo</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 78.4375px;">Fecha</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 85.7188px;">Riesgo</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 117.266px;">Liberados</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 107.656px;">Stock en Deposito</th></tr></thead>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Comprobantes Procesados', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})()


export { printData, exportTableToExcel }