// eslint-disable-next-line no-unused-vars
import { deepClone, objectMerge, sort, unique } from '@/utils'
import store from '@/store'
import { fetchData } from '@/api/panel'

/**
 * 主要数据处理过程
 * @returns {*}
 * @param params
 */
export async function getFullData(params) {
  /**
   * params 请求参数信息 该视图的配置信息
   * drill__drillName
   * drill_drillName
   * drill_parameters
   */
  const { drill__drillName, drill_drillName, drill_parameters } = params
  const data = { // 请求参数
    vf_id: undefined,
    dir: store.state.user.api_dir + drill__drillName,
    name: drill_drillName,
    year: +drill_parameters.year,
    month: +drill_parameters.month,
    ...store.state.user.apiTemplate
  }
  let res = {} // 返回数据

  // 实际
  data.vf_id = 0
  res = await getData(data, res)

  // 预计
  if (params.compare === 'true') {
    data.vf_id = 1
    res = await getData(data, res)
  }

  params.ratio = false // todo 暂时取消占比数据读取
  if (params.ratio === 'true') {
    // 实际  占比
    res = await getData(data)
    // 预计  占比
    if (params.compare === 'true') {
      res = await getData(data)
    }
  }

  return {
    chartDate: res
    // tableDate: standardize(res)
  }
}
// toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooools
async function getData(data, res) {
  res['vf_id' + data.vf_id] = await fetchData(data)
  return res
}

export function standardize(data) {
  // data.res_s_zb.unshift({ name: '123', title: 'zbzb', value: 100 })
  // data.res_y_zb.unshift({ name: '456', title: '撒旦发', value: 200 })

  // console.log('data:', data)

  let index = 1
  let _titles = []
  const _temp = data[0] || data[1]
  console.log('data:', data)
  console.log('_temp:', _temp)

  /*  if (data.res_s.length <= 0) { // 如果没有实际数据，以目标数据为准排序
    _temp = data.res_y
  } else {
    _temp = data.res_s
  }*/

  _titles = [..._temp.map(item => {
    return {
      name: item.name,
      title: item.title,
      value: undefined, // 空值填充 默认值
      index: index++ //
    }
  })]

  _titles = unique(_titles) // 去重

  // console.log('_titles:', _titles)

  Object.keys(data).forEach((key) => { // 统一
    _titles.forEach(item => {
      const v = data[key].find(item2 => item2.name === item.name)
      if (!v) {
        data[key].push(item) // 填补空缺
      } else {
        v.index = item.index // 统一索引
      }
    })
    data[key] = sort(data[key]) // 重新排序 确保各维度位置正确必须步骤
  })

  // Currency 金额、 Integer 整数、 Percentage 百分比、 Duration 时间
  Object.keys(data).forEach((key) => { // 统一
    data[key].forEach(item => {
      if (item.value === 'Null') {
        // item.value = '-'
        // console.log(!!item)
      }

      item.original = item.value
      // console.log(item.type)
      switch (item.type) {
        case 'Duration':
          item.value = item.value && (item.value * 1440).toFixed(2)
          // console.log(item)
          break
        case 'Currency':
          item.value = item.value && item.value.toFixed(2)
          // console.log(item)
          break
        case 'Double':
          item.value = item.value && item.value.toFixed(2)
          break
        case 'Integer':
          item.value = item.value && Math.round(item.value)
          // console.log(item)
          break
        case 'Percentage':
          item.value = item.value && (item.value * 100).toFixed(2)
          // console.log(item)
          break
        case 'String':
          item.value = (item.value === 'Null') ? ' ' : item.value
          // console.log(item)
          break
        default:
      }
    })
  })

  return data
}
