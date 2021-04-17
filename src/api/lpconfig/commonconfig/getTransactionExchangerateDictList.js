import request from '@/utils/request'

export function add(form) {
  const data = {
    currencycode: form.currencycode,
    currencyname: form.currencyname,
    currencyrate: form.currencyrate,
    stag: form.stag,
    stime: form.stime
  }
  return request({
    url: '/api/lpTransactionExchangerateDict/create/' + form.mykey,
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
    id: form.id
  }
  return request({
    url: '/api/lpTransactionExchangerateDict/update/' + form.mykey,
    method: 'post',
    data
  })
}

export default { add, edit, del }
