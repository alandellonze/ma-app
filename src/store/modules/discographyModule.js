import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

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
    getAllDiscography: async ({ commit }, params) => {
      let discography = await axios.get(`${API_URL}/discography/${params.bandName}`)
      commit('mutateDiscography', discography.data)
    },

    // FIXME to be implemented: plus
    plusAlbum: async ({ commit }, params) => {
      let data = {
        band: params.band,
        albumDiff: params.albumDiff
      }

      let result = await axios.post(`${API_URL}/discography/`, data)
      console.log(result)
    },

    // FIXME to be implemented: minus
    minusAlbum: async ({ commit }, params) => {
      let result = await axios.delete(`${API_URL}/discography/${params.albumId}`)
      console.log(result)
    },

    // FIXME to be implemented: change
    changeAlbum: async ({ commit }, params) => {
      let data = {
        band: params.band,
        albumDiff: params.albumDiff
      }

      let result = await axios.put(`${API_URL}/discography/`, data)
      console.log(result)
    }
  },

  getters: {
    discography: state => state.discography
  }
}
