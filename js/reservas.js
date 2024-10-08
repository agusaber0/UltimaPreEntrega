

async function enviarReservaAPI(reserva) {
    try {
        let response = await fetch('json/emulador.json');
        if (response.ok) {
            let data = await response.json();
            mostrarMensaje('Reserva enviada de forma exitosa: ' + data.message);
        } 
    } catch (error) {
        mostrarMensaje('Error al intentar enviar la reserva: ' + error.message);
    }
}

cargarReservas();

let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

document.getElementById('reservarButton').addEventListener('click', function() {
    let reserva = {};

    reserva.nombreCompleto = document.getElementById('nombreCompleto').value;
    reserva.numeroTelefono = document.getElementById('numeroTelefono').value;
    reserva.fecha = document.getElementById('fecha').value;
    reserva.cantidadEntradas = parseInt(document.getElementById('cantidadEntradas').value);
    reserva.ubicacion = document.getElementById('ubicacion').value;


    let fechaReserva = DateTime.fromISO(reserva.fecha);
    let hoy = DateTime.now();
    
    if (fechaReserva < hoy) {
        mostrarMensaje('No puedes hacer una reserva para una fecha pasada.');
        return;
    }

    if (validarCantidadEntradas(reserva.ubicacion, reserva.cantidadEntradas)) {
        if (confirmarReserva(reserva)) {
            reservas.push(reserva);
            localStorage.setItem('reservas', JSON.stringify(reservas));
            document.getElementById('formularioReserva').reset();
            mostrarMensaje('Reserva realizada con éxito. ¡Gracias por reservar!');
            enviarReservaAPI(reserva);
        }
    }
});

document.getElementById('buscarButton').addEventListener('click', function() {
    let busqueda = document.getElementById('busqueda').value;
    let resultado = reservas.find(reserva => reserva.nombreCompleto === busqueda || reserva.numeroTelefono === busqueda);

    if (resultado) {
        mostrarReserva(resultado);
    } else {
        mostrarMensaje('No se encontró ninguna reserva con esos datos.');
    }
});

function validarCantidadEntradas(ubicacion, cantidad) {
    if (ubicacion === 'Palcos') {
        mostrarMensaje('Por favor comunícate al número 0096113379790 para reservar entradas en palcos.');
        return false;
    } else if (ubicacion === 'Platea Baja' || ubicacion === 'Platea Alta') {
        if (cantidad < 1 || cantidad > 6) {
            mostrarMensaje('Debes seleccionar entre 1 y 6 entradas.');
            return false;
        }
    }
    return true;
}

function confirmarReserva(reserva) {
    let mensajeConfirmacion = `Por favor confirma los siguientes datos de tu reserva:\n
    Nombre Completo: ${reserva.nombreCompleto}\n
    Número de Teléfono: ${reserva.numeroTelefono}\n
    Fecha: ${reserva.fecha}\n
    Cantidad de Entradas: ${reserva.cantidadEntradas}\n
    Ubicación: ${reserva.ubicacion}`;
    
    return confirm(mensajeConfirmacion); 
}

function mostrarReserva(reserva) {
    document.getElementById('resultadoReserva').innerText = `Reserva encontrada:\n
    Nombre Completo: ${reserva.nombreCompleto}\n
    Número de Teléfono: ${reserva.numeroTelefono}\n
    Fecha: ${reserva.fecha}\n
    Cantidad de Entradas: ${reserva.cantidadEntradas}\n
    Ubicación: ${reserva.ubicacion}`;
}

function mostrarMensaje(mensaje) {
    document.getElementById('resultadoReserva').innerText = mensaje;
}


function calcularDiasParaReserva(fechaReserva) {
    let fecha = DateTime.fromISO(fechaReserva);
    let hoy = DateTime.now();
    let diferencia = fecha.diff(hoy, 'days').toObject();
    return Math.ceil(diferencia.days); 
}

let diasParaReserva = calcularDiasParaReserva(reserva.fecha);
if (diasParaReserva <= 3) {
    mostrarMensaje('Tu reserva es en menos de 3 días.');
}