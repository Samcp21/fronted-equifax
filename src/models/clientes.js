export default class ClientesModel {
    static BaseForm() {
        return {
            numeroDocumento: '',
            nombres: null,
            apellidos: null,
            telefono: '',
            correo: '',
            direccion: '',
            idTipoDocumento: 1,
        }
    }
}
