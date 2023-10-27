export default class ClientesModel {
    static BaseForm() {
        return {
            idTipoDocumento: 1,
            nombreCompletos: '',
            numeroDocumento: '',
            nombres: '',
            apellidos: '',
            telefono: '',
            correo: '',
            direccion: '',
            ubigeo: '',
            activo: true
        }
    }
}
