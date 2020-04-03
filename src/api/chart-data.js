import request from '@/utils/request'
import { request2 } from '@/utils/request'
// import Base64 from 'js-base64'
const Base64 = require('js-base64').Base64

export function fetchData(data) {
  return request2({
    url: '/visualizeData',
    method: 'post',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    data: 'data=' + Base64.encode(data)
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
