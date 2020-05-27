// eslint-disable-next-line no-unused-vars
import { deepClone, parseTime, sort, unique, washValue } from '@/utils'
import store from '@/store'
import { fetchData } from '@/api/panel'
// import { dataType } from '@/filters'
// import uuidv1 from 'uuid/v1'

/**
 * 主要数据处理过程
 * @returns {*}
 * @param params
 */
export async function getFullData(params) {
  // eslint-disable-next-line no-unused-vars
  const keyColumn = 'vf_id0'
  let res = {} // 返回数据

  let day_s = 604800000 - 86400000
  const week_s = 3628800000 - 86400000
  let month_s = 15552000000

  if (params.config.component.type === 'chart_bar') {
    day_s = 86400000
    // week_s = 604800000
    if (parseTime(params.query.date, '{m}') === '03') {
      month_s = 2505600000
    } else {
      month_s = 2592000000
    }
  }

  /**
   * params 请求参数信息 该视图的配置信息
   * drill__drillName
   * drill_drillName
   * drill_parameters
   */

  // console.log('params:', params)
  // console.log('params.query.type:', params.query.type)

  let subject = params.items[`${params.query.type}`]
  // console.log('subject:', subject)
  if (!subject) { // todo 降级参数
    subject = params.items['*'] || ['']
  }

  const viewSubject = subject.map(item => {
    let _title = ''

    const _v = store.state.options.subject.find(s => {
      return s.name === item
    })

    // console.log('_v:', _v)
    // console.log('_v:', JSON.parse(_v.config))

    if (_v) {
      _title = _v.config.show_name || _v.title
    }

    return {
      name: item,
      title: _title
    }
  })

  // console.log('viewSubject:', viewSubject)
  // console.log('subject:', subject)

  const data = { // 请求参数
    vf_id: undefined,
    dir: 'Sample Reports/query',
    dateType: params.query.dateType,
    start: '', // 起始日期（如果是日粒度，就是时间选框日期减去30天，如果是周，就是前推6周的周一的日期（注意，还是日期，不过日期是前推6周的周一，需要计算一下），如果是月，就是6个月前的YYYYmm，如201909）
    end: '', // 结束日期（如果是日粒度，就是时间选框日期，如果是周，就是所选日期的礼拜天的日期，如果是月，就是所选日期的当前月）
    dimension: [], // 查询的切片，json数组，里面每项就是一个查询条件。如:[{"v_id":"1561"},{"v_group_name":"李红英"},{"v_phase":"实习期","v_group_name":"李红英"}]，分别查询人员id为1561的员工，小组名称为"李红英"的小组，以及小组名称为"李红英"的小组里面阶段为"实习期"的信息，并且把这三种不同维度信息一并给查询出来。
    subject: subject, // 查询的科目，json数组，里面每项就是一个科目。如:["income","AHT"]
    table: 'statistics', // 查询的是目标还是实际，默认不填写，就是实际，查询目标需要填写成 target
    // year: +params.drill_parameters.year,
    // month: +params.drill_parameters.month,
    ...store.state.user.apiTemplate
  }

  // console.log('params.query.group:', params)
  // console.log('params.query.group:', params.query)
  // console.log('params.query.group:', params.query.group)
  // 处理组、人员参数

  // console.log('params.query.group:', params.query.group)

  const __arr = store.state.group.employeeList
  // console.log('__arr=>', __arr)
  if (params.query.group === 'null' || params.query.group.length === 0) {
    // 空选项
    data.dimension.push({})

    if (params.config.component.type === 'table_lirun') {
      __arr.forEach((item) => {
        data.dimension.push({ v_group_name: item.value })
        item.children.forEach((_item) => {
          const __obj = {}
          __obj.v_id = _item.v_project_work_id
          data.dimension.push(__obj)
        })
      })
    }
  } else if (params.query.multiple) {
    // 多选
    params.query.group.forEach(item => data.dimension.push(item.length === 1 ? { v_group_name: item[0] } : { v_id: item[1] })
    )
  } else {
    // 单选
    if (params.config.component.type === 'table_lirun') {
      data.dimension.push({ v_group_name: params.query.group[0] })

      if (params.query.group.length === 1) {
        // console.log('__arr', __arr)
        __arr.forEach((item) => {
          if (item.value === params.query.group[0]) {
            item.children.forEach((_item) => {
              const __obj = {}
              __obj.v_id = _item.v_project_work_id
              data.dimension.push(__obj)
            })
          }
        })
      } else {
        data.dimension.push({ v_id: params.query.group[1].toString() })
      }
    } else {
      data.dimension.push(params.query.group.length === 1 ? { v_group_name: params.query.group[0] } : { v_id: params.query.group[1].toString() })
    }
  }

  if (params.query.dateType === 'daily') {
    // console.log('按天查。。。', params.query)
    const _data = parseTime(params.query.date, '{y}{m}{d}')
    // 天毫秒数  604800000 =  1000   ×   60   ×   60   ×   24   ×   7
    // const day_s = 604800000
    const _data_start = parseTime(params.query.date.getTime() - day_s, '{y}{m}{d}')
    data.vf_id = 0
    data.start = _data_start
    data.end = _data
  }

  // 处理日期参数
  if (params.query.dateType === 'week') {
    console.log('按周查。。。', params.query)

    // 周毫秒数  3628800000 =  1000   ×   60   ×   60   ×   24   ×   42
    // const week_s = 3628800000
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
    // const month_s = 15552000000
    const _data_start = parseTime(params.query.date.getTime() - month_s, '{y}{m}')
    const _data_end = parseTime(params.query.date, '{y}{m}')
    data.vf_id = 2
    if (params.config.component.type === 'table' || params.config.component.type === 'table_lirun') {
      data.start = _data_end
    } else {
      data.start = _data_start
    }

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
  // data = { // 请求参数
  //   vf_id: undefined,
  //   dir: 'Sample Reports/query',
  //   start: '20200114', // 起始日期（如果是日粒度，就是时间选框日期减去30天，如果是周，就是前推6周的周一的日期（注意，还是日期，不过日期是前推6周的周一，需要计算一下），如果是月，就是6个月前的YYYYmm，如201909）
  //   end: '20200120',
  //   // dimension: [{ 'v_id': '21' }, { 'v_group_name': '李昊' }, { 'v_phase': '正式', 'v_group_name': '李昊' }],
  //   dimension: [{ 'v_group_name': '李昊' }],
  //   subject: ['use_ratio'],
  //   table: '', // 查询的是目标还是实际，默认不填写，就是实际，查询目标需要填写成 target
  //   ...store.state.user.apiTemplate
  // }

  // data.start = 202002
  // data.end = 202002

  switch (params.query.dateType) {
    case 'daily':
      data.vf_id = 0
      break
    case 'week':
      data.vf_id = 1
      break
    case 'month':
      data.vf_id = 2
      break
    case 'year':
      data.vf_id = 3
      break
  }
  // console.log('data:', data)

  // 实际数据
  res = await getData(data, res, 'actual') // return res.vf_id0

  // 目标数据
  if (params.config.compare) {
    data.table = 'target'
    // console.log('target', await getData(data, res, 'target'))
    res = await getData(data, res, 'target') // return res.vf_id0
  }

  // 根据view视图配置，发出请求
  // console.log(
  //   'title:', params.title,
  //   'name:', params.name,
  //   'compare:', params.compare,
  //   'completion:', params.completion,
  //   'ratio:', params.ratio,
  //   'fold:', params.fold,
  //   'sort:', params.sort,
  //   'params:', params
  // )
  // console.log('res:', res)

  // 数组长度统一,格式
  res = standardize(res, params)

  // 排序
  res = resSort(res, viewSubject)

  // 转换成数字
  // res = valueToNumber(res)

  params.compare = true // todo debug
  params.completion = true // todo debug
  // 计算完成率

  if (params.config.completion) {
    res = calcCompletion(res)
  }

  // 计算高亮
  if (params.config.completion) {
    res = calcHighlight(res)
  }

  // 集成整合
  const chartDate = formatDataSet(params.query.dateType, res)
  const tableDate = integration(res)

  // 处理表格折叠行
  const foldTableDate = planeToHierarchy(params.query, tableDate)
  // const foldTableDate = []

  // console.log('res=>',res)

  return {
    chartDate: chartDate,
    tableDate: foldTableDate,
    // foldTableDate: foldTableDate,
    res: res
    // tableDate: standardize(res)
  }
}

// toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooools
// 集成整合
function integration(data) {
  // console.log(data)
  return data
}

function formatDataSet(dateType, data) {
  // if (dateType === 'week') {
  // if (data[0]['dimension'][0]['data']) {
  //
  // }
  // }
  return { data }
}

async function getData(data, res, key) {
  res[key] = await fetchData(data)
  return res
}

// 计算高亮
export function calcHighlight(data) {
  // console.log('data:', data)

  data.forEach(subject => {
    subject.dimension.forEach(dimension => {
      dimension.data.forEach(item => {
        // console.log('item.highlight:', item.highlight)
        item.highlightStyle = ''

        if (item.targetValue) {
          if (item.highlight === 'true') {
            item.highlightStyle = item.actualValue < item.targetValue ? 'danger' : 'blue'
          }
          if (item.highlight === 'false') {
            item.highlightStyle = item.actualValue > item.targetValue ? 'danger' : 'blue'
          }
        }
        // todo
        // item.highlightStyle = 'danger'
      })
    })
  })

  return data
}

// 计算完成率
export function calcCompletion(data) {
  data.forEach(subject => {
    subject.dimension.forEach(group => {
      // console.log(data)
      group.data.forEach(item => {
        // console.log('item:', item)
        let _rate = (item.actualValue / item.targetValue * 100).toFixed(2)
        _rate = washValue(_rate)
        item.finish_rate = _rate
      })
    })
  })

  // console.log(data)
  // data.finish_rate = []
  // data.actual.forEach((item, index) => {
  //   // console.log(item)
  //   let _rate = (item.value / data.target[index].value * 100).toFixed(2)
  //   _rate = washValue(_rate)
  //   item.finish_rate = _rate
  //   data.finish_rate.push({
  //     name: item.name,
  //     title: item.title,
  //     value: _rate
  //   })
  // })
  return data
}
// 转换成数字
export function valueToNumber(data) {
  return data
}

// 科目排序
export function resSort(data, viewSubject) {
  viewSubject.map(item => {
    item.dimension = []
    const _v = data.find(s => s.name === item.name)
    // console.log('_v:', _v)
    if (_v) {
      // console.log('_v:', _v.dimension[0].data[0].type)
      item.index = _v.index
      item.type = _v.dimension[0].data[0].type
      item.dimension = _v.dimension
    }
  })
  // console.log('viewSubject:', viewSubject)
  // console.log('data:', data)
  return viewSubject
}

// 拉齐长度，填平空位
export function standardize(data, params) {
  data.actual.forEach(item => {
    // console.log(item.title, item.value)
  })

  let index = 1
  let resDate = []

  // Currency 金额、 Integer 整数、 Percentage 百分比、 Duration 时间  Hour 小时 Second 秒  Time 分钟 7‘11”
  Object.keys(data).forEach((key) => { // 统一
    data[key].forEach(item => {
      // console.log(item)
      item.unit = item.unit === 'Null' ? undefined : item.unit

      item.original = item.value
      item.value = item.value === 'Null' ? undefined : item.value
      // console.log('item.type:', item.type)

      switch (item.type) {
        case 'Duration':
          item.value = item.value && (item.value * 1440).toFixed(2)
          break
        case 'Currency':
          item.value = item.value && item.value.toFixed(2)
          break
        case 'Double':
          // item.value = item.value && item.value.toFixed(2)
          break
        case 'Integer':
          item.value = item.value && Math.round(item.value)
          break
        case 'Percentage':
          item.value = item.value && (item.value * 100).toFixed(2)
          break

        case 'Hour':
          console.log('item:', item)
          item.value = item.value && Math.round(item.value)
          break
        case 'Second':
          item.value = item.value && Math.round(item.value * 60)
          break

        case 'Time':

          if (item.unit === '秒') {
            item.value = item.value && Math.round(item.value * 3600)
          }

          if (item.unit === '小时') {
            item.value = item.value && Math.round(item.value)
          }

          // // eslint-disable-next-line no-case-declarations
          // const _minute = parseInt(item.value / 60)
          // // eslint-disable-next-line no-case-declarations
          // const _second = parseInt(item.value % 60)
          // item.value = `${_minute}'${_second}"`
          // item.timeValue = `${_minute}'${_second}"`
          // console.log('Time:', item)
          break
        case 'String':
          item.value = (item.value === 'Null') ? ' ' : item.value
          // console.log(item)
          break
        default:
      }
      item.value = parseFloat(item.value) || item.value

      if (item.type === 'Time') {
        // item.value = item.timeValue
        // console.log('Time:', item)
      }

      // console.log(item.value, typeof item.value, item.type)
      item.formula = item.formula === 'Null' ? undefined : item.formula
      item.dimension = JSON.parse(item.dimension)
    })
  })

  data.actual.forEach(item => {
    // console.log(item)
    const _v = resDate.find(subject => subject.name === item.name)
    if (!_v) {
      resDate.push({
        name: item.name,
        title: item.title,
        index: index++,
        dimension: []
      })
    }
  })

  resDate = unique(resDate) // 去重

  // console.log('resDate:', resDate)

  resDate.forEach(item => {
    // item.name 类目名称
    // data.actual.forEach =>...
    // 添加实际数据

    // console.log('item:', item)

    data.actual.forEach(a => {
      if (item.title === a.title) {
        // if (a.type === 'Time') {
        //   a.value = a.timeValue
        // }

        // item.type = a.type

        const _data = {
          actualValue: a.value,
          timeValue: a.timeValue,
          highlight: a.highlight,
          time: translateTime(a.time, params),
          type: a.type,
          formula: a.formula,
          original: a.original,
          unit: a.unit,
          children: a.children,
          v_id: a.dimension.v_id
        }

        // console.log(a.dimension.v_group_name)
        const _v = item.dimension.find(dimension => dimension.v_group_name === a.dimension.v_group_name)
        // console.log('_v', _v)
        if (!_v) {
          // item.type = a.type // todo
          item.dimension.push({ // 创建维度并添加数据
            v_group_name: a.dimension.v_group_name,
            data: [_data]
          })
        } else { // 添加数据
          _v.data.push(_data)
        }
      }
    })

    // console.log('data:', data)

    // 添加目标数据
    if (data.target) {
      data.target.forEach(a => {
        if (item.title === a.title) {
          // console.log('a.title:', a.title)
          // console.log('a:', a)
          const _data = {
            // actualValue: a.value, // todo
            targetValue: a.value,
            time: a.time,
            type: a.type,
            formula: a.formula,
            original: a.original,
            unit: a.unit,
            children: a.children
          }
          // console.log('_data:', _data)
          const _v = item.dimension.find(dimension => dimension.v_group_name === a.dimension.v_group_name)
          // console.log('_v:', _v)
          const _v2 = _v.data.find(data => data.time === a.time)
          // console.log('_v2:', _v2)
          if (!_v2) {
            _v.data.push(_data)
          } else {
            _v2.targetValue = a.value
          }
        }
      })
    }
  })

  // console.log('resDate:', resDate)

  return resDate
}

// 数据层级折叠
export function planeToHierarchy(_query, arr) {
  // 1.标记父级，从而可以从高级向低级组织结构
  arr = deepClone(arr)
  const resArr = []
  let _date

  // console.log('planeToHierarchy...')

  // console.log(arr)
  // 初始化准备
  arr = arr.map(item => {
    if (item.children) {
      item.children = item.children === 'Null' ? '[]' : item.children
    } else {
      item.children = []
    }

    switch (_query.dateType) {
      case 'daily':
        _date = parseTime(_query.date, '{y}{m}{d}')
        break
      case 'week':
        // _date = parseTime(_query.date,'{y}{m}{d}')
        break
      case 'month':
        _date = parseTime(_query.date, '{y}{m}')
        break
      case 'year':
        _date = parseTime(_query.date, '{y}{m}{d}')
        break
    }

    if (item.dimension[0]) {
      item.dimension[0].data.forEach(items => {
        if (items.time === parseInt(_date)) {
          item.children = JSON.parse(items.children) // fixJson 字符串 =>>变数组
        }
      })
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

function translateTime(time, params) {
  let res = time
  const day_s = 86400000
  const week_s = day_s * 7
  const _time_start = params.query.date.getTime() - week_s * (7 - time) + day_s
  const _time_end = params.query.date.getTime() - week_s * (6 - time)
  switch (params.query.dateType) {
    case 'week':
      res = parseTime(_time_start, '{mm}.{d}') + '-' + parseTime(_time_end, '{m}.{d}')
      break
    case 'day':
      break
    case 'month':
      break
  }

  return res
}

