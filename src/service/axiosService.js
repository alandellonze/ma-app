import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const axiosService = {

  get: (url, params) => {
    return axios.get(`${API_URL}/${url}`, { params: params })
  },

  post: (url, data) => {
    return axios.post(`${API_URL}/${url}`, data)
  },

  put: (url, data) => {
    return axios.put(`${API_URL}/${url}`, data)
  },

  patch: (url, data) => {
    return axios.patch(`${API_URL}/${url}`, data)
  },

  delete: (url, params) => {
    return axios.delete(`${API_URL}/${url}`, { params: params })
  }

}
