import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpGameUserBase',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/lpGameUserBase/',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/lpGameUserBase',
    method: 'put',
    data
  })
}

export default { add, edit, del }
