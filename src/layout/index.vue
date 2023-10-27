<template>
    <v-app id="inspire">
        <v-app-bar app hide-on-scroll class="white" flat>
            <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="text-uppercase" to="/">
                <strong>EQUIFAX</strong>
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-items> </v-toolbar-items>
            <v-spacer />
            <v-chip class="ml-2" outlined color="green" small> <v-icon left> mdi-android </v-icon> {{ VersionAPP }} </v-chip>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app width="240" dark :mini-variant.sync="mini" class="main">
            <v-list>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img src="https://congreso.america-digital.com/wp-content/uploads/2018/06/Logo-EQUIFAX.png"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-title dark> {{ userLogin.usuario }} </v-list-item-title>
                    <v-btn icon @click.stop="mini = !mini">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                </v-list-item>
                <v-divider></v-divider>
                <v-list nav dense>
                    <v-list-item link to="/reservas/main">
                        <v-list-item-icon>
                            <v-icon>mdi-calendar</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>RESERVAS</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/colaboradores/main">
                        <v-list-item-icon>
                            <v-icon>mdi-account-group</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>COLABORADORES</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/productos/main">
                        <v-list-item-icon>
                            <v-icon>mdi-package-variant-closed</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>SERVICIOS</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/clientes/main">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>CLIENTES</v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item link to="/transportes/main"></v-list-item> -->
                    <v-list-item link to ="/operador/main">
                        <v-list-item-icon>
                            <v-icon> mdi-bus-school</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>OPERADORES</v-list-item-title>
                    </v-list-item>

                    <template v-if="roles == 'SUPERADMIN'">
                        <v-list-item link to="/operador/main">
                            <v-list-item-icon>
                                <v-icon>mdi-shield-account</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>OPERADORES</v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list>
            </v-list>
            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block @click="cerrarSesion" color="red" v-if="!mini"> Cerrar Sesión </v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <v-main class="grey lighten-3">
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { VersionAPP } from '@/utils/auth'

export default {
    data: () => ({
        drawer: true,
        mini: true,
        clipped: true,
        fixed: false,
        miniVariant: false,
        admins: [
            ['Management', 'mdi-account-multiple-outline'],
            ['Settings', 'mdi-cog-outline']
        ],
        cruds: [
            ['Create', 'mdi-plus-outline'],
            ['Read', 'mdi-file-outline'],
            ['Update', 'mdi-update'],
            ['Delete', 'mdi-delete']
        ],
        right: true,
        rightDrawer: false
    }),
    computed: {
        ...mapGetters('usuarios', ['optionalRole']),

        ...mapState('usuarios', ['userLogin', 'roles']),
        VersionAPP() {
            return VersionAPP
        }
    },
    methods: {
        openDrawer() {
            this.drawer = !this.drawer
            this.mini = false
        },
        ...mapActions({
            SIGN_OUT: 'usuarios/resetToken'
        }),
        async cerrarSesion() {
            this.$store.commit('mainUI/OPEN_MODAL', { state: true, overlay: false, color: 'red', width: '400px', text: 'CERRANDO SESIÓN' })
            await this.SIGN_OUT()
        }
    }
}
</script>
<style>
@media only screen and (max-width: 600px) {
    .container {
        padding: 8px !important;
    }
}
</style>
