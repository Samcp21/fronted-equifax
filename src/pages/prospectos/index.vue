<template>
    <v-container fluid>
        <v-row>
            <v-container fluid>
                <v-card>
                    <v-card-text>
                        <v-row align="center" justify="center">
                            <v-col cols="12" sm="8" align="start" justify="center">
                                <v-row class="grey lighten-4" align="start" justify="center">
                                    <v-col cols="12"> <strong>FILTROS</strong></v-col>
                                    <v-col cols="12" sm="4">
                                        <v-menu
                                            ref="menu"
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="auto"
                                        >
                                            <template #activator="{ on, attrs }">
                                                <v-text-field
                                                    v-model="fechaFiltro"
                                                    hide-details="auto"
                                                    dense
                                                    label="FILTRAR POR MES"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                />
                                            </template>
                                            <v-date-picker type="month" v-model="fechaFiltro" no-title scrollable>
                                                <v-spacer />
                                                <v-btn text color="primary" @click="menu = false"> CERRAR </v-btn>
                                                <v-btn color="primary" @click="filtrarProspecto"> BUSCAR </v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-divider inset vertical></v-divider>
                                    <v-col cols="6" sm="4">
                                        <v-autocomplete
                                            clearable
                                            v-model="isTipoDocumento"
                                            dense
                                            hide-details="auto"
                                            outlined
                                            :items="tipoDocumento"
                                            item-text="text"
                                            item-value="id"
                                            label="Tipo Documento"
                                        >
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" sm="4">
                                        <v-autocomplete
                                            clearable
                                            v-model="isLocation"
                                            dense
                                            hide-details="auto"
                                            outlined
                                            :items="itemListaOrigen"
                                            item-text="descripcion"
                                            item-value="id"
                                            label="Ubicacion"
                                        >
                                        </v-autocomplete>
                                    </v-col>

                                    <v-col cols="6" sm="4">
                                        <v-select
                                            clearable
                                            :items="niveles"
                                            item-text="description"
                                            item-value="id"
                                            dense
                                            outlined
                                            v-model="isNivel"
                                            label="Nivel"
                                            required
                                            placeholder="Nivel"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="6" sm="4">
                                        <v-select
                                            clearable
                                            :items="operadorList"
                                            item-text="nombreCompletos"
                                            item-value="id"
                                            dense
                                            outlined
                                            v-model="isOperador"
                                            label="Operador"
                                            required
                                            placeholder="Operador"
                                        ></v-select>
                                    </v-col>

                                    <v-col cols="6" sm="4">
                                        <v-btn small color="primary" dark @click="filtrarProspecto"> FILTRAR</v-btn>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-row>
                                    <v-col cols="12"> <strong>ACTIONS</strong></v-col>
                                    <v-col cols="12" align="start" justify="center">
                                        <v-btn class="mx-1" small color="green" dark @click="downloadHandle">
                                            DESCARGAR <v-icon right dark> mdi-arrow-down-box </v-icon>
                                        </v-btn>
                                        <!-- <v-btn class="mx-1" small color="green" dark @click="fnReload"> RELOAD <v-icon right dark> mdi-reload </v-icon> </v-btn> -->

                                        <v-btn class="mx-1" small color="primary" dark @click="openForm(1)"> CREAR </v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-container>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title dark>
                        <strong>PROSPECTOS</strong>
                        <v-spacer />
                        <v-spacer />

                        <v-row>
                            <v-col cols="6">
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="BUSCAR" single-line hide-details />
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table
                            item-key="idProspecto"
                            flat
                            :headers="headers"
                            :items="listaProspectos"
                            :search="search"
                            :loading="loading"
                            loading-text="...Cargando"
                        >
                            <!-- <template v-slot:[`item.lastEstadoProspecto`]="{ item }">
                                <v-chip :color="colorChip(item)" dark>
                                    {{ item.lastEstadoProspecto }}
                                </v-chip>
                            </template> -->
                            <!-- <template v-slot:[`item.actions`]="{ item }"> -->
                            <!-- <v-icon color="green" @click="openForm(4, item)"> mdi-eye </v-icon>
                                <v-icon color="blue" @click="openForm(2, item)"> mdi-pencil </v-icon> -->
                            <!-- <v-icon v-if="roles[0] == 'SUPERADMIN'" color="red" @click="openForm(3, item)"> mdi-delete </v-icon> -->
                            <!-- </template> -->
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <Delete v-if="openDelete" :open="openDelete" :loadingBTN="loadingBTN" @handle-delete="fnHandlePut" @closeModal="closeModal" />
        <Documento v-if="openDocumento" :open="openDocumento" @handle-search="fnHandleGet" @closeModal="closeModal" />
        <Canal v-if="openCanal" :open="openCanal" @handle-search="fnHandleGet" @closeModal="closeModal" />
        <Prospecto v-if="openProspecto" :open="openProspecto" :step="step" :textButton="modalText" @closeModal="closeModal" @reload="fnReload" />
    </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { exportXLSX } from '@/utils'
