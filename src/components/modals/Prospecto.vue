<template>
    <div>
        <v-dialog v-model="open" v-if="open" persistent scrollable max-width="600px" min-height="300px">
            <v-card>
                <v-app-bar flat dark color="primary">
                    <span v-if="textHeader">{{ textHeader }}</span>
                    <span
                        ><h3><Strong>Agregar Pasajeros</Strong></h3>
                    </span>

                    <v-spacer></v-spacer>
                    <v-chip small color="secondaryTheme" v-if="datos.idProspecto" class="caption pl-3" dark>N° {{ datos.idProspecto }}</v-chip>
                    <v-btn small class="blue darken-4 mx-2" icon @click.native="cerrarModal"> <v-icon small>mdi-close</v-icon> </v-btn>
                </v-app-bar>
                <v-divider></v-divider>
                <v-card-text class="mainText">
                    <!-- <v-container> -->
                    <v-row dense class="py-2">
                        <v-col cols="12">
                            <v-container>
                                <template v-if="showModal === 1">
                                    <v-row align="center">
                                        <v-col cols="12" sm="6" md="6">
                                            <v-select
                                                clearable
                                                v-model="datos.operacion"
                                                v-validate="'required'"
                                                dense
                                                hide-details="auto"
                                                outlined
                                                :items="lista"
                                                item-text="nombreCompletos"
                                                item-value="id"
                                                :error-messages="errors.collect('datos.operacion')"
                                                label="Operacion*"
                                                data-vv-name="datos.operacion"
                                                data-vv-as="Operacion"
                                                required
                                            />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                                v-model="datos.nroClientes"
                                                v-validate="'required|numeric'"
                                                dense
                                                hide-details="auto"
                                                outlined
                                                label="Nro Clientes*"
                                                :error-messages="errors.collect('datos.nroClientes')"
                                                data-vv-name="datos.nroClientes"
                                                data-vv-as="Nro de Clientes"
                                                required
                                            />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-select
                                                v-model="datos.location"
                                                v-validate="'required'"
                                                dense
                                                :items="itemListaOrigen"
                                                item-text="descripcion"
                                                item-value="id"
                                                hide-details="auto"
                                                outlined
                                                label="Local*"
                                                :error-messages="errors.collect('datos.location')"
                                                data-vv-name="datos.location"
                                                data-vv-as="Local"
                                                required
                                            />
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-container>
                        </v-col>
                    </v-row>
                    <!-- </v-container> -->
                </v-card-text>
                <v-divider></v-divider>

                <v-card-actions class="grey lighten-2" align="center" justify="center">
                    <v-row dense>
                        <v-col cols="12" sm="12">
                            <v-row class="justify-center">
                                <template>
                                    <v-col cols="6" sm="6">
                                        <v-btn color="green" small :loading="loadingRegistro" dark @click="nextAction">{{ textBTN }}</v-btn>
                                    </v-col>
                                </template>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="openConfirmation" persistent max-width="360px" min-height="400px">
            <v-card class="blue darken-1">
                <v-app-bar flat dark color="primary">
                    <span class="white--text title" color="white">¿Esta seguro de este registro?</span>
                    <v-spacer></v-spacer>
                    <v-btn small class="blue darken-4" icon @click="closeModalConfirm"> <v-icon small>mdi-close</v-icon> </v-btn>
                </v-app-bar>

                <v-card-actions class="blue-grey lighten-3">
                    <v-spacer />
                    <!-- <v-btn color="green" :disabled="roles[0] == 'COMUNITY'" :loading="loadingContinuar" @click="createRegistro(true, 'loadingContinuar')" -->
                    <!-- <v-btn color="orange" :disabled="roles[0] == 'COMUNITY'" :loading="loadingContinuar" @click="createRegistro(true, 'loadingContinuar')">
                        Continuar</v-btn
                    > -->
                    <v-btn color="green" dark :loading="loadingConfirmation" @click="createRegistro(false, 'loadingConfirmation')">Continuar</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="openModalContinue" persistent max-width="360px" min-height="400px">
            <v-card class="blue darken-1">
                <v-app-bar flat dark color="primary">
                    <span class="white--text title" color="white">¿Continuar editando?</span>
                    <v-spacer></v-spacer>
                    <v-btn small class="blue darken-4" icon @click="closeModalContinue(1)"> <v-icon small>mdi-close</v-icon> </v-btn>
                </v-app-bar>
                <v-card-actions class="blue-grey lighten-3">
                    <v-spacer />
                    <!-- <v-btn color="green" :disabled="roles[0] == 'COMUNITY'" :loading="loadingContinuar" @click="createRegistro(true, 'loadingContinuar')" -->
                    <v-btn color="orange" :disabled="roles[0] == 'COMUNITY'" :loading="loadingContinuar" @click="closeModalContinue(1)"> si</v-btn>
                    <v-btn color="green" dark :loading="loadingConfirmation" @click="closeModalContinue(2)">NO</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { mixins } from '@/mixins/mixin.js'
