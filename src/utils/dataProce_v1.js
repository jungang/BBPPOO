// eslint-disable-next-line no-unused-vars
import { deepClone, parseTime, sort, unique, washValue } from '@/utils'
import { standardize, standardizeFill, createDateRuler } from '@/utils/standardize'
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
  let fill_res = {} // 补齐步长

  const day_s = 86400000 * 29
  // const day30_s = 86400000 * 30
  const week_s = 3628800000 - 86400000
  const month_s = 15552000000

  /*
  if (params.config.component.type === 'chart_bar') {
    day_s = 86400000
    // week_s = 604800000
    if (parseTime(params.query.date, '{m}') === '03') {
      month_s = 2505600000
    } else {
      month_s = 2592000000
    }
  }
*/

  /**
   * params 请求参数信息 该视图的配置信息
   * drill__drillName
   * drill_drillName
   * drill_parameters
   */

  // console.log('params:', params)
  // console.log('params.query.type:', params.query.type)

  // console.log('params.query.type:', params.query.type)

  let subject = params.items[`${params.query.type}`]
  // console.log('subject:', subject)
  if (!subject) { // todo 降级参数
    subject = params.items['*'] || ['']
  }

  // 去除空格
  const _subject = []
  subject.forEach((items) => {
    _subject.push(items.trim())
  })
  subject = _subject

  const viewSubject = subject.map(item => {
    let _title = ''

    const _v = store.state.options.subject.find(s => {
      return s.name === item.trim()
    })

    // console.log('_v:', _v)
    // console.log('_v:', JSON.parse(_v.config))

    if (_v) {
      // console.log('_v:', _v)
      _title = _v.config.show_name || _v.title
      _v.title = _v.config.show_name || _v.title
    }

    return _v || {
      name: item,
      title: _title
    }
  })

  // console.log('viewSubject:', viewSubject)
  // console.log('subject:', subject)
  params.viewSubject = deepClone(viewSubject)

  const data = { // 请求参数
    vf_id: undefined,
    dir: 'Sample Reports/query',
    dateType: params.query.dateType,
    start: '', // 起始日期（如果是日粒度，就是时间选框日期减去30天，如果是周，就是前推6周的周一的日期（注意，还是日期，不过日期是前推6周的周一，需要计算一下），如果是月，就是6个月前的YYYYmm，如201909）
    end: '', // 结束日期（如果是日粒度，就是时间选框日期，如果是周，就是所选日期的礼拜天的日期，如果是月，就是所选日期的当前月）
    dimension: [], // 查询的切片，json数组，里面每项就是一个查询条件。如:[{"v_company": "永基","v_id":"1561"},{"v_group_name":"李红英"},{"v_phase":"实习期","v_group_name":"李红英"}]，分别查询人员id为1561的员工，小组名称为"李红英"的小组，以及小组名称为"李红英"的小组里面阶段为"实习期"的信息，并且把这三种不同维度信息一并给查询出来。
    subject: subject, // 查询的科目，json数组，里面每项就是一个科目。如:["income","AHT"]
    table: 'statistics', // 查询的是目标还是实际，默认不填写，就是实际，查询目标需要填写成 target
    // year: +params.drill_parameters.year,
    // month: +params.drill_parameters.month,
    ...store.state.user.apiTemplate
  }

  // console.log('params.query.group:', params)
  // console.log('params.query.group:', params)
  // console.log('params.query.group:', params.query)
  // console.log('params.query.group:', params.query.group)
  // 处理组、人员参数

  // console.log('params.query.group:', params.query.group)

  // console.log('length:', params.query.group.length)
  const __arr = store.state.group.employeeList
  // console.log('__arr=>', __arr)
  // console.log('params.query.group:', params.query.group)
  if (params.query.group === 'null' || params.query.group.length === 0) {
    // 空选项
    data.dimension.push({})

    if (params.config.component.type === 'table_lirun') {
      if (__arr.length > 0) {
        data.dimension = []
        __arr.forEach((item) => {
          if (item.children) {
            const obj = {}
            obj.v_company = item.value
            data.dimension.push(obj)
            item.children.forEach((_item) => {
              const _obj = {}
              _obj.v_group_name = _item.value
              data.dimension.push(_obj)
              _item.children.forEach((__item) => {
                const __obj = {}
                __obj.v_id = __item.value
                data.dimension.push(__obj)
              })
            })
          }
        })
      }
      // console.log('data.dimension=>',data.dimension)
    }
  } else if (params.query.multiple) {
    params.query.group.forEach(item => {
      // console.log('params.query.group:', params.query.group)
      switch (item.length) {
        case 1:
          data.dimension.push({ v_company: item[0] })
          break
        case 2:
          data.dimension.push({ v_group_name: item[1] })
          break
        case 3:
          data.dimension.push({ v_id: item[2].toString() })
          break
      }
    })
  } else {
    // 单选
    if (params.config.component.type === 'table_lirun') {
      data.dimension.push({ v_group_name: params.query.group[1] })

      if (params.query.group.length === 2) {
        __arr.forEach((item) => {
          if (item.children) {
            item.children.forEach((_item) => {
              if (_item.value === params.query.group[1]) {
                _item.children.forEach((__item) => {
                  const __obj = {}
                  __obj.v_id = __item.v_project_work_id
                  data.dimension.push(__obj)
                })
              }
            })
          }
        })
      } else if (params.query.group.length === 3) {
        data.dimension.push({ v_id: params.query.group[2].toString() })
      } else {
        data.dimension.push({ v_company: params.query.group[0] })
      }
    } else {
      // console.log('params.query.group:', params.query.group)
      switch (params.query.group.length) {
        case 1:
          data.dimension.push({ v_company: params.query.group[0] })
          break
        case 2:
          data.dimension.push({ v_group_name: params.query.group[1] })
          break
        case 3:
          data.dimension.push({ v_id: params.query.group[2].toString() })
          break
      }
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
    // console.log('按周查。。。', params.query)

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
  //
  // switch (params.query.dateType) {
  //   case 'daily':
  //     data.vf_id = 0
  //     break
  //   case 'week':
  //     data.vf_id = 1
  //     break
  //   case 'month':
  //     data.vf_id = 2
  //     break
  //   case 'year':
  //     data.vf_id = 3
  //     break
  // }
  //  console.log('data:', data)

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

  // 生成时间轴线
  params.dateRuler = createDateRuler(params, 6)

  res = dimensionStringify(res)

  // 数组长度统一,格式
  fill_res = standardizeFill(deepClone(res), params) // 代偿
  res = standardize(res, params)

  // console.log('fill_res:', fill_res)
  // 排序
  // res = resSort(res, deepClone(viewSubject))
  // fill_res = resSort(fill_res, deepClone(viewSubject))

  // 补齐科目数据
  // res = fillSubject(res, params)

  // console.log('res2:', res)
  // 转换成数字
  // res = valueToNumber(res)

  params.compare = true // todo debug
  params.completion = true // todo debug
  // 计算完成率

  if (params.config.completion) {
    res = calcCompletion(res)
    fill_res = calcCompletion(fill_res)
  }

  // 计算高亮
  if (params.config.completion) {
    res = calcHighlight(res)
    fill_res = calcHighlight(fill_res)
  }

  // console.log('res:', res)

  // 集成整合
  const chartDate = formatDataSet(params.query.dateType, res)
  const fillChartDate = formatDataSet(params.query.dateType, fill_res)
  const tableDate = integration(res)
  //  console.log('tableDate=>',tableDate)
  // 处理表格折叠行
  const foldTableDate = planeToHierarchy(params.query, tableDate)
  const fillFoldTableDate = planeToHierarchy(params.query, fill_res)
  // const foldTableDate = []

  // console.log('res=>',res)

  return {
    chartDate: chartDate,
    tableDate: foldTableDate,
    foldTableDate: foldTableDate,
    fillFoldTableDate: fillFoldTableDate,
    res: res,
    fillChartDate: fillChartDate,
    fillDate: fill_res
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
  // console.log('res[key]:', res[key])
  res[key].forEach(item => {
    item._dimension = item.dimension.replace(' ', '')
  })
  return res
}

function dimensionStringify(data) {
  return data
}

// 计算高亮
export function calcHighlight(data) {
  // console.log('data:', data)

  data.forEach(subject => {
    subject.dimension.forEach(dimension => {
      dimension.date.forEach(item => {
        // console.log('item.highlight:', item.highlight)
        item.highlightStyle = ''

        if (item.targetValue !== undefined) {
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
    // console.log('subject:', subject)
    subject.dimension.forEach(group => {
      // console.log('group.data:', group.data)
      // console.log('group:', group)
      // console.log(data)
      group.date.forEach(item => {
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
      // console.log('_v.dimension:', _v.dimension)
      item.index = _v.index
      item.type = _v.dimension[0].date[0].type
      item.dimension = _v.dimension
    }
  })
  // console.log('viewSubject:', viewSubject)
  // console.log('data:', data)
  return viewSubject
}

// 补齐科目
/*
export function fillSubject(res, params) {
  const _date = params.dateRuler.map(item => {
    return {
      actualValue: '',
      time: item
    }
  })
  // console.log('_date:', _date)
  res.forEach(item => {
    // console.log('item:', item)
    if (item.dimension.length <= 0) {
      item.dimension.push({
        v_group_name: undefined,
        data: _date
      })
    }
  })

  return res
}
*/

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
      item.dimension[0].date.forEach(items => {
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
