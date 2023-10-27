import { getToken, setToken, removeToken, VersionAPP } from '@/utils/auth'
import request from '@/utils/request'
import DefaultModel from '@/models/usuarios'
import { timeout } from '@/utils/index'
import axios from 'axios'

const state = {
    datos: new DefaultModel.BaseForm(),
    userLogin: {},
    lista: [],
    listaOrigen: [],
    token: '',
    roles: [],
    listaUsuariosAsociados: []
}

const getters = {
    lista: (_state) => (_state.lista.length > 0 ? _state.lista : []),
    listaCanal: (_state) => {
        const items = []

        _state.listaOrigen.map((x) => items.push(x.idCanal))

        const newItems = [...items]
        console.log(newItems)
        const newArray = []
        newItems.map((x) => {
            const item = _state.listaOrigen.find((y) => y.idCanal == x)
            newArray.push({ idCanal: item.idCanal, canal: item.canal })
        })
        return newArray
    },
    // optionalRole: (_state) => {
    //     console.log("option roles",_state.userLogin)
    //     return JSON.parse(_state.userLogin.optionalRoles)
    // },
    listUsuAssign: (state, getters, rootState, rootGetters) => {
        const oRoles = state.roles[0]
        if (oRoles === 'SUPERADMIN') {
            return state.listaUsuariosAsociados
        } else {
            if (getters.optionalRole['to-assign']) {
                const excludeToAssign = getters.optionalRole['excludeToAssign']
                return state.listaUsuariosAsociados.filter((x) => !excludeToAssign.some((y) => y == x.usuario))
            } else {
                return [{ ...state.userLogin }]
            }
        }
    }
}

const mutations = {
    SET_LISTA: (state, payload) => {
        state.lista = payload
    },
    RESET_FORM: (state, payload) => {
        state.datos = new DefaultModel.BaseForm()
    },
    UPDATE_DATOS: (state, payload) => {
        state.datos = payload
    },
    SET_TOKEN: (state, p) => {
        state.token = p
    },
    SET_ROLES: (state, p) => {
        state.roles = p
    },
    SET_CANAL_ORIGEN_USER: (state, p) => {
        state.listaOrigen = p
    },
    SET_USUARIOS_ASOCIADOS: (state, p) => {
        state.listaUsuariosAsociados = p
    },
    SET_USER_LOGIN: (state, p) => {
        state.userLogin = p
    }
}

const actions = {
    async obtenerLista({ state, commit }, payload) {
        if (state.lista.length < 1 || payload.status) {
            console.log('payload ', payload)
            const numeroDocumento = payload.numeroDocumento ?? null
            const all = payload.all ?? true
            const fromDate = payload.fechaFiltro ? format(payload.fechaFiltro, 'YYYY-MM-DD') : null
            const { data } = await request({
                url: '/api/private/usuarios/',
                method: 'GET',
                params: {
                    fromDate,
                    numeroDocumento,
                    all
                }
            })

            console.log('obtenerLista', data)
            commit('SET_LISTA', data.payload)
        } else {
            console.log('USUARIOS_FROM_CACHE')
        }
    },
    async registrar({ commit }, payload) {
        console.log('post_payload ', payload)
        const { data } = await request({
            url: '/api/private/usuarios/',
            method: 'POST',
            data: {
                ...payload,
                isLogin: Number(payload.isLogin),
                activo: 1
            }
        })
        console.log('data', data)
    },
    async registrarUsuarioOrigen({ commit }, payload) {
        console.log('post_payload ', payload)
        const { data } = await request({
            url: '/api/private/usuarioorigen/',
            method: 'POST',
            data: payload
        })
        console.log('data', data)
    },
    async getUsuarioOrigen({ commit }, payload) {
        console.log('post_payload ', payload)
        const user = payload.usuario
        console.log('post_payload ', user)

        const { data } = await request({
            url: `/api/private/usuarioorigen/${user}`,
            method: 'GET',
            data: payload
        })
        console.log('data', data)
        return data
    },
    async actualizarUsuarioOrigen({ commit }, payload) {
        console.log('actualizarUsuarioOrigen ', payload)
        const { data } = await request({
            url: `/api/private/usuarioorigen/${payload.id}`,
            method: 'PUT',
            data: payload
        })
        console.log('data', data)
    },
    async actualizar({ commit, state }, payload) {
        console.log('post_payload ', payload)
        const datos = state.userLogin
        payload.usuarioModificacion = datos.usuario
        const { data } = await request({
            url: `/api/private/usuarios/${payload.id}`,
            method: 'PUT',
            data: payload
        })
    },
    async singup({ commit, rootState }, payload) {
        console.log('post_payload ', payload)
        const { data } = await request({
            url: `/api/private/private/usuarios/singup`,
            method: 'POST',
            data: payload
        })
    },

    async validateLogin({ commit }, data) {
        try {
            console.log('paylaod--->', data)
            const { data: response } = await axios({
                url: `http://localhost:3000/ms/genbby/servicios/login`,
                method: 'POST',
                data
            })
            console.log('response ', response)
            if (response.status === 200) {
                console.log('here---1')
                const { token, data } = response
                setToken(token)
                commit('SET_TOKEN', token)

                const roles = Object.assign(data.idRol, {})

                commit('SET_ROLES', [roles])
                return {
                    status: response.status,
                    roles
                }
            }
            return {
                status: 500,
                user: null,
                bussines: null
            }
        } catch (error) {
            console.log('ERROR: ', error)
            return {
                status: 500,
                user: null,
                bussines: null
            }
        }
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(async (resolve) => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            localStorage.clear()
            removeToken()
            await timeout(1500)
            location.reload()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
