
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeList(params) {
  return request({
    url: '/api/detectPay/getAllowCurrencyPayIOS' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function toSetPay(params) {
  return request({
    url: '/api/detectPay/toSetAllowCurrencyPayIOS' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { gameCodeList, toSetPay }
