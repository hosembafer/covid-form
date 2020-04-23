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

const MAP_API_KEY = "AIzaSyDSBf13VbI5FfrisaYaTZP96Wm2snpDBG4";

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

    document.querySelector("#locate_start").addEventListener('click', (evt) => {
        getLocation();
    })
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

    const us = (s) => s.split(' ').join('_');

    const fileName = us(`${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()} ${val('time_from').replace(':', '-')} for ${val('full_name')} COVID LETTER`);

    outNode.classList.add('absoluteVisible');
    html2pdf()
        .from(outNode)
        .save(fileName);
    setTimeout(() => outNode.classList.remove('absoluteVisible'), 0);
    alert('Ներբեռնված է');
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(appendAddress);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function appendAddress(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?region=es&language=hy&latlng=${latitude},${longitude}&key=${MAP_API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(res => {
            document.getElementById("address_from").value = resolveAddress(res)
        });
}

function resolveAddress(response) {
    return response.results.find(res => res.types[0] === 'street_address')?.formatted_address;
}