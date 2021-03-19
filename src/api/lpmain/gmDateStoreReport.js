
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeLists() {
  return request({
    url: 'api/gmDateStoreReport/gameCodeList',
    method: 'get'
  })
}
export function gameCodeList() {
  return request({
    url: 'api/gmDateStoreReport/reportList',
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: '/api/gmDateStoreReport/download' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { gameCodeList, download }
