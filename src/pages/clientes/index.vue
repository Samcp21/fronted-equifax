<template>
    <v-row>
        <v-col cols="4">
            <ValidationObserver ref="obs">
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Agregar Clientes </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <ValidationProvider name="Numero Documento" rules="required|max:10">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.numeroDocumento"
                                    :counter="8"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Numero Documento"
                                    required
                                ></v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="email" rules="required|email">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.correo"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="E-mail"
                                    required
                                ></v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="Nombres" rules="required">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.nombres"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Nombres"
                                    required
                                ></v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="Apellidos" rules="required">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.apellidos"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Apellidos"
                                    required
                                ></v-text-field>
                            </ValidationProvider>

                            <ValidationProvider name="telefono" rules="required|max:9">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.telefono"
                                    :counter="9"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Numero Telefonico"
                                    required
                                ></v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="direccion" rules="required">
                                <v-text-field
                                    slot-scope="{ errors, valid }"
                                    v-model="form.direccion"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Direccion"
                                    required
                                ></v-text-field>
                            </ValidationProvider>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" :disabled="disableRegister" @click="submit">Registrar</v-btn>
                        <v-spacer />
                        <v-btn color="yellow" :disabled="disableUpdate" dark @click="update">Actualizar</v-btn>
                    </v-card-actions>
                </v-card>
            </ValidationObserver>
        </v-col>
        <v-col cols="8">
            <v-data-table multi-sort :loading="loadingPersons" :search="search" :headers="headers" :items="lista" class="elevation-1" :items-per-page="20">
                <template v-slot:[`item.action`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" color="green" small @click="editDeleteItem(item)">mdi-pencil</v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" color="primary" small @click="editDeleteItem({ ...item, isDelete: true })">mdi-delete</v-icon>
                        </template>
                        <span>Eliminar</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-col>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2"> Advertencia </v-card-title>

                <v-card-text class="lg-4">
                    Ya tenemos almacenado al cliente en nuestra base de datos. Cualquier cambio que se quiera hacer acerca del cliente, lo puede hacer
                    editandolo.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="dialog = false"> Aceptar </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { ValidationObserver, ValidationProvider, withValidation } from 'vee-validate'
import DefaultModel from '@/models/clientes'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    data: () => ({
        form: DefaultModel.BaseForm(),
        headers: [
            { text: 'Actions', value: 'action', sortable: false },
            { text: 'Nombre', value: 'nombreCompletos' },
            { text: 'Colaborador', value: 'numeroDocumento' },
            { text: 'Correo', value: 'correo' },
            { text: 'Telefono', value: 'telefono' }
        ],
        loadingPersons: false,
        search: '',
        dialog: false,
        disableRegister: false,
        disableUpdate: true
    }),
    computed: {
        ...mapState('persons', ['lista'])
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
                const createPersons = await this.$store.dispatch('persons/postPersons', this.form)
                console.log('createPersons', createPersons)
                if (createPersons.status == '02') {
                    this.dialog = true
                } else {
                    await this.$store.dispatch('persons/getPersons', { status: true })
                }
            }
        },
        async update() {
            const result = await this.$refs.obs.validate()
            if (result) {
                await this.$store.dispatch('persons/putPersons', this.form)
                await this.$store.dispatch('persons/getPersons', { status: true })
            }
        },
        async editDeleteItem(item) {
            if (item.isDelete) {
                await this.$store.dispatch('persons/putPersons', { ...item, isDelete: item.isDelete })
                await this.$store.dispatch('persons/getPersons', { status: true })
            } else {
                this.form = { ...item }
                this.disableRegister = true
                this.disableUpdate = false
            }
        }
        // async deleteItem(item) {
        //     await this.$store.dispatch('persons/putPersons', { id: item.id, isDelete: true })
        //     await this.$store.dispatch('persons/getPersons', { status: true })
        // }
    },
    async mounted() {
        await this.$store.dispatch('persons/getPersons')
        console.log('here is my mounted')
    }
}
</script>
