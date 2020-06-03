import _ from 'underscore';

export function sortArray(_arr,order) {

  var array = [];

  array = _.sortBy(_arr, (item) => {
    return item.config.index
  });

  if (order === 'DESC') {
    array.reverse()
  }

  return array
}
