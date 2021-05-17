import request from '@/utils/request'

export function getUrl() {
  return request({
    url: '/api/gamePackageOnline/getGamePackageCheckURL',
    method: 'get'
  })
}

export default { getUrl }
