import request from '@/utils/request'

export function projectFetchList(query) {
  return request({
    url: '/project-list',
    method: 'get',
    params: query,
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}
