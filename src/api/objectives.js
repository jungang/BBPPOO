import request from '@/utils/request'

export function calculate(query) {
  return request({
    url: '/calculate',
    method: 'get',
    params: query,
    baseURL: 'http://39.98.167.246:8096'
  })
}

export function fetchFileList(query) {
  return request({
    url: '/objectives/file-list',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/objectives/list',
    method: 'get',
    params: query
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
