import { fetchData } from '@/api/panel'
import { unique, sort, deepClone } from '@/utils/index'

function standardize(data) {
  // data.res_s_zb.unshift({ name: '123', title: 'zbzb', value: 100 })
  // data.res_y_zb.unshift({ name: '456', title: '撒旦发', value: 200 })

  let _titles = []
  Object.keys(data).forEach((key) => { // 集合title
    _titles = [..._titles, ...data[key].map(item => {
      return {
        name: item.name,
        title: item.title,
        value: undefined // 空值填充 默认值
      }
    })]
  })

  _titles = unique(_titles) // 去重

  Object.keys(data).forEach((key) => { // 统一
    _titles.forEach(item => {
      const v = data[key].find(item2 => item2.name === item.name)
      !v && data[key].push(item) // 填补空缺
    })
    data[key] = sort(data[key]) // 重新排序 确保各维度位置正确必须步骤
  })

  return data
}

export function format(...arg) {
  // console.log(arg)
  const [options, currentView, data] = [...arg]
  options.series = []

  const _data = standardize(deepClone(data))
  // console.log('__data:', _data)
  // const _data = data

  // 实际数据 基础数据 ///////////////////////////////////////////////////////////////////////////////
  options.series.push(
    {
      name: '实际',
      type: 'bar',
      itemStyle: {
        opacity: 1
      },
      label: {
        show: true,
        position: 'inside',
        // formatter: '{@实际}\n({@完成率}%)\n占:{@实际占比}%{@isDrill}'
        formatter: (params) => {
          // console.log(params)
          let res = ''
          if (params.value.isDrill) {
            res = params.value.实际 + '\n（' + params.value.完成率 + '%）\n占：' + params.value.实际占比 + '%\n'
            res = '{a|' + res + '}'
          } else {
            res = params.value.实际
          }
          return res
        },
        rich: {
          a: {
            align: 'center',
            textShadowBlur: 2,
            textShadowColor: '#000',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            color: 'yellow'
          }
        }
      },
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 50
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
      drillName: item.name,
      drillNameNode: currentView.items[item.name],
      isDrill: !!currentView.items[item.name]
    })
  })

  // currentView.compare = false // todo
  // 预实对比，即预计和实际两项数据 ///////////////////////////////////////////////////////////////////////////////
  if (currentView.compare) {
    options.dataset.dimensions = ['类目', '预计', '实际']
    options.series.unshift(
      {
        name: '预计',
        type: 'bar',
        label: {
          show: true,
          position: 'inside',
          formatter: (params) => {
            let res = ''
            if (params.value.isDrill) {
              res = params.value.预计 + '\n占：' + params.value.预计占比 + '%'
              res = '{a|' + res + '}'
            } else {
              res = params.value.预计
            }
            return res
          },
          rich: {
            a: {
              align: 'center',
              textShadowBlur: 2,
              textShadowColor: '#000',
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              color: 'yellow'
            }
          }
        }
      }
    )
    _data.res_y.forEach((item, index) => {
      options.dataset.source[index].预计 = item.value
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
  if (currentView.completion) {
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
        readOnly: true,
        optionToContent: function(opt) {
          var axisData = opt.dataset[0].source
          // console.log(opt.dataset)
          // console.log(axisData)
          var table = '<table class="chart-table"><tbody><tr>' +
          '<th>' + opt.dataset[0].dimensions[0] + '</th>' +
          '<th>' + opt.dataset[0].dimensions[1] + '</th>' +
          '<th>' + opt.dataset[0].dimensions[5] + '</th>' +
          '<th>' + opt.dataset[0].dimensions[2] + '</th>' +
          '<th>' + opt.dataset[0].dimensions[4] + '</th>' +
          '<th>' + opt.dataset[0].dimensions[3] + '</th>' +
          '</tr>'

          for (var i = 0; i < axisData.length; i++) {
            table += '<tr>' +
            '<td>' + axisData[i].类目 + '</td>' +
            '<td>' + (axisData[i].预计 ? axisData[i].预计 : '') + '</td>' +
            '<td>' + (axisData[i].预计占比 ? axisData[i].预计占比 + '%' : '') + '</td>' +
            '<td>' + (axisData[i].实际 ? axisData[i].实际 : '') + '</td>' +
            '<td>' + (axisData[i].实际占比 ? axisData[i].实际占比 * 100 + '%' : '') + '</td>' +
            '<td>' + (!isNaN(axisData[i].完成率) ? axisData[i].完成率 + '%' : '') + '</td>' +
            '</tr>'
          }
          table += '</tbody></table>'
          return table
        }
      },
      magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      restore: { show: true }
    }
  }

  return options
}

export async function getData(...arg) {
  const [currentView, data] = arg
  console.log(data)
  let res_s = []
  let res_y = []
  let res_s_zb = []
  let res_y_zb = []

  // 实际
  const data1 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 0,
    'vf_file': 'dashboard.efwvf'
  }
  const data2 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 1,
    'vf_file': 'dashboard.efwvf'
  }
  const data3 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 2,
    'vf_file': 'dashboard.efwvf'
  }
  const data4 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'year': data.parameters.year,
    'month': +data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 3,
    'vf_file': 'dashboard.efwvf'
  }

  console.log({ data1, data2, data3, data4 })

  res_s = await fetchData(data1)
  // console.log('res_s::', res_s)
  // 预计
  if (currentView.compare) {
    res_y = await fetchData(data2)
  }

  // console.log('currentView:', currentView)
  // 实际  占比
  res_s_zb = await fetchData(data3)
  // 预计  占比
  res_y_zb = await fetchData(data4)

  // console.log('console.lo...')
  // console.log(currentView)
  console.log({ res_s, res_y, res_s_zb, res_y_zb })
  return { res_s, res_y, res_s_zb, res_y_zb }
}
