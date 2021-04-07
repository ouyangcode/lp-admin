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
// 重置密码
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
// 设置邮箱
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
// 清除缓存
export function gameUserCleanCache(passport) {
  return request({
    url: '/api/lpGameUser/gameUserCleanCache',
    method: 'get',
    params: {
      passport
    }
  })
}
// 获取用户的游戏
export function getGameUserPlayGames(passport) {
  return request({
    url: '/api/lpGameUser/getGameUserPlayGames',
    method: 'get',
    params: {
      passport
    }
  })
}
// 冻结
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
// 解除冻结
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

export default { add, edit, del, updatePass, updateEmail, gameUserCleanCache, lockGameUser, disLockGameUser, getGameUserPlayGames }
