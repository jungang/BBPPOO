
export function formatter_s(params) {
  // console.log('params...')
  // console.log(params)
  let res = ''
  res += `${params.value.实际}\n`
  if (!isNaN(params.value.完成率)) {
    res += `(${params.value.完成率}%)\n`
  }
  if (params.value.实际占比) {
    res += `占${params.value.实际占比}%`
  }

  if (params.value.isDrill) {
    res = `{a| ${res}  }`
  } else {
    res = `{b| ${res}  }`
  }
  return res
}
export function formatter_y(params) {
  // console.log('params...')
  // console.log(params)
  let res = ''
  res += `${params.value.预计}\n`
  if (params.value.预计占比) {
    res += `占${params.value.预计占比}%`
  }

  if (params.value.isDrill) {
    res = `{a| ${res}  }`
  } else {
    res = `{b| ${res}  }`
  }
  return res
}

export function optionToContent(opt) {
  let table = ''
  var source = opt.dataset[0].source

  table = '<table class="chart-table"><tbody><tr>'
  table += source[0].类目 !== undefined ? `<th>类目</th>` : ``
  table += source[0].预计 !== undefined ? `<th>预计</th>` : ``
  table += source[0].预计占比 !== undefined ? `<th>预计占比</th>` : ``
  table += source[0].实际 !== undefined ? `<th>实际</th>` : ``
  table += source[0].实际占比 !== undefined ? `<th>实际占比</th>` : ``
  table += source[0].完成率 !== undefined ? `<th>完成率</th>` : ``
  source.forEach(item => {
    table += `<tr>`
    table += item.类目 !== undefined ? `<td>${item.类目}</td>` : ``
    table += item.预计 !== undefined ? `<td>${item.预计}</td>` : ``
    table += item.预计占比 !== undefined ? `<td>${item.预计占比}%</td>` : ``
    table += item.实际 !== undefined ? `<td>${item.实际}</td>` : ``
    table += item.实际占比 !== undefined ? `<td>${item.实际占比}%</td>` : ``
    table += item.完成率 !== undefined ? `<td>${item.完成率}%</td>` : ``
    table += `</tr>`
  })

  table += '</tbody></table>'
  return table
}