import ItemEstados from '@/components/crud/ItemEstados'

export default {
    props: ['open', 'loadingBTN', 'textButton', 'step'],
    mixins: [mixins],
    components: {
        ItemEstados
    },
    data() {
        return {
            openModalContinue: false,
            showMenu: false,
            openConfirmation: false,
            loadingStep: false,
            showModal: 1,
            loadingItems: true,
            loading: false,
            textHeader: '',
            loadingRegistro: false,
            loadingConfirmation: false,
            loadingContinuar: false,

            tipoProspecto: [
                { id: 1, text: 'Primera Compra' },
                { id: 2, text: 'Recurrente' },
                { id: 3, text: 'Cambio de Marca' }
            ],
            tipoPago: [
                { id: 3, text: 'Tarjeta' },
                { id: 4, text: 'Efectivo' },
                { id: 5, text: 'Transferencia' },
                { id: 6, text: 'Financiamiento' }
            ]
        }
    },
    computed: {
        ...mapGetters({
            listaProductos: 'productos/lista',
            listaEstados: 'estados/lista',
            optionalRole: 'usuarios/optionalRole'
        }),
        ...mapState('prospectos', ['datos']),
        ...mapGetters('operador', ['lista']),

        ...mapState('productos', ['listaMarca']),

        ...mapState('usuarios', ['listaOrigen', 'userLogin', 'roles']),
        ...mapState('utilities', ['tipoDocumento', 'metodoEnvio', 'itemListaOrigen']),
        idTipoProspecto() {
            return this.datos.idTipoProspecto
        },
        idMarca() {
            console.log('this.datos.idMarca ', this.datos.idMarca)
            return this.datos.idMarca
        },
        idModelo() {
            console.log('this.datos.idModelo ', this.datos.idModelo)
            return this.datos.idModelo
        },

        isEnvioCliente() {
            return this.datos.isEnvioCliente
        },
        textBTN() {
            return 'CREAR'
        },
        _filterListModelo() {
            if (this.datos.idMarca) {
                return this.listaProductos.filter((x) => x.idMarca == this.datos.idMarca)
            } else {
                return []
            }
        },
        _filterListMarca() {
            let idTipoMarca = this.idTipoProspecto == 1 || this.idTipoProspecto == 2 ? 1 : 2
            if (idTipoMarca) {
                return this.listaMarca.filter((x) => x.idTipoMarca == idTipoMarca)
            } else {
                return []
            }
        },
        isNotMobile() {
            if (this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name == 'sm') {
                return false
            } else {
                return true
            }
        },
        showNext() {
            if (this.showModal == 4) {
                return false
            } else if (this.showModal == 2) {
                if (this.step == 2) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }
    },
    watch: {
        async idMarca() {
            console.log('watch this.datos.idMarca', this.datos.idMarca)
            await this.handleGetProducto()
        },

        async showModal(val) {
            console.log('val ', val, this.step)

            if (val == 2) {
                //this.loadingItems = false
                let tipo = this.idTipoProspecto == 1 || this.idTipoProspecto == 2 ? 1 : 2
                await this.handleGetMarcas(tipo)
            } else if (val == 3) {
                /* if (this.step == 1) {
                    this.openConfirmation = true
                } */
            } else if (val == 4) {
                await this.fnHandleGet({})
            }
        }
    },
    methods: {
        ...mapMutations({
            UPDATE_DATOS: 'prospectos/UPDATE_DATOS',
            OPEN_MODAL: 'mainUI/OPEN_MODAL',
            OPEN_BAR: 'mainUI/OPEN_BAR'
        }),
        ...mapActions({
            handleGetProducto: 'productos/obtenerLista',
            handleGetLocation: 'operador/getLocation',
            handleGetEstados: 'estados/obtenerLista',
            handleGetOrigen: 'origen/obtenerLista',
            handleCrearRegistro: 'prospectos/registrarProspecto',
            handleCrearClientes: 'clientes/registrar',
            handleActualizarClientes: 'clientes/actualizar',
            handleActualizarRegistro: 'prospectos/actualizarProspecto',
            handleGetMarcas: 'productos/getMarcas'
        }),

        closeModalConfirm() {
            this.openConfirmation = false
        },
        nextAction() {
            this.$validator.validateAll().then(async (result) => {
                if (result) {
                    if (this.roles[0] == 'ASESOR' && this.optionalRole.create) {
                        this.UPDATE_DATOS({
                            usuarioCreacion: this.userLogin.usuario,
                            usuarioModificacion: this.userLogin.usuario
                        })
                    }
                    if (this.step == 2) {
                        await this.updateRegistro({ closeModal: true })
                    } else {
                        console.log('this.roles ', this.roles)
                        console.log('userLogin ', this.optionalRole)
                        if (this.optionalRole.create || this.roles[0] == 'SUPERADMIN') {
                            if (this.showModal > 2) {
                                await this.updateRegistro({ closeModal: false })
                            } else {
                                this.openConfirmation = true
                            }
                        }
                    }
                }
            })
        },
        async fnHandleGet({ numeroDocumento = null, idCanal = null, idOrigen = null, usuario = null }) {
            await this.handleGetEstados({ status: false })
        },
        async createRegistro(val, labelLoading) {
            this[labelLoading] = true

            await this.handleCrearRegistro(this.datos)
            this.UPDATE_DATOS({ ...this.datos })
            this[labelLoading] = false
            this.openConfirmation = false
            if (!val) {
                // si le da click a finalizar
                this.cerrarModal()
                await this.$emit('reload')
                return
            } else {
                this.showModal = this.showModal + 1
            }
            console.log('here-1')
        },
        async cerrarModal() {
            this.showModal = 1
            await this.$emit('closeModal', 'openDialog')
        },
        async updateRegistro(payload) {
            console.log('close /update ', payload['closeModal'])
            this.loadingRegistro = true
            console.log('this.datos ', this.datos)
            await this.handleActualizarRegistro(this.datos)
            this.loadingRegistro = false
            this.openModalContinue = true
            // await this.$emit('closeModal', 'openDialog')
        },
        async closeModalContinue(tipo) {
            this.openModalContinue = false
            if (tipo == 2) {
                this.cerrarModal()
                await this.$emit('reload')
            }
        },
        nextStep() {
            this.$validator.validateAll().then(async (result) => {
                if (result) {
                    this.loadingStep = true
                    const val = 1 + this.showModal
                    console.log('val ', val)
                    if (val == 2) {
                        if (this.step == 1 && !this.datos.idPersona) {
                            console.log('here-1')
                            //Create person
                            const per = await this.handleCrearClientes(this.datos)
                            this.UPDATE_DATOS({
                                idPersona: per.payload
                            })
                        } else {
                            //Update person
                            await this.handleActualizarClientes({
                                ...this.datos,
                                id: this.datos.idPersona
                            })
                        }
                    }
                    if (val === 5) {
                        this.showModal = 1
                    } else {
                        this.showModal = val
                    }
                    this.loadingStep = false
                }
            })
        },
        activeClick(header, text) {
            this.textHeader = text
            console.log('here--------', header)
            if (this.step == 2) {
                this.showModal = header
            }
        },
        downStep() {
            const val = this.showModal - 1
            if (val === 0) {
                this.showModal = 1
            } else {
                this.showModal = val
            }
        }
    },
    async mounted() {
        console.log('CREATED_MODAL', this.datos)
        //

        this.textHeader = null
        this.showMenu = false

        const idTipoProspecto = this.datos.idTipoProspecto
        const idModelo = this.datos.idModelo

        if (this.step == 2) {
            if (idTipoProspecto) {
                await this.handleGetMarcas()
            }
            await this.handleGetProducto()
            if (idModelo) {
                const listaFind = this.listaProductos.find((x) => x.id == idModelo)
                this.datos.idMarca = listaFind ? listaFind.idMarca : null
            }
        }
    }
}
</script>
