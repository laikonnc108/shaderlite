import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    day: {},
    shader_configs: [],
    custom_labels: [],
    products_arr: [],
    transtypes_arr: [],
    app_config: {},
    logged_in_user: {}
  },
  mutations: {
    setDay (state, day) {
      state.day = day
    },
    setShaderConfigs (state, payload) {
      console.log('setShaderConfigs', payload)
      state.shader_configs = payload
    },
    setAppConfig (state, payload) {
      state.app_config = payload
    },
    setCustomLabels (state, payload) {
      state.custom_labels = payload
    },
    setProductsArr (state, payload) {
      state.products_arr = payload
    },
    setTranstypesArr(state, payload) {
      state.transtypes_arr = payload
    },
    setLoggedInUser(state, payload) {
      state.logged_in_user = payload
    },
  },
  actions: {

  }
})

class MyStoreMutations {
  static setShaderConfigs = 'setShaderConfigs'
  static setAppConfig = 'setAppConfig'
  static setCustomLabels = 'setCustomLabels'
  static setProductsArr = 'setProductsArr'
  static setTranstypesArr = 'setTranstypesArr'
  static setLoggedInUser = 'setLoggedInUser'
}
export {store, MyStoreMutations}