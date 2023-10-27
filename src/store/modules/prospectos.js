import request from '@/utils/request'
import { sortItems, buildFilterPayload } from '@/utils/genericUtils'
import DefaultModel from '@/models/prospectos'
import { format } from 'date-fns'
import axios from 'axios'

const state = {
    lista: [],
    listaEstadoProspectos: [],
    datos: new DefaultModel.BaseForm()
}

const getters = {
    lista: (_state) => (_state.lista ? _state.lista : []),
    listaEstadoProspectos: (_state) => {
        const items = _state.listaEstadoProspectos
        if (items) {
            return items.sort((a, b) => b.id - a.id)
        } else {
            return []
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
        state.datos = {
            ...state.datos,
            ...payload
        }
    },
    SET_LISTA_ESTADOS: (state, payload) => {
        state.listaEstadoProspectos = payload
    }
}

const actions = {
    async obtenerLista({ commit, rootState }, payload) {
        console.log('payload', payload)
        const { data } = await axios({
            url: 'http://localhost:3000/ms/genbby/servicios/filtrarProspectos',
            method: 'POST',
            data: buildFilterPayload(payload)
        })
        console.log('obtenerLista', data)
        commit('SET_LISTA', data)
        return data
    },
    async registrarProspecto({ commit, rootState }, payload) {
        console.log('post_payload ', payload)

        const { data } = await axios({
            url: 'http://localhost:3000/ms/genbby/servicios/prospectos',
            method: 'POST',
            data: payload
        })
        console.log('registrar', data)
        return data
    },
    async actualizarEstadoProspecto({ commit }, payload) {
        console.log('post_payload ', payload)
        const { data } = await request({
            url: `http://localhost:3000/api/private/estadoprospecto/idEstadoProspecto/${payload.id}`,
            method: 'POST',
            data: payload
        })
        console.log('registrar', data)
    },
    async actualizarProspecto({ commit, rootState }, payload) {
        console.log('post_payload ', payload)
        const datos = rootState.usuarios.userLogin
        console.log('usuario ', datos)
        delete payload.usuarioModificacion
        payload.id = payload.idProspecto
        const { data } = await request({
            url: `http://localhost:3000/api/private/prospectos/${payload.id}`,
            method: 'PUT',
            data: payload
        })
        console.log('actualizar', data)
    },
    async getEstado({ commit, state }, payload) {
        const { data } = await request({
            url: `http://localhost:3000/api/private/estadoprospecto/idProspecto/${payload.idProspecto}`,
            method: 'GET'
        })

        console.log('getEstado', data)
        commit('SET_LISTA_ESTADOS', data.payload)
    },
    async registrarEstadoProspecto({ commit }, payload) {
        console.log('post_payload ', payload)

        const { data } = await request({
            url: `http://localhost:3000/api/private/estadoprospecto/idProspecto/${payload.idProspecto}`,
            method: 'POST',
            data: payload
        })
        console.log('registrarEstadoProspecto', data)
    },

    async reporteModelo({ commit, rootState }, payload) {
        console.log('post_payload ', payload)
        const { data } = await request({
            url: 'http://localhost:3000/api/private/prospectos/reporte/top/modelos',
            method: 'GET',
            params: {
                fromDate: format(payload.fechaFiltro, 'YYYY-MM-DD')
            }
        })

        console.log('obtenerLista', data)
        return data.payload
    },
    async reporteOrigenProspecto({ commit, rootState }, payload) {
        const datos = rootState.usuarios.userLogin
        const usuarioOrigen = datos.usuario

        //
        const { data } = await request({
            url: 'http://localhost:3000/api/private/reportes/origen/prospecto',
            method: 'POST',
            data: buildFilterPayload(payload, usuarioOrigen)
        })

        console.log('obtenerLista', data)
        return data.payload
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
