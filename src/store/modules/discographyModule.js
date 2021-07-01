import { axiosService } from '@/service/axiosService'

export const discographyModule = {
  actions: {
    equalAlbum: async ({ rootGetters }, albumDiff) => {
      await axiosService.patch('/discography/', {
        bandId: rootGetters.band.id,
        diff: albumDiff
      })
    },

    plusAlbum: async ({ rootGetters }, albumDiff) => {
      await axiosService.post('/discography', {
        bandId: rootGetters.band.id,
        diff: albumDiff
      })
    },

    minusAlbum: async ({ rootGetters }, albumId) => {
      let bandId = rootGetters.band.id
      await axiosService.delete(`/discography/${bandId}/${albumId}`)
    },

    changeAlbum: async ({ rootGetters }, albumDiff) => {
      await axiosService.put('/discography/', {
        bandId: rootGetters.band.id,
        diff: albumDiff
      })
    }
  }
}
