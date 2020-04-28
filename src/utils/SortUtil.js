
export function sortUtil(array, propName, order) {
  array.sort((a, b) => {
    if (a[propName] < b[propName]) {
      return -1
    }

    if (a[propName] > b[propName]) {
      return 1
    }
    return 0
  })

  if (order === 'DESC') {
    array.reverse()
  }

  return array
}
