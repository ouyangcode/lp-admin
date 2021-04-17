import request from '@/utils/request'

export function getDefaultData(data) {
  return request({
    url: '/api/transactionHuawei?page=' + data.page + '&size=' + data.size + '&sort=' + data.sort + '&createtime=' + data.createtime[0] + '&createtime=' + data.createtime[1] + '',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/transactionHuawei',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/transactionHuawei/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/transactionHuawei',
    method: 'put',
    data
  })
}

export default { getDefaultData, add, edit, del }
