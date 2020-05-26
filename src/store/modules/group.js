const state = {
  persons: [],
  employeeList: []
}

const mutations = {
  SET_PERSON(state, response) {
    state.persons = response
  },
  SET_EMPLOYEE(state, response) {
    state.employeeList = response
  }
}

const actions = {
  person({ commit }, response) {
    commit('SET_PERSON', response)
  },
  employeelist({ commit }, response) {
    commit('SET_EMPLOYEE', response)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
