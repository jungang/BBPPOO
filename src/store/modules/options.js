import { fetchData, dashboard } from '@/api/panel'
import store from '@/store'
const pkg = require('../../../package.json')

const state = {
  dateType: [
    { label: '年', key: 'year' },
    { label: '月', key: 'month' },
    { label: '日', key: 'day' }
  ],
  dateValueYear: [
    { label: '2017年', key: 2017 },
    { label: '2018年', key: 2018 },
    { label: '2019年', key: 2019 },
    { label: '2020年', key: 2020 }
  ],
  dateValueMonth: [
    { label: '一月', key: '01', num: 1 },
    { label: '二月', key: '02', num: 2 },
    { label: '三月', key: '03', num: 3 },
    { label: '四月', key: '04', num: 4 },
    { label: '五月', key: '05', num: 5 },
    { label: '六月', key: '06', num: 6 },
    { label: '七月', key: '07', num: 7 },
    { label: '八月', key: '08', num: 8 },
    { label: '九月', key: '09', num: 9 },
    { label: '十月', key: '10', num: 10 },
    { label: '十一月', key: '11', num: 11 },
    { label: '十二月', key: '12', num: 12 }
  ],
  dateValueDay: [
    { label: '1日', key: 1 },
    { label: '2日', key: 2 },
    { label: '3日', key: 3 },
    { label: '4日', key: 4 },
    { label: '5日', key: 5 },
    { label: '6日', key: 6 },
    { label: '7日', key: 7 },
    { label: '8日', key: 8 },
    { label: '9日', key: 9 },
    { label: '10日', key: 10 },
    { label: '11日', key: 11 },
    { label: '12日', key: 12 },
    { label: '13日', key: 13 },
    { label: '14日', key: 14 },
    { label: '15日', key: 15 },
    { label: '16日', key: 16 },
    { label: '17日', key: 17 },
    { label: '18日', key: 18 },
    { label: '19日', key: 19 },
    { label: '20日', key: 20 },
    { label: '21日', key: 21 },
    { label: '22日', key: 22 },
    { label: '23日', key: 23 },
    { label: '24日', key: 24 },
    { label: '25日', key: 25 },
    { label: '26日', key: 26 },
    { label: '27日', key: 27 },
    { label: '28日', key: 28 },
    { label: '29日', key: 29 },
    { label: '30日', key: 30 },
    { label: '31日', key: 31 }
  ],
  filterOptions: {
    date: new Date(),
    dateType: 'month', // 天 day | 周 week | 月 month | 年 year
    company: '全台', // 公司信息（供应商）
    group: 'null', // 选择组信息
    type: 'all' // 合集 all | 集团 group | 本地 local
  },
  views: [],
  subject: [],
  API: ''
}

const mutations = {
  CHANGE_OPTIONS: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_VIEWS: (state, response) => {
    state.views = response
    state.views.forEach(item => {
      // console.log(item.title, item)

      item.fold = false
      item.sort = false
      item.switch = false
      switch (item.style) {
        case 'chart':
          item.switch = true
          break
        case 'multicols':
          break
        case 'tabular':
          item.style = 'tabular'
          // console.log(item.style)
          break
        case 'foldTable':
          item.style = 'tabular'
          item.fold = true
          // console.log(item.style)
          break
        case 'sortTable':
          item.style = 'tabular'
          item.sort = true
          // console.log(item.style)
          break
        default:
          item.style = 'chart'
          // console.log(item.style)
      }

      // 转换boolean
      item.show = item.show === 'true'
      item.ratio = item.ratio === 'true'
      // console.log(item.title, item.compare)
      item.compare = item.compare === 'true'
      item.completion = item.completion === 'true'
      item.items = (item.items !== 'Null') ? JSON.parse(item.items) : {}
      item.config = JSON.parse(item.config)

      item.location = `${item.config.pagesName}_${item.config.panelName}_${item.config.zoneName}`

      if (item.config.indexType) {
        item.location += `_${item.config.indexType}`
      }
    })
    // console.log('state.views:', state.views)
  },
  SET_FILTER: (state, options) => {
    // console.log('SET_FILTER:')
    state.filterOptions = options
    // console.log('state.filterOptions:', state.filterOptions)
  },
  SET_API: (state) => {
    state.API = process.env.VUE_APP_BASE_API
    // console.log('state.views:', state.views)
  },
  SET_SUBJECT: (state, response) => {
    state.subject = response
    // console.log('state.views:', state.views)
  },
  SET_DASHBOARD: (state, response) => {
    console.log('dashboard:', response)
    console.log('state:', state)

    state.dashboard = response
    // console.log('state.views:', state.views)
  }
}

const actions = {
  changeOptions({ commit }, data) {
    commit('CHANGE_OPTIONS', data)
  },
  setFilterOptions({ commit }, options) {
    commit('SET_FILTER', options)
  },
  getDashboard({ commit, state }) {
    return new Promise((resolve, reject) => {
      dashboard().then(response => {
        commit('SET_DASHBOARD', response.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getView({ commit, state }) {
    commit('SET_API')

    const data = {
      'dir': 'Sample Reports/view',
      'projectId': store.state.user.apiTemplate.projectId,
      'vf_id': 1,
      'vf_file': 'dashboard.efwvf'
    }

    // console.log('data:', data)
    return new Promise((resolve, reject) => {
      fetchData(data).then(response => {
        // console.log('view:', response)

        // response.forEach(item => {
        //   console.log(item.name)
        // })

        commit('SET_VIEWS', response)
        // console.log('response:', response)
        console.info('v', pkg.version)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getSubject({ commit, state }) {
    const data = {
      'dir': 'Sample Reports/subject',
      'projectId': store.state.user.apiTemplate.projectId,
      'vf_id': 0,
      'vf_file': 'dashboard.efwvf'
    }

    // console.log('data:', data)
    return new Promise((resolve, reject) => {
      fetchData(data).then(response => {
        // console.log('getSubject...............:')
        // console.log('response:', response)
        response.forEach(item => {
          item.config = JSON.parse(item.config)
          // console.log('item.config.show_name:', item.config.show_name)
        })

        commit('SET_SUBJECT', response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
