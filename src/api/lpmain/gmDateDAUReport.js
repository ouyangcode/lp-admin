
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeLists() {
  return request({
    url: 'api/gmDateDAUReport/getGameList',
    method: 'get'
  })
}
export function gameCodeList() {
  return request({
    url: 'api/gmDateDAUReport/reportList',
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: '/api/gmDateDAUReport/download' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { gameCodeList, download }
