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

const MAP_PROVIDER = 'here'; // [google, here]

let signaturePad = null;
let locateAddressSpinnerNode = null;

const val = (field) => document.getElementById(field).value;
const setVal = (field) => (value) => document.getElementById(field).value = value;
const out = (field) => (value) => document.getElementById(`out-${field}`).innerHTML = value;
const mapOut = (field) => out(field)(val(field));

function init_sign_editor() {
    const canvas = document.querySelector("#sign");
    signaturePad = new SignaturePad(canvas, {
        penColor: '#4285f4'
    });
}

function resizeSignaturePadCanvas() {
    const canvas = document.querySelector("#sign");
    canvas.width = document.querySelector("#sign-wrapper").offsetWidth;
    canvas.height = canvas.width / 2;
}

window.addEventListener("resize", resizeSignaturePadCanvas);

document.addEventListener('DOMContentLoaded', () => {
    init_sign_editor();
    locateAddressSpinnerNode = document.querySelector('#locate_start span');
    resizeSignaturePadCanvas();

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        buildAndDownload();
    });

    document.querySelector("#locate_start").addEventListener('click', () => getLocation());
});

function clear_signpad() {
    signaturePad.clear();
}

function buildAndDownload() {
    const outNode = document.getElementById('output');

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
        locateAddressSpinnerNode.classList.add('spinner-grow');
        navigator.geolocation.getCurrentPosition(appendAddress);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function makeGeolocatorUrl({ latitude, longitude }) {
    const opts = {
        here: () => `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&lang=hy-HY&apiKey=iyzIIN0ab4nRWGNWfxvPHSsMcnb1eVlTmagpCq5UrE4`,
        google: () => `https://maps.googleapis.com/maps/api/geocode/json?region=es&language=hy&latlng=${latitude},${longitude}&key=AIzaSyDSBf13VbI5FfrisaYaTZP96Wm2snpDBG4`,
    };
    return opts[MAP_PROVIDER]();
}

function appendAddress(position) {
    const url = makeGeolocatorUrl(position.coords);
    fetch(url)
        .then(response => response.json())
        .then((res) => setVal('address_from')(resolveAddress(res)))
        .then(() => locateAddressSpinnerNode.classList.remove('spinner-grow'));
}

function resolveAddress(response) {
    const opts = {
        here: () => response.items[0].title,
        google: () => response.results.find(res => res.types[0] === 'street_address').formatted_address,
    };
    return opts[MAP_PROVIDER]();
}
