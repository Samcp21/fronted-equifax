export default class CollaboratorsModel {
    static BaseForm() {
        return {
            numeroDocumento: '',
            password: '',
            correo: '',
            nombres: '',
            apellidos: '',
            idRol: null,
            telefono: '',
            idTipoDocumento: 1,
        }
    }

}