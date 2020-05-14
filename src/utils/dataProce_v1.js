// eslint-disable-next-line no-unused-vars
import { deepClone, objectMerge, sort, unique, washValue } from '@/utils'
import store from '@/store'
import { fetchData } from '@/api/panel'
// import { dataType } from '@/filters'
import uuidv1 from 'uuid/v1'
import { parseTime } from '@/utils'

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

  let data = { // 请求参数
    vf_id: undefined,
    dir: store.state.user.api_dir + params.drill__drillName,
    name: params.drill_drillName,
    dateType: params.query.dateType, // vf_id:0（按天查）vf_id:1（按周查）vf_id:2（按月查）注意vf_id与start,end字段的对应关系
    start: '20190901', // 起始日期（如果是日粒度，就是时间选框日期减去30天，如果是周，就是前推6周的周一的日期（注意，还是日期，不过日期是前推6周的周一，需要计算一下），如果是月，就是6个月前的YYYYmm，如201909）
    end: '20200101', // 结束日期（如果是日粒度，就是时间选框日期，如果是周，就是所选日期的礼拜天的日期，如果是月，就是所选日期的当前月）
    dimension: [], // 查询的切片，json数组，里面每项就是一个查询条件。如:[{"v_id":"1561"},{"v_group_name":"李红英"},{"v_phase":"实习期","v_group_name":"李红英"}]，分别查询人员id为1561的员工，小组名称为"李红英"的小组，以及小组名称为"李红英"的小组里面阶段为"实习期"的信息，并且把这三种不同维度信息一并给查询出来。
    subject: [], // 查询的科目，json数组，里面每项就是一个科目。如:["income","AHT"]
    table: 'target', // 查询的是目标还是实际，默认不填写，就是实际，查询目标需要填写成 target
    year: +params.drill_parameters.year,
    month: +params.drill_parameters.month,
    ...store.state.user.apiTemplate
  }

  // 处理组、人员参数
  if (params.query.group === 'null') {
    // 空选项
    data.dimension.push({})
  } else if (params.query.multiple) {
    // 多选
    params.query.group.forEach(item => data.dimension.push(item.length === 1 ? { v_group_name: item[0] } : { v_id: item[1] })
    )
  } else {
    // 单选
    data.dimension.push(params.query.group.length === 1 ? { v_group_name: params.query.group[0] } : { v_id: params.query.group[1] })
  }

  if (params.query.dateType === 'day') {
    // console.log('按天查。。。', params.query)
    const _data = parseTime(params.query.date, '{y}{m}{d}')
    data.vf_id = 0
    data.start = _data
    data.end = _data
  }

  // 处理日期参数
  if (params.query.dateType === 'week') {
    console.log('按周查。。。', params.query)

    // 周毫秒数  3628800000 =  1000   ×   60   ×   60   ×   24   ×   42
    const week_s = 3628800000
    const _data_start = parseTime(params.query.date.getTime() - week_s, '{y}{m}{d}')
    const _data_end = parseTime(params.query.date, '{y}{m}{d}')
    data.vf_id = 1
    data.start = _data_start
    data.end = _data_end
    // res = await getData(data, res) // return res.vf_id0
  }

  if (params.query.dateType === 'month') {
    // console.log('按月查。。。', data)

    // 月毫秒数  15552000000 =  1000   ×   60   ×   60   ×   24   ×   180
    const month_s = 15552000000
    const _data_start = parseTime(params.query.date.getTime() - month_s, '{y}{m}')
    const _data_end = parseTime(params.query.date, '{y}{m}')
    data.vf_id = 2
    data.start = _data_start
    data.end = _data_end
    // res = await getData(data, res) // return res.vf_id0
  }

  if (params.query.dateType === 'year') {
    console.log('按年查。。。', data)

    data.start = parseTime(params.query.date, '{y}')
    data.end = parseTime(params.query.date, '{y}')
    data.vf_id = 3
    // res = await getData(data, res) // return res.vf_id0
  }

  // todo mock数据
  data = { // 请求参数
    vf_id: undefined,
    dir: 'Sample Reports/query',
    start: '20200119', // 起始日期（如果是日粒度，就是时间选框日期减去30天，如果是周，就是前推6周的周一的日期（注意，还是日期，不过日期是前推6周的周一，需要计算一下），如果是月，就是6个月前的YYYYmm，如201909）
    end: '20200120',
    // dimension: [{ 'v_id': '21' }, { 'v_group_name': '李昊' }, { 'v_phase': '正式', 'v_group_name': '李昊' }],
    dimension: [{ 'v_group_name': '李昊' }],
    subject: ['use_ratio'],
    table: '', // 查询的是目标还是实际，默认不填写，就是实际，查询目标需要填写成 target
    ...store.state.user.apiTemplate
  }

  switch (params.query.dateType) {
    case 'day':
      data.vf_id = 0
      // console.log('data:', data)
      res = await getData(data, res, 'actual') // return res.vf_id0
      // data.table = 'target'
      res = await getData(data, res, 'target') // return res.vf_id0

      // console.log('res:', res)
      break
    case 'week':
      break
    case 'month':
      break
    case 'year':
      break
  }

  // 根据view视图配置，发出请求
  console.log(
    'title:', params.title,
    'name:', params.name,
    'compare:', params.compare,
    'completion:', params.completion,
    'ratio:', params.ratio,
    'fold:', params.fold,
    'sort:', params.sort,
    'params:', params
  )
  // console.log('res:', res)

  // 数组长度统一,格式
  res = standardize(res)

  // 转换成数字
  // res = valueToNumber(res)

  // 计算完成率
  if (params.compare && params.completion) {
    res = calcCompletion(res)
  }

  // 计算高亮
  if (params.compare && params.completion) {
    res = calcHighlight(res)
  }

  res.currentView = params
  // 集成整合
  const chartDate = integration(res)
  const tableDate = integration(res)

  // 处理表格折叠行
  // const foldTableDate = planeToHierarchy(tableDate)
  // const foldTableDate = []

  // const foldTableDate = planeToHierarchy(res)

  return {
    chartDate: chartDate,
    tableDate: tableDate,
    // foldTableDate: foldTableDate,
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
  data.actual.forEach((item, index) => {
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
      res_s_value: data.actual && data.actual[index].value,
      res_y_value: data.target && data.target[index].value,
      res_finish_rate_value: item.finish_rate
    })
    // console.log('data.vf_id2[index].value:', data.vf_id2[index].value)
  })

  return tableDate
}

