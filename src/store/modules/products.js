import DefaultModel from '@/models/products'
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
    async getProducts({ commit, state, rootState }, payload) {
        console.log('getProducts', state)
        const { token } = rootState.usuarios
        if (!state.lista.length > 0 || payload?.status) {
            const { data } = await axios({
                url: `http://localhost:3000/ms/genbby/servicios/products`,
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

    async postProducts({ rootState }, payload) {
        console.log('payload', payload)
        const { token } = rootState.usuarios

        const { idTypeTours, price, name } = payload

        const { data } = await axios({
            url: `http://localhost:3000/ms/genbby/servicios/products`,
            method: 'POST',
            data: {
                name,
                description: idTypeTours.shift,
                idTypeTours: idTypeTours.idTour,
                price
            },
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        console.log('data', data)
    },
    async putProducts({ rootState }, payload) {
        let request
        const { token } = rootState.usuarios

        if (payload.isDelete) {
            request = {
                ...payload,
                activo: 0
            }
        } else {
            request = {
                id: payload.id,
                name: payload.name,
                description: payload.idTypeTours.shift || payload.description,
                idTypeTours: payload.idTypeTours.idTour || payload.idTypeTours,
                price: payload.price
            }
        }
        console.log('request', request)
        const { data } = await axios({
            url: `http://localhost:3000/ms/genbby/servicios/products`,
            method: 'PUT',
            data: request,
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        console.log('data', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
