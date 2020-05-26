const state = {
  persons: []
}

const mutations = {
  SET_PERSON(state, response) {
    state.persons = response
  }
}

const actions = {
  person({ commit }, response) {
    commit('SET_PERSON', response)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
