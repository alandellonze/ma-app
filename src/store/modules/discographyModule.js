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
      let discography = await axios.get(`${API_URL}/discography/`, {
        params: {
          bandName: params.bandName
        }
      })
      return commit('mutateDiscography', discography.data)
    },

    equalAlbum: async ({ state, dispatch }, params) => {
      let data = {
        band: state.discography.band,
        albumDiff: params.albumDiff
      }

      let result = await axios.patch(`${API_URL}/discography/`, data)
      if (result.status === 200) {
        return dispatch('getAllDiscography', {
          bandName: state.discography.band.name
        })
      }
    },

    plusAlbum: async ({ state, dispatch }, params) => {
      let data = {
        band: state.discography.band,
        albumDiff: params.albumDiff
      }

      let result = await axios.post(`${API_URL}/discography/`, data)
      if (result.status === 200) {
        return dispatch('getAllDiscography', {
          bandName: state.discography.band.name
        })
      }
    },

    minusAlbum: async ({ state, dispatch }, params) => {
      let albumId = params.albumDiff.original[0].id

      let result = await axios.delete(`${API_URL}/discography/${albumId}`)
      if (result.status === 200) {
        return dispatch('getAllDiscography', {
          bandName: state.discography.band.name
        })
      }
    },

    changeAlbum: async ({ state, dispatch }, params) => {
      let data = {
        band: state.discography.band,
        albumDiff: params.albumDiff
      }

      let result = await axios.put(`${API_URL}/discography/`, data)
      if (result.status === 200) {
        return dispatch('getAllDiscography', {
          bandName: state.discography.band.name
        })
      }
    },

    checkMP3: async ({ state, dispatch }, params) => {
      let albumId = params.albumDiff.original[0].id

      await axios.get(`${API_URL}/mp3/check/${albumId}`)
    }
  },

  getters: {
    discography: state => state.discography
  }
}
