import { format, subDays, differenceInDays } from 'date-fns'

export default class ProspectosModel {
    static BaseForm() {
        return {
            operacion: null,
            nroClientes: null,
            location: null
        }
    }
    static BaseFormItem() {
        return {
            fechaMovimiento: format(new Date(), 'YYYY-MM-DD'),
            horaMovimiento: format(new Date(), 'HH:mm:ss'),
            idEstado: null,
            usuarioModificacion: null,
            descripcion: null,
            idProspecto: null
        }
    }
}
