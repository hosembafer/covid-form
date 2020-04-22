const months = [
    'Հունվար / January / Январь',
    'Փետրվար / February / Февраль',
    'Մարտ / March / Март',
    'Ապրիլ / April / Апрель',
    'Մայիս / May / Май',
    'Հունիս / June / Июнь',
    'Հուլիս / July / Июль',
    'Օգոստոս / August / Август',
    'Սեպտեմբեր / September / Сентябрь',
    'Հոկտեմբեր / October / Октябрь',
    'Նոյեմբեր / November / Ноябрь',
    'Դեկտեմբեր / December / Декабрь',
];

var signaturePad = null;

function init_sign_editor() {
    var canvas = document.querySelector("#sign");
    signaturePad = new SignaturePad(canvas, {
        penColor: '#4285f4'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    init_sign_editor();

    document.querySelector('.main_form').addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        buildAndDownload();
    });
});

function clear_signpad() {
    signaturePad.clear();
}

function buildAndDownload() {
    const outNode = document.getElementById('output');
    const val = (field) => document.getElementById(field).value;
    const out = (field) => (value) => document.getElementById(`out-${field}`).innerHTML = value;
    const mapOut = (field) => out(field)(val(field));

    const dateObj = new Date(val('date'));
    const date = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`
    out('date')(date);

    mapOut('full_name');
    mapOut('time_from');
    mapOut('address_from');
    mapOut('address_to');
    mapOut('reason');
    mapOut('time_to');

    out('sign')(`<img src='${signaturePad.toDataURL()}' />`);

    outNode.classList.add('absoluteVisible');
    html2pdf()
        .from(outNode)
        .save();
    setTimeout(() => outNode.classList.remove('absoluteVisible'), 0);
}