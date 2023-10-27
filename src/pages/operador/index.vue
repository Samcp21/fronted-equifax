<template>
    <v-container fluid>
        <v-row>
            <v-container fluid>
                <v-card>
                    <v-card-text>
                        <v-row align="center" justify="center">
                            <v-col cols="12" sm="6">
                                <v-row class="grey lighten-4" align="center" justify="center">
                                    <v-col cols="12"> <strong>FILTROS</strong></v-col>
                                    <v-col cols="12" sm="6">
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
                                                    label="FILTRAR POR RANGO - MES"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                />
                                            </template>
                                            <v-date-picker v-model="fechaFiltro" range no-title scrollable>
                                                <v-spacer />
                                                <v-btn text color="primary" @click="menu = false"> CERRAR </v-btn>
                                                <v-btn color="primary" @click="fnHandleGet"> BUSCAR </v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-divider inset vertical></v-divider>
                                    <v-col cols="12" sm="6">
                                        <v-btn class="mx-1" small color="primary" dark @click="openDocumento = true"> BUSCAR OPERADORES </v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-row>
                                    <v-col cols="12"> <strong>ACTIONS</strong></v-col>

                                    <v-col cols="12" align="start" justify="center"
                                        ><v-btn class="mx-1" small color="green" dark @click="downloadHandle">
                                            DESCARGAR <v-icon right dark> mdi-arrow-down-box </v-icon>
                                        </v-btn>

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
            <v-col cols="12"
                ><v-card>
                    <v-card-title dark>
                        <strong>OPERADORES</strong>
                        <v-spacer />
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="BUSCAR" single-line hide-details />
                    </v-card-title>
                    <v-card-text
                        ><v-data-table
                            item-key="id"
                            flat
                            :headers="headers"
                            :items="lista"
                            :search="search"
                            :loading="loading"
                            :sort-by="['fechaCreacion']"
                            :sort-desc="[true]"
                            loading-text="...Cargando"
                        >
                            <template v-slot:[`item.fechaCreacion`]="{ item }">
                                {{ item.fechaCreacion | fechaISO }}
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon color="green" @click="openForm(4, item)"> mdi-eye </v-icon>
                                <v-icon color="blue" @click="openForm(2, item)"> mdi-pencil </v-icon>
                            </template>
                        </v-data-table></v-card-text
                    >
                </v-card></v-col
            >
        </v-row>
        <v-dialog v-model="openDialog" v-if="openDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="grey lighten-5">
                    <strong>{{ modalText }} OPERADORES </strong>
                </v-card-title>
                <v-container class="pa-3" align="center">
                    <v-row align="center">
                        <v-col cols="12">
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        clearable
                                        v-model="datos.tipoDocumento"
                                        v-validate="'required'"
                                        dense
                                        hide-details="auto"
                                        outlined
                                        :items="tipoDocumento"
                                        item-text="text"
                                        item-value="text"
                                        :error-messages="errors.collect('datos.idTipoDocumento')"
                                        label="Tipo de documento*"
                                        data-vv-name="datos.idTipoDocumento"
                                        data-vv-as="Tipo Documento"
                                        required
                                    />
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="datos.numeroDocumento"
                                        v-validate="'required|numeric'"
                                        dense
                                        hide-details="auto"
                                        outlined
                                        label="Nro Documento*"
                                        :error-messages="errors.collect('datos.numeroDocumento')"
                                        data-vv-name="datos.numeroDocumento"
                                        data-vv-as="Numero Documento"
                                        required
                                    />
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field v-model="datos.telefono" hide-details="auto" dense outlined label="Telefono" />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-validate="'email'"
                                        :error-messages="errors.collect('datos.correo')"
                                        data-vv-name="datos.correo"
                                        data-vv-as="Correo"
                                        v-model="datos.correo"
                                        hide-details="auto"
                                        dense
                                        outlined
                                        label="Correo"
                                    />
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="datos.nombreCompletos"
                                        v-validate="'required'"
                                        dense
                                        outlined
                                        hide-details="auto"
                                        label="Nombres Completos*"
                                        :error-messages="errors.collect('datos.nombreCompletos')"
                                        data-vv-name="datos.nombreCompletos"
                                        data-vv-as="Nombre Completo"
                                        required
                                    />
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                            <small>*Campos Obligatorios</small>
                        </v-col>
                    </v-row>
                </v-container>
                <v-card-actions class="grey lighten-5">
                    <v-spacer />
                    <v-btn color="darken-1" text @click="EMPTY_FORM"> CERRAR </v-btn>
                    <v-btn v-if="step != 4" :loading="loadingBTN" color="primary" @click="fnHandleCrud"> {{ modalText }} </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Delete :open="openDelete" :loadingBTN="loadingBTN" @handle-delete="fnHandlePut" @closeModal="closeDocumento" />
        <Documento :open="openDocumento" @handle-search="fnHandleGet" @closeModal="closeDocumento" />
    </v-container>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { exportXLSX } from '@/utils'
