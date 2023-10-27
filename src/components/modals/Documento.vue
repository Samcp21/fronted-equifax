<template>
    <v-dialog v-model="open" v-if="open" persistent max-width="300px">
        <v-card>
            <v-card-title>
                <strong>Buscar Persona</strong>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    dense
                    hide-details="auto"
                    outlined
                    label="Nro Documento*"
                    v-validate="'required'"
                    v-model="numeroDocumento"
                    :error-messages="errors.collect('numeroDocumento')"
                    data-vv-name="numeroDocumento"
                    required
                ></v-text-field>
            </v-card-text>
            <v-card-actions class="grey lighten-5">
                <v-spacer></v-spacer>
                <v-btn text @click="cerrarModal"> CERRAR </v-btn>
                <v-btn class="primary" text @click="handleAction" :loading="loading"> BUSCAR </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    $_veeValidate: {
        validator: 'new'
    },
    props: ['open'],
    data() {
        return {
            loading: false,
            numeroDocumento: null
        }
    },

    methods: {
        async handleAction() {
            this.$validator.validateAll().then(async (result) => {
                if (result) {
                    this.loading = true
                    await this.$emit('handle-search', {numeroDocumento:this.numeroDocumento})
                    this.numeroDocumento = null
                    this.loading = false
                } else {
                    this.OPEN_BAR({ state: true, text: 'Completar Campos', color: 'red' })
                    this.numeroDocumento = null
                }
            })
        },

        async cerrarModal() {
            this.loading = true
            await this.$emit('closeModal','openDocumento')
            this.loading = false
        }
    },
    async created() {}
}
</script>
