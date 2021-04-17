import request from '@/utils/request'

export function getDefaultData(data) {
  return request({
    url: '/api/transactionApplepay?page=' + data.page + '&size=' + data.size + '&sort=' + data.sort + '&time=' + data.time[0] + '&time=' + data.time[1] + '',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/transactionApplepay',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/transactionApplepay/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/transactionApplepay',
    method: 'put',
    data
  })
}

export default { getDefaultData, add, edit, del }