import { mixins } from '@/mixins/mixin.js'
import Delete from '@/components/modals/Delete'
import Documento from '@/components/modals/Documento'

const defaultText = 'REGISTRAR'

export default {
    components: {
        Delete,
        Documento
    },
    mixins: [mixins],

    data() {
        return {
            menu: false,
            openDialog: false,
            openDelete: false,
            openDocumento: false,
            search: '',
            singleSelect: true,
            loadingBTN: false,
            selected: null,
            modalText: defaultText,
            step: 1,
            loading: false,
            headers: [
                { text: 'Actions', value: 'actions', sortable: false },
                { text: 'Perfil', value: 'tipoDocumento' },
                { text: 'Nro Documento', value: 'numeroDocumento' },
                { text: 'Nombres', value: 'nombreCompletos' },
                { text: 'telefono', value: 'telefono' },
                { text: 'correo', value: 'correo' }
            ]
        }
    },
    watch: {
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
        ...mapGetters('operador', ['lista']),
        ...mapState('operador', ['datos']),
        ...mapState('utilities', ['tipoDocumento'])
    },
    methods: {
        ...mapMutations({
            RESET_FORM: 'operador/RESET_FORM',
            UPDATE_DATOS: 'operador/UPDATE_DATOS',
            OPEN_MODAL: 'mainUI/OPEN_MODAL',
            OPEN_BAR: 'mainUI/OPEN_BAR'
        }),
        ...mapActions({
            handleGet: 'operador/obtenerLista',
            handlePost: 'operador/registrar',
            handlePut: 'operador/actualizar'
        }),
        EMPTY_FORM() {
            this.openDialog = false
            this.loading = false
            this.loadingBTN = false
            this.menu = false
            this.selected = null
            this.openDelete = false
            this.openDocumento = false
            this.OPEN_MODAL({ state: false })
            this.step = 1
            this.RESET_FORM()
        },
        openForm(tipo, item) {
            this.step = tipo
            let status = false
            this.selected = item
            if (tipo == 1) {
                this.RESET_FORM()
                status = true
            } else if (tipo == 2) {
                if (!item) {
                    this.OPEN_BAR({ state: true, text: 'No hay selección', color: 'red' })
                } else {
                    status = true
                    this.UPDATE_DATOS(item)
                }
            } else if (tipo == 3) {
                if (!item) {
                    this.OPEN_BAR({ state: true, text: 'No hay selección', color: 'red' })
                } else {
                    this.openDelete = true
                }
            } else if (tipo == 4) {
                if (!item) {
                    this.OPEN_BAR({ state: true, text: 'No hay selección', color: 'red' })
                } else {
                    status = true
                    this.UPDATE_DATOS(item)
                }
            }
            this.openDialog = status
        },
        async fnHandleCrud() {
            this.loadingBTN = true
            this.OPEN_MODAL({ state: true })
            if (this.step == 1) {
                await this.handlePost(this.datos)
            } else {
                const item = this.selected
                await this.handlePut(item)
            }
            await this.fnHandleGet({})
            this.EMPTY_FORM()
        },
        async fnHandlePut() {
            this.loadingBTN = true
            const item = this.selected
            if (this.step == 3) {
                item.activo = 0
            }
            await this.handlePut(item)
            await this.fnHandleGet({})
            this.EMPTY_FORM()
        },
        async fnHandleGet({ numeroDocumento = '' }) {
            this.loading = true
            console.log('handle_get', { fechaFiltro: this.fechaFiltro, numeroDocumento })
            await this.handleGet({ fechaFiltro: this.fechaFiltro, numeroDocumento })
            this.EMPTY_FORM()
        },

        downloadHandle() {
            this.loading = true
            const headers = ['Perfil', 'numeroDocumento', 'nombreCompletos', 'telefono', 'correo']

            const filename = `REPORT_OPERADOR_${Date.now()}`
            exportXLSX({ headers, campos: ['Perfil', 'numeroDocumento', 'nombreCompletos', 'telefono', 'correo'], arrayData: this.lista }, { filename })
            this.loading = false
        },
        closeDocumento(nombreModal) {
            this[nombreModal] = false
        }
    },
    async created() {
        await this.fnHandleGet({})
    }
}
</script>
