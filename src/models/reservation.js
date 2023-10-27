export default class ReservationModel {
    static BaseForm() {
        return {
            nombre: '',
            documento: '',
            precioVenta: null,
            idTransport: null,
            abono: null,
            menu: false,
            menu2: false,
            reservationDay: null,
            findDateReservation: null,
        }
    }
    static formClient() {
        return {
            numeroDocumento: '',
            nombres: null,
            apellidos: null,
            telefono: '',
            correo: '',
            direccion: '',
            idTipoDocumento: 1
        }
    }
    static formPacks() {
        return {
            day: '',
            menu3: null,
            idPack: null,
            passenger: null
        }
    }
}
