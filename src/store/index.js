import Vue from 'vue'
import Vuex from 'vuex'

import { discographyModule } from './modules/discographyModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    discographyModule: discographyModule
  }
})
