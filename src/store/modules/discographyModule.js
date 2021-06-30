import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

let initialState = () => {
  return {
    diff: null
  }
}

export const discographyModule = {
  state: initialState(),

  mutations: {
    mutateDiff: (state, diff) => {
      state.diff = (diff === undefined || diff === '') ? null : diff
    }
  },

  actions: {
    allDiff: ({ commit }, params) => {
      axios.get(`${API_URL}/discography/all`)
    },

    getAllDiff: async ({ commit }, params) => {
      let response = await axios.get(`${API_URL}/diff`, {
        params: {
          bandName: params.bandName
        }
      })
      return commit('mutateDiff', response.data)
    },

    equalAlbum: async ({ state, dispatch }, params) => {
      let data = {
        bandId: state.diff.band.id,
        diff: params.albumDiff
      }

      let result = await axios.patch(`${API_URL}/discography/`, data)
      if (result.status === 200) {
        return dispatch('getAllDiff', {
          bandName: state.diff.band.name
        })
      }
    },

    plusAlbum: async ({ state, dispatch }, params) => {
      let data = {
        bandId: state.diff.band.id,
        diff: params.albumDiff
      }

      let result = await axios.post(`${API_URL}/discography/`, data)
      if (result.status === 200) {
        return dispatch('getAllDiff', {
          bandName: state.diff.band.name
        })
      }
    },

    minusAlbum: async ({ state, dispatch }, params) => {
      let bandId = state.diff.band.id
      let albumId = params.albumDiff.original[0].id

      let result = await axios.delete(`${API_URL}/discography/${bandId}/${albumId}`)
      if (result.status === 200) {
        return dispatch('getAllDiff', {
          bandName: state.diff.band.name
        })
      }
    },

    changeAlbum: async ({ state, dispatch }, params) => {
      let data = {
        bandId: state.diff.band.id,
        diff: params.albumDiff
      }

      let result = await axios.put(`${API_URL}/discography/`, data)
      if (result.status === 200) {
        return dispatch('getAllDiff', {
          bandName: state.diff.band.name
        })
      }
    },

    checkMP3: async ({ state, dispatch }, params) => {
      let albumId = params.albumDiff.original[0].id

      await axios.get(`${API_URL}/mp3/check/${albumId}`)
    }
  },

  getters: {
    diff: state => state.diff
  }
}
