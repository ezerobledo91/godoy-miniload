const MODAL_CARGA = document.createElement('template')
MODAL_CARGA.innerHTML = `
<div class="modal fade mymodal" id="modal-carga" role="dialog" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header" style="padding: 10px 20px;">
                <h4 class="modal-title"><i class="bi bi-upload"></i> Carga</h4>
                <div class="buttons-modal">
                    <button type="button" class="btn modalMinimize"> <i class="bi-dash-lg"></i> </button>
                    <button type="button" class="btn white-color" data-bs-dismiss="modal" aria-label="Close"
                        id="modal-carga"><i class="bi bi-x-lg" id="modal-carga"></i></button>
                </div>
            </div>
            <div class="modal-body" style="padding:40px 50px;">
                <form class="row g-3">
                    <div class="row mb-3">
                        <div class="col-sm-5">
                        <label for="inputCod" class="form-label">Codigo de Barras</label>
                        <input type="number" class="form-control" id="inputCod">
                        </div>
                    </div>
                    <div class="row-mb-3">
                        <div class="col-sm-5">
                        <label for="inputArticulo" class="form-label">Nombre del Articulo</label>
                        <input type="text" class="form-control" id="inputArticulo" disabled>
                        </div>
                    </div>
                    <div class="row-mb-3">
                        <div class="col-sm-5">
                        <label for="inputCodigo" class="form-label">Código</label>
                        <input type="text" class="form-control" id="inputCodigo" disabled>
                        </div>
                    </div>
                    <div class="row-3">
                        <div class="col-sm-5">
                        <label for="inputGaveta" class="form-label">Tipo de Gaveta</label>
                        <input type="text" class="form-control" id="inputGaveta" placeholder="Sin Divisiones">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="col-sm-5">
                        <label for="inputCantidad" class="form-label">Cantidad</label>
                        <input type="number" class="form-control" id="inputCantidad"
                            placeholder="Ingrese la Cantidad">
                        </div>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Enviar</button>
                    </div>
                </form>
            </div>
            <div class="modal-footer" style="padding:40px 50px;">
            </div>
        </div>
    </div>
</div>
`

document.body.appendChild(MODAL_CARGA.content)


export {MODAL_CARGA}