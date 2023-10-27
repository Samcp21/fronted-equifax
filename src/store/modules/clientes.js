import request from '@/utils/request'
import DefaultModel from '@/models/clientes'
import { format, subDays, differenceInDays } from 'date-fns'

const state = {
    lista: [],
    datos: new DefaultModel.BaseForm()
}

const getters = {
    lista: (_state) => (_state.lista.length>0 ? _state.lista : [])
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
    async obtenerLista({ commit }, payload) {
        console.log('payload ', payload)
        const numeroDocumento = payload.numeroDocumento ?? null
        const fromDate = payload.fechaFiltro ?? [format(subDays(new Date(), 31), 'YYYY-MM-DD'), format(new Date(), 'YYYY-MM-DD')]

        const { data } = await request({
            url: '/api/private/personas',
            method: 'GET',
            params: {
                fromDateLeft: fromDate[0],
                fromDateRight: fromDate[1],
                numeroDocumento
            }
        })

        console.log('obtenerLista', data)
        commit('SET_LISTA', data.payload)
    },
    async registrar({ commit }, payload) {
        console.log('post_payload ', payload)
        const { data } = await request({
            url: '/api/private/personas/',
            method: 'POST',
            data: payload
        })
        console.log('data', data)
        return data
    },
    async actualizar({ commit, rootState }, payload) {
        const datos = rootState.usuarios.userLogin
        payload.usuarioModificacion = datos.usuario
        console.log('post_payload ', payload)

        const { data } = await request({
            url: `/api/private/personas/${payload.id}`,
            method: 'PUT',
            data: payload
        })
        console.log('data', data)
        return data
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
