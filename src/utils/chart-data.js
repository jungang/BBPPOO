import { fetchData } from '@/api/panel'
import { unique, sort, deepClone } from '@/utils/index'
import { formatter_s, formatter_y } from '@/utils/chartType'
export function standardize(data, currentView) {
  // data.res_s_zb.unshift({ name: '123', title: 'zbzb', value: 100 })
  // data.res_y_zb.unshift({ name: '456', title: '撒旦发', value: 200 })

  //  console.log('data:', data)
  //  console.log('currentView:', currentView)

  let index = 1
  let _titles = []
  let _temp = []

  if (data.res_s.length <= 0) { // 如果没有实际数据，以目标数据为准排序
    _temp = data.res_y
  } else {
    _temp = data.res_s
  }

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

  // 计算完成率
  // console.log('currentView:', currentView)
  if (currentView && currentView.compare === 'true') {
    data.res_s.forEach((item, index) => {
      item.完成率 = (item.value / data.res_y[index].value * 100).toFixed(2)
    })
    // 完成率
  }

  return data
}

export function format(...arg) {
  // console.log(arg)
  const [options, currentView, data] = [...arg]
  options.series = []
  options.dataset = []

  const _data = standardize(deepClone(data))
  // console.log('__data:', _data)
  // const _data = data
  // 实际数据 基础数据 ///////////////////////////////////////////////////////////////////////////////

  // console.log('format.....')
  // console.log(options.dataset)
  // console.log(options.series)

  options.series.push(
    {
      name: '实际',
      type: 'bar',
      itemStyle: {
        opacity: 1,
        color: '#dc6161'
      },
      label: {
        show: true,
        position: 'inside',
        // formatter: '{@实际}\n({@完成率}%)\n占:{@实际占比}%{@isDrill}'
        formatter: (params) => {
          return formatter_s(params)
        },
        rich: {
          a: {
            align: 'center',
            textShadowBlur: 2,
            textShadowColor: '#000',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            color: 'yellow'
          },
          b: {
            align: 'center',
            color: 'white'
          }
        }
      }
    }
  )

  options.dataset = {
    dimensions: ['类目', '实际'],
    source: []
  }
  _data.res_s.forEach((item, index) => {
    // console.log(item.name)
    // console.log(currentView)
    options.dataset.source.push({
      类目: item.title,
      实际: item.value,
      type: item.type,
      formula: item.formula === 'Null' ? undefined : item.formula,
      highlight: item.highlight,
      drillName: item.name,
      drillNameNode: currentView.items[item.name],
      isDrill: !!currentView.items[item.name]
    })
  })

  // currentView.compare = false // todo
  // 预实对比，即预计和实际两项数据 ///////////////////////////////////////////////////////////////////////////////
  if (currentView.compare === 'true') {
    options.dataset.dimensions = ['类目', '预计', '实际']
    options.series.unshift(
      {
        name: '预计',
        type: 'bar',
        itemStyle: {
          opacity: 1,
          color: '#6b65ca'
        },
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => {
            return formatter_y(params)
          },
          rich: {
            a: {
              align: 'center',
              textShadowBlur: 2,
              textShadowColor: '#000',
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              color: 'yellow'
            },
            b: {
              align: 'center',
              color: 'white'
            }
          }
        }
      }
    )
    _data.res_y.forEach((item, index) => {
      options.dataset.source[index]['预计'] = item.value
    })
  }

  // console.log(_data)
  // 实际占比 ///////////////////////////////////////////////////////////////////////////////
  _data.res_s_zb.forEach((item, index) => {
    options.dataset.source[index].实际占比 = item.value
  })
  // 预计占比 ///////////////////////////////////////////////////////////////////////////////
  _data.res_y_zb.forEach((item, index) => {
    options.dataset.source[index].预计占比 = item.value
  })

  // 实际占比 ///////////////////////////////////////////////////////////////////////////////
  // options.dataset.dimensions = ['类目', '预计', '实际']
  // y_zb.forEach((item, index) => {
  //   options.dataset.source[index].预计占比 = item.value
  // })

  // currentView.completion = false // todo
  // 计算完成率 ///////////////////////////////////////////////////////////////////////////////
  if (currentView.completion === 'true') {
    options.dataset.dimensions = ['类目', '预计', '实际', '完成率', '实际占比', '预计占比', 'isDrill']
    options.dataset.source.forEach((item, index) => {
      item.完成率 = (item.实际 / item.预计 * 100).toFixed(0)
    })
  }

  // console.log('options:', options)

  options.toolbox = {
    show: true,
    // orient: 'vertical',
    left: 'right',
    top: 'top',
    feature: {
      dataView: {
        show: false
        /*       readOnly: true,
        optionToContent: function(opt) {
          return optionToContent(opt)
        }*/
      },
      magicType: { show: true, type: ['line', 'bar', 'stack'] }
      // restore: { show: true }
    }
  }

  return options
}

export async function getData(...arg) {
  const [currentView, data] = arg
  // console.log(data)
  let res_s = []
  let res_y = []
  let res_s_zb = []
  let res_y_zb = []

  // 实际
  const data0 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 0,
    'vf_file': 'dashboard.efwvf'
  }
  const data1 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 1,
    'vf_file': 'dashboard.efwvf'
  }
  const data2 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 2,
    'vf_file': 'dashboard.efwvf'
  }
  const data3 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 3,
    'vf_file': 'dashboard.efwvf'
  }

  // console.log(currentView)
  /*  console.log(
    'compare:', currentView.compare,
    'ratio:', currentView.ratio,
    'completion:', currentView.completion)*/
  // console.log({ data0, data1, data2, data3 })

  res_s = await fetchData(data0)

  // 预计
  if (currentView.compare === 'true') {
    res_y = await fetchData(data1)
  }

  // currentView.ratio = false // todo 暂时取消占比数据读取
  if (currentView.ratio === 'true') {
    // 实际  占比
    res_s_zb = await fetchData(data2)
    // 预计  占比
    if (currentView.compare === 'true') {
      res_y_zb = await fetchData(data3)
    }
  }

  // console.log('chart-data....................................')
  // console.log('currentView:', currentView)
  // console.log({ res_s, res_y, res_s_zb, res_y_zb })
  return { res_s, res_y, res_s_zb, res_y_zb }
}
