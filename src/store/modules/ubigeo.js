import axios from 'axios'

const state = {
    departamento: [],
    provincia: [],
    distrito: []

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


}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
