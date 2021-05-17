import request from '@/utils/request'

export function add(form) {
  const data = {
    currencycode: form.currencycode,
    currencyname: form.currencyname,
    currencyrate: form.currencyrate,
    stag: form.stag,
    stime: form.stime,
    mykey: form.mykey
  }
  return request({
    url: '/api/lpTransactionExchangerateDict',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/lpTransactionExchangerateDict/',
    method: 'delete',
    data: ids
  })
}

export function edit(form) {
  const data = {
    currencycode: form.currencycode,
    currencyname: form.currencyname,
    currencyrate: form.currencyrate,
    stag: form.stag,
    stime: form.stime,
    id: form.id,
    mykey: form.mykey
  }
  return request({
    url: '/api/lpTransactionExchangerateDict',
    method: 'put',
    data
  })
}

export default { add, edit, del }
