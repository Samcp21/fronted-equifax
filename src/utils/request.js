import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { timeout } from '../utils/index'
// create an axios instance
const service = axios.create({
    // withCredentials: true, // send cookies when cross-domain requests
    //timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    (config) => {
        // do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['Content-Type'] = 'application/json'
            config.headers.Authorization = `Bearer ${getToken()}`
        }
        return config
    },

    (error) => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)
service.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        console.log('error.response.status' + error.response.status) // for debug
        if (error.response.status == 401) {
            // to re-    this.$store.commit('mainUI/OPEN_BAR', { state: false });

            store.commit('mainUI/OPEN_MODAL', { state: true,overlay:false, color: 'red', width: '400px', text: 'SU SESIÓN HA EXPIRADO' })
            await store.dispatch('usuarios/resetToken')
        }
        return Promise.reject(error)
    }
)

export default service
