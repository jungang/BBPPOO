import { deepClone } from '@/utils'
export function formatter_s(params) {
  // console.log('params...')
  // console.log(params)
  let res = ''
  res += `${params.value.实际}\n`
  // if (!isNaN(params.value.完成率)) {
  //   res += `(${params.value.完成率}%)\n`
  // }
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

export function planeToHierarchy(arr) {
  // 1.标记父级，从而可以从高级向低级组织结构
  arr = deepClone(arr)
  const resArr = []

  // console.log('planeToHierarchy...')

  // 初始化准备
  arr = arr.map(item => {
    // console.log(item.breadName,item.children)
    item.children = JSON.parse(item.children) // fixJson 字符串 =>>变数组
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
  // console.log('findChildren....', n++)
  // console.log('parent:', parent)
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
