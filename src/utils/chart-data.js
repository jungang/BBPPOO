import { fetchData } from '@/api/panel'

export function format(...arg) {
  // console.log(arg)
  const [options, currentView, s, y, s_zb, y_zb] = arg
  options.series = []

  // 实际数据 基础数据 ///////////////////////////////////////////////////////////////////////////////
  options.series.push(
    {
      name: '实际',
      type: 'bar',
      label: {
        show: true,
        // position: 'top',
        formatter: '{@实际}\n({@完成率}%)\n占:{@预计占比}%'
      },
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 50

    }
  )
  options.dataset = {
    dimensions: ['类目', '实际'],
    source: []
  }
  s.forEach((item, index) => {
    options.dataset.source.push({
      类目: item.title,
      实际: item.value,
      drillName: item.name
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
          // position: 'top',
          formatter: '{@预计}\n占:??.??%'
        }
      }
    )
    y.forEach((item, index) => {
      options.dataset.source[index].预计 = item.value
    })
  }

  // 实际占比 ///////////////////////////////////////////////////////////////////////////////
  // options.dataset.dimensions = ['类目', '预计', '实际']
  // s_zb.forEach((item, index) => {
  //   options.dataset.source[index].实际占比 = item.value
  // })

  // 实际占比 ///////////////////////////////////////////////////////////////////////////////
  // options.dataset.dimensions = ['类目', '预计', '实际']
  // y_zb.forEach((item, index) => {
  //   options.dataset.source[index].预计占比 = item.value
  // })

  // currentView.completion = false // todo
  // 计算完成率 ///////////////////////////////////////////////////////////////////////////////
  if (currentView.completion) {
    options.dataset.dimensions = ['类目', '预计', '实际', '完成率']
    options.dataset.source.forEach((item, index) => {
      item.完成率 = (item.实际 / item.预计 * 100).toFixed(0)
    })
  }
  console.log('options.dataset:', options.dataset)
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
    'month': data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 0,
    'vf_file': 'dashboard.efwvf'
  }
  res_s = await fetchData(data1)

  // 预计
  const data2 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'month': data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 1,
    'vf_file': 'dashboard.efwvf'
  }
  if (currentView.compare) {
    res_y = await fetchData(data2)
  }

  // 实际  占比
  const data3 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'month': data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 0,
    'vf_file': 'dashboard.efwvf'
  }
  res_s_zb = await fetchData(data3)

  // 实际  占比
  const data4 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'month': data.parameters.month,
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 0,
    'vf_file': 'dashboard.efwvf'
  }
  res_y_zb = await fetchData(data4)

  return [res_s, res_y, res_s_zb, res_y_zb]
}
