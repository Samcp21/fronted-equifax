export default class ClientesModel {
    static BaseForm() {
        return {
          selectedOrigen:[],
            idTipoDocumento: 1,
            numeroDocumento:null,
            nombres: null,
            usuario: null,
            correo: null,
            telefono:null,
            password: null,
            idRole: 4,
            id: null,
            isLogin: false,
            role : null,
            activo:true,

        }
    }
}
