import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpGameUser',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/lpGameUser/',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/lpGameUser',
    method: 'put',
    data
  })
}

export default { add, edit, del }
