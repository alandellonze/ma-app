import { axiosService } from '@/service/axiosService'

let initialState = () => {
  return {
    bands: null,
    band: null
  }
}

export const bandModule = {
  state: initialState(),

  mutations: {
    mutateBands: (state, bands) => {
      state.bands = (bands === undefined) ? null : bands
    },

    mutateBand: (state, band) => {
      state.band = (band === undefined || band === '') ? null : band
    }
  },

  actions: {
    findAllBands: async ({ dispatch }, name) => {
      let response = await axiosService.get('/bands', { name: name })
      dispatch('setBands', response.data)
    },

    setBands: async ({ commit }, bands) => {
      commit('mutateBands', bands)
    },

    setBand: async ({ commit }, band) => {
      commit('mutateBand', band)
    }
  },

  getters: {
    bands: state => state.bands,
    band: state => state.band
  }
}
