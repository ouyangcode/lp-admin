import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpuserGamelimit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/lpuserGamelimit/',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/lpuserGamelimit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
