import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/lpTransactionExchangerateDict',
    method: 'post',
    data
  })
}
export function getPoint(currencycode, tm) {
  return request({
    url: '/api/lpTransactionExchangerateDict/getCurrencyRate',
    method: 'get',
    params: {
      currencycode
    }
  })
}

export function del(ids) {
  return request({
    url: 'api/lpTransactionExchangerateDict/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/lpTransactionExchangerateDict',
    method: 'put',
    data
  })
}

export default { add, edit, del, getPoint }
