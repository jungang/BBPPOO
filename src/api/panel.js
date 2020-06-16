import request from '@/utils/request'
import { request2 } from '@/utils/request'
import { Base64 } from 'js-base64'

export function fetchData(data) {
  // console.log(data)

  return request2({
    url: `/visualizeData?vf_id=${data.vf_id}
    &pid=${data.projectId}
    &dir=${data.dir}
    &start=${data.start}
    &end=${data.end}
    &table=${data.table}
    &dimension=${JSON.stringify(data.dimension)}
    &subject=${JSON.stringify(data.subject)}
    `,
    method: 'post',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    // data: 'data=' + code
    data: 'data=' + Base64.encode(JSON.stringify(data))
  })
}

export function dashboard(query) {
  return request({
    url: '/dashboard/list',
    method: 'get',
    params: query,
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}

export function fetchPanel(id) {
  return request({
    url: '/chart/get',
    method: 'get',
    params: { id }
  })
}

export function fetchDrill(params) {
  return request({
    url: '/panel/detail',
    method: 'get',
    params: params
  })
}

export function test(params) {
  return request({
    url: '/panel/test',
    method: 'get',
    params: params
  })
}

export function fetchDrillObjective(params) {
  return request({
    url: '/panel/detail-objective',
    method: 'get',
    params: params
  })
}

export function saveLayout(data) {
  return request({
    url: '/chart/set',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

