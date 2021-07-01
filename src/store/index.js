import Vue from 'vue'
import Vuex from 'vuex'

import { bandModule } from './modules/bandModule'
import { diffModule } from './modules/diffModule'
import { discographyModule } from './modules/discographyModule'
import { mp3Module } from './modules/mp3Module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    bandModule,
    diffModule,
    discographyModule,
    mp3Module
  }
})
