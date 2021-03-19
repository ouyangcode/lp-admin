import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpgameroom',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/lpgameroom/',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/lpgameroom',
    method: 'put',
    data
  })
}

export default { add, edit, del }
