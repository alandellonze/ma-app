import { axiosService } from '@/service/axiosService'

let initialState = () => {
  return {
    diff: null
  }
}

export const diffModule = {
  state: initialState(),

  mutations: {
    mutateDiff: (state, diff) => {
      state.diff = (diff === undefined || diff === '') ? null : diff
    }
  },

  actions: {
    findDiffs: async ({ dispatch, rootGetters }) => {
      let response = await axiosService.get('/diffs', { bandId: rootGetters.band.id })
      dispatch('setDiff', response.data)
    },

    setDiff: async ({ commit }, diff) => {
      commit('mutateDiff', diff)
    },

    findAllDiffs: () => {
      axiosService.get('/diffs/all')
    }
  },

  getters: {
    diff: state => state.diff
  }
}
