import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpGameUser',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/lpGameUser/',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/lpGameUser',
    method: 'put',
    data
  })
}
export function updatePass(passport, vercodeKey) {
  return request({
    url: '/api/lpGameUser/updatePass',
    method: 'get',
    params: {
      passport,
      vercodeKey
    }
  })
}
export function updateEmail(passport, vercodeKey, email) {
  return request({
    url: '/api/lpGameUser/updateEmail',
    method: 'get',
    params: {
      passport,
      vercodeKey,
      email
    }
  })
}
export function gameUserCleanCache(passport) {
  return request({
    url: '/api/lpGameUser/gameUserCleanCache',
    method: 'get',
    params: {
      passport
    }
  })
}
export function lockGameUser(passport, vercodeKey) {
  return request({
    url: '/api/lpGameUser/lockGameUser',
    method: 'get',
    params: {
      passport,
      vercodeKey
    }
  })
}
export function disLockGameUser(passport, vercodeKey) {
  return request({
    url: '/api/lpGameUser/disLockGameUser',
    method: 'get',
    params: {
      passport,
      vercodeKey
    }
  })
}

export default { add, edit, del, updatePass, updateEmail, gameUserCleanCache, lockGameUser, disLockGameUser }
