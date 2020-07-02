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
  // const employeeList = store.state.group.employeeList
  // console.log('__arr=>', __arr)
  // console.log('params.query.group:', params.query.group)
  // console.log('params.query:', params.query)
  if (params.query.group === 'null' || params.query.group.length === 0) {
    // 空选项
    data.dimension.push({})

    /*    if (params.config.component.type === 'table_lirun') {
      console.log('单人利润:')
      console.log('params.query:', params.query)
      console.log('params.query.group_all:', params.query.group_all)
      data.dimension = params.query.group_all

      /!*     if (employeeList.length > 0) {
        data.dimension = []
        employeeList.forEach((item) => {
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
      }*!/
      console.log('data.dimension:', data.dimension)
    }*/
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
    /*    if (params.config.component.type === 'table_lirun') {
      // console.log('.....:')
      // console.log('params.query.group[1]:', params.query.group[0])
      data.dimension.push({ v_group_name: params.query.group[0] })

      if (params.query.group.length === 2) {
        employeeList.forEach((item) => {
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
    } else {*/
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
    // }
  }

  if (params.config.component.type === 'table_lirun') data.dimension = params.query.group_all || [{}]
  // console.log('params.config.component.type:', params.config.component.type)
  // console.log('data.dimension:', data.dimension)

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
  let fillFoldTableDate = planeToHierarchy(params.query, fill_res)
  // const foldTableDate = []

  // console.log('res=>',res)

  if (params.config.component.type === 'table_lirun') {
    if (res[0])fillFoldTableDate = handleProfit(res)
  }

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

function handleProfit(res) {
  let data = []
  // console.log('单人利润:')
  // console.log('data:', data)
  // console.log('res[0]:', res[0])

  res[0].dimension.forEach(item => {
    // console.log('item:', item)

    const _item = item.date[0]
    // console.log('_item:', _item)

    if (item.v_group_name) {
      _item.v_group_name = item.v_group_name + '组'
      _item.name = item.v_group_name + '组'
    }
    if (_item.v_id) {
      _item.name = _item.v_id
      const _v = store.state.group.employeeList_res.find(item => item.v_project_work_id === _item.v_id)
      if (_v) {
        _item.name = _v.v_name
        _item.v_group_name = _v.v_group_name + '组'
      }
    }

    data.push(_item)
  })
  // console.log('data:', data)

  data = data.filter(item => {
    // console.log('item.v_group_name:', item.v_group_name)
    return item.v_group_name || false
  })

  data.sort((a, b) => {
    // console.log('a.v_group_name:', a.v_group_name)
    // a.v_group_name = a.v_group_name || ''
    return a.v_group_name.localeCompare(b.v_group_name)
  }
  )
  return data
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

  // console.log(arr)
  // 初始化准备
  arr = arr.map(subject => {
    // console.log('subject:', subject)
    if (subject.children) {
      subject.children = subject.children === 'Null' ? '[]' : subject.children
    } else {
      subject.children = []
    }

    if (subject.dimension[0]) {
      // console.log('subject.dimension[0].date:', subject.dimension[0].date)
      const _pop = subject.dimension[0].date.pop()
      // console.log('_pop:', _pop)
      if (_pop.children) {
        if (typeof _pop.children === 'string') _pop.children = JSON.parse(_pop.children)
        subject.children = _pop.children
      }

      // console.log('subject:', subject)
      // console.log('_pop:', _pop)
      subject.actualValue = _pop.actualValue
      subject.targetValue = _pop.targetValue
      subject.highlightStyle = _pop.highlightStyle
      // console.log('subject:', subject)
      // console.log('_pop:', _pop)
    }

    subject.childrenRow = [] // 默认无子元素
    subject.parent = undefined // 默认父级未定义
    return subject
  })

  // console.log('arr:', arr)
  // 标记父级
  arr.forEach(item => {
    if (item.children.length !== 0) { // 有下级元素
      // console.log('item.name:', item.name)
      // console.log("item.children:", item.children)
      item.children.forEach(childrenName => {
        const childrenItem = arr.find(arrItem => arrItem.name === childrenName)
        if (childrenItem) {
          childrenItem.parent = item.name
        }
      })
    }
  })

  // console.log('arr:', arr)
  // 最上级元素
  arr.forEach(item => {
    // 是否为一级元素（即判断是否有父元素）
    if (!item.parent) {
      resArr.push(item)
      // 是否包含子元素，如果有，则递归调用
      // if (item.children.length > 0) {
      // item 当前元素  ，arr 全部元素
      // findChildren(item, deepClone(arr))
      // }
    }
  })

  // console.log('resArr:', resArr)
  resArr.forEach(item => {
    if (item.children.length > 0) {
    // item 当前元素  ，arr 全部元素
      findChildren(item, deepClone(arr))
    }
  })
  return resArr
}

// tooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooools

// 表格折叠行 递归子元素
// const n = 1
// parent 当前元素

function findChildren(parent, arr) {
  // parent.children 子元素名字列表 ['service_level_reward','','']
  parent.children.forEach(childrenName => {
    // childrenItem 查找子元素对象 'service_level_reward'
    const childrenItem = arr.find(arrItem => arrItem.name === childrenName)
    if (childrenItem) {
      // console.log('parent.childrenRow:', parent.childrenRow)
      const _v = parent.childrenRow.find(item => item.name === childrenItem.name)
      if (!_v) parent.childrenRow.push(childrenItem)
      if (childrenItem.children.length > 0) {
        // findChildren(childrenItem, arr) // todo  递归中有错误，待修复

        childrenItem.children.forEach(childrenName => {
          const childrenItem2 = arr.find(arrItem => arrItem.name === childrenName)
          if (childrenItem2) {
            const _v2 = childrenItem.childrenRow.find(item => item.name === childrenItem2.name)
            if (!_v2) childrenItem.childrenRow.push(deepClone(childrenItem2))
          }
        })
      }
    }

    // fix bug
    parent.childrenRow.forEach(item => {
      item.childrenRow.forEach(item2 => {
        if (item2.children.length > 0) {
          item2.children.forEach(item3 => {
            const childrenItem = arr.find(arrItem => arrItem.name === item3)
            // console.log('childrenItem:', childrenItem)
            // console.log('item2.childrenRow:', item2.childrenRow)
            const _v = item2.childrenRow.find(item => item.name === childrenItem.name)
            if (!_v)item2.childrenRow.push(deepClone(childrenItem))
          })
        }
      })
    })

    // if (childrenItem) {
    //   // 添加子元素对象到父元素childrenRow中
    //   parent.childrenRow.push(deepClone(childrenItem))
    //
    //   console.log('childrenItem:', childrenItem)
    //   if (childrenName === childrenItem.name) {
    //     console.log('!!!!!:', childrenItem)
    //     return
    //   }
    //   // fix exit rule parent.name !== childrenName
    //   if (childrenItem.children.length > 0) {
    //     findChildren(childrenItem, arr)
    //   }
    // }
  })
}
