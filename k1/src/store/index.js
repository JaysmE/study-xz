import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from './kStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  mutations: {
    addCount(state) {
      state.counter ++
    }
  },
  actions: {
    addCount({ commit, dispatch, getters }, payload) {
      commit('addCount', payload)
    }
  },
  getters: {
    getCounter: state => state.counter * 20
  },
  modules: {
  }
})
