import DefaultModel from '@/models/clientes'
import axios from 'axios'

const actions = {
    async printerRep({ commit, state, rootState }, payload) {
        const { token } = rootState.usuarios
        const { data } = await axios({
            url: 'http://localhost:3000/ms/genbby/servicios/reports',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: payload,
            responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'nombre-archivo.odt') // Cambia 'nombre-archivo.odt' según tu necesidad
        document.body.appendChild(link)
        link.click()
    }
}

export default {
    namespaced: true,
    actions
}
