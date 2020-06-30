const state = {
  persons: [],
  employeeList: []
}

const mutations = {
  SET_PERSON(state, response) {
    state.persons = response
  },
  SET_EMPLOYEE(state, obj) {
    state.employeeList = obj.list
    state.employeeList_res = obj.res
  }
}

const actions = {
  person({ commit }, response) {
    commit('SET_PERSON', response)
  },
  employeelist({ commit }, obj) {
    commit('SET_EMPLOYEE', obj)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
