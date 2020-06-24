import moment from 'moment'
import { parseTime, unique, deepClone } from '@/utils/index'

// 拉齐长度，填平空位(旧)
export function standardize(data, params) {
  // console.log('standardize...:')
  // console.log('params:', params)

  data.actual.forEach(item => {
    // console.log(item.title, item.value)
  })
  // console.log('data:', data)

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

      // 数据类型格式化
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

  // 科目处理
  data.actual.forEach(item => {
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

  if (data.actual.length <= 0) {
    data.actual.push({})
  }

  // console.log('data.actual:', data.actual)
  resDate = unique(resDate) // 去重

  // console.log('resDate:', resDate)

  resDate.forEach(item => {
    // item.name 类目名称
    // 添加实际数据
    // data.actual.forEach =>...
    // console.log('data.actual:', data.actual)
    data.actual.forEach(a => {
      // console.log('a.title:', a.title)
      // console.log('a:', a)
      // item.title a.title 科目中文名称
      if (item.title === a.title) {
        // if (a.type === 'Time') {
        //   a.value = a.timeValue
        // }

        // item.type = a.type

        const _date = {
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
        const _c = item.dimension.find(dimension => dimension.v_company === a.dimension.v_company)

        const _obj = {}
        if (!_c) {
          _obj.v_company = a.dimension.v_company
        }

        if (!_v) {
          _obj.v_group_name = a.dimension.v_group_name
        }
        _obj.date = []
        _obj.date.push(_date)
        item.dimension.push(_obj)
      }
    })

    // console.log('data:', data)

    // 添加目标数据
    if (data.target) {
      data.target.forEach(a => {
        if (item.title === a.title) {
          // console.log('a.title:', a.title)
          // console.log('a:', a)
          const _date = {
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
          const _v2 = _v.date.find(data => data.time === a.time)
          // console.log('_v2:', _v2)
          if (!_v2) {
            _v.date.push(_date)
          } else {
            _v2.targetValue = a.value
          }
        }
      })
    }

    // console.log('item:', item)
  })

  return resDate
}

// 模板填充方式（新0617）
export function standardizeFill(data, params) {
  if (params.query.dateType === 'week') data = transWeekDate(data, params)

  // console.log('data:', data)
  // Currency 金额、 Integer 整数、 Percentage 百分比、 Duration 时间  Hour 小时 Second 秒  Time 分钟 7‘11”
  Object.keys(data).forEach((key) => { // 统一格式
    data[key].forEach(item => {
      item.children = JSON.parse(item.children)
      // console.log(typeof item.children)
      item.unit = item.unit === 'Null' ? undefined : item.unit

      item.original = item.value
      item.value = item.value === 'Null' ? undefined : item.value
      // console.log('item.type:', item.type)

      // 数据类型格式化
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

  // console.log('data.actual:', data.actual)
  const newResDate = generateTemplate(deepClone(params))

  newResDate.forEach(subject => {
    // 过滤科目 subject.name
    // const __subject = data.actual.filter(item => item.name === subject.name)
    // const __subject = data.target.filter(item => item.name === subject.name)
    subject.dimension.forEach(dimension => {
      // const __dimension = __subject.filter(_dimension => JSON.stringify(_dimension.dimension) === dimension._dimension)
      // console.log('__dimension:', __dimension)
      // 过滤组织 dimension._dimension
      dimension.date.forEach(date => {
        // 过滤日期 date.time
        // const __date = __dimension.find(_date => +_date.time === +date.time)
        // console.log('__date:', __date)
        // 实际数据
        const _v = data.actual.find(item => {
          // console.log('item.name === subject.name:', item.name === subject.name)
          // console.log(' JSON.stringify(item.dimension) === dimension._dimension:', JSON.stringify(item.dimension) === dimension._dimension)
          // console.log('item.time === +date.time:', item.time === +date.time)

          return item.name === subject.name &&
            JSON.stringify(item.dimension) === dimension._dimension &&
            +item.time === +date.time
        })
        if (_v) {
          // console.log('_v:', _v)
          date.actualValue = _v.value
          date.targetValue = undefined
          date.type = _v.type
          date.unit = _v.unit
          date.children = _v.children
          date.formula = _v.formula
          date.highlight = _v.highlight
          date.original = _v.original
        }

        // console.log('data.target:', data.target)

        if (data.target) {
          // 目标数据
          const _t = data.target.find(item => {
            return item.name === subject.name &&
              JSON.stringify(item.dimension) === dimension._dimension &&
              +item.time === +date.time
          })
          if (_t) {
            // console.log('_t:', _t)
            date.targetValue = _t.value
          }
          // console.log('date:', date)
        }
      })
    })
    // console.log('subject.dimension:', subject.dimension[0].date)
    // const _dimension = _subject.filter(_dimension => _dimension.name === subject.name)
    // console.log('_dimension:', _dimension)
    // _subject.forEach(dimension => {
    //   console.log('dimension:', dimension)
    // })
  })

  // 科目处理
  /*  data.actual.forEach(item => {
    console.log('item:', item)
    const _v = resDate.find(subject => subject.name === item.name)
    if (!_v) {
      resDate.push({
        name: item.name,
        title: item.title,
        index: index++,
        dimension: []
      })
    }
  })*/

  // console.log('newResDate:', newResDate)
  // debugger
  return newResDate
  // return resDate
}

function transWeekDate(data, params) {
  // console.log('transWeekDate:', data)
  // data.actual
  const end_date = parseTime(params.query.date, '{y}{m}{d}')
  Object.keys(data).forEach((key) => { // 统一格式
    data[key].forEach(item => {
      // console.log('item.time:', item.time)
      item.time = moment(end_date).subtract(7 - item.time, 'week').add(1, 'days').format('YYYYMMDD')
      // console.log('_w:', _w)
      // console.log('item:', item)
    })
  })

  return data
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

// 生成时间刻度
// [202001， 202002, 202003, 202004, 202005, 202006,]
/**
 *
 * @param params
 * @returns {[]}
 */
export function createDateRuler(params) {
  const res = []
  const steps = {
    daily: 30,
    week: 6,
    month: 6,
    year: 1
  }
  for (let i = 0; i < steps[params.query.dateType]; i++) res.unshift(i)
  const end_date = parseTime(params.query.date, '{y}{m}{d}')
  const dates = {
    daily: res.map(item => moment(end_date).subtract(item, 'days').format('YYYYMMDD')),
    week: res.map(item => moment(end_date).subtract(item + 1, 'week').add(1, 'days').format('YYYYMMDD')),
    month: res.map(item => moment(end_date).subtract(item, 'months').format('YYYYMM')),
    year: res.map(item => moment(end_date).format('YYYY'))
  }
  // console.log('dates[params.query.dateType]:', dates[params.query.dateType])
  return dates[params.query.dateType]
}

/**
 * 数据模板，先结构框架后填充数据
 * @param params
 * @returns {[]}
 */
export function generateTemplate(params) {
  const res = deepClone(params.viewSubject)
  // console.log('res:', res)
  const _params = deepClone(params)
  if (!_params.query.multiple) {
    _params.query.group = []
    _params.query.group.push(params.query.group)
  }

  // if (params.query.group.length === 1) {
  // console.log('params.query.group:', params.query.group)
  // console.log('_params.query.group:',_params.query.group)
  // }

  if (_params.query.group.length === 0) _params.query.group.push([])
  // console.log('_params:', _params)
  // console.log('params.query.group:', _params.query.group)
  const _group = []
  // console.log('params.dateRule:', params.dateRuler)
  const _date = params.dateRuler.map(item => {
    return {
      actualValue: '',
      time: item
    }
  })

  // console.log('_date:', _date)

  // console.log(' _params.query.group:', _params.query.group)
  _params.query.group.forEach(item => {
    switch (item.length) {
      case 1:
        _group.push({
          v_company: item[0],
          _dimension: JSON.stringify({ v_company: item[0] }),
          date: _date
        })
        break
      case 2:
        _group.push({
          v_group_name: item[1],
          _dimension: JSON.stringify({ v_group_name: item[1] }),
          date: _date
        })
        break
      case 3:
        _group.push({
          v_id: item[2].toString(),
          _dimension: JSON.stringify({ v_id: item[2].toString() }),
          date: _date
        })
        break
      default:
        _group.push({
          _dimension: '{}',
          date: _date
        })
        break
    }
  })
  // console.log('_group:', _group)

  // console.log('params:', params.query.group)
  res.forEach(item => {
    // console.log('item:', item)
    item.dimension = _group
  })

  // console.log('generateTemplate...:')
  // console.log('params:', params.viewSubject)
  // console.log('res:', res)
  return deepClone(res)
}
