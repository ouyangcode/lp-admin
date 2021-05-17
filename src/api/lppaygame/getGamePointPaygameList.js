import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpGamePointPaygame',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/lpGamePointPaygame/',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/lpGamePointPaygame',
    method: 'put',
    data
  })
}
// 兑换补点
export function addPointGamePointPaygame(data) {
  return request({
    url: '/api/lpGamePointPaygame/addPointGamePointPaygame',
    method: 'get',
    params: {
      orderId: data.orderId,
      passport: data.passport,
      servercode: data.servercode,
      param: data.param,
      roleid: data.roleid,
      itemcode: data.itemcode,
      vercodeKey: data.vercodeKey
    }
  })
}
// 更新服代码
export function editGameServerCode(data) {
  return request({
    url: '/api/lpGamePointPaygame/editGameServerCode',
    method: 'get',
    params: {
      orderId: data.orderId,
      servercode: data.servercode,
      vercodeKey: data.vercodeKey
    }
  })
}
// 更新订单状态
export function editStatusGamePointPaygame(data) {
  return request({
    url: '/api/lpGamePointPaygame/editStatusGamePointPaygame',
    method: 'get',
    params: {
      orderId: data.orderId,
      status: data.status,
      vercodeKey: data.vercodeKey
    }
  })
}

// 获取游戏服
export function getAllServerCode(gamecode) {
  return request({
    url: '/api/lpgameserver/getAllServerCode',
    method: 'get',
    params: {
      gamecode
    }
  })
}

export default { add, edit, del, addPointGamePointPaygame, editGameServerCode, editStatusGamePointPaygame, getAllServerCode }
