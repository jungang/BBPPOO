import request from '@/utils/request'
import { request2 } from '@/utils/request'
import { Base64 } from 'js-base64'

export function fetchData(data) {
  return request2({
    url: '/visualizeData',
    method: 'post',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    // data: 'data=' + code
    data: 'data=' + Base64.encode(JSON.stringify(data))
  })
}

export function fetchPanel(id) {
  return request({
    url: '/chart/get',
    method: 'get',
    params: { id },
    baseURL: 'http://172.20.95.131:8096'
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
    data,
    baseURL: 'http://172.20.95.131:8096'
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

