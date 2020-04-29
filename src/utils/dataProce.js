// eslint-disable-next-line no-unused-vars
import { deepClone, objectMerge, sort, unique, washValue } from '@/utils'
import store from '@/store'
import { fetchData } from '@/api/panel'
// import { dataType } from '@/filters'
import uuidv1 from 'uuid/v1'

/**
 * 主要数据处理过程
 * @returns {*}
 * @param params
 */
export async function getFullData(params) {
  // eslint-disable-next-line no-unused-vars
  const keyColumn = 'vf_id0'
  let res = {} // 返回数据

  /**
   * params 请求参数信息 该视图的配置信息
   * drill__drillName
   * drill_drillName
   * drill_parameters
   */
  // console.log('params:', params)

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
  /*  console.log(
    'params.compare:', params.compare,
    'params.completion:', params.completion,
    'params.ratio:', params.ratio,
    'params.fold:', params.fold,
    'params.sort:', params.sort
  )*/

  // 数组长度统一,格式
  res = standardize(res)

  // 转换成数字
  // res = valueToNumber(res)

  // 计算完成率
  if (params.completion === 'true') {
    res = calcCompletion(res)
  }

  // 计算高亮
  res = calcHighlight(res)

  res.currentView = params
  // 集成整合
  const chartDate = integration(res)
  const tableDate = integration(res)

  // 处理表格折叠行
  const foldTableDate = planeToHierarchy(tableDate)
  // const foldTableDate = []

  // const foldTableDate = planeToHierarchy(res)

  return {
    chartDate: chartDate,
    tableDate: tableDate,
    foldTableDate: foldTableDate,
    res: res
    // tableDate: standardize(res)
  }
}

// toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooools
// 集成整合
function integration(data) {
  // const views = store.state.options.views
  const tableDate = []
  // console.log('data.currentView:', data.currentView)
  data.vf_id0.forEach((item, index) => {
    tableDate.push({
      id: uuidv1(),
      name: item.name,
      type: item.type,
      title: item.title,
      index: item.index,
      chartId: uuidv1(),
      formula: item.formula,
      original: item.original,
      children: item.children,
      breadName: item.title,
      highlight: item.highlight,
      highlightStyle: item.highlightStyle,
      isDrill: !!data.currentView.items[item.name],
      drillName: item.name,
      _drillName: data.currentView.items[item.name] || data.currentView.items['*'],
      res_s_title: item.title,
      res_s_value: data.vf_id0 && data.vf_id0[index].value,
      res_y_value: data.vf_id1 && data.vf_id1[index].value,
      res_s_zb_value: data.vf_id2 && data.vf_id2[index].value,
      res_y_zb_value: data.vf_id3 && data.vf_id3[index].value,
      res_finish_rate_value: item.finish_rate
    })
    // console.log(item.value, typeof item.value, item.type)
    // console.log(item)
  })

  return tableDate
}

async function getData(data, res) {
  res['vf_id' + data.vf_id] = await fetchData(data)
  return res
}

// 计算高亮
export function calcHighlight(data) {
  data.vf_id0.forEach((item, index) => {
    item.highlightStyle = ''

    // console.log(item.value, typeof item.value)
    // item.value = washValue(item.value)
    // data.vf_id1[index].value = washValue(data.vf_id1[index].value)

    if (item.highlight === 'true') {
      item.highlightStyle = item.value < data.vf_id1[index].value ? 'danger' : ''
    }
    if (item.highlight === 'false') {
      item.highlightStyle = item.value > data.vf_id1[index].value ? 'danger' : ''
    }
  })
  return data
}

// 计算完成率
export function calcCompletion(data) {
  data.finish_rate = []
  data.vf_id0.forEach((item, index) => {
    // console.log(item.value, typeof item.value)
    let _rate = (item.value / data.vf_id1[index].value * 100).toFixed(2)
    _rate = washValue(_rate)
    // console.log('_rate:', _rate)
    item.finish_rate = _rate
    data.finish_rate.push({
      name: item.name,
      title: item.title,
      value: _rate
    })
  })
  return data
}
// 转换成数字
export function valueToNumber(data) {
  Object.keys(data).forEach((key) => {
    data[key].forEach(item => {
      // console.log(item)
      // console.log(item.value, typeof item.value, item.type)
      // console.log(item)
    })
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

          break
        case 'String':
          item.value = (item.value === 'Null') ? ' ' : item.value
          // console.log(item)
          break
        default:
      }
      item.value = parseFloat(item.value) || item.value
      // console.log(item.value, typeof item.value, item.type)
      item.formula = item.formula === 'Null' ? undefined : item.formula

      // console.log('item.formula:', item.formula)
    })
  })

  return data
}

// 数据层级折叠
export function planeToHierarchy(arr) {
  // 1.标记父级，从而可以从高级向低级组织结构
  arr = deepClone(arr)
  const resArr = []

  // console.log('planeToHierarchy...')

  // console.log(arr)
  // 初始化准备
  arr = arr.map(item => {
    // console.log('item:', item)
    // console.log(item.breadName, item.children)

    if (item.children) {
      item.children = item.children === 'Null' ? '[]' : item.children
      item.children = JSON.parse(item.children) // fixJson 字符串 =>>变数组
    } else {
      item.children = []
    }

    item.childrenRow = [] // 默认无子元素
    item.parent = undefined // 默认父级未定义
    return item
  })

  // 标记父级
  arr.forEach(item => {
    if (item.children.length !== 0) { // 有下级元素
      // console.log("item.name:", item.name)
      // console.log("item.children:", item.children)
      item.children.forEach(childrenName => {
        const childrenItem = arr.find(arrItem => arrItem.name === childrenName)
        if (childrenItem) {
          childrenItem.parent = item.name
        }
      })
    }
  })

  //
  arr.forEach(item => {
    if (!item.parent) {
      resArr.push(item)
      if (item.children.length > 0) {
        findChildren(item, arr)
      }
    }
  })

  // console.log('-----------------------------------------------------')

  // console.log('arr:', arr)
  return resArr
}

// tooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooools

// 递归子元素
// const n = 1
function findChildren(parent, arr) {
  // console.log('findChildren....', n++)
  // console.log('parent:', parent)
  parent.children.forEach(childrenName => {
    const childrenItem = arr.find(arrItem => arrItem.name === childrenName)
    if (childrenItem) {
      parent.childrenRow.push(childrenItem)
      if (childrenItem.children.length > 0) {
        // console.log(childrenItem.children)
        findChildren(childrenItem, arr)
      }
    }
  })
}
