import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    day: {},
    shader_configs: [],
    custom_labels: [],
    electron_data: {}
  },
  mutations: {
    setDay (state, day) {
      state.day = day
    },
    setShaderConfigs (state, payload) {
      state.shader_configs = payload
    },
    setElectronData (state, payload) {
      state.electron_data = payload
    },
    setCustomLabels (state, payload) {
      state.custom_labels = payload
    }
  },
  actions: {

  }
})