import { renameKeys } from '@/utils/genericUtils'
import { mixins } from '@/mixins/mixin.js'
import Delete from '@/components/modals/Delete'
import Documento from '@/components/modals/Documento'
import Prospecto from '@/components/modals/Prospecto'
import Canal from '@/components/modals/Canal'
import { format, addDays, subDays, differenceInDays } from 'date-fns'

const defaultText = 'REGISTRAR'

export default {
    $_veeValidate: {
        validator: 'new'
    },
    components: {
        Delete,
        Documento,
        Prospecto,
        Canal
    },
    mixins: [mixins],
    data() {
        return {
            fechaFiltro: format(new Date(), 'YYYY-MM'),
            isSelectDepartamento: null,
            isSelectProvincia: null,
            isLocation: null,
            isTipoDocumento: null,
            isOperador: null,
            isNivel: null,
            numeroDocumento: null,
            listaProspectos: [],
            menu: false,
            found: [],
            estadoSeleccionado: null,
            openCanal: false,
            openEstado: false,
            openProspecto: false,
            openDelete: false,
            openDocumento: false,
            search: '',
            singleSelect: true,
            loadingBTN: false,
            selected: null,
            modalText: defaultText,
            step: 1,
            loading: false
        }
    },
    watch: {
        openProspecto(val) {
            if (!val) {
                console.log('listen to close')
                this.EMPTY_FORM()
            }
        },

        step(val) {
            if (val == 1) {
                this.modalText = defaultText
            } else if (val == 2) {
                this.modalText = 'ACTUALIZAR'
            } else if (val == 3) {
                this.modalText = 'ELIMINAR'
            } else {
                this.modalText = 'VISUALIZAR'
            }
        }
    },
    computed: {
        ...mapGetters('prospectos', ['lista']),
        ...mapGetters({ operadorList: 'operador/lista' }),

        ...mapGetters('usuarios', ['listaCanal']),
        // ...mapGetters('usuarios', ['optionalRole']),

        ...mapState('usuarios', ['listaOrigen', 'roles', 'userLogin']),
        ...mapState('prospectos', ['datos']),
        ...mapState('utilities', ['tipoDocumento', 'niveles', 'itemListaOrigen']),

        headers() {
            // console.log('this.$vuetify.breakpoint.name ', this.$vuetify.breakpoint.name)
            // const breakpoint = this.$vuetify.breakpoint.name
            const baseList = [
                // { text: 'Actions', value: 'actions', sortable: false },
                { text: 'Perfil', value: 'tipoDocumento' },
                { text: 'Nombres', value: 'nombreCompletos' },
                { text: 'Nivel Alcanzado', value: 'nivel' },
                { text: '# Clientes', value: 'numberLead' },
                { text: 'Ubicacion', value: 'labelLocation' },
                { text: 'Ultima Actualización', value: 'created_at' }
            ]
            return baseList
        }
    },
    methods: {
        ...mapMutations({
            RESET_FORM: 'prospectos/RESET_FORM',
            UPDATE_DATOS: 'prospectos/UPDATE_DATOS',
            OPEN_MODAL: 'mainUI/OPEN_MODAL',
            OPEN_BAR: 'mainUI/OPEN_BAR'
        }),
        ...mapActions({
            handleGet: 'prospectos/obtenerLista',
            handleGetOperador: 'operador/obtenerLista',
            handlePost: 'prospectos/registrarProspecto',
            handlePut: 'prospectos/actualizarProspecto'
        }),
        EMPTY_FORM() {
            this.openProspecto = false
            this.loading = false
            this.loadingBTN = false
            this.openCanal = false
            this.openEstado = false
            this.menu = false
            this.selected = null
            this.openDelete = false
            this.openDocumento = false
            this.OPEN_MODAL({ state: false })
            this.step = 1
            this.RESET_FORM()
        },
        colorChip(item) {
            if (item.lastEstadoProspecto === 'NUEVO' || item.lastEstadoProspecto === 'REINGRESO') {
                return 'green'
            } else if (item.lastEstadoProspecto === 'CITA') {
                return 'light-blue darken-2'
            } else {
                return 'orange'
            }
        },
        async openForm(tipo, item) {
            this.step = tipo
            let status = false
            this.selected = item

            if (tipo == 1) {
                this.RESET_FORM()
                status = true
            } else if (tipo == 2 || tipo == 4) {
                if (!item) {
                    this.OPEN_BAR({ state: true, text: 'No hay selección', color: 'red' })
                } else {
                    status = true
                    console.log('item ', item)
                    this.UPDATE_DATOS({
                        idDepartamento: item.idDistritoEnvio
                    })
                    this.UPDATE_DATOS(item)
                }
            } else if (tipo == 3) {
                if (!item) {
                    this.OPEN_BAR({ state: true, text: 'No hay selección', color: 'red' })
                } else {
                    this.openDelete = true
                }
            }
            this.openProspecto = status
        },

        async fnHandlePut() {
            console.log('fnHandlePut ')
            this.loadingBTN = true
            const item = this.selected
            if (this.step == 3) {
                item.activo = 0
            }
            await this.handlePut(item)
            await this.fnHandleGet({ idDepartamento: this.isSelectDepartamento })
            this.EMPTY_FORM()
        },
        async filtrarProspecto() {
            this.$validator.validateAll().then(async (result) => {
                if (result) {
                    console.log('result ', result)
                    await this.fnHandleGet({
                        location: this.isLocation,
                        tipoDocumento: this.isTipoDocumento,
                        nivel: this.isNivel,
                        operador: this.isOperador
                    })
                    this.menu = false
                    this.estadoSeleccionado = 0
                }
            })
        },
        async fnHandleGet(payload) {
            const { tipoDocumento = null, location = null, nivel = null, operador = null } = payload
            this.loading = true
            await this.handleGet({ fechaFiltro: this.fechaFiltro, tipoDocumento, location, nivel, operador })
            await this.handleGetOperador()
            console.log('______', this.lista)
            console.log('niveles', this.niveles)
            let listProspecto = []
            this.lista.map((x) => {
                this.niveles.map((y) => {
                    if (x.numberLead >= y.rango[0] && x.numberLead <= y.rango[1]) {
                        const created_at = format(x.created_at, 'DD/MM/YYYY HH:mm a')
                        console.log('created_at', created_at)
                        const nivel = y.description
                        const idNivel = y.id
                        const labelLocation = this.itemListaOrigen.find((k) => k.id == x.idLocation).descripcion
                        listProspecto.push({ ...x, nivel, labelLocation, idNivel, created_at })
                    }
                })
            })
            if (nivel) {
                listProspecto = listProspecto.filter((fn) => fn.idNivel == nivel)
            }
            console.log('listProspecto', listProspecto)
            this.listaProspectos = listProspecto
            this.loading = false
            // this.EMPTY_FORM()
        },

        downloadHandle() {
            this.loading = true
            const headers = ['Ubicacion', 'Perfil', 'Nombre', '# Clientes', 'Nivel Alcanzado', 'Fecha Creacion']
            const filename = `REPORT_PROSPECTOS_${Date.now()}`
            exportXLSX(
                {
                    headers,
                    campos: ['labelLocation', 'tipoDocumento', 'nombreCompletos', 'numberLead', 'nivel', 'created_at'],
                    arrayData: this.listaProspectos
                },
                { filename }
            )
            this.loading = false
        },
        async closeModal(nombreModal) {
            this.EMPTY_FORM()
            this[nombreModal] = false
        },
        async fnReload() {
            console.log('reload')
            await this.fnHandleGet({ idDepartamento: this.isSelectDepartamento })
            this.estadoSeleccionado = 0
        },
        getInfoSlash(value) {
            console.log('value ', value)
            if (value) {
                return value.split('|')
            } else {
                return ['', '', '', '']
            }
        }
    },
    async created() {
        // const oRoles = this.optionalRole
        if (this.userLogin.idRole === 9) {
            return this.$router.push('/reclamaciones')
        }

        let idDepas = [null]
        // if (!oRoles.allLocation) {
        //     idDepas = oRoles.idDepartamento
        //     this.isSelectDepartamento = idDepas[0]
        // }
        await this.fnHandleGet({ idDepartamento: idDepas[0] })
        // await this.handleGetDepartamentos()
        this.estadoSeleccionado = 0
    },
    async mounted() {
        let iteration = 0
        window.setInterval(async () => {
            iteration = iteration + 1
            await this.filtrarProspecto()
        }, 1000 * 60 * 10)
    }
}
</script>
