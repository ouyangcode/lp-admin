import request from '@/utils/request'

export function getDefaultData(data) {
  return request({
    url: '/api/transactionMycardDj?page=' + data.page + '&size=' + data.size + '&sort=' + data.sort + '&stime=' + data.stime[0] + '&stime=' + data.stime[1] + '',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/transactionMycardDj',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/transactionMycardDj/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/transactionMycardDj',
    method: 'put',
    data
  })
}

export default { getDefaultData, add, edit, del }
