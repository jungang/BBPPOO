import Cookies from 'js-cookie'
import store from '@/store'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function ViewAuth(view) {
  let res = false
  if (view.config.rule[0] === 'all') {
    res = true
  } else {
    // console.log(view.config.rule)
    // console.log(store.state.user.roles)
    res = view.config.rule.find(item => item === store.state.user.roles[0])
  }
  return res
}

