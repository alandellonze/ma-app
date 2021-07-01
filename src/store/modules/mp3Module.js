import { axiosService } from '@/service/axiosService'

export const mp3Module = {
  actions: {
    checkMP3: async ({ state, dispatch }, albumId) => {
      await axiosService.get(`/mp3/check/${albumId}`)
    }
  }
}
