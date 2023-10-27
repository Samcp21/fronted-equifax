import DefaultModel from '@/models/transport'
import axios from 'axios'

const state = {
    lista: [],
    datos: new DefaultModel.BaseForm(),
    roles: []
}

const getters = {
    lista: (_state) => (_state.lista.length > 0 ? _state.lista : [])
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
    }
}
const actions = {
    async getTransport({ commit, state, rootState }, payload) {
        console.log("getTransport", state)
        const { token } = rootState.usuarios
        if (!state.lista.length > 0 || payload?.status) {
            const { data } = await axios({
                url: `http://localhost:3000/ms/genbby/servicios/transport`,
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('data', data)
            commit('SET_LISTA', data)
        }
    },

    async postTransport({ rootState }, payload) {
        console.log("payload", payload)
        const { token } = rootState.usuarios

        const { data } = await axios({
            url: `http://localhost:3000/ms/genbby/servicios/transport`,
            method: 'POST',
            data: {
                ...payload,
                plate: payload.plate.toUpperCase()
            },
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        console.log("data", data)
    },
    async putTransport({ rootState }, payload) {
        let request
        if (payload.isDelete) {
            request = {
                ...payload,
                activo: 0
            }
        }
        else {
            request = {
                ...payload
            }
        }
        const { token } = rootState.usuarios

        console.log("payload", payload)
        const { data } = await axios({
            url: `http://localhost:3000/ms/genbby/servicios/transport`,
            method: 'PUT',
            data: request,
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        console.log("data", data)
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
