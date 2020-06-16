import moment from 'moment'
import { parseTime, unique, deepClone } from '@/utils/index'

// 拉齐长度，填平空位
export function standardize(data, params, fill) {
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
        const _c = item.dimension.find(dimension => dimension.v_company === a.dimension.v_company)

        let _obj ={};
        if(!_c){
          _obj.v_company = a.dimension.v_company
        }

        if(!_v){
          _obj.v_group_name = a.dimension.v_group_name
        }
        _obj.data = [];
        _obj.data.push(_data);
        item.dimension.push(_obj);
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

    // 补齐步长
    // console.log('item:', item.dimension[0].data)
    if (fill && params.query.dateType !== 'year') {
      const _month_date = params.dateRuler.map(date => {
        const _d = deepClone(item.dimension[0].data[0])
        _d.time = +date
        _d.actualValue = ''
        _d.highlightStyle = ''
        // _d.targetValue = 0
        _d.original = 0
        const _v = item.dimension[0].data.find(time => time.time === +date)
        if (_v) {
          // console.log('_v:', _v)
          _d.actualValue = _v.actualValue || ''
          _d.highlightStyle = _v.highlightStyle || ''
          _d.targetValue = _v.targetValue || 0
        }
        return _d
      })

      if (params.query.dateType !== 'week') {
        item.dimension[0].data = _month_date
      }
    }

    // console.log('item:', item)
  })

  // console.log('resDate:', resDate)
  const newResDate = generateTemplate(params)
  // console.log('newResDate:', newResDate)

  return resDate
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
 * @param n 步数
 * @returns {[]}
 */
export function createDateRuler(params, n) {
  let res = []
  for (let i = 0; i < n; i++) {
    res.unshift(i)
  }

  const end_date = parseTime(params.query.date, '{y}{m}{d}')
  switch (params.query.dateType) {
    case 'daily':
      res = res.map(item => moment(end_date).subtract(item, 'days').format('YYYYMMDD'))
      break
    case 'week':
      res = res.map(item => moment(end_date).subtract(item, 'week').format('YYYYMMDD'))
      break
    case 'month':
      res = res.map(item => moment(end_date).subtract(item, 'months').format('YYYYMM'))
      break
    case 'year':
      res = moment(end_date).format('YYYY')
      break
  }
  return res
}

/**
 * 数据模板，先结构框架后填充数据
 * @param params
 * @returns {[]}
 */
export function generateTemplate(params) {
  const res = deepClone(params.viewSubject)
  const _params = deepClone(params)
  if (!_params.query.multiple) {
    _params.query.group = []
    _params.query.group.push(params.query.group)
  }
  // console.log('_params:', _params)
  // console.log('params.query.group:', _params.query.group)
  const _group = []
  const _data = params.dateRuler.map(item=>{
    return {
      actualValue: '',
      time:item
    }
  })
  _params.query.group.forEach(item => {
    switch (item.length) {
      case 1:
        _group.push({
          v_company: item[0],
          data:_data
        })
        break
      case 2:
        _group.push({
          v_group_name: item[1],
          data:_data
        })
        break
      case 3:
        _group.push({
          v_id: item[2].toString(),
          data:_data
        })
        break
      default:
        _group.push({
          v_company: undefined,
          data:_data
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
  return res
}
