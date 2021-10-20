
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


export { printData }