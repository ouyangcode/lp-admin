
import request from '@/utils/request'
import qs from 'qs'

export function gameCodeList(params) {
  return request({
    url: '/api/detectThirdPartyPayOpen/getUserGoogleISPDeviceList' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { gameCodeList }
