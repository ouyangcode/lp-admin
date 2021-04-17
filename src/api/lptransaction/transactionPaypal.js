import request from '@/utils/request'

export function getDefaultData(data) {
  return request({
    url: '/api/transactionPaypal?page=' + data.page + '&size=' + data.size + '&sort=' + data.sort + '&time=' + data.time[0] + '&time=' + data.time[1] + '',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/transactionPaypal',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/transactionPaypal/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/transactionPaypal',
    method: 'put',
    data
  })
}

export default { getDefaultData, add, edit, del }
