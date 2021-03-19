
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeLists() {
  return request({
    url: 'api/gmGameUserPercentReport/getGameList',
    method: 'get'
  })
}
export function gameCodeList() {
  return request({
    url: 'api/gmGameUserPercentReport/reportList',
    method: 'get'
  })
}
export function download(params) {
  return request({
    url: '/api/gmGameUserPercentReport/download' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { gameCodeList, download }
