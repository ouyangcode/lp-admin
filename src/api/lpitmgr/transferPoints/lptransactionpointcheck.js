import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lptransactionpointcheck',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/lptransactionpointcheck/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/lptransactionpointcheck',
    method: 'put',
    data
  })
}
export function agreeTrUserPoint(data) {
  return request({
    url: '/api/lpTransactionpointcheck/agreeTrUserPoint',
    method: 'get',
    params: {
      id: data.id,
      vercodeKey: data.vercodeKey
    }
  })
}
export function refuseTrUserPoint(data) {
  return request({
    url: '/api/lpTransactionpointcheck/refuseTrUserPoint',
    method: 'get',
    params: {
      id: data.id,
      vercodeKey: data.vercodeKey
    }
  })
}
export function createTrUserPoint(data) {
  return request({
    url: '/api/lpTransactionpointcheck/createTrUserPoint',
    method: 'get',
    params: {
      passport: data.passport,
      gotopassport: data.gotoPassport,
      lpoint: data.lpoint,
      remark: data.remark,
      vercodeKey: data.vercodeKey
    }
  })
}

export default { add, edit, del, agreeTrUserPoint, refuseTrUserPoint, createTrUserPoint }
