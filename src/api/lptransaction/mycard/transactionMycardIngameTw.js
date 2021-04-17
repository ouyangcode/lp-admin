import request from '@/utils/request'

export function getDefaultData(data) {
  return request({
    url: '/api/transactionMycardIngameTw?page=' + data.page + '&size=' + data.size + '&sort=' + data.sort + '&stime=' + data.stime[0] + '&stime=' + data.stime[1] + '',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/transactionMycardIngameTw',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/transactionMycardIngameTw/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/transactionMycardIngameTw',
    method: 'put',
    data
  })
}

export default { getDefaultData, add, edit, del }
