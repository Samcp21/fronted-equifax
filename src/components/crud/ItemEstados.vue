<template>
    <v-row class="blue lighten-5 my-2">
        <v-col cols="12" class="justify-center align-center">
            <form @submit.prevent="addEstadoProspecto">
                <v-container>
                    <v-row class="align-center">
                        <!--
                        <v-col cols="12" md="3">
                            <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        dense
                                        hide-details="auto"
                                        v-model="formItem.fechaMovimiento"
                                        label="Fecha de Movimiento*"
                                        append-icon="mdi-calendar"
                                        readonly
                                        data-vv-name="formItem.fechaMovimiento"
                                        data-vv-as="fecha"
                                        :error-messages="errors.collect('formItem.fechaMovimiento')"
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker v-model="formItem.fechaMovimiento" no-title locale="es" @input="menu = false" /> </v-menu
                        ></v-col>
                         <v-col cols="12" md="3">
                            <v-menu
                                ref="menu2"
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="formItem.horaMovimiento"
                                transition="scale-transition"
                                offset-y
                                dense
                                hide-details="auto"
                                max-width="290px"
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="formItem.horaMovimiento"
                                        label="Hora Movimiento"
                                        prepend-icon="mdi-clock-time-four-outline"
                                        readonly
                                        dense
                                        hide-details="auto"
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-time-picker v-if="menu2" v-model="formItem.horaMovimiento" full-width @click:minute="$refs.menu.save(time)"></v-time-picker>
                            </v-menu>
                        </v-col> -->
                        <v-col cols="6" md="3">
                            <v-select
                                clearable
                                v-validate="'required'"
                                :error-messages="errors.collect('datos.idEstado')"
                                data-vv-name="datos.idEstado"
                                required
                                dense
                                hide-details="auto"
                                v-model="formItem.idEstado"
                                :items="listaEstados"
                                item-text="descripcion"
                                item-value="id"
                                label="Estados*"
                            />
                        </v-col>
                        <v-col cols="6" md="3">
                            <v-select
                                clearable
                                v-validate="'required'"
                                :error-messages="errors.collect('formItem.usuarioModificacion')"
                                data-vv-name="formItem.usuarioModificacion"
                                required
                                dense
                                hide-details="auto"
                                v-model="formItem.usuarioModificacion"
                                :items="listUsuAssign"
                                item-text="nombres"
                                item-value="usuario"
                                label="Asignar Usuario*"
                            />
                        </v-col>
                        <v-col cols="6" sm="3">
                            <v-textarea
                                v-model="formItem.descripcion"
                                auto-grow
                                rows="1"
                                row-height="30"
                                v-validate="'required'"
                                dense
                                hide-details="auto"
                                label="Observaciones*"
                                :error-messages="errors.collect('formItem.descripcion')"
                                data-vv-name="formItem.descripcion"
                                required
                            />
                        </v-col>

                        <v-col cols="4" sm="3" class="text-center"><v-btn type="submit" dark color="primary darken-1" small>Agregar</v-btn></v-col>
                    </v-row>
                </v-container>
            </form>
        </v-col>

        <v-col cols="12" class="justify-center align-center">
            <v-data-table multi-sort dense :loading="loading" :headers="headers" :items="listaEstadoProspectos" :items-per-page="10" class="elevation-1">
                <!-- <template v-slot:[`item.action`]="{ item }">
                    <v-icon color="primary" small @click="deleteItem(item)">mdi-delete</v-icon>
                </template> -->
                <template v-slot:[`item.fechaMovimiento`]="{ item }">
                    {{ item.fechaMovimiento | formatDateHour }}
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
<script>
import { mixins } from '@/mixins/mixin.js'
import DefaultModel from '@/models/prospectos'
import { mapState, mapGetters, mapActions } from 'vuex'
import { format, parseISO } from 'date-fns'

export default {
    mixins: [mixins],
    props: ['loading', 'step'],
    filters: {
        formatDateHour(val) {
            const today = format(val)
            return format(today, 'DD/MM/YYYY HH:mm a')
        }
    },
    computed: {
        ...mapGetters({
            listaEstados: 'estados/lista',
            optionalRole: 'usuarios/optionalRole',
            listUsuAssign: 'usuarios/listUsuAssign',
            listaEstadoProspectos: 'prospectos/listaEstadoProspectos'
        }),
        ...mapState('prospectos', ['datos']),
        ...mapState('usuarios', ['userLogin', 'listaUsuariosAsociados', 'roles'])
    },
    data() {
        return {
            disableTc: false,
            menu: false,
            menu2: false,
            recibido: null,
            headers: [
                { text: 'fechaMovimiento', value: 'fechaMovimiento' },
                { text: 'Estado', value: 'estado' },
                { text: 'Detalle', value: 'descripcion' },
                { text: 'usuarioModificacion', value: 'nombreUsuarioModificacion' }
            ],
            formItem: DefaultModel.BaseFormItem()
        }
    },
    methods: {
        ...mapActions({
            handleGetEstados: 'estados/obtenerLista',
            handleGetEstadosProspecto: 'prospectos/getEstado',
            handleGetUsuarios: 'usuarios/obtenerLista'
        }),
        addEstadoProspecto() {
            this.$validator.validateAll().then(async (result) => {
                if (result) {
                    this.$store.commit('mainUI/OPEN_MODAL', {
                        state: true,
                        text: 'guardando estado'
                    })
                    const usuarioModificacion = this.formItem.usuarioModificacion ? this.formItem.usuarioModificacion : this.userLogin.usuario

                    console.log('usuarioModificacion ', usuarioModificacion)
                    const fechaMovimiento = format(new Date())
                    const body = {
                        ...this.formItem,
                        usuarioModificacion,
                        fechaMovimiento,
                        idProspecto: this.datos.idProspecto
                    }
                    console.log('this.formItem ', body)
                    await this.$store.dispatch('prospectos/registrarEstadoProspecto', body)
                    this.$store.commit('mainUI/OPEN_MODAL', { state: false })
                    this.formItem = DefaultModel.BaseFormItem()
                    await this.handleGetEstadosProspecto(this.datos)
                }
            })
        },
        async deleteItem(item) {
            this.$store.commit('mainUI/OPEN_MODAL', {
                state: true,
                text: 'Eliminando pago'
            })
            await this.$store.dispatch('pagos/deletePagos', item)
            this.$store.commit('mainUI/OPEN_MODAL', { state: false })
        }
    },

    async created() {
        console.log('this.datos //', this.datos)
        this.formItem = DefaultModel.BaseFormItem()
        this.formItem.usuarioModificacion = this.userLogin.usuario
        await this.handleGetEstados({})
        await this.handleGetEstadosProspecto(this.datos)
    }
}
</script>