async function getData(data, res, key) {
  // console.log(await fetchData(data))
  res[key] = await fetchData(data)
  return res
}

// 计算高亮
export function calcHighlight(data) {
  data.actual.forEach((item, index) => {
    // console.log('item.highlight:', item.highlight)

    item.highlightStyle = ''

    if (item.highlight === 'true') {
      item.highlightStyle = item.value < data.target[index].value ? 'danger' : ''
    }
    if (item.highlight === 'false') {
      item.highlightStyle = item.value > data.target[index].value ? 'danger' : ''
    }

    // console.log(item.value, typeof item.value, data.vf_id1[index].value, typeof data.vf_id1[index].value)
    // console.log(item.title, item.highlightStyle)
  })
  return data
}

// 计算完成率
export function calcCompletion(data) {
  // console.log(data)
  data.finish_rate = []
  data.actual.forEach((item, index) => {
    // console.log(item)
    let _rate = (item.value / data.target[index].value * 100).toFixed(2)
    _rate = washValue(_rate)
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
  return data
}

// 拉齐长度，填平空位
export function standardize(data) {
  data.actual.forEach(item => {
    // console.log(item.title, item.value)
  })

  let index = 1
  let _titles = []

  // console.log('data:', data)
  // console.log('data.vf_id0:', data.vf_id0)
  // console.log('data.vf_id1:', data.vf_id1)
  // console.log('_temp:', _temp)
  // 取得所有类目

  /*  _titles = [..._temp.map(item => {
    return {
      name: item.name,
      title: item.title,
      value: undefined, // 空值填充 默认值
      index: index++ //
    }
  })]*/

  // Currency 金额、 Integer 整数、 Percentage 百分比、 Duration 时间
  Object.keys(data).forEach((key) => { // 统一
    data[key].forEach(item => {
      item.original = item.value
      switch (item.type) {
        case 'Duration':
          item.value = item.value && (item.value * 1440).toFixed(2)
          break
        case 'Currency':
          item.value = item.value && item.value.toFixed(2)
          break
        case 'Double':
          item.value = item.value && item.value.toFixed(2)
          break
        case 'Integer':
          item.value = item.value && Math.round(item.value)
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

      item.dimension = JSON.parse(item.dimension)

      // item.highlight = item.highlight === 'true' ? true : item.highlight
      // item.highlight = item.highlight === 'false' ? false : item.highlight
      // item.highlight = item.highlight === 'Null' ? undefined : item.highlight

      // console.log('item.highlight:', item.highlight, typeof item.highlight)
    })
  })

  data.actual.forEach(item => {
    // console.log(item)
    const _v = _titles.find(subject => subject.name === item.name)
    if (!_v) {
      _titles.push({
        name: item.name,
        title: item.title,
        index: index++,
        dimension: []
      })
    }
  })

  _titles = unique(_titles) // 去重

  Object.keys(data).forEach((key) => { // 统一
    _titles.forEach(item => {
      // item.name 类目名称
      // data.actual.forEach =>...
      data[key].forEach(a => {
        // const _dimension = JSON.parse(a.dimension)
        // console.log('_dimension:', _dimension)
        // console.log('a:', a)
        const _data = {
          value: a.value,
          time: a.time,
          type: a.type,
          formula: a.formula,
          original: a.original,
          unit: a.unit
        }
        const _v = item.dimension.find(dimension => dimension.v_group_name === a.dimension.v_group_name)
        if (!_v) {
          item.dimension.push({
            v_group_name: a.dimension.v_group_name,
            data: [_data]
          })
        } else {
          _v.data.push(_data)
        }
      })
    })
    data[key] = sort(data[key]) // 重新排序 确保各维度位置正确必须步骤
  })

  console.log('_titles:', _titles)

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
