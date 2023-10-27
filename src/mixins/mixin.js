import { format,addDays, subDays, differenceInDays } from 'date-fns'

export const mixins = {
    $_veeValidate: {
        validator: 'new'
    },
    props: ['color'],
    methods: {
        isNumber(evt) {
            evt = evt || window.event
            const charCode = evt.which ? evt.which : evt.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
                evt.preventDefault()
            } else {
                return true
            }
        }
    },
    filters: {
        fechaISO(evt) {
            return evt ? format(evt, 'DD/MM/YYYY') : null
        }
    },
    data() {
        return {
            fechaFiltro: [format(subDays(new Date(), 31), 'YYYY-MM-DD'), format(addDays(new Date(),1), 'YYYY-MM-DD')]
        }
    }
}
