import request from '@/utils/request'

export function panelsFetchList(query) {
  return request({
    url: '/panels/list',
    method: 'get',
    params: query
  })
}

export function createPanel(data) {
  return request({
    url: '/panels/create',
    method: 'post',
    data
  })
}

export function deletePanel(id) {
  return request({
    url: `/panels/delete`,
    method: 'delete',
    params: { id: id }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/panels/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/panels/pv',
    method: 'get',
    params: { pv }
  })
}

export function updateArticle(data) {
  return request({
    url: '/panels/update',
    method: 'put',
    data
  })
}
