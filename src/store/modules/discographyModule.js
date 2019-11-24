import axios from 'axios'

let initialState = () => {
  return {
    discography: null
  }
}

export const discographyModule = {
  state: initialState(),

  mutations: {
    mutateDiscography: (state, discography) => {
      state.discography = (discography === undefined || discography === '') ? null : discography
    }
  },

  actions: {
    loadDiscography: async ({ commit }, bandName) => {
      // FIXME externalize config
      let discography = await axios.get(`http://localhost:8080/discography/${bandName}`)
      commit('mutateDiscography', discography.data)
    },

    plusAlbum: async ({ commit }, params) => {
      console.log(params.albumRevised)
      let data = {
        bandId: params.bandId,
        type: params.albumRevised.type,
        typeCount: params.albumRevised.typeCount,
        name: params.albumRevised.name,
        year: params.albumRevised.year
      }

      // FIXME externalize config
      let result = await axios.post(`http://localhost:8080/discography/`, data)
      console.log(result)
    },

    minusAlbum: async ({ commit }, params) => {
      let data = {
        bandId: params.bandId,
        id: params.albumOriginal.id,
        type: params.albumOriginal.type,
        typeCount: params.albumOriginal.typeCount,
        name: params.albumOriginal.name,
        year: params.albumOriginal.year
      }

      // FIXME externalize config
      let result = await axios.delete(`http://localhost:8080/discography/`, data)
      console.log(result)
    },

    changeAlbum: async ({ commit }, params) => {
      // FIXME fix params
      let data = {
        bandId: params.bandId,
        id: params.albumOriginal.id,
        type: params.albumOriginal.type,
        typeCount: params.albumOriginal.typeCount,
        name: params.albumOriginal.name,
        year: params.albumOriginal.year
      }

      // FIXME externalize config
      let result = await axios.put(`http://localhost:8080/discography/`, data)
      console.log(result)
    }
  },

  getters: {
    discography: state => state.discography
  }
}
