// eslint-disable-next-line no-unused-vars
import { deepClone, objectMerge, sort, unique, washValue } from '@/utils'
import store from '@/store'
import { fetchData } from '@/api/panel'

/**
 * 主要数据处理过程
 * @returns {*}
 * @param params
 */
export async function getFullData(params) {
  let res = {} // 返回数据
  /**
   * params 请求参数信息 该视图的配置信息
   * drill__drillName
   * drill_drillName
   * drill_parameters
   */

  const data = { // 请求参数
    vf_id: undefined,
    dir: store.state.user.api_dir + params.drill__drillName,
    name: params.drill_drillName,
    year: +params.drill_parameters.year,
    month: +params.drill_parameters.month,
    ...store.state.user.apiTemplate
  }

  // 实际
  data.vf_id = 0
  res = await getData(data, res) // return res.vf_id0

  // 预计
  if (params.compare === 'true') {
    data.vf_id = 1
    res = await getData(data, res) // return res.vf_id1
  }

  // 占比
  if (params.ratio === 'true') {
    // 实际  占比
    data.vf_id = 2
    res = await getData(data, res) // return res.vf_id2
    // 预计  占比
    if (params.compare === 'true') {
      data.vf_id = 3
      res = await getData(data, res) // return res.vf_id3
    }
  }

  // console.log('res:', res)
  // console.count()
  // 根据view视图配置，发出请求
  /* console.log(
    'params.compare:', params.compare,
    'params.completion:', params.completion,
    'params.ratio:', params.ratio
  )*/

  // 数组长度统一
  res = standardize(res)

  // for (let i = 0; i < res.vf_id1.length; i++) {
  // console.log('res.vf_id0.title:', res.vf_id0[i].title, 'res.vf_id1.title:', res.vf_id1[i].title)
  // console.log('res.vf_id0.name:', res.vf_id0[i].name, 'res.vf_id1.name:', res.vf_id1[i].name)
  // }

  // 计算完成率
  if (params.completion === 'true') {
    res = calcCompletion(res)
  }

  return {
    chartDate: res,
    tableDate: res,
    foldTableDate: res
    // tableDate: standardize(res)
  }
}
// toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooools
async function getData(data, res) {
  res['vf_id' + data.vf_id] = await fetchData(data)
  return res
}

export function calcCompletion(data) {
  // console.log('data:', data)
  // console.log('计算完成率')

  data.finish_rate = []

  data.vf_id0.forEach((item, index) => {
    let _rate = (item.value / data.vf_id1[index].value * 100).toFixed(2)
    _rate = washValue(_rate)
    // console.log('_rate:', _rate)
    item.finish_rate = _rate
    data.finish_rate.push({
      name: item.name,
      title: item.title,
      value: _rate
    })
    // console.log(item)
    // data.finish_rate.push()
  })

  return data
}

// 拉齐长度，填平空位
export function standardize(data) {
  // data.res_s_zb.unshift({ name: '123', title: 'zbzb', value: 100 })
  // data.res_y_zb.unshift({ name: '456', title: '撒旦发', value: 200 })

  // console.log('data:', data)

  let index = 1
  let _titles = []
  let _temp = data.vf_id0 // 参考标准（实际）
  // console.log('data:', data)
  // console.log('_temp:', _temp)

  if (data.vf_id0.length <= 0) { // 如果没有实际数据，以目标数据为准排序
    _temp = data.vf_id1
  }

  // 取得所有类目
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
      // item.name类目名称
      // data[key] => data.vf_id0 data.vf_id1 data.vf_id2 data.vf_id3  ...
      const v = data[key].find(item2 => item2.name === item.name)
      // console.log(v)
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
