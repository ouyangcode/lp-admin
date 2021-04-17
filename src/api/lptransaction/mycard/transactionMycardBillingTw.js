import request from '@/utils/request'

export function getDefaultData(data) {
  return request({
    url: '/api/transactionMycardBillingTw?page=' + data.page + '&size=' + data.size + '&sort=' + data.sort + '&sdate=' + data.sdate[0] + '&sdate=' + data.sdate[1] + '',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/transactionMycardBillingTw',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/transactionMycardBillingTw/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/transactionMycardBillingTw',
    method: 'put',
    data
  })
}

export default { getDefaultData, add, edit, del }
