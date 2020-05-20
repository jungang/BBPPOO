import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/role/list',
    method: 'get',
    params: query,
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}

export function dele(data) {
  return request({
    url: '/user/role/delete',
    method: 'delete',
    params: data,
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}

export function create(data) {
  return request({
    url: '/user/role',
    method: 'put',
    data: data,
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}

export function updatePermis(data) {
  return request({
    url: '/user/role',
    method: 'put',
    data: data,
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}

export function allPermission(data) {
  return request({
    url: '/permission/all',
    method: 'get',
    data: data,
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}
