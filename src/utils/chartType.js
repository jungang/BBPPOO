// import { deepClone } from '@/utils'
export function formatter_s(params) {
  let res = ''
  res += `${params.value.实际}\n`
  // if (!isNaN(params.value.完成率)) {
  //   res += `(${params.value.完成率}%)\n`
  // }
  // if (params.value.实际占比) {
  //   res += `占${params.value.实际占比}%`
  // }

  if (params.value.isDrill) {
    res = `{a| ${res}  }`
  } else {
    res = `{b| ${res}  }`
  }
  return res
}
export function formatter_y(params) {
  let res = ''
  res += `${params.value.预计}\n`
  // if (params.value.预计占比) {
  //   res += `占${params.value.预计占比}%`
  // }

  if (params.value.isDrill) {
    res = `{a| ${res}  }`
  } else {
    res = `{b| ${res}  }`
  }
  return res
}
