var signaturePad = null;

function init_sign_editor() {
    var canvas = document.querySelector("#sign");
    signaturePad = new SignaturePad(canvas);
}

document.addEventListener('DOMContentLoaded', function() {
    init_sign_editor();

    document.querySelector('.main_form').addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        window.print();
    });
});

function clear_signpad() {
    signaturePad.clear();
}
