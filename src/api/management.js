import request from '@/utils/request'

export function fetchStatus(query) {
  return request({
    url: '/calstatus',
    method: 'get',
    params: query,
    baseURL: 'http://39.98.167.246:8096'
  })
}

export function fetchList(query) {
  return request({
    url: '/excel/list',
    method: 'get',
    params: query,
    baseURL: 'http://39.98.167.246:8096'
  })
}

export function actionDelete(query) {
  return request({
    url: '/excel/delete',
    method: 'delete',
    params: query,
    baseURL: 'http://39.98.167.246:8096'
  })
}

export function fetchDetail(query) {
  return request({
    url: '/objectives/detail',
    method: 'get',
    params: query
  })
}

export function generate(data) {
  return request({
    url: '/objectives/generate',
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
