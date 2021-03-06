import { login, logout, getInfo } from '@/api/user'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  api_dir: 'Sample Reports/',
  apiTemplate: {
    projectId: '',
    description: '',
    vf_file: 'dashboard.efwvf'
  },
  alias: '',
  currentProject: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PROJECT: (state, project) => {
    // console.log('project:', project)
    console.log('project.description:', project.description)
    state.apiTemplate.projectId = project.id
    state.apiTemplate.description = project.description
    state.alias = project.alias
    state.currentProject = project
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log(response)
        // const { data } = response
        // data.token = 'tokenStr'
        commit('SET_TOKEN', 'tokenStr')
        setToken('tokenStr')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        // console.log('data:', data)

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const _data = {
          roles: data,
          name: 'name',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          introduction: ''
        }

        const { roles, name, avatar, introduction } = _data

        // console.log('roles:', roles)

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(_data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  async setProjectId({ commit, state, dispatch }, project) {
    const _d = store.state.options.dashboard.find(item => item.dashboardName === project.alias)
    store.state.options.currentDashboard = _d
    localStorage.currentDashboard = JSON.stringify(_d)
    commit('SET_PROJECT', project)
    await store.dispatch('options/getView')
    // console.log('async setProjectId...:')
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
