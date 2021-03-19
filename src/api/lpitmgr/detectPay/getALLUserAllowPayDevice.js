
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeList(params) {
  return request({
    url: '/api/detectPay/getALLUserAllowPayDevice' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
export function toWhiteOrForbiddenDevice(params) {
  return request({
    url: '/api/detectPay/toWhiteOrForbiddenDevice' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { gameCodeList, toWhiteOrForbiddenDevice }
