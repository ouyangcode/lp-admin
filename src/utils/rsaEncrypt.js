import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair
// const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVCywD/4aEFCpauEF9LQhuo+0ITH+hPA8vaYiUEAjXRRQisQG1IdbrKuBSab7AYq7/Cu8gFWVMEEoeWm3MJShNmm8RsvGb076tm/bK5xi+3eY5ozKLbG8oc60SXwBv10SXrVGlNZgb59tRXYwJFSObefiuuyjtZGPco6zSiu4H5QIDAQAB'
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGI54TIucPsVlMd/IAP28KaZcW1ega69zGgRzgEzjlzoAdonX1XC7MSXjh48wId2FKwaLu4pozmqxDT/CGdMtwsNmjj1JVHCcW4qlgg4ZE/0bDVDGGIR7FpW3P6GCc8f0qkNrpiqpT1w0lEJBSTOaFjKlHF03WumjLKNoTuJYtawIDAQAB'
// const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
//  '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ=='

const privateKey = ''

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}

