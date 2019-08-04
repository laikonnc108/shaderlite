import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    day: {},
    shader_configs: [],
    custom_labels: [],
    products_arr: [],
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
    },
    setProductsArr (state, payload) {
      state.products_arr = payload
    }
  },
  actions: {

  }
})

class MyStoreMutations {
  static setShaderConfigs = 'setShaderConfigs'
  static setElectronData = 'setElectronData'
  static setCustomLabels = 'setCustomLabels'
  static setProductsArr = 'setProductsArr'
}
export {store, MyStoreMutations}