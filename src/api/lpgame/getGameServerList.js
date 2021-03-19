import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpgameserver',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/lpgameserver/',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/lpgameserver',
    method: 'put',
    data
  })
}
export function getAllGameCode() {
  return request({
    url: '/api/lpgameroom/getAllGameCode',
    method: 'get'
  })
}

export default { add, edit, del, getAllGameCode }
