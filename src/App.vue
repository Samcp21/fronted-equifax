<template>
    <v-app>
        <router-view />
        <v-snackbar v-model="showSnackBar.state" center :timeout="2000" top right :color="showSnackBar.color">
            {{ showSnackBar.text }}
        </v-snackbar>
        <v-dialog v-model="openModalDefault.state" :hide-overlay="openModalDefault.overlay" persistent :width="openModalDefault.width">
            <v-card :color="openModalDefault.color" dark>
                <v-card-text>
                  <strong>{{ openModalDefault.text }}</strong>
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'App',
    computed: {
        ...mapState('mainUI', ['showSnackBar', 'openModalDefault'])
    },
    async created() {
        this.$store.commit('mainUI/OPEN_BAR', { state: false })
        this.$store.commit('mainUI/OPEN_MODAL', { state: false })
    }
}
</script>
<style lang="css">
.required label::after {
    content: '*';
}
</style>
