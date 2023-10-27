import DefaultModel from '@/models/collaborators'
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
    SET_ROLES: (state, payload) => {
        console.log("set_roles")
        state.roles = payload
    },
    RESET_FORM: (state, payload) => {
        state.datos = new DefaultModel.BaseForm()
    },
    UPDATE_DATOS: (state, payload) => {
        state.datos = payload
    }
}
const actions = {
    async getRoles({ commit, state, rootState }) {
        if (!state.roles.length > 0) {
            const { token } = rootState.usuarios

            const { data } = await axios({
                url: `http://localhost:3000/ms/genbby/servicios/rol`,
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('data', data)
            commit('SET_ROLES', data)
        }
    },
    async getCollaborators({ commit, state, rootState }, payload) {
        if (!state.lista.length > 0 || payload?.status) {
            const { token } = rootState.usuarios

            const { data } = await axios({
                url: `http://localhost:3000/ms/genbby/servicios/collaborators`,
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('data_getCollaborators', data)
            commit('SET_LISTA', data)
        }
    },
    async postCollaborators({ rootState }, payload) {
        console.log("payload", payload)
        const { token } = rootState.usuarios

        const { nombres, apellidos } = payload
        const { data } = await axios({
            url: `http://localhost:3000/ms/genbby/servicios/collaborators`,
            method: 'POST',
            data: {
                nombreCompletos: `${nombres} ${apellidos}`,
                ...payload
            },
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        console.log("data", data)
        return data
    },
    async putCollaborators({ rootState }, payload) {
        let request
        if (payload.isDelete) {
            request = {
                ...payload,
                activo: 0
            }
        }
        else {
            request = {
                nombreCompletos: `${nombres} ${apellidos}`,
                ...payload
            }
        }
        console.log("payload", payload)
        const { nombres, apellidos } = payload
        const { token } = rootState.usuarios

        const { data } = await axios({
            url: `http://localhost:3000/ms/genbby/servicios/collaborators`,
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
