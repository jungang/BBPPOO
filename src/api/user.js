import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/j_spring_security_check',
    method: 'get',
    params: data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token },
//     baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
//   })
// }

export function getInfo(token) {
  return request({
    url: '/auth/role',
    method: 'get',
    params: { token }
    // baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
    baseURL: 'http://rap2api.taobao.org/app/mock/249653/dev-api'
  })
}
