<template >
    <div>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>FILTROS</v-card-title>
                    <v-card-text>
                        <ValidationObserver ref="obs">
                            <v-form>
                                <v-row>
                                    <v-col cols="12" sm="7">
                                        <v-row class="d-flex justify-center mb-6">
                                            <v-col cols="12" sm="4">
                                                <ValidationProvider name="Tours">
                                                    <v-select
                                                        slot-scope="{ errors, valid }"
                                                        clearable
                                                        :items="listCollaborators"
                                                        v-model="filter.idColaborador"
                                                        item-text="nombreCompletos"
                                                        item-value="id"
                                                        :error-messages="errors"
                                                        :success="valid"
                                                        label="Seleccionar Asistente"
                                                    ></v-select> </ValidationProvider
                                            ></v-col>
                                            <!-- <v-col cols="12" sm="4" class="d-flex align-center">
                                                <v-menu
                                                    ref="menu"
                                                    v-model="filter.menu"
                                                    :close-on-content-click="false"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    min-width="auto"
                                                >
                                                    <template #activator="{ on, attrs }">
                                                        <v-text-field
                                                            clearable
                                                            v-model="filter.date"
                                                            hide-details="auto"
                                                            dense
                                                            label="FILTRAR POR DIA"
                                                            prepend-icon="mdi-calendar"
                                                            readonly
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        />
                                                    </template>
                                                    <v-date-picker v-model="filter.date"> </v-date-picker>
                                                </v-menu>
                                           </v-col>  -->
                                            <v-col cols="12" sm="4">
                                                <ValidationProvider name="cars">
                                                    <v-select
                                                        slot-scope="{ errors, valid }"
                                                        clearable
                                                        :items="listPersons"
                                                        v-model="filter.idCliente"
                                                        item-text="nombreCompletos"
                                                        item-value="id"
                                                        :error-messages="errors"
                                                        :success="valid"
                                                        label="Seleccionar Cliente"
                                                    ></v-select>
                                                </ValidationProvider>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                        <v-row class="d-flex justify-space-around mb-6">
                                            <v-btn color="primary" @click="searchReserva">BUSCAR</v-btn>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </ValidationObserver>
                    </v-card-text>
                </v-card></v-col
            >
            <v-col cols="12"
                ><v-data-table
                    multi-sort
                    :loading="loadingPackages"
                    :search="search"
                    :headers="headersReservation"
                    :items="listReserva()"
                    class="elevation-1"
                    :items-per-page="20"
                >
                    <template v-slot:[`item.action`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon v-bind="attrs" v-on="on" color="green" @click="editReservationItem(item)" small>mdi-pencil</v-icon>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon v-bind="attrs" v-on="on" color="red" @click="deleteReservationItem(item)" small>mdi-delete</v-icon>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                    </template>
                </v-data-table></v-col
            >
        </v-row>
        <v-dialog v-model="formReservation" persistent max-width="900">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Reserva</span>
                </v-card-title>
                <v-card-text>
                    <ValidationObserver ref="obs">
                        <div class="d-flex justify-space-between mb-6">
                            <v-dialog v-model="dialogformClient" width="700">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-row align="center">
                                        <v-col cols="12" sm="6" md="6">
                                            <v-autocomplete
                                                v-validate="'required'"
                                                dense
                                                v-model="form.idCliente"
                                                :items="listPersons"
                                                item-text="nombreCompletos"
                                                item-value="id"
                                                placeholder="INNOUT SAC"
                                                label="Buscar Clientes"
                                                data-vv-name="form.idCliente"
                                                data-vv-as="Tipo"
                                                filled
                                                rounded
                                            >
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col class="d-flex justify-center" cols="12" sm="6" md="6">
                                            <v-btn dark small v-bind="attrs" v-on="on">
                                                <b>Agregar Cliente</b>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </template>
                                <v-card>
                                    <v-toolbar color="primary" dark>Cliente</v-toolbar>
                                    <v-card-text>
                                        <ValidationObserver ref="formClient">
                                            <v-form>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <ValidationProvider name="Numero Documento" rules="required|max:10">
                                                            <v-text-field
                                                                slot-scope="{ errors, valid }"
                                                                v-model="formClient.numeroDocumento"
                                                                :counter="8"
                                                                :error-messages="errors"
                                                                :success="valid"
                                                                label="Numero Documento"
                                                                required
                                                            ></v-text-field>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <ValidationProvider name="email" rules="required|email">
                                                            <v-text-field
                                                                slot-scope="{ errors, valid }"
                                                                v-model="formClient.correo"
                                                                :error-messages="errors"
                                                                :success="valid"
                                                                label="E-mail"
                                                                required
                                                            ></v-text-field>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <ValidationProvider name="Nombres" rules="required">
                                                            <v-text-field
                                                                slot-scope="{ errors, valid }"
                                                                v-model="formClient.nombres"
                                                                :error-messages="errors"
                                                                :success="valid"
                                                                label="Nombres"
                                                                required
                                                            ></v-text-field>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col>
                                                        <ValidationProvider name="Apellidos" rules="required">
                                                            <v-text-field
                                                                slot-scope="{ errors, valid }"
                                                                v-model="formClient.apellidos"
                                                                :error-messages="errors"
                                                                :success="valid"
                                                                label="Apellidos"
                                                                required
                                                            ></v-text-field>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col>
                                                        <ValidationProvider name="telefono" rules="required|max:9">
                                                            <v-text-field
                                                                slot-scope="{ errors, valid }"
                                                                v-model="formClient.telefono"
                                                                :counter="9"
                                                                :error-messages="errors"
                                                                :success="valid"
                                                                label="Numero Telefonico"
                                                                required
                                                            ></v-text-field>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col>
                                                        <ValidationProvider name="direccion" rules="required">
                                                            <v-text-field
                                                                slot-scope="{ errors, valid }"
                                                                v-model="formClient.direccion"
                                                                :error-messages="errors"
                                                                :success="valid"
                                                                label="Direccion"
                                                                required
                                                            ></v-text-field>
                                                        </ValidationProvider>
                                                    </v-col>
                                                </v-row>
                                            </v-form>
                                        </ValidationObserver>
                                    </v-card-text>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" text @click="dialogformClient = false">Cerrar </v-btn>
                                        <v-btn color="primary" text @click="submitClient"> Crear </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                        <v-form>
                            <v-row>
                                <v-col>
                                    <v-row>
                                        <v-col cols="12" sm="3" md="2"
                                            ><ValidationProvider name="Precio Venta" rules="required|numeric">
                                                <v-text-field
                                                    slot-scope="{ errors, valid }"
                                                    v-model="form.precioVenta"
                                                    :error-messages="errors"
                                                    :success="valid"
                                                    label="Precio Venta"
                                                    required
                                                ></v-text-field> </ValidationProvider
                                        ></v-col>
                                        <v-col cols="12" sm="3" md="2"
                                            ><ValidationProvider name="Abono" :rules="`required|numeric|max_value:${form.precioVenta}`">
                                                <v-text-field
                                                    slot-scope="{ errors, valid }"
                                                    v-model="form.abono"
                                                    :error-messages="errors"
                                                    :success="valid"
                                                    label="Abono"
                                                    required
                                                ></v-text-field> </ValidationProvider
                                        ></v-col>

                                        <v-col cols="12" sm="3" md="3"
                                            ><ValidationProvider name="Hotel" rules="required">
                                                <v-text-field
                                                    slot-scope="{ errors, valid }"
                                                    v-model="form.hotel"
                                                    :error-messages="errors"
                                                    :success="valid"
                                                    label="Hotel"
                                                    required
                                                ></v-text-field> </ValidationProvider
                                        ></v-col>
                                        <v-col cols="12" sm="3" md="3"
                                            ><ValidationProvider name="Referido" rules="required">
                                                <v-select
                                                    slot-scope="{ errors, valid }"
                                                    v-model="form.ref"
                                                    :items="listCollaboratorsOperador()"
                                                    item-text="nombreCompletos"
                                                    item-value="id"
                                                    :error-messages="errors"
                                                    :success="valid"
                                                    label="Referido"
                                                    required
                                                ></v-select> </ValidationProvider
                                        ></v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-form>
                        <small>*indica que se requiere el campo</small>
                    </ValidationObserver>
                    <v-card>
                        <v-card-title>PAQUETES</v-card-title>
                        <v-card-text>
                            <ValidationObserver ref="packs">
                                <v-form>
                                    <v-row>
                                        <v-col cols="12" sm="10">
                                            <v-row>
                                                <v-col cols="12" sm="4">
                                                    <ValidationProvider name="Tours" rules="required">
                                                        <v-select
                                                            slot-scope="{ errors, valid }"
                                                            :items="listCollaborators"
                                                            v-model="formPacks.idPack"
                                                            :error-messages="errors"
                                                            :success="valid"
                                                            item-text="nombreCompletos"
                                                            item-value="id"
                                                            label="Seleccionar Asistente"
                                                            required
                                                        ></v-select>
                                                    </ValidationProvider>
                                                </v-col>
                                                <v-col cols="12" sm="4">
                                                    <ValidationProvider name="pasajero" rules="required|numeric">
                                                        <v-text-field
                                                            slot-scope="{ errors, valid }"
                                                            v-model="formPacks.passenger"
                                                            :error-messages="errors"
                                                            :success="valid"
                                                            label="Pasajeros"
                                                            required
                                                        ></v-text-field> </ValidationProvider
                                                ></v-col>
                                                <!-- <v-col cols="12" sm="3"
                                                    ><ValidationProvider name="Carro" rules="required">
                                                        <v-select
                                                            slot-scope="{ errors, valid }"
                                                            v-model="formPacks.idTransport"
                                                            :items="listTransport"
                                                            item-text="plate"
                                                            item-value="id"
                                                            :error-messages="errors"
                                                            :success="valid"
                                                            label="Seleccionar Carro"
                                                            required
                                                        ></v-select> </ValidationProvider
                                                ></v-col> -->
                                                <v-col cols="12" sm="4">
                                                    <ValidationProvider name="Fecha">
                                                        <v-menu
                                                            ref="menu"
                                                            v-model="formPacks.menu3"
                                                            :close-on-content-click="false"
                                                            transition="scale-transition"
                                                            offset-y
                                                            min-width="auto"
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="formPacks.day"
                                                                    label="Fecha del Tours"
                                                                    required
                                                                    prepend-icon="mdi-calendar"
                                                                    readonly
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="formPacks.day" no-title scrollable @input="formPacks.menu3 = false">
                                                            </v-date-picker>
                                                        </v-menu>
                                                    </ValidationProvider>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" sm="2">
                                            <v-col class="d-flex justify-center">
                                                <v-btn small :disabled="disableAddPack" class="blue" dark @click="addPack">Agregar</v-btn>
                                            </v-col>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </ValidationObserver>
                        </v-card-text>
                    </v-card>
                    <v-data-table
                        multi-sort
                        :loading="loadingPackages"
                        :search="search"
                        :headers="headers"
                        :items="listPackages"
                        class="elevation-1"
                        :items-per-page="20"
                    >
                        <template v-slot:[`item.action`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon v-bind="attrs" v-on="on" color="primary" @click="deleteItem(item)" small>mdi-delete</v-icon>
                                </template>
                                <span>Eliminar</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeFormReservation">CERRAR</v-btn>
                    <v-btn color="blue darken-1" text @click="submit" :loading="loadingResult"> {{ isEdit ? 'EDITAR' : 'CREAR' }} </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="clientRepeat" max-width="290">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2"> Advertencia </v-card-title>

                <v-card-text class="lg-4">
                    Ya tenemos almacenado al cliente en nuestra base de datos. Cualquier cambio que se quiera hacer acerca del cliente, lo puede hacer
                    editandolo.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="clientRepeat = false"> Aceptar </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="errorDownload" max-width="290">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2"> Error al descargar </v-card-title>

                <v-card-text class="lg-4"> Estos fueron las Reservas que no se pudieron asignar un vehiculo:{{ reservationUndesignated }} </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="errorDownload = false"> Aceptar </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { ValidationObserver, ValidationProvider, withValidation } from 'vee-validate'
import DefaultModel from '@/models/reservation'
import { mapState, mapGetters, mapActions } from 'vuex'
import { format, parseISO } from 'date-fns'
import { exportXLSX } from '@/utils'
export default {
    data: () => ({
        form: DefaultModel.BaseForm(),
        formClient: DefaultModel.formClient(),
        formReservation: false,
        loadingPackages: false,
        loadingResult: false,
        loadingDownload: false,
        errorDownload: false,
        reservationUndesignated: [],
        isEdit: false,
        disableAddPack: false,
        listPackages: [],
        headersReservation: [
            { text: 'Actions', value: 'action', sortable: false },
            { text: 'ID', value: 'reservation' },
            { text: 'Colaborador', value: 'colaborador' },
            { text: 'Cliente', value: 'cliente' },
            { text: 'Precio de Venta', value: 'precio' },
        ],
        headers: [
            { text: 'Actions', value: 'action', sortable: false },
            { text: 'Tours', value: 'descriptionTours' },
            { text: 'Pasajeros', value: 'passenger' },
            // { text: 'Transporte', value: 'transport' },
            { text: 'Fecha', value: 'day' }
        ],
        filter: {
            idColaborador: null,
            date: '2023-08-26',
            menu: null,
            idCliente: null
        },
        search: '',
        dialogformClient: false,
        clientRepeat: false,
        formPacks: DefaultModel.formPacks()
    }),
    components: {
        ValidationProvider,
        ValidationObserver
    },

    computed: {
        ...mapGetters({ listProduct: 'products/lista' }),
        ...mapGetters({ listTransport: 'transport/lista' }),
        ...mapGetters({ listCollaborators: 'collaborators/lista' }),
        ...mapGetters({ listReservation: 'reservation/lista' }),
        ...mapGetters({ listPersons: 'persons/lista' })
    },
    methods: {
        listReserva() {
            const newArray = []
            this.listReservation.map((x) => {
                newArray.push({
                    ...x,
                    collaborator: this.listCollaborators.find((y) => y.id == x.idCollaborator)?.nombreCompletos,
                    client: this.listPersons.find((y) => y.id == x.idPerson)?.nombreCompletos
                })
            })
            return newArray
        },
        async downloadXlsx() {
            console.log('listReserva', this.listReservation)
            this.loadingDownload = true
            const data = await this.$store.dispatch('reservation/findPackagesReservation', {
                listReservation: this.listReservation,
                products: this.listProduct,
                transport: this.listTransport
            })
            console.log('data_downloadXlsx', data)
            const headers = ['ID RESERVA', 'NUMERO DE PAX', 'NOMBRE', 'TELEFONO', 'HOTEL', 'AGENCIA', 'TOUR', 'FECHA', 'TRANSPORTE']
            const filename = `Reservas`
            const arrayPrint = []
            console.log('listPersons', this.listPersons)
            console.log('listCollaborators', this.listCollaborators)
            console.log('this.listProduct', this.listProduct)
            console.log('data', data)
            const idUnassigned=[]
            data.data['Unassigned Reservations']? data.body.reservation.filter((x)=>{
              data.data['Unassigned Reservations'].forEach(element => {
                if(element==x.idRes ){
                  idUnassigned.push(x.idReservation)
                }
              });
            }) : ""
            this.reservationUndesignated = idUnassigned
            this.reservationUndesignated?.length > 0 ? (this.errorDownload = true) : null
            data.data.output.map((x) => {
                console.log('x', x)
                const _searchReservation = data.body.reservation.find((y) => y.idRes == x.idRes)
                console.log('_searchReservation', _searchReservation)
                const findReservation = this.listReservation.find((y) => y.idReservation == _searchReservation.idReservation)
                console.log('findReservation', findReservation)
                const findCar = this.listTransport.find((y) => y.id == x.idCar)
                const findPersons = this.listPersons.find((y) => y.id == findReservation.idPerson)
                const findCollaborator = this.listCollaborators.find((y) => y.id == findReservation.idCollaborator)
                const findProduct = this.listProduct.find((y) => y.id == _searchReservation.idTour)
                console.log('findProduct', findProduct)
                arrayPrint.push({
                    idReserva: _searchReservation.idReservation,
                    passenger: _searchReservation.passenger,
                    nombreCompletos: `${findPersons?.nombres} ${findPersons?.apellidos}`,
                    telefono: findPersons?.telefono,
                    hotel: findReservation?.hotel,
                    colaborador: findCollaborator?.nombreCompletos,
                    destino: findProduct?.name,
                    fechaReserva: findReservation?.fechaReserva,
                    plate: findCar?.plate,
                    assigned: 'Si'
                })
            })
            this.reservationUndesignated.map((x) => {
                console.log('x', x)
                const _searchReservation = data.body.reservation.find((y) => y.idReservation == x)
                console.log('_searchReservation', _searchReservation)
                const findReservation = this.listReservation.find((y) => y.idReservation == _searchReservation.idReservation)
                console.log('findReservation', findReservation)
                const findCar = ''
                const findPersons = this.listPersons.find((y) => y.id == findReservation.idPerson)
                const findCollaborator = this.listCollaborators.find((y) => y.id == findReservation.idCollaborator)
                const findProduct = this.listProduct.find((y) => y.id == _searchReservation.idTour)
                arrayPrint.push({
                    idReserva: _searchReservation.idReservation,
                    passenger: _searchReservation.passenger,
                    nombreCompletos: `${findPersons?.nombres} ${findPersons?.apellidos}`,
                    telefono: findPersons?.telefono,
                    hotel: findReservation?.hotel,
                    colaborador: findCollaborator?.nombreCompletos,
                    destino: findProduct?.name,
                    fechaReserva: findReservation?.fechaReserva,
                    plate: findCar,
                    assigned: 'No'
                })
            })
            console.log('arrayPrint', arrayPrint)
            exportXLSX(
                {
                    headers: [...headers, 'ASIGNADO'],
                    campos: ['idReserva', 'passenger', 'nombreCompletos', 'telefono', 'hotel', 'colaborador', 'destino', 'fechaReserva', 'plate', 'assigned'],
                    arrayData: arrayPrint
                },
                { filename }
            )
            this.loadingDownload = false
        },
        async clear() {
            this.form.name = this.form.email = this.form.select = this.form.checkbox = ''
            this.$nextTick(() => {
                this.$refs.obs.reset()
            })
        },
        async searchReserva() {
            this.loadingPackages = true
            console.log('search')
            console.log('this.filter --1', this.filter)
            await this.$store.dispatch('reservation/filterPackage', this.filter)
            console.log('this.filter --2', this.filter)
            this.loadingPackages = false
        },
        async submitClient() {
            const result = await this.$refs.formClient.validate()
            console.log('result', result)
            if (result) {
                const createPersons = await this.$store.dispatch('persons/postPersons', this.formClient)
                console.log('createPersons', createPersons)
                if (createPersons.status == '02') {
                    this.clientRepeat = true
                } else {
                    await this.$store.dispatch('persons/getPersons', { status: true })
                    this.form.idCliente = createPersons.data.id
                    this.dialogformClient = false
                }
            }
        },
        async addPack() {
            this.$refs.packs.validate().then((success) => {
                if (success) {
                    this.disableAddPack = true
                    console.log('formPacks', this.formPacks)
                    const { day, passenger, idPack, idTransport } = this.formPacks
                    this.listPackages.push({
                        idTours: idPack,
                        passenger: Number(passenger),
                        day,
                        descriptionTours: this.listProduct.find((x) => x.id == idPack).name
                        // transport: this.listTransport.find((y) => y.id == idTransport).plate,
                        // idTransport
                    })
                    // this.formPacks = DefaultModel.formPacks()
                    this.disableAddPack = false
                }
            })
        },
        async closeFormReservation() {
            this.form = DefaultModel.BaseForm()
            this.formClient = DefaultModel.formClient()
            this.formPacks = DefaultModel.formPacks()
            this.isEdit = false
            this.listPackages = []
            this.formReservation = false
        },
        async deleteItem(item) {
            const findIndex = this.listPackages.indexOf(item)
            this.listPackages.splice(findIndex, 1)
        },
        async deleteReservationItem(item) {
            await this.$store.dispatch('reservation/putReservation', { ...item, isDelete: true })
            await this.$store.dispatch('reservation/filterPackage', this.filter)
        },
        async editReservationItem(item) {
            console.log('item', item)
            this.isEdit = true
            this.loadingPackages = true
            this.formReservation = true
            this.form = {
                ...item
            }
            this.form.idCliente = item.idPerson
            this.form.precioVenta = item.salePrice
            this.form.abono = item.pass
            this.form.ref = item.idCollaborator

            // this.listPackages
            const getPackages = await this.$store.dispatch('reservation/getPackages', { idReserva: item.id })
            console.log('his.listTransport', this.listTransport)
            getPackages.map((x) => {
                this.listPackages.push({
                    ...x,
                    descriptionTours: this.listProduct.find((y) => y.id == x.idTours)?.name,
                    transport: this.listTransport.find((y) => y.id == x?.idTransport)?.plate,
                    day: x.fechaReserva
                })
            })
            this.loadingPackages = false
            //  text: 'Actions', value: 'action', sortable: false },
            // { text: 'Tours', value: 'descriptionTours' },
            // { text: 'Pasajeros', value: 'passenger' },
            // { text: 'Fecha', value: 'day' }
        },
        async submit() {
            const result = await this.$refs.obs.validate()
            console.log('this.$refs', this.$refs)
            console.log('result', result)
            if (result) {
                this.loadingResult = true
                if (this.isEdit) {
                    await this.$store.dispatch('reservation/putReservation', { form: this.form, listPackages: this.listPackages })
                } else {
                    await this.$store.dispatch('reservation/postReservation', { listPackage: this.listPackages, details: this.form })
                }
                this.searchReserva()
                this.closeFormReservation()
                this.loadingResult = false
                this.formReservation = false
            }
        },
        listCollaboratorsOperador() {
            return this.listCollaborators.filter((x) => x.idRol == 4)
        },
        async getFindDay({ state = true, numeroDocumento = null }) {
            this.loadingCotizacion = true
            await this.$store.dispatch('reservation/getLista', { fechaFiltro: this.fechaFiltro, state, numeroDocumento })
            this.loadingCotizacion = false
            this.form.menu = false
        }
    },
    async mounted() {
        await Promise.all([
            this.$store.dispatch('products/getProducts'),
            //this.$store.dispatch('transport/getTransport'),
            this.$store.dispatch('collaborators/getCollaborators'),
            this.$store.dispatch('persons/getPersons'),
            this.searchReserva()
        ])
        console.log('//////mounte',this.listCollaborators)
        console.log('this.filter mounte v1', this.filter)
        this.formPacks.day = this.filter.date = format(new Date(), 'YYYY-MM-DD')
        console.log('this.filter mounte v2', this.filter)
    }
}
</script>
