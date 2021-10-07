const MODAL_DESCARGA = document.createElement('template')
MODAL_DESCARGA.innerHTML = `
<div class="modal fade mymodal" id="modal-descarga" role="dialog" data-bs-backdrop="static">
<div class="modal-dialog modal-xl">
    <div class="modal-content">
        <div class="modal-header" style="padding: 10px 20px;">
            <h4 class="modal-title"><i class="bi bi-download"></i> Descarga</h4>
            <div class="buttons-modal">
                <button type="button" class="btn modalMinimize"><i class="bi-dash-lg"></i></button>
                <button type="button" class="btn white-color" data-bs-dismiss="modal" aria-label="Close" id="modal-descarga"><i class="bi bi-x-lg" id="modal-descarga"></i></button>
            </div>
        </div>
        <div class="modal-body" style="padding:40px 50px;">
            <p>Some text in the modal.</p>
        </div>
        <div class="modal-footer" style="padding:40px 50px;">
            <p>Some text in the modal.</p>
        </div>
    </div>
</div>
</div>   
    `
document.body.appendChild(MODAL_DESCARGA.content)

export {MODAL_DESCARGA}