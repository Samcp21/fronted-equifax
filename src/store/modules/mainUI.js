const state = {
  showSnackBar: {
    state: false,
    text: 'Agregado exitosamente',
    color: 'grey',
  },
  openModalDefault: {
    state: false,
    text: 'Cargando datos',
    color: 'green',
    width:200,
    overlay:true
  },
};

const mutations = {
  OPEN_BAR(state, payload) {
    state.showSnackBar = payload;
  },
  OPEN_MODAL(state, payload) {
    state.openModalDefault = {
      ...state.openModalDefault,
      ...payload,
      text: payload.text || 'Cargando datos',
    };
  },
};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
