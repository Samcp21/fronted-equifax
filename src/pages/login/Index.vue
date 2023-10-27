<template>
    <v-row dense>
        <v-col cols="12" sm="7" md="8" order-xs-2 order-md1 class="mainLefLogin" />
        <v-col cols="12" sm="5" md="4" order-xs-1 order-md2 class="mainLogin">
            <v-row dense>
                <v-col cols="12" lg="10" offset-lg="1" xl="8" offset-xl="2" class="pa-3">
                    <form autocomplete="nope" @submit.prevent="goLogin">
                        <v-card flat>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" class="text-center">
                                        <img
                                            class="text-center"
                                            src="https://congreso.america-digital.com/wp-content/uploads/2018/06/Logo-EQUIFAX.png"
                                            aspect-ratio="1"
                                            max-height="60"
                                            width="180px"
                                            alt="logo"
                                        />
                                        <h5 class="grey--text py-2">Bienvenido, por favor inicia sesión</h5>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="usuario"
                                            v-validate="'required'"
                                            prepend-icon="mdi-account"
                                            outlined
                                            :error-messages="errors.collect('usuario')"
                                            data-vv-name="usuario"
                                            placeholder="admin"
                                            required
                                            name="login"
                                            label="Numero Documento"
                                            type="text"
                                        />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="password"
                                            v-validate="'required'"
                                            prepend-icon="mdi-lock"
                                            outlined
                                            name="password"
                                            required
                                            label="Contraseña"
                                            placeholder="password"
                                            type="password"
                                            :error-messages="errors.collect('password')"
                                            data-vv-name="password"
                                        />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" block :loading="loading" type="submit">Ingresar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </form>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import { mixins } from '@/mixins/mixin.js'
import { mapState, mapActions } from 'vuex'

export default {
    mixins: [mixins],
    $_veeValidate: {
        validator: 'new'
    },
    data: () => ({
        usuario: null,
        password: null,
        loading: false
    }),
    computed: {},
    methods: {
        ...mapActions({
            validaLogin: 'usuarios/validateLogin'
        }),
        goLogin() {
            this.$validator.validateAll().then(async (result) => {
                try {
                    if (result) {
                        this.loading = true

                        const { status } = await this.validaLogin({
                            usuario: this.usuario,
                            password: this.password
                        })
                        console.log('status', status)
                        if (status != 500) {
                            console.log('route')
                            this.loading = false
                            this.$router.push('/reservas/main')
                        } else {
                            console.log('<--->, not found user')
                            this.$store.commit('mainUI/OPEN_BAR', {
                                state: true,
                                text: 'Usuario no existe',
                                color: 'grey'
                            })
                            this.documento = null
                            this.password = null
                            this.loading = false
                        }
                    }
                } catch (error) {
                    console.log('<--->, not found user')
                    this.$store.commit('mainUI/OPEN_BAR', {
                        state: true,
                        text: 'Usuario no existe',
                        color: 'grey'
                    })
                    this.documento = null
                    this.password = null
                    this.loading = false
                }
            })
        }
    }
}
</script>
<style scoped>
.mainLefLogin {
    width: 100%;
    background: url('https://www.licenciasonline.com/images/news/f3155ebf-6aaf-455d-9ac2-a96abcf1c8c9.jpg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}
.mainLogin {
    display: flex;
    background: #f4f4f4;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
}
</style>
