import { fetchData } from '@/api/panel'

export function format(...arg) {
  // console.log(arg)
  const [options, currentView, s, y] = arg
  options.series = []
  // 实际数据 基础数据 ///////////////////////////////////////////////////////////////////////////////
  options.series.push(
    {
      name: '实际',
      type: 'bar',
      label: {
        show: true,
        // position: 'top',
        formatter: '{@实际}\n({@完成率}%)'
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
          // position: 'top'
        }
      }
    )
    y.forEach((item, index) => {
      options.dataset.source[index].预计 = item.value
    })
  }

  // currentView.completion = false // todo
  // 计算完成率 ///////////////////////////////////////////////////////////////////////////////
  if (currentView.completion) {
    options.dataset.dimensions = ['类目', '预计', '实际', '完成率']
    /*    options.series.push(
      {
        name: '完成率',
        type: 'bar',
        label: {
          show: true,
          formatter: '{@完成率}%'
        }
      })*/
    options.dataset.source.forEach((item, index) => {
      item.完成率 = (item.实际 / item.预计 * 100).toFixed(0)
    })
  }
  // console.log('options.series:', options.series)
  return options
}

export async function getData(...arg) {
  const [currentView, data] = arg

  // console.log(data)
  let res_s = []
  let res_y = []

  const data1 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'month': '1',
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 0,
    'vf_file': 'dashboard.efwvf'
  }

  // console.log(data1)
  res_s = await fetchData(data1)

  const data2 = {
    'dir': 'Sample Reports/' + data._drillName,
    'name': data.drillName,
    'month': '1',
    'projectId': '00000000-0000-0000-0000-000000000000',
    'vf_id': 1,
    'vf_file': 'dashboard.efwvf'
  }

  if (currentView.compare) {
    res_y = await fetchData(data2)
  }

  return [res_s, res_y]
}
