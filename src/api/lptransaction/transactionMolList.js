import request from '@/utils/request'

export function getDefaultData(data) {
  console.log(data)
  return request({
    url: '/api/transactionMol?page=' + data.page + '&size=' + data.size + '&sort=' + data.sort + '&time=' + data.time[0] + '&time=' + data.time[1] + '',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/transactionMol',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/transactionMol/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/transactionMol',
    method: 'put',
    data
  })
}

export default { getDefaultData, add, edit, del }
