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

  async getReservation({ commit, state, rootState }, payload) {
    console.log("getReservation", state)
    if (!state.lista.length > 0 || payload?.status) {
      const { token } = rootState.usuarios
      const { data } = await axios({
        url: `http://localhost:3000/ms/genbby/servicios/reservation`,
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
  async postReservation({ rootState }, payload) {
    console.log("payload", payload)
    const { token } = rootState.usuarios
    const { details, listPackage } = payload
    const { ref, idCliente, precioVenta, abono, idTransport, hotel } = details
    console.log("listPackage", listPackage)
    const data = await axios({
      url: `http://localhost:3000/ms/genbby/servicios/reservation`,
      method: 'POST',
      data: {
        idCollaborator: ref,
        idPerson: idCliente,
        packages: listPackage,
        salePrice: precioVenta,
        pass: abono,
        // idTransport: idTransport,
        hotel,
      },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log("data", data)
  },
  async filterPackage({ commit, state, rootState }, payload) {
    const { token } = rootState.usuarios
    console.log("payload ", payload)
    payload.date = payload.date || new Date().toISOString().substr(0, 10);
    const { tour,
      date,
      menu,
      idColaborador, idCliente } = payload
    const { data } = await axios({
      url: `http://localhost:3000/ms/genbby/servicios/packages/filter`,
      method: 'POST',
      data: {
        idCliente,
        date,
        menu,
        idColaborador
      },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log("data", data)
    commit('SET_LISTA', data)

    // }

  },
  async getPackages({ rootState }, payload) {
    console.log("getPackages")
    const { token } = rootState.usuarios
    const { data } = await axios({
      url: `http://localhost:3000/ms/genbby/servicios/packages/reserva/${payload.idReserva}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    return data
  },

  async findPackagesReservation({ commit, state, rootState }, payload) {
    const { token } = rootState.usuarios
    async function searchTourReserva(idReserva) {
      const { data } = await axios({
        url: `http://localhost:3000/ms/genbby/servicios/packages/reserva/${idReserva}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      return data
    }
    console.log("payload", payload)
    const { listReservation, products, transport } = payload
    const reservation = []
    const tours = []
    const cars = []
    for (const iterator of listReservation) {
      console.log("iterator", iterator)
      const findTours = await searchTourReserva(iterator.idReservation)
      console.log("_findTours", findTours)
      findTours.map((x) => {
        reservation.push({
          idRes: x.id,
          idReservation: iterator.idReservation,
          passenger: x.passenger,
          idTour: x.idTours
        })
      })
    }
    products.map(x => {
      tours.push({
        idTour: x.id,
        shift: x.description
      })
    })
    transport.map(x => {
      cars.push({
        idCar: x.id,
        capacity: x.capacity
      })
    })
    const body = {
      reservation,
      tours,
      cars
    }
    console.log("body", body)
    const { data } = await axios({
      url: `http://localhost:3000/ms/genbby/booking`,
      method: 'POST',
      data: body,
      headers: {
        'content-type': 'application/json',
      }
    })
    console.log("data", data)
    return { data, body }

  },
  async putReservation({ rootState }, payload) {
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
    console.log("request", request)
    console.log("payload", payload)
    const { data } = await axios({
      url: `http://localhost:3000/ms/genbby/servicios/reservation`,
      method: 'PUT',
      data: request,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log("data", data)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
