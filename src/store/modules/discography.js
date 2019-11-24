import axios from 'axios'

let initialState = () => {
  return {
    discography: null
  }
}

export const discography = {
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
    }
  },

  getters: {
    discography: state => state.discography
  }
}
