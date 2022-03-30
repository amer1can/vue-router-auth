import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {},
    isLoggedIn: null
  },
  getters: {
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    toggleLogin(state, payload) {
      if (payload === false) { state.user = {} }
      state.isLoggedIn = payload
    },
    getUserFromStorage(state) {
      state.user = JSON.parse(localStorage.getItem('user'))
    }
  },
  actions: {
  },
  modules: {
  }
})
