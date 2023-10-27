<template>
    <v-row>
        <v-col cols="4">
            <ValidationObserver ref="obs">
                <v-card class="elevation-12" slot-scope="{ invalid, validated }">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Agregar Transporte</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <ValidationProvider name="nombre" rules="required|numeric">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.capacity"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Asiento"
                                    required
                                ></v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="Tipo Tours" rules="required">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.plate"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Placa"
                                    required
                                ></v-text-field>
                            </ValidationProvider>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" :disabled="disableRegister" :loading="loadingRegister" @click="submit">Registrar</v-btn>
                        <v-spacer />
                        <v-btn color="yellow" :disabled="disableUpdate" :loading="loadingUpdate" dark @click="update">Actualizar</v-btn>
                    </v-card-actions>
                </v-card>
            </ValidationObserver>
        </v-col>
        <v-col cols="8">
            <v-data-table
                multi-sort
                :loading="loadingCollaborators"
                :search="search"
                :headers="headers"
                :items="lista"
                class="elevation-1"
                :items-per-page="20"
            >
                <template v-slot:[`item.action`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" color="green" small @click="editDeleteItem(item)">mdi-pencil</v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" color="red" small @click="editDeleteItem({ ...item, isDelete: true })">mdi-delete</v-icon>
                        </template>
                        <span>Eliminar</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>


<script>
import { ValidationObserver, ValidationProvider, withValidation } from 'vee-validate'
import DefaultModel from '@/models/transport'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    data: () => ({
        form: DefaultModel.BaseForm(),
        headers: [
            { text: 'Actions', value: 'action', sortable: false },
            { text: 'Placa', value: 'plate' },
            { text: 'Capacidad', value: 'capacity' }
        ],
        loadingCollaborators: false,
        search: '',
        loadingRegister: false,
        loadingUpdate: false,
        disableRegister: false,
        disableUpdate: true
    }),
    computed: {
        ...mapState('transport', ['lista'])
    },
    components: {
        ValidationProvider,
        ValidationObserver
    },
    methods: {
        async clear() {
            this.form.name = this.form.email = this.form.select = this.form.checkbox = ''
            this.$nextTick(() => {
                this.$refs.obs.reset()
            })
        },
        async submit() {
            const result = await this.$refs.obs.validate()
            if (result) {
                this.loadingRegister = true
                console.log('enter')
                await this.$store.dispatch('transport/postTransport', this.form)
                await this.$store.dispatch('transport/getTransport', { status: true })
                this.loadingRegister = false
            }
        },
        async update() {
            const result = await this.$refs.obs.validate()
            if (result) {
                this.loadingUpdate = true
                console.log('this.form', this.form)
                await this.$store.dispatch('transport/putTransport', this.form)
                await this.$store.dispatch('transport/getTransport', { status: true })
                this.loadingUpdate = false
            }
        },
        async editDeleteItem(item) {
            console.log('items', item)
            if (item.isDelete) {
                await this.$store.dispatch('transport/putTransport', { ...item, isDelete: item.isDelete })
                await this.$store.dispatch('transport/getTransport', { status: true })
            } else {
                this.form = item
                this.disableRegister = true
                this.disableUpdate = false
            }
        }
        // async deleteItem(item) {
        //     await this.$store.dispatch('collaborators/putCollaborators', { id: item.id, isDelete: true })
        //     await this.$store.dispatch('collaborators/getCollaborators', { status: true })
        // }
    },
    async mounted() {
        await this.$store.dispatch('transport/getTransport')
        console.log('here is my mounted')
    }
}
</script>
