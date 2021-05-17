import request from '@/utils/request'

export function getUrl() {
  return request({
    url: '/api/gamePackageOnline/getGamePackageCheckXQBURL',
    method: 'get'
  })
}

export default { getUrl }
