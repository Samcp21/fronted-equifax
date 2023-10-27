<template>
    <v-dialog v-model="open" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <strong>CONFIRMAR ELIMINACIÓN</strong>
            </v-card-title>
            <v-card-text>¿Desea Eliminar?</v-card-text>
            <v-card-actions class="grey lighten-5">
                <v-spacer></v-spacer>

                <v-btn text @click="cerrarModal"> CERRAR </v-btn>
                <v-btn class="primary" text @click="handleAction" :loading="loadingBTN"> CONFIRMAR </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    $_veeValidate: {
        validator: 'new'
    },
    props: ['open','loadingBTN'],
    data() {
        return {
        }
    },
    methods: {
        async handleAction() {
            await this.$emit('handle-delete')
        },
        async cerrarModal() {
            await this.$emit('closeModal', 'openDelete')
        }
    },
    async created() {}
}
</script>
