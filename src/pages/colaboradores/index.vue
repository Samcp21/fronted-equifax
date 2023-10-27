<template>
    <v-row>
        <v-col cols="4">
            <ValidationObserver ref="obs">
                <v-card class="elevation-12" slot-scope="{ invalid, validated }">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Agregar Colaboradores</v-toolbar-title>
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
                                <v-text-field slot-scope="{ errors, valid }" v-model="form.correo" :success="valid" label="E-mail" required></v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="password">
                                <v-text-field
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    v-model="form.password"
                                    :type="show1 ? 'text' : 'password'"
                                    name="input-10-1"
                                    label="Password"
                                    @click:append="show1 = !show1"
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
                            <ValidationProvider name="Rol" rules="required">
                                <v-select
                                    slot-scope="{ errors, valid }"
                                    :items="roles"
                                    item-text="description"
                                    item-value="id"
                                    v-model="form.idRol"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Rol"
                                    required
                                ></v-select>
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
            <v-data-table
                multi-sort
                :loading="loadingCollaborators"
                :search="search"
                :headers="headers"
                :items="listCollaborators"
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
                    Ya tenemos almacenado al colaborador en nuestra base de datos. Cualquier cambio que se quiera hacer el usuario lo puede hacer editandolo
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="dialog = false"> Aceptar </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogResponseEdit" width="auto">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2"> Anuncio </v-card-title>

                <v-card-text>
                    {{ BodyEdit }}
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="dialogResponseEdit = false">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { ValidationObserver, ValidationProvider, withValidation } from 'vee-validate'
import DefaultModel from '@/models/collaborators'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    data: () => ({
        form: DefaultModel.BaseForm(),
        headers: [
            { text: 'Actions', value: 'action', sortable: false },
            { text: 'Nombre', value: 'nombreCompletos' },
            { text: 'Colaborador', value: 'numeroDocumento' },
            { text: 'Cargo', value: 'rol' },
            { text: 'Correo', value: 'correo' },
            { text: 'Telefono', value: 'telefono' }
        ],
        loadingCollaborators: false,
        search: '',
        show1: false,
        dialog: false,
        disableRegister: false,
        dialogResponseEdit: false,
        BodyEdit: 'Text body',
        disableUpdate: true
    }),
    computed: {
        ...mapState('collaborators', ['roles', 'lista']),
        listCollaborators() {
            console.log('this.lista', this.lista)
            console.log('roles', this.roles)
            const items = []
            this.lista.map((x) => {
                items.push({ ...x, nombreCompletos: `${x.nombres} ${x.apellidos}`, rol: this.roles.find((y) => y.id == x.idRol)?.description })
            })
            return items
        }
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
            this.disableRegister = true
            const result = await this.$refs.obs.validate()
            if (result) {
                const createCollaborators = await this.$store.dispatch('collaborators/postCollaborators', this.form)
                console.log('createCollaborators', createCollaborators)
                if (createCollaborators.status == '02') {
                    this.dialog = true
                } else {
                    await this.$store.dispatch('collaborators/getCollaborators', { status: true })
                }
            }
            this.disableRegister = false
        },

        async update() {
            const result = await this.$refs.obs.validate()
            console.log('result', result)
            if (result) {
                await this.$store.dispatch('collaborators/putCollaborators', this.form)
                await this.$store.dispatch('collaborators/getCollaborators', { status: true })
                this.BodyEdit = 'Colaborador Editado'
                this.disableUpdate = true
            } else {
                this.disableUpdate = false
                this.BodyEdit = 'No se pudo editar el Colaborador'
            }
            this.dialogResponseEdit = true
        },
        async editDeleteItem(item) {
            if (item.isDelete) {
                await this.$store.dispatch('collaborators/putCollaborators', { ...item, isDelete: item.isDelete })
                await this.$store.dispatch('collaborators/getCollaborators', { status: true })
                this.BodyEdit = 'Colaborador Eliminado'
                this.dialogResponseEdit = true
            } else {
                console.log('items', item)
                this.form = { ...item }
                this.form.password = ''
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
        await Promise.all([this.$store.dispatch('collaborators/getRoles'), this.$store.dispatch('collaborators/getCollaborators')])

        console.log('here is my mounted')
    }
}
</script>
